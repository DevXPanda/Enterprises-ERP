# NKTech ERP API — NestJS + PostgreSQL (Neon)

Backend for every page of the Next.js frontend: **89 resources** (Factory, Manufacturing, Wages)
with full CRUD, search, filtering, pagination — plus aggregate dashboard endpoints.

The Wages module runs on the real **MWMS v1.1 schema** (`sql/mwms_wages_v1.1.sql`,
schema `wages`, 25 tables): UUID PKs, tenant scoping, soft deletes, OT/incentive/statutory
rule engines, wage sheets, and the event outbox.

## Setup & run

```bash
npm install
npm run seed          # public-schema tables (factory/manufacturing) + sample data
npm run wages:schema  # applies MWMS_Database_Schema_v1.1 (schema `wages`, 25 tables)
npm run wages:seed    # full sample wage flow: attendance -> OT -> wage sheet -> statutory -> export
npm run start:dev     # dev server with watch  -> http://localhost:4000/api
# or
npm run build && npm start
```

`DATABASE_URL` is read from `backend/.env` (Neon Postgres, SSL required).
All scripts are idempotent — they skip anything that already exists.

## How it works

Every frontend page's table is declared once in `src/resources/registry/` as a
`ResourceDef` — URL path, typed columns, searchable fields, optional auto-code
(e.g. `GRN-1005`), and seed rows. From that single declaration the app generates:

- a TypeORM `EntitySchema` (table) — `src/resources/entity.factory.ts`
- CRUD routes — `src/resources/resources.controller.ts`
- seeding — `src/seed/run-seed.ts`

Adding a new page's backend = adding one `defineResource(...)` entry.

## API

| Route | Meaning |
|---|---|
| `GET /api/health` | service + database status |
| `GET /api/resources` | catalog of all resources with their columns |
| `GET /api/dashboard` | executive dashboard payload (frontend `/`) |
| `GET /api/factory/dashboard` | factory dashboard (KPIs computed live from DB) |
| `GET /api/<page-path>` | list — supports `?search=`, `?page=`, `?pageSize=`, `?sort=`, `?order=`, and `?<column>=value` filters |
| `GET /api/<page-path>/:id` | single row |
| `POST /api/<page-path>` | create (business code auto-generated if omitted) |
| `PATCH /api/<page-path>/:id` | update |
| `DELETE /api/<page-path>/:id` | delete |

`<page-path>` mirrors the frontend route, e.g.:

```
GET  /api/factory/store/current-stock?search=limestone
GET  /api/factory/smart-access/employee-entry?page=1&pageSize=20
POST /api/factory/production/production-orders
GET  /api/manufacturing/bom
```

### Wages (MWMS)

Frontend-compatible read models (computed live from the MWMS tables):

| Route | Backed by |
|---|---|
| `GET /api/wages/workers` | `wages.employees` + latest production assignment + attendance |
| `GET /api/wages/attendance` | `wages.attendance_daily` + OT requests |
| `GET /api/wages/payroll` | `wages.wage_sheet_lines` with statutory split |
| `GET /api/wages/summary` | production-linked labour cost analytics (cost/bag, cost/machine, true labour cost incl. employer PF/ESI) |

Plus raw CRUD on all 25 MWMS tables (UUID ids, tenant auto-injected, soft delete
where the table has `deleted_at`): `/api/wages/plants`, `/api/wages/employees`,
`/api/wages/shifts`, `/api/wages/attendance-daily`, `/api/wages/production-assignments`,
`/api/wages/ot-rules`, `/api/wages/overtime-requests`, `/api/wages/incentive-rules`,
`/api/wages/wage-sheets`, `/api/wages/wage-sheet-lines`, `/api/wages/statutory-rules`,
`/api/wages/statutory-contributions`, `/api/wages/contractor-bills`,
`/api/wages/outbox-events`, … (full list at `GET /api/resources`).

## Notes

- `synchronize: true` is enabled for development — move to migrations before production.
- No authentication yet — add a Nest guard (JWT) before exposing publicly.
- The old demo services (`backend/wages/server.js`, `backend/manufacture/server.js`)
  and the root `gateway/` are superseded by this API.
