// Seeds the MWMS wages schema with a sample end-to-end flow — run with: npm run wages:seed.
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Client } from 'pg';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

const T = process.env.TENANT_ID as string;

async function main() {
  if (!process.env.DATABASE_URL || !T) {
    throw new Error('DATABASE_URL and TENANT_ID must be set in backend/.env');
  }
  const db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await db.connect();

  const existing = await db.query(
    `SELECT count(*)::int AS n FROM wages.plants WHERE tenant_id = $1`,
    [T],
  );
  if (existing.rows[0].n > 0) {
    console.log('wages schema already seeded — skipping.');
    await db.end();
    return;
  }

  const one = async (sql: string, params: unknown[]): Promise<string> =>
    (await db.query(sql, params)).rows[0].id;

  const plant = await one(
    `INSERT INTO wages.plants (tenant_id, code, name, address)
     VALUES ($1, 'NKT-P1', 'NKTech Plant 1 — Nagpur', 'MIDC Industrial Area, Nagpur, MH') RETURNING id`,
    [T],
  );

  const deptProduction = await one(
    `INSERT INTO wages.departments (tenant_id, plant_id, name) VALUES ($1, $2, 'Production') RETURNING id`,
    [T, plant],
  );
  const deptPacking = await one(
    `INSERT INTO wages.departments (tenant_id, plant_id, name) VALUES ($1, $2, 'Packing') RETURNING id`,
    [T, plant],
  );

  const mcPacker = await one(
    `INSERT INTO wages.machines (tenant_id, plant_id, code, name, line_name)
     VALUES ($1, $2, 'MC-08', 'Packer #1', 'Line A') RETURNING id`,
    [T, plant],
  );
  const mcRawMill = await one(
    `INSERT INTO wages.machines (tenant_id, plant_id, code, name, line_name)
     VALUES ($1, $2, 'MC-03', 'Raw Mill', 'Line B') RETURNING id`,
    [T, plant],
  );
  const mcCementMill = await one(
    `INSERT INTO wages.machines (tenant_id, plant_id, code, name, line_name)
     VALUES ($1, $2, 'MC-07', 'Cement Mill #2', 'Line C') RETURNING id`,
    [T, plant],
  );

  const contractor = await one(
    `INSERT INTO wages.contractors (tenant_id, name, gst_number, contact_person, contact_phone, billing_rate_type)
     VALUES ($1, 'Shivam Manpower Services', '27ABCDE1234F1Z5', 'Baljeet Singh', '98230 44556', 'per_worker_day') RETURNING id`,
    [T],
  );

  const shMorning = await one(
    `INSERT INTO wages.shifts (tenant_id, plant_id, name, start_time, end_time, standard_hours, breaks)
     VALUES ($1, $2, 'Morning', '06:00', '14:00', 8.0, '[{"start":"10:00","end":"10:30","paid":false}]') RETURNING id`,
    [T, plant],
  );
  const shEvening = await one(
    `INSERT INTO wages.shifts (tenant_id, plant_id, name, start_time, end_time, standard_hours, breaks)
     VALUES ($1, $2, 'Evening', '14:00', '22:00', 8.0, '[{"start":"18:00","end":"18:30","paid":false}]') RETURNING id`,
    [T, plant],
  );
  const shNight = await one(
    `INSERT INTO wages.shifts (tenant_id, plant_id, name, start_time, end_time, is_night_shift, standard_hours)
     VALUES ($1, $2, 'Night', '22:00', '06:00', true, 8.0) RETURNING id`,
    [T, plant],
  );

  await db.query(
    `INSERT INTO wages.holiday_calendar (tenant_id, plant_id, calendar_date, name, day_type) VALUES
     ($1, $2, '2026-07-12', 'Weekly Off — Sunday', 'weekly_off'),
     ($1, $2, '2026-08-15', 'Independence Day', 'national_holiday')`,
    [T, plant],
  );

  const emp = async (
    code: string, name: string, dept: string, skill: string, type: string,
    contractorId: string | null, rate: number, shift: string, doj: string,
  ) =>
    one(
      `INSERT INTO wages.employees
       (tenant_id, employee_code, full_name, plant_id, department_id, skill_category,
        employment_type, contractor_id, wage_type, daily_wage_rate, ot_eligible,
        default_shift_id, uan_number, status, date_of_joining)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,'daily',$9,true,$10,$11,'active',$12) RETURNING id`,
      [T, code, name, plant, dept, skill, type, contractorId, rate, shift, `10${code.replace(/\D/g, '')}45678`, doj],
    );

  const w1 = await emp('W-001', 'Ramesh Kumar', deptPacking, 'packer', 'permanent', null, 850, shMorning, '2021-04-12');
  const w2 = await emp('W-002', 'Nilesh Kulkarni', deptProduction, 'mixer_operator', 'permanent', null, 820, shMorning, '2022-01-20');
  const w3 = await emp('W-003', 'Mahesh Singh', deptProduction, 'mixer_operator', 'permanent', null, 800, shEvening, '2023-08-05');
  const w4 = await emp('W-004', 'Dinesh Rao', deptPacking, 'packer', 'permanent', null, 850, shMorning, '2020-11-30');
  const w5 = await emp('W-005', 'Santosh Pawar', deptProduction, 'helper', 'contractor', contractor, 780, shNight, '2025-02-14');

  for (const [empId, shiftId] of [
    [w1, shMorning], [w2, shMorning], [w3, shEvening], [w4, shMorning], [w5, shNight],
  ] as const) {
    await db.query(
      `INSERT INTO wages.shift_rosters (tenant_id, employee_id, shift_id, effective_from)
       VALUES ($1, $2, $3, '2026-07-01')`,
      [T, empId, shiftId],
    );
  }

  const device = await one(
    `INSERT INTO wages.attendance_devices (tenant_id, plant_id, device_code, device_type, ip_address)
     VALUES ($1, $2, 'BIO-GATE1', 'fingerprint', '10.20.2.15') RETURNING id`,
    [T, plant],
  );

  const punches: [string, string, string][] = [
    [w1, '2026-07-10 06:01+05:30', 'in'], [w1, '2026-07-10 15:35+05:30', 'out'],
    [w2, '2026-07-10 06:08+05:30', 'in'], [w2, '2026-07-10 14:05+05:30', 'out'],
    [w3, '2026-07-10 13:58+05:30', 'in'], [w3, '2026-07-10 22:04+05:30', 'out'],
    [w4, '2026-07-10 06:00+05:30', 'in'], [w4, '2026-07-10 14:02+05:30', 'out'],
    [w1, '2026-07-11 06:02+05:30', 'in'],
    [w2, '2026-07-11 06:07+05:30', 'in'],
  ];
  for (const [empId, time, type] of punches) {
    await db.query(
      `INSERT INTO wages.attendance_raw_logs (tenant_id, employee_id, device_id, punch_time, punch_type, source)
       VALUES ($1, $2, $3, $4, $5, 'biometric')`,
      [T, empId, device, time, type],
    );
  }

  const attDay = async (
    empId: string, date: string, shiftId: string, firstIn: string | null,
    lastOut: string | null, mins: number, late: number, status: string,
  ) =>
    one(
      `INSERT INTO wages.attendance_daily
       (tenant_id, employee_id, attendance_date, shift_id, first_in, last_out,
        working_minutes, late_minutes, break_minutes, status)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,30,$9) RETURNING id`,
      [T, empId, date, shiftId, firstIn, lastOut, mins, late, status],
    );

  const ad1 = await attDay(w1, '2026-07-10', shMorning, '2026-07-10 06:01+05:30', '2026-07-10 15:35+05:30', 544, 1, 'present');
  const ad2 = await attDay(w2, '2026-07-10', shMorning, '2026-07-10 06:08+05:30', '2026-07-10 14:05+05:30', 447, 8, 'present');
  const ad3 = await attDay(w3, '2026-07-10', shEvening, '2026-07-10 13:58+05:30', '2026-07-10 22:04+05:30', 456, 0, 'present');
  const ad4 = await attDay(w4, '2026-07-10', shMorning, '2026-07-10 06:00+05:30', '2026-07-10 14:02+05:30', 452, 0, 'present');
  await attDay(w5, '2026-07-10', shNight, null, null, 0, 0, 'absent');
  const ad1b = await attDay(w1, '2026-07-11', shMorning, '2026-07-11 06:02+05:30', null, 0, 2, 'present');
  const ad2b = await attDay(w2, '2026-07-11', shMorning, '2026-07-11 06:07+05:30', null, 0, 7, 'present');

  const batchA = 'aaaaaaaa-0000-0000-0000-00000000b001';
  const batchB = 'aaaaaaaa-0000-0000-0000-00000000b002';
  const productOpc = 'bbbbbbbb-0000-0000-0000-00000000f001';

  const assign = async (
    empId: string, adId: string, machineId: string, batch: string,
    mins: number, output: number, supervisor: string,
  ) =>
    db.query(
      `INSERT INTO wages.production_assignments
       (tenant_id, employee_id, attendance_daily_id, machine_id, plant_id, batch_id,
        product_id, assigned_minutes, output_quantity, uom, supervisor_employee_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,'bags',$10)`,
      [T, empId, adId, machineId, plant, batch, productOpc, mins, output, supervisor],
    );

  await assign(w1, ad1, mcPacker, batchA, 480, 520, w4);
  await assign(w2, ad2, mcRawMill, batchA, 420, 390, w4);
  await assign(w3, ad3, mcCementMill, batchB, 426, 260, w4);
  await assign(w4, ad4, mcPacker, batchA, 452, 495, w1);
  await assign(w1, ad1b, mcPacker, batchB, 240, 250, w4);
  await assign(w2, ad2b, mcRawMill, batchB, 230, 190, w4);

  const otRule = await one(
    `INSERT INTO wages.ot_rules
     (tenant_id, plant_id, name, trigger_after_minutes, multiplier, applicable_day_types, priority, effective_from)
     VALUES ($1, $2, 'Weekday OT after 8h @ 2x', 480, 2.00, '["weekday"]', 1, '2026-04-01') RETURNING id`,
    [T, plant],
  );
  await db.query(
    `INSERT INTO wages.ot_rules
     (tenant_id, plant_id, name, trigger_after_minutes, multiplier, applicable_day_types, priority, effective_from)
     VALUES ($1, $2, 'Holiday/Sunday OT @ 3x', 0, 3.00, '["sunday","holiday"]', 2, '2026-04-01')`,
    [T, plant],
  );

  await db.query(
    `INSERT INTO wages.overtime_requests
     (tenant_id, employee_id, attendance_daily_id, ot_rule_id, ot_minutes, calculated_amount, status, approved_by, approved_at)
     VALUES ($1,$2,$3,$4,64,226.67,'approved',$5,'2026-07-10 18:30+05:30')`,
    [T, w1, ad1, otRule, w4],
  );

  const incRule = await one(
    `INSERT INTO wages.incentive_rules
     (tenant_id, plant_id, name, target_metric, target_value, bonus_type, bonus_value, effective_from)
     VALUES ($1, $2, 'Packing above 500 bags/day', 'output_quantity', 500, 'per_unit', 0.50, '2026-04-01') RETURNING id`,
    [T, plant],
  );
  await db.query(
    `INSERT INTO wages.incentive_awards
     (tenant_id, employee_id, incentive_rule_id, period_start, period_end, achieved_value, bonus_amount, status)
     VALUES ($1,$2,$3,'2026-07-01','2026-07-10',520,10.00,'calculated')`,
    [T, w1, incRule],
  );

  const statRule = async (
    scheme: string, state: string | null, empPct: number, erPct: number,
    ceiling: number | null, slab: number | null,
  ) =>
    one(
      `INSERT INTO wages.statutory_rules
       (tenant_id, scheme_type, state, employee_contribution_percent,
        employer_contribution_percent, wage_ceiling, fixed_slab_amount, effective_from)
       VALUES ($1,$2,$3,$4,$5,$6,$7,'2026-04-01') RETURNING id`,
      [T, scheme, state, empPct, erPct, ceiling, slab],
    );

  const rulePf = await statRule('PF', null, 12, 13, 15000, null);
  const ruleEsi = await statRule('ESI', null, 0.75, 3.25, 21000, null);
  const rulePt = await statRule('PT', 'Maharashtra', 0, 0, null, 200);
  await statRule('LWF', 'Maharashtra', 0, 0, null, 25);

  await db.query(
    `INSERT INTO wages.wage_rate_cards (tenant_id, skill_category, wage_type, base_rate, effective_from) VALUES
     ($1, 'packer', 'daily', 850, '2026-04-01'),
     ($1, 'mixer_operator', 'daily', 820, '2026-04-01'),
     ($1, 'helper', 'daily', 780, '2026-04-01')`,
    [T],
  );

  const sheet = await one(
    `INSERT INTO wages.wage_sheets (tenant_id, plant_id, period_start, period_end, status, generated_at, generated_by)
     VALUES ($1, $2, '2026-06-01', '2026-06-30', 'locked', '2026-07-01 08:30+05:30', $3) RETURNING id`,
    [T, plant, w4],
  );

  const line = async (
    empId: string, present: number, absent: number, otMin: number, otAmt: number,
    incentive: number, base: number, advance: number,
  ) => {
    const gross = base + otAmt + incentive;
    const pfBase = Math.min(base, 15000);
    const pfEmp = Math.round(pfBase * 0.12 * 100) / 100;
    const pfEr = Math.round(pfBase * 0.13 * 100) / 100;
    const esiApplies = gross <= 21000;
    const esiEmp = esiApplies ? Math.round(gross * 0.0075 * 100) / 100 : 0;
    const esiEr = esiApplies ? Math.round(gross * 0.0325 * 100) / 100 : 0;
    const pt = 200;
    const empStat = Math.round((pfEmp + esiEmp + pt) * 100) / 100;
    const erStat = Math.round((pfEr + esiEr) * 100) / 100;
    const net = Math.round((gross - empStat - advance) * 100) / 100;

    const lineId = await one(
      `INSERT INTO wages.wage_sheet_lines
       (tenant_id, wage_sheet_id, employee_id, present_days, absent_days, ot_minutes, ot_amount,
        incentive_amount, gross_wage, deductions, employee_statutory_deduction, employer_statutory_cost, net_wage)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13) RETURNING id`,
      [T, sheet, empId, present, absent, otMin, otAmt, incentive, gross,
        JSON.stringify(advance ? { advance } : {}), empStat, erStat, net],
    );

    const contrib = (ruleId: string, scheme: string, baseAmt: number, e: number, er: number) =>
      db.query(
        `INSERT INTO wages.statutory_contributions
         (tenant_id, wage_sheet_line_id, employee_id, statutory_rule_id, scheme_type,
          contribution_base_amount, employee_contribution, employer_contribution)
         VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
        [T, lineId, empId, ruleId, scheme, baseAmt, e, er],
      );
    await contrib(rulePf, 'PF', pfBase, pfEmp, pfEr);
    if (esiApplies) await contrib(ruleEsi, 'ESI', gross, esiEmp, esiEr);
    await contrib(rulePt, 'PT', gross, pt, 0);
  };

  await line(w1, 26, 0, 480, 3400, 300, 22100, 500);
  await line(w2, 25, 1, 120, 410, 0, 20500, 0);
  await line(w3, 26, 0, 0, 0, 0, 20800, 1000);
  await line(w4, 24, 2, 240, 1700, 150, 20400, 0);
  await line(w5, 22, 4, 0, 0, 0, 17160, 0);

  await db.query(
    `INSERT INTO wages.payroll_export_batches (tenant_id, wage_sheet_id, export_format, exported_at, status)
     VALUES ($1, $2, 'bank_csv', '2026-07-02 11:15+05:30', 'exported')`,
    [T, sheet],
  );

  await db.query(
    `INSERT INTO wages.contractor_bills (tenant_id, contractor_id, period_start, period_end, total_amount, status)
     VALUES ($1, $2, '2026-06-01', '2026-06-30', 17160.00, 'approved')`,
    [T, contractor],
  );

  await db.query(
    `INSERT INTO wages.module_config (tenant_id, plant_id, config_key, config_value) VALUES
     ($1, $2, 'ot_calculation_mode', '{"mode":"rule_engine"}'),
     ($1, NULL, 'ai_ot_analysis_enabled', 'true')`,
    [T, plant],
  );

  await db.query(
    `INSERT INTO wages.outbox_events (tenant_id, event_type, payload, status, published_at) VALUES
     ($1, 'WageSheetGenerated', '{"wageSheetId":"${sheet}","period":"2026-06"}', 'published', '2026-07-01 08:31+05:30'),
     ($1, 'OvertimeApproved', '{"employeeCode":"W-001","otMinutes":64}', 'published', '2026-07-10 18:31+05:30'),
     ($1, 'AttendanceRecorded', '{"date":"2026-07-11","present":2}', 'pending', NULL)`,
    [T],
  );

  console.log('MWMS wages schema seeded: 1 plant, 5 employees, attendance + OT +');
  console.log('production assignments, statutory rules, June-2026 wage sheet (5 lines');
  console.log('+ contributions), payroll export, contractor bill, outbox events.');
  await db.end();
}

main().catch((err) => {
  console.error('Wages seed failed:', err.message);
  process.exit(1);
});
