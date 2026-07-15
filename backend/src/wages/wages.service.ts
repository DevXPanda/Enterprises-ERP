// MWMS read models — workers, attendance, payroll, dashboard and cost analytics.
import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DEFAULT_TENANT_ID } from '../resources/resources.service';
import {
  wageCostTrend,
  monthlyWageReport,
  overtimeTrend,
  shiftColors,
  categoryColors,
} from './wages.data';

@Injectable()
export class WagesService {
  constructor(private readonly dataSource: DataSource) {}

  private get tenant() {
    return DEFAULT_TENANT_ID;
  }

  private q<T = Record<string, unknown>>(sql: string): Promise<T[]> {
    return this.dataSource.query(sql, [this.tenant]);
  }

  async createWorker(body: {
    name?: string;
    department?: string;
    type?: string;
    dailyRate?: number | string;
    bankAccount?: string;
    shift?: string;
  }) {
    const name = String(body.name ?? '').trim();
    const dailyRate = Number(body.dailyRate);
    if (!name || !dailyRate || dailyRate <= 0) {
      throw new BadRequestException('name and a positive dailyRate are required');
    }
    const type = body.type === 'contractual' ? 'contractor' : 'permanent';
    const departmentName = String(body.department ?? 'Production').trim() || 'Production';
    const shiftName = String(body.shift ?? 'Morning').trim() || 'Morning';

    const [plant] = await this.q(
      `SELECT id FROM wages.plants WHERE tenant_id = $1 AND deleted_at IS NULL ORDER BY created_at LIMIT 1`,
    );
    if (!plant) {
      throw new BadRequestException('No plant found — run "npm run wages:seed" first');
    }

    let [dept] = await this.dataSource.query(
      `SELECT id FROM wages.departments WHERE tenant_id = $1 AND deleted_at IS NULL AND name ILIKE $2 LIMIT 1`,
      [this.tenant, departmentName],
    );
    if (!dept) {
      [dept] = await this.dataSource.query(
        `INSERT INTO wages.departments (tenant_id, plant_id, name) VALUES ($1, $2, $3) RETURNING id`,
        [this.tenant, plant.id, departmentName],
      );
    }

    const [shift] = await this.dataSource.query(
      `SELECT id FROM wages.shifts WHERE tenant_id = $1 AND deleted_at IS NULL AND name ILIKE $2 LIMIT 1`,
      [this.tenant, shiftName],
    );

    const [contractor] =
      type === 'contractor'
        ? await this.q(
            `SELECT id FROM wages.contractors WHERE tenant_id = $1 AND deleted_at IS NULL LIMIT 1`,
          )
        : [undefined];

    const [next] = await this.q(
      `SELECT 'W-' || lpad((COALESCE(MAX(NULLIF(regexp_replace(employee_code, '\\D', '', 'g'), '')::int), 0) + 1)::text, 3, '0') AS code
       FROM wages.employees WHERE tenant_id = $1`,
    );

    const [created] = await this.dataSource.query(
      `INSERT INTO wages.employees
         (tenant_id, employee_code, full_name, plant_id, department_id, skill_category,
          employment_type, contractor_id, wage_type, daily_wage_rate, ot_eligible,
          default_shift_id, bank_account_number, status)
       VALUES ($1, $2, $3, $4, $5, 'helper', $6, $7, 'daily', $8, true, $9, $10, 'active')
       RETURNING employee_code, full_name, daily_wage_rate`,
      [
        this.tenant,
        next.code,
        name,
        plant.id,
        dept.id,
        type,
        contractor?.id ?? null,
        dailyRate,
        shift?.id ?? null,
        body.bankAccount ? String(body.bankAccount).trim() : null,
      ],
    );

    return {
      created: true,
      id: created.employee_code,
      name: created.full_name,
      department: departmentName,
      type: type === 'contractor' ? 'contractual' : 'permanent',
      dailyRate: Number(created.daily_wage_rate),
      status: 'active',
    };
  }

  async workers() {
    const rows = await this.q(`
      SELECT
        e.employee_code                                   AS "id",
        e.employee_code                                   AS "workerId",
        e.full_name                                       AS "name",
        COALESCE(d.name, '—')                             AS "department",
        CASE WHEN e.employment_type = 'contractor' THEN 'contractual' ELSE 'permanent' END AS "type",
        e.daily_wage_rate::float                          AS "dailyRate",
        e.daily_wage_rate::float                          AS "wagePerDay",
        '******' || right(COALESCE(e.bank_account_number, e.uan_number, '0000'), 4) AS "bankAccount",
        COALESCE(att.pct, 0)::float                       AS "attendancePct",
        s.name                                            AS "shift",
        m.line_name                                       AS "line",
        COALESCE(ad.status, 'no record')                  AS "attendance",
        COALESCE(pa.output_quantity, 0)::float            AS "bagsPerDay",
        CASE WHEN COALESCE(pa.output_quantity, 0) > 0
             THEN ROUND(e.daily_wage_rate / pa.output_quantity, 2)::float
             ELSE NULL END                                AS "costPerBag",
        ROUND(COALESCE(pa.assigned_minutes, 0) / 60.0, 1)::float AS "machineHours",
        CASE
          WHEN COALESCE(pa.output_quantity, 0) >= 450 THEN 'High'
          WHEN COALESCE(pa.output_quantity, 0) >= 300 THEN 'Average'
          WHEN COALESCE(pa.output_quantity, 0) > 0    THEN 'Low'
          ELSE '—'
        END                                               AS "rating",
        CASE
          WHEN e.status = 'active' AND COALESCE(ad.status, '') = 'leave' THEN 'leave'
          WHEN e.status = 'active' THEN 'active'
          ELSE 'suspended'
        END                                               AS "status"
      FROM wages.employees e
      LEFT JOIN wages.departments d ON d.id = e.department_id
      LEFT JOIN wages.shifts s ON s.id = e.default_shift_id
      LEFT JOIN LATERAL (
        SELECT pa1.output_quantity, pa1.assigned_minutes, pa1.machine_id
        FROM wages.production_assignments pa1
        WHERE pa1.employee_id = e.id AND pa1.deleted_at IS NULL
        ORDER BY pa1.created_at DESC LIMIT 1
      ) pa ON true
      LEFT JOIN wages.machines m ON m.id = pa.machine_id
      LEFT JOIN LATERAL (
        SELECT ad1.status
        FROM wages.attendance_daily ad1
        WHERE ad1.employee_id = e.id AND ad1.deleted_at IS NULL
        ORDER BY ad1.attendance_date DESC LIMIT 1
      ) ad ON true
      LEFT JOIN LATERAL (
        SELECT ROUND(100.0 * count(*) FILTER (WHERE ad2.status IN ('present','half_day'))
               / NULLIF(count(*), 0), 1) AS pct
        FROM wages.attendance_daily ad2
        WHERE ad2.employee_id = e.id AND ad2.deleted_at IS NULL
      ) att ON true
      WHERE e.tenant_id = $1 AND e.deleted_at IS NULL
      ORDER BY e.employee_code
    `);

    const total = rows.length;
    const active = rows.filter((r) => r.status === 'active').length;
    const leave = rows.filter((r) => r.status === 'leave').length;
    const permanent = rows.filter((r) => r.type === 'permanent').length;
    const contractual = rows.filter((r) => r.type === 'contractual').length;

    return {
      resource: 'wages/workers',
      source: 'wages.employees (MWMS)',
      kpis: [
        { id: 'total-workers', label: 'Total Workforce', value: String(total), icon: 'Users', color: 'blue' },
        { id: 'active-w', label: 'Active Workers', value: String(active), change: 4, icon: 'UserCheck', color: 'green' },
        { id: 'onleave-w', label: 'On Leave', value: String(leave), icon: 'UserMinus', color: 'purple' },
        { id: 'permanent-w', label: 'Permanent', value: String(permanent), icon: 'Shield', color: 'blue' },
        { id: 'contractual-w', label: 'Contractual', value: String(contractual), icon: 'FileText', color: 'orange' },
        { id: 'suspended-w', label: 'Suspended', value: String(total - active - leave), icon: 'AlertTriangle', color: 'red' },
      ],
      total,
      data: rows,
    };
  }

  async markAttendance(body: {
    empId?: string;
    date?: string;
    status?: string;
    checkIn?: string;
    checkOut?: string;
  }) {
    const empId = String(body.empId ?? '').trim();
    const date = String(body.date ?? '').trim();
    const status = String(body.status ?? 'present').replace('-', '_');
    if (!empId || !date) {
      throw new BadRequestException('empId and date are required');
    }
    const allowed = ['present', 'absent', 'half_day', 'leave', 'weekly_off', 'holiday'];
    if (!allowed.includes(status)) {
      throw new BadRequestException(`status must be one of: ${allowed.join(', ')}`);
    }

    const [emp] = await this.dataSource.query(
      `SELECT id, default_shift_id FROM wages.employees
       WHERE tenant_id = $1 AND deleted_at IS NULL AND employee_code = $2`,
      [this.tenant, empId],
    );
    if (!emp) throw new BadRequestException(`Unknown worker: ${empId}`);

    const firstIn = body.checkIn ? `${date} ${body.checkIn}:00+05:30` : null;
    const lastOut = body.checkOut ? `${date} ${body.checkOut}:00+05:30` : null;
    let minutes = 0;
    if (body.checkIn && body.checkOut) {
      const toMin = (t: string) => {
        const [h, m] = t.split(':').map(Number);
        return (h || 0) * 60 + (m || 0);
      };
      let diff = toMin(body.checkOut) - toMin(body.checkIn);
      if (diff < 0) diff += 24 * 60; // night shift crossing midnight
      minutes = Math.max(0, diff - 30);
    }

    const [row] = await this.dataSource.query(
      `INSERT INTO wages.attendance_daily
         (tenant_id, employee_id, attendance_date, shift_id, first_in, last_out,
          working_minutes, break_minutes, status, is_manual_override, override_reason)
       VALUES ($1, $2, $3, $4, $5, $6, $7, 30, $8, true, 'Marked via ERP UI')
       ON CONFLICT (tenant_id, employee_id, attendance_date)
       DO UPDATE SET first_in = EXCLUDED.first_in, last_out = EXCLUDED.last_out,
                     working_minutes = EXCLUDED.working_minutes, status = EXCLUDED.status,
                     is_manual_override = true, updated_at = now()
       RETURNING id, attendance_date, status`,
      [this.tenant, emp.id, date, emp.default_shift_id, firstIn, lastOut, minutes, status],
    );
    return { saved: true, empId, date: row.attendance_date, status: row.status };
  }

  async generatePayroll(body: { month?: string }) {
    const month = String(body.month ?? '').trim();
    if (!/^\d{4}-\d{2}$/.test(month)) {
      throw new BadRequestException('month is required in YYYY-MM format');
    }
    const periodStart = `${month}-01`;

    const [existing] = await this.dataSource.query(
      `SELECT id FROM wages.wage_sheets WHERE tenant_id = $1 AND period_start = $2`,
      [this.tenant, periodStart],
    );
    if (existing) {
      throw new BadRequestException(`A wage sheet for ${month} already exists`);
    }

    const [plant] = await this.q(
      `SELECT id FROM wages.plants WHERE tenant_id = $1 AND deleted_at IS NULL LIMIT 1`,
    );
    if (!plant) throw new BadRequestException('No plant found — run "npm run wages:seed" first');

    const [sheet] = await this.dataSource.query(
      `INSERT INTO wages.wage_sheets (tenant_id, plant_id, period_start, period_end, status, generated_at)
       VALUES ($1, $2, $3::date, ($3::date + interval '1 month' - interval '1 day')::date, 'computed', now())
       RETURNING id`,
      [this.tenant, plant.id, periodStart],
    );

    // One line per active employee: attendance days × rate + approved OT,
    // then statutory rules (PF/ESI/PT) split into employee/employer sides.
    const lines = await this.dataSource.query(
      `WITH att AS (
         SELECT employee_id,
                count(*) FILTER (WHERE status = 'present') + 0.5 * count(*) FILTER (WHERE status = 'half_day') AS present_days,
                count(*) FILTER (WHERE status = 'absent') AS absent_days
         FROM wages.attendance_daily
         WHERE tenant_id = $1 AND deleted_at IS NULL
           AND date_trunc('month', attendance_date) = $3::date
         GROUP BY employee_id
       ), ot AS (
         SELECT o.employee_id, SUM(o.ot_minutes) AS ot_minutes, SUM(o.calculated_amount) AS ot_amount
         FROM wages.overtime_requests o
         JOIN wages.attendance_daily ad ON ad.id = o.attendance_daily_id
         WHERE o.tenant_id = $1 AND o.status = 'approved'
           AND date_trunc('month', ad.attendance_date) = $3::date
         GROUP BY o.employee_id
       )
       INSERT INTO wages.wage_sheet_lines
         (tenant_id, wage_sheet_id, employee_id, present_days, absent_days, ot_minutes, ot_amount,
          incentive_amount, gross_wage, deductions, employee_statutory_deduction, employer_statutory_cost, net_wage)
       SELECT
         $1, $2, e.id,
         COALESCE(att.present_days, 0),
         COALESCE(att.absent_days, 0),
         COALESCE(ot.ot_minutes, 0),
         COALESCE(ot.ot_amount, 0),
         0,
         gross.amount,
         '{}'::jsonb,
         statutory.employee_side,
         statutory.employer_side,
         gross.amount - statutory.employee_side
       FROM wages.employees e
       LEFT JOIN att ON att.employee_id = e.id
       LEFT JOIN ot ON ot.employee_id = e.id
       CROSS JOIN LATERAL (
         SELECT ROUND(e.daily_wage_rate * COALESCE(att.present_days, 0) + COALESCE(ot.ot_amount, 0), 2) AS amount
       ) gross
       CROSS JOIN LATERAL (
         SELECT
           ROUND(LEAST(gross.amount, 15000) * 0.12, 2)
             + CASE WHEN gross.amount <= 21000 THEN ROUND(gross.amount * 0.0075, 2) ELSE 0 END
             + CASE WHEN gross.amount > 0 THEN 200 ELSE 0 END AS employee_side,
           ROUND(LEAST(gross.amount, 15000) * 0.13, 2)
             + CASE WHEN gross.amount <= 21000 THEN ROUND(gross.amount * 0.0325, 2) ELSE 0 END AS employer_side
       ) statutory
       WHERE e.tenant_id = $1 AND e.deleted_at IS NULL AND e.status = 'active'
       RETURNING id`,
      [this.tenant, sheet.id, periodStart],
    );

    await this.dataSource.query(
      `INSERT INTO wages.outbox_events (tenant_id, event_type, payload)
       VALUES ($1, 'WageSheetGenerated', $2::jsonb)`,
      [this.tenant, JSON.stringify({ wageSheetId: sheet.id, month, lines: lines.length })],
    );

    return { generated: true, month, wageSheetId: sheet.id, lines: lines.length };
  }

  async attendance() {
    const rows = await this.q(`
      SELECT
        e.employee_code                                    AS "id",
        e.employee_code                                    AS "empId",
        e.full_name                                        AS "name",
        to_char(ad.attendance_date, 'DD Mon YYYY')         AS "date",
        COALESCE(s.name, '—')                              AS "shift",
        COALESCE(to_char(ad.first_in AT TIME ZONE 'Asia/Kolkata', 'HH24:MI'), '—') AS "inTime",
        COALESCE(to_char(ad.last_out AT TIME ZONE 'Asia/Kolkata', 'HH24:MI'), '—') AS "outTime",
        COALESCE(to_char(ad.first_in AT TIME ZONE 'Asia/Kolkata', 'HH24:MI'), '—') AS "checkIn",
        COALESCE(to_char(ad.last_out AT TIME ZONE 'Asia/Kolkata', 'HH24:MI'), '—') AS "checkOut",
        ROUND(ad.working_minutes / 60.0, 1)::float         AS "workingHours",
        ROUND(ad.working_minutes / 60.0, 1)::float         AS "hours",
        ROUND(COALESCE(ot.ot_minutes, 0) / 60.0, 1)::float AS "otHours",
        ad.late_minutes                                    AS "lateMinutes",
        REPLACE(ad.status, '_', '-')                       AS "status"
      FROM wages.attendance_daily ad
      JOIN wages.employees e ON e.id = ad.employee_id
      LEFT JOIN wages.shifts s ON s.id = ad.shift_id
      LEFT JOIN wages.overtime_requests ot ON ot.attendance_daily_id = ad.id
      WHERE ad.tenant_id = $1 AND ad.deleted_at IS NULL
      ORDER BY ad.attendance_date DESC, e.employee_code
    `);

    const [k] = await this.q(`
      SELECT
        count(*) FILTER (WHERE status IN ('present','half_day'))::int AS present,
        count(*) FILTER (WHERE status = 'absent')::int                AS absent,
        count(*) FILTER (WHERE status = 'leave')::int                 AS on_leave,
        count(*) FILTER (WHERE late_minutes > 0)::int                 AS late,
        count(*)::int                                                 AS total
      FROM wages.attendance_daily
      WHERE tenant_id = $1 AND deleted_at IS NULL
        AND attendance_date = (
          SELECT MAX(attendance_date) FROM wages.attendance_daily WHERE tenant_id = $1
        )
    `);
    const [ot] = await this.q(`
      SELECT ROUND(COALESCE(SUM(ot_minutes), 0) / 60.0, 1)::float AS hours
      FROM wages.overtime_requests WHERE tenant_id = $1
    `);

    const coverage = k?.total
      ? Math.round((1000 * Number(k.present)) / Number(k.total)) / 10
      : 0;

    return {
      resource: 'wages/attendance',
      source: 'wages.attendance_daily (MWMS)',
      kpis: [
        { id: 'present-today', label: 'Present Today', value: String(k?.present ?? 0), change: 3, icon: 'UserCheck', color: 'green' },
        { id: 'absent-today', label: 'Absent Today', value: String(k?.absent ?? 0), change: -1, icon: 'UserX', color: 'red' },
        { id: 'on-leave', label: 'On Leave', value: String(k?.on_leave ?? 0), icon: 'UserMinus', color: 'purple' },
        { id: 'late-entries', label: 'Late Entries', value: String(k?.late ?? 0), change: -4, icon: 'Clock', color: 'orange' },
        { id: 'overtime-hrs', label: 'Overtime Hours', value: `${ot?.hours ?? 0}h`, change: 12, icon: 'Timer', color: 'blue' },
        { id: 'shift-coverage', label: 'Shift Coverage', value: `${coverage}%`, icon: 'Target', color: 'green' },
      ],
      total: rows.length,
      data: rows,
    };
  }

  async payroll() {
    const rows = await this.q(`
      SELECT
        'PAY-' || lpad((9800 + row_number() OVER (ORDER BY ws.period_start DESC, e.employee_code))::text, 4, '0') AS "payoutId",
        e.employee_code                                   AS "workerId",
        e.employee_code                                   AS "empId",
        e.full_name                                       AS "name",
        to_char(ws.period_start, 'Mon YYYY')              AS "month",
        l.present_days::float                             AS "presentDays",
        (l.gross_wage - l.ot_amount - l.incentive_amount)::float AS "baseWages",
        (l.gross_wage - l.ot_amount - l.incentive_amount)::float AS "baseWage",
        l.ot_amount::float                                AS "overtimePay",
        l.ot_amount::float                                AS "otAmount",
        (l.employee_statutory_deduction
          + COALESCE((l.deductions->>'advance')::numeric, 0))::float AS "deductions",
        l.employee_statutory_deduction::float             AS "statutoryDeduction",
        l.incentive_amount::float                         AS "bonuses",
        l.incentive_amount::float                         AS "incentive",
        l.gross_wage::float                               AS "grossWage",
        l.employer_statutory_cost::float                  AS "employerStatutoryCost",
        l.net_wage::float                                 AS "netPayable",
        l.net_wage::float                                 AS "netPay",
        CASE
          WHEN ws.status IN ('locked', 'exported', 'approved') THEN 'paid'
          WHEN ws.status = 'computed' THEN 'processing'
          ELSE 'hold'
        END                                               AS "status"
      FROM wages.wage_sheet_lines l
      JOIN wages.wage_sheets ws ON ws.id = l.wage_sheet_id
      JOIN wages.employees e ON e.id = l.employee_id
      WHERE l.tenant_id = $1
      ORDER BY ws.period_start DESC, e.employee_code
    `);

    const paid = rows.filter((r) => r.status === 'paid').length;
    const processing = rows.filter((r) => r.status === 'processing').length;
    const hold = rows.filter((r) => r.status === 'hold').length;
    const totalGross = rows.reduce((s, r) => s + Number(r.grossWage ?? 0), 0);
    const totalBonus = rows.reduce((s, r) => s + Number(r.bonuses ?? 0), 0);
    const avgDeduction = rows.length
      ? Math.round(rows.reduce((s, r) => s + Number(r.deductions ?? 0), 0) / rows.length)
      : 0;

    return {
      resource: 'wages/payroll',
      source: 'wages.wage_sheet_lines (MWMS)',
      kpis: [
        { id: 'monthly-payroll', label: 'Monthly Payroll', value: `₹${totalGross.toLocaleString('en-IN')}`, change: 3.8, icon: 'IndianRupee', color: 'blue' },
        { id: 'paid-payouts', label: 'Paid', value: String(paid), icon: 'CheckCircle', color: 'green' },
        { id: 'processing-p', label: 'Processing', value: String(processing), icon: 'RefreshCw', color: 'purple' },
        { id: 'hold-payouts', label: 'On Hold', value: String(hold), icon: 'AlertTriangle', color: 'orange' },
        { id: 'avg-deductions', label: 'Avg Deductions', value: `₹${avgDeduction.toLocaleString('en-IN')}`, icon: 'Percent', color: 'blue' },
        { id: 'bonuses-paid', label: 'Bonuses Paid', value: `₹${totalBonus.toLocaleString('en-IN')}`, icon: 'Gift', color: 'green' },
      ],
      total: rows.length,
      data: rows,
    };
  }

  async dashboard() {
    const [head] = await this.q(`
      SELECT
        (SELECT count(*)::int FROM wages.employees WHERE tenant_id = $1 AND deleted_at IS NULL AND status = 'active') AS total_workers,
        (SELECT count(*)::int FROM wages.attendance_daily ad
          WHERE ad.tenant_id = $1 AND ad.deleted_at IS NULL AND ad.status IN ('present','half_day')
            AND ad.attendance_date = (SELECT MAX(attendance_date) FROM wages.attendance_daily WHERE tenant_id = $1)) AS present_today,
        (SELECT ROUND(AVG(daily_wage_rate))::int FROM wages.employees WHERE tenant_id = $1 AND deleted_at IS NULL) AS avg_wage,
        (SELECT count(*)::int FROM wages.overtime_requests WHERE tenant_id = $1 AND status = 'pending') AS pending_ot,
        (SELECT status FROM wages.wage_sheets WHERE tenant_id = $1 ORDER BY period_start DESC LIMIT 1) AS sheet_status,
        (SELECT ROUND(100.0 * count(*) FILTER (WHERE status IN ('present','half_day')) / NULLIF(count(*), 0), 1)::float
          FROM wages.attendance_daily WHERE tenant_id = $1 AND deleted_at IS NULL) AS attendance_rate
    `);

    const wagesToday = await this.q(`
      SELECT COALESCE(SUM(e.daily_wage_rate), 0)::float AS total
      FROM wages.attendance_daily ad
      JOIN wages.employees e ON e.id = ad.employee_id
      WHERE ad.tenant_id = $1 AND ad.deleted_at IS NULL
        AND ad.status IN ('present','half_day')
        AND ad.attendance_date = (SELECT MAX(attendance_date) FROM wages.attendance_daily WHERE tenant_id = $1)
    `);

    const deptAttendance = await this.q(`
      SELECT
        d.name                                             AS "department",
        count(*) FILTER (WHERE ad.status IN ('present','half_day'))::int AS "present",
        count(DISTINCT e.id)::int                          AS "total"
      FROM wages.departments d
      JOIN wages.employees e ON e.department_id = d.id AND e.deleted_at IS NULL
      LEFT JOIN wages.attendance_daily ad ON ad.employee_id = e.id AND ad.deleted_at IS NULL
        AND ad.attendance_date = (SELECT MAX(attendance_date) FROM wages.attendance_daily WHERE tenant_id = $1)
      WHERE d.tenant_id = $1 AND d.deleted_at IS NULL
      GROUP BY d.name ORDER BY d.name
    `);

    const shiftRows = await this.q(`
      SELECT s.name AS shift, COALESCE(SUM(e.daily_wage_rate), 0)::float AS cost
      FROM wages.shifts s
      LEFT JOIN wages.employees e ON e.default_shift_id = s.id AND e.deleted_at IS NULL
      WHERE s.tenant_id = $1 AND s.deleted_at IS NULL
      GROUP BY s.name ORDER BY cost DESC
    `);
    const shiftTotal = shiftRows.reduce((s, r) => s + Number(r.cost ?? 0), 0);
    const shiftCostBreakdown = shiftRows.map((r) => ({
      shift: `Shift ${r.shift}`,
      cost: Number(r.cost),
      percentage: shiftTotal ? Math.round((100 * Number(r.cost)) / shiftTotal) : 0,
      color: shiftColors[String(r.shift)] ?? '#94A3B8',
    }));

    const recentPayouts = await this.q(`
      SELECT
        'PAY-' || lpad((9800 + row_number() OVER (ORDER BY ws.period_start DESC, e.employee_code))::text, 4, '0') AS "id",
        e.full_name                                        AS "workerName",
        COALESCE(d.name, '—')                              AS "department",
        'Monthly Wage'                                     AS "type",
        l.net_wage::float                                  AS "amount",
        CASE
          WHEN ws.status IN ('locked', 'exported', 'approved') THEN 'paid'
          WHEN ws.status = 'computed' THEN 'processing'
          ELSE 'hold'
        END                                                AS "status",
        to_char(COALESCE(ws.generated_at, ws.created_at), 'DD Mon') AS "date"
      FROM wages.wage_sheet_lines l
      JOIN wages.wage_sheets ws ON ws.id = l.wage_sheet_id
      JOIN wages.employees e ON e.id = l.employee_id
      LEFT JOIN wages.departments d ON d.id = e.department_id
      WHERE l.tenant_id = $1
      ORDER BY ws.period_start DESC, l.net_wage DESC
      LIMIT 5
    `);

    const pendingWageApprovals = await this.q(`
      SELECT
        'APP-' || lpad((500 + row_number() OVER (ORDER BY o.created_at))::text, 3, '0') AS "id",
        e.full_name                                        AS "workerName",
        COALESCE(d.name, '—')                              AS "department",
        COALESCE('Shift ' || s.name, '—')                  AS "shift",
        8                                                  AS "regularHours",
        ROUND(o.ot_minutes / 60.0, 1)::float               AS "otHours",
        (e.daily_wage_rate + o.calculated_amount)::float   AS "amount"
      FROM wages.overtime_requests o
      JOIN wages.employees e ON e.id = o.employee_id
      LEFT JOIN wages.departments d ON d.id = e.department_id
      LEFT JOIN wages.shifts s ON s.id = e.default_shift_id
      WHERE o.tenant_id = $1 AND o.status = 'pending'
      ORDER BY o.created_at
    `);

    return {
      source: 'MWMS wages schema — computed live',
      kpis: [
        { id: 'active-workers', label: 'Active Workers', value: `${head?.present_today ?? 0}/${head?.total_workers ?? 0}`, changeLabel: 'on-duty today', icon: 'Users', color: 'blue' },
        { id: 'wages-today', label: 'Total Wages Today', value: `₹${Number(wagesToday[0]?.total ?? 0).toLocaleString('en-IN')}`, changeLabel: '', icon: 'IndianRupee', color: 'green' },
        { id: 'avg-daily-wage', label: 'Avg Wage / Worker', value: `₹${Number(head?.avg_wage ?? 0).toLocaleString('en-IN')}`, icon: 'DollarSign', color: 'purple' },
        { id: 'payroll-status', label: 'Payroll Status', value: head?.sheet_status ? String(head.sheet_status).replace(/^./, (c) => c.toUpperCase()) : '—', changeLabel: 'latest sheet', icon: 'FileCheck', color: 'blue' },
        { id: 'attendance-rate', label: 'Attendance Rate', value: `${head?.attendance_rate ?? 0}%`, changeLabel: '', icon: 'CalendarCheck', color: 'green' },
        { id: 'pending-approvals', label: 'Pending Approvals', value: String(head?.pending_ot ?? 0), changeLabel: 'timesheets', icon: 'Clock', color: 'orange' },
      ],
      wageCostTrend,
      deptAttendance,
      shiftCostBreakdown,
      recentPayouts,
      pendingWageApprovals,
    };
  }

  async reportsAnalytics() {
    const [totals] = await this.q(`
      SELECT
        COALESCE(SUM(l.gross_wage), 0)::float          AS ytd,
        COALESCE(SUM(l.ot_amount), 0)::float           AS ot,
        COALESCE(SUM(l.incentive_amount), 0)::float    AS bonus
      FROM wages.wage_sheet_lines l
      WHERE l.tenant_id = $1
    `);

    const categoryRows = await this.q(`
      SELECT e.employment_type AS category, COALESCE(SUM(l.gross_wage), 0)::float AS cost
      FROM wages.wage_sheet_lines l
      JOIN wages.employees e ON e.id = l.employee_id
      WHERE l.tenant_id = $1
      GROUP BY e.employment_type ORDER BY cost DESC
    `);
    const categoryCost = categoryRows.map((r) => ({
      category: r.category === 'contractor' ? 'Contract Workers' : 'Permanent Workers',
      cost: Number(r.cost),
      color: categoryColors[String(r.category)] ?? categoryColors.other,
    }));

    return {
      kpis: [
        { id: 'reports-gen', label: 'Reports Generated', value: '0', icon: 'FileText', color: 'blue' },
        { id: 'avg-monthly-r', label: 'Avg Monthly Cost', value: `₹${Number(totals?.ytd ?? 0).toLocaleString('en-IN')}`, change: 1.5, icon: 'TrendingUp', color: 'green' },
        { id: 'ytd-wages', label: 'YTD Wages', value: `₹${Number(totals?.ytd ?? 0).toLocaleString('en-IN')}`, icon: 'IndianRupee', color: 'purple' },
        { id: 'payout-accuracy', label: 'Payout Accuracy', value: '—', icon: 'Check', color: 'green' },
        { id: 'ot-expense-r', label: 'OT Expenses', value: `₹${Number(totals?.ot ?? 0).toLocaleString('en-IN')}`, change: -8.5, icon: 'Timer', color: 'orange' },
        { id: 'bonus-impact-r', label: 'Bonus Impact', value: `₹${Number(totals?.bonus ?? 0).toLocaleString('en-IN')}`, icon: 'Sparkles', color: 'blue' },
      ],
      monthlyWageReport,
      overtimeTrend,
      categoryCost,
    };
  }

  async summary() {
    const [att] = await this.q(`
      SELECT
        ROUND(100.0 * count(*) FILTER (WHERE status IN ('present','half_day'))
              / NULLIF(count(*), 0), 1)::float AS "attendanceRate"
      FROM wages.attendance_daily
      WHERE tenant_id = $1 AND deleted_at IS NULL
    `);

    const [ot] = await this.q(`
      SELECT
        ROUND(COALESCE(SUM(ot_minutes), 0) / 60.0, 1)::float AS "otHours",
        COALESCE(SUM(calculated_amount), 0)::float           AS "otAmount",
        count(*) FILTER (WHERE status = 'pending')::int      AS "pendingApprovals"
      FROM wages.overtime_requests
      WHERE tenant_id = $1
    `);

    const costPerMachine = await this.q(`
      SELECT
        m.name                                        AS "machine",
        m.line_name                                   AS "line",
        SUM(pa.output_quantity)::float                AS "output",
        SUM(ROUND(e.daily_wage_rate * pa.assigned_minutes / 480.0, 2))::float AS "labourCost",
        ROUND(SUM(ROUND(e.daily_wage_rate * pa.assigned_minutes / 480.0, 2))
              / NULLIF(SUM(pa.output_quantity), 0), 2)::float AS "costPerUnit"
      FROM wages.production_assignments pa
      JOIN wages.employees e ON e.id = pa.employee_id
      LEFT JOIN wages.machines m ON m.id = pa.machine_id
      WHERE pa.tenant_id = $1 AND pa.deleted_at IS NULL
      GROUP BY m.name, m.line_name
      ORDER BY "costPerUnit" ASC NULLS LAST
    `);

    const [sheet] = await this.q(`
      SELECT
        COALESCE(SUM(l.gross_wage), 0)::float               AS "grossWages",
        COALESCE(SUM(l.employee_statutory_deduction), 0)::float AS "employeeStatutory",
        COALESCE(SUM(l.employer_statutory_cost), 0)::float  AS "employerStatutory",
        COALESCE(SUM(l.net_wage), 0)::float                 AS "netPayout",
        COALESCE(SUM(l.gross_wage + l.employer_statutory_cost), 0)::float AS "trueLabourCost"
      FROM wages.wage_sheet_lines l
      JOIN wages.wage_sheets ws ON ws.id = l.wage_sheet_id
      WHERE l.tenant_id = $1
        AND ws.period_start = (
          SELECT MAX(period_start) FROM wages.wage_sheets WHERE tenant_id = $1
        )
    `);

    const totalOutput = costPerMachine.reduce(
      (sum: number, r) => sum + Number(r.output ?? 0),
      0,
    );
    const totalLabour = costPerMachine.reduce(
      (sum: number, r) => sum + Number(r.labourCost ?? 0),
      0,
    );

    const best = costPerMachine[0];
    return {
      source: 'MWMS wages schema — computed live',
      attendanceRate: att?.attendanceRate ?? null,
      overtime: ot,
      avgCostPerBag: totalOutput ? Math.round((totalLabour / totalOutput) * 100) / 100 : null,
      costPerMachine,
      latestWageSheet: sheet,
      aiRecommendation: best?.costPerUnit
        ? `Lowest labour cost is ${best.machine} (${best.line}) at ₹${best.costPerUnit}/unit — prioritise assignments there.`
        : 'Not enough production assignments to recommend.',
    };
  }
}
