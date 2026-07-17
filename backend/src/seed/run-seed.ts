// Seeds all registry-owned tables — run with: npm run seed.
import 'reflect-metadata';
import * as path from 'path';
import * as dotenv from 'dotenv';
import { DataSource } from 'typeorm';
import { neonConfig } from '@neondatabase/serverless';
import * as neonDriver from '@neondatabase/serverless';
import ws from 'ws';

neonConfig.webSocketConstructor = ws;
import { entitySchemas } from '../resources/entity.factory';
import { registry } from '../resources/registry';
import { ResourceDef } from '../resources/resource.types';

dotenv.config({ path: path.join(__dirname, '..', '..', '.env') });

function rowsFor(def: ResourceDef): Record<string, unknown>[] {
  return def.seed.map((values) =>
    Object.fromEntries(def.columns.map((col, i) => [col.key, values[i] ?? null])),
  );
}

async function main() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not set (backend/.env)');
  }

  const dataSource = new DataSource({
    type: 'postgres',
  driver: neonDriver,
    url: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
    entities: entitySchemas,
    synchronize: true,
  });

  console.log('Connecting to Neon and synchronizing schema...');
  await dataSource.initialize();
  console.log(`Connected. ${registry.length} resources registered.\n`);

  let seeded = 0;
  let skipped = 0;

  for (const def of registry) {
    const repo = dataSource.getRepository(def.path);
    const existing = await repo.count();
    if (existing > 0) {
      skipped++;
      console.log(`  skip  ${def.path}  (${existing} rows already)`);
      continue;
    }
    await repo.save(repo.create(rowsFor(def)));
    seeded++;
    console.log(`  seed  ${def.path}  (+${def.seed.length} rows)`);
  }

  console.log(`\nDone. Seeded ${seeded} tables, skipped ${skipped}.`);
  await dataSource.destroy();
}

main().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
