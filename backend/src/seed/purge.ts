// Removes ALL demo/seed rows so real data can be entered. Keeps schema plus
// functional config: wages plant, shifts, statutory rules and the admin user.
// Run with:  npm run purge
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Client } from 'pg';
import { registry } from '../resources/registry';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

async function main() {
  const db = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await db.connect();

  console.log('Purging registry-owned tables (public schema)...');
  for (const def of registry) {
    if (def.external) continue;
    await db.query(`TRUNCATE TABLE public."${def.table}" RESTART IDENTITY CASCADE`);
    console.log(`  emptied ${def.table}`);
  }

  console.log('\nPurging MWMS wages data (keeping plant, shifts, statutory rules)...');
  const wagesTables = [
    'statutory_contributions',
    'payroll_export_batches',
    'wage_sheet_lines',
    'wage_sheets',
    'wage_rate_cards',
    'incentive_awards',
    'incentive_rules',
    'overtime_requests',
    'ot_rules',
    'production_assignments',
    'attendance_daily',
    'attendance_raw_logs',
    'attendance_devices',
    'shift_rosters',
    'holiday_calendar',
    'outbox_events',
    'module_config',
    'employees',
    'contractor_bills',
    'contractors',
    'machines',
    'departments',
  ];
  for (const t of wagesTables) {
    await db.query(`DELETE FROM wages."${t}"`);
    console.log(`  emptied wages.${t}`);
  }

  const kept = await db.query(`
    SELECT
      (SELECT count(*)::int FROM wages.plants) AS plants,
      (SELECT count(*)::int FROM wages.shifts) AS shifts,
      (SELECT count(*)::int FROM wages.statutory_rules) AS statutory_rules,
      (SELECT count(*)::int FROM public.app_users) AS admin_users
  `);
  console.log('\nKept functional config:', kept.rows[0]);
  console.log('Done — database is clean and ready for real data.');
  await db.end();
}

main().catch((err) => {
  console.error('Purge failed:', err.message);
  process.exit(1);
});
