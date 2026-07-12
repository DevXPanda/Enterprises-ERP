// MWMS read models — workers, attendance, payroll and cost analytics.
import { Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { DEFAULT_TENANT_ID } from '../resources/resources.service';

@Injectable()
export class WagesService {
  constructor(private readonly dataSource: DataSource) {}

  private get tenant() {
    return DEFAULT_TENANT_ID;
  }

  async workers() {
    const rows = await this.dataSource.query(
      `
      SELECT
        e.id,
        e.employee_code                                   AS "workerId",
        e.full_name                                       AS "name",
        s.name                                            AS "shift",
        m.line_name                                       AS "line",
        COALESCE(ad.status, 'no record')                  AS "attendance",
        COALESCE(pa.output_quantity, 0)::float            AS "bagsPerDay",
        e.daily_wage_rate::float                          AS "wagePerDay",
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
        e.employment_type                                 AS "employmentType",
        e.status                                          AS "status"
      FROM wages.employees e
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
      WHERE e.tenant_id = $1 AND e.deleted_at IS NULL
      ORDER BY e.employee_code
      `,
      [this.tenant],
    );
    return { resource: 'wages/workers', source: 'wages.employees (MWMS)', total: rows.length, data: rows };
  }

  async attendance() {
    const rows = await this.dataSource.query(
      `
      SELECT
        ad.id,
        e.employee_code                                    AS "empId",
        e.full_name                                        AS "name",
        ad.attendance_date                                 AS "date",
        s.name                                             AS "shift",
        to_char(ad.first_in  AT TIME ZONE 'Asia/Kolkata', 'HH24:MI') AS "checkIn",
        to_char(ad.last_out  AT TIME ZONE 'Asia/Kolkata', 'HH24:MI') AS "checkOut",
        ROUND(ad.working_minutes / 60.0, 1)::float         AS "hours",
        ROUND(COALESCE(ot.ot_minutes, 0) / 60.0, 1)::float AS "otHours",
        ad.status                                          AS "status"
      FROM wages.attendance_daily ad
      JOIN wages.employees e ON e.id = ad.employee_id
      LEFT JOIN wages.shifts s ON s.id = ad.shift_id
      LEFT JOIN wages.overtime_requests ot ON ot.attendance_daily_id = ad.id
      WHERE ad.tenant_id = $1 AND ad.deleted_at IS NULL
      ORDER BY ad.attendance_date DESC, e.employee_code
      `,
      [this.tenant],
    );
    return { resource: 'wages/attendance', source: 'wages.attendance_daily (MWMS)', total: rows.length, data: rows };
  }

  async payroll() {
    const rows = await this.dataSource.query(
      `
      SELECT
        l.id,
        e.employee_code                                   AS "empId",
        e.full_name                                       AS "name",
        to_char(ws.period_start, 'Mon YYYY')              AS "month",
        l.present_days::float                             AS "presentDays",
        (l.gross_wage - l.ot_amount - l.incentive_amount)::float AS "baseWage",
        l.ot_amount::float                                AS "otAmount",
        l.incentive_amount::float                         AS "incentive",
        l.gross_wage::float                               AS "grossWage",
        l.employee_statutory_deduction::float             AS "statutoryDeduction",
        l.deductions                                      AS "otherDeductions",
        l.employer_statutory_cost::float                  AS "employerStatutoryCost",
        l.net_wage::float                                 AS "netPay",
        ws.status                                         AS "status"
      FROM wages.wage_sheet_lines l
      JOIN wages.wage_sheets ws ON ws.id = l.wage_sheet_id
      JOIN wages.employees e ON e.id = l.employee_id
      WHERE l.tenant_id = $1
      ORDER BY ws.period_start DESC, e.employee_code
      `,
      [this.tenant],
    );
    return { resource: 'wages/payroll', source: 'wages.wage_sheet_lines (MWMS)', total: rows.length, data: rows };
  }

  async summary() {
    const [att] = await this.dataSource.query(
      `
      SELECT
        ROUND(100.0 * count(*) FILTER (WHERE status IN ('present','half_day'))
              / NULLIF(count(*), 0), 1)::float AS "attendanceRate"
      FROM wages.attendance_daily
      WHERE tenant_id = $1 AND deleted_at IS NULL
      `,
      [this.tenant],
    );

    const [ot] = await this.dataSource.query(
      `
      SELECT
        ROUND(COALESCE(SUM(ot_minutes), 0) / 60.0, 1)::float AS "otHours",
        COALESCE(SUM(calculated_amount), 0)::float           AS "otAmount",
        count(*) FILTER (WHERE status = 'pending')::int      AS "pendingApprovals"
      FROM wages.overtime_requests
      WHERE tenant_id = $1
      `,
      [this.tenant],
    );

    const costPerMachine = await this.dataSource.query(
      `
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
      `,
      [this.tenant],
    );

    const [sheet] = await this.dataSource.query(
      `
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
      `,
      [this.tenant],
    );

    const totalOutput = costPerMachine.reduce(
      (sum: number, r: { output: number | null }) => sum + (r.output ?? 0),
      0,
    );
    const totalLabour = costPerMachine.reduce(
      (sum: number, r: { labourCost: number | null }) => sum + (r.labourCost ?? 0),
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
