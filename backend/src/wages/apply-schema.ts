// Applies sql/mwms_wages_v1.1.sql to Neon — run with: npm run wages:schema.
import * as fs from 'fs';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { Client, neonConfig } from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

async function main() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });
  await client.connect();

  const existing = await client.query(
    `SELECT count(*)::int AS n FROM information_schema.tables WHERE table_schema = 'wages'`,
  );
  if (existing.rows[0].n > 0) {
    console.log(
      `wages schema already has ${existing.rows[0].n} tables — skipping DDL. ` +
        `(Drop with: DROP SCHEMA wages CASCADE)`,
    );
  } else {
    const sql = fs.readFileSync(
      path.join(__dirname, '..', '..', 'sql', 'mwms_wages_v1.1.sql'),
      'utf8',
    );
    console.log('Applying MWMS_Database_Schema_v1.1 ...');
    await client.query(sql);
    const created = await client.query(
      `SELECT count(*)::int AS n FROM information_schema.tables WHERE table_schema = 'wages'`,
    );
    console.log(`Done — ${created.rows[0].n} tables created in schema "wages".`);
  }

  for (const t of ['wages_workers', 'wages_attendance', 'wages_payroll']) {
    await client.query(`DROP TABLE IF EXISTS public."${t}"`);
    console.log(`dropped old toy table public.${t} (if it existed)`);
  }

  await client.end();
}

main().catch((err) => {
  console.error('Schema apply failed:', err.message);
  process.exit(1);
});
