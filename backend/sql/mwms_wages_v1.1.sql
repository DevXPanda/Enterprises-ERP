-- ══════════════════════════════════════════════════════════════════════════
-- Manufacturing Wages Management System (MWMS) — Database Schema v1.1
-- CHANGELOG v1.0 -> v1.1: Added Section 7B (statutory_rules,
-- statutory_contributions) for PF/ESI/PT/LWF — configurable rule engine
-- + employer-vs-employee contribution split, feeding labour cost
-- analytics. Added employee_statutory_deduction / employer_statutory_cost
-- columns to wage_sheet_lines.
-- Service: nep-wages   |   Schema: wages
-- Stack target: NestJS + Prisma + PostgreSQL 16 + Redis + (RabbitMQ later)
--
-- DESIGN PRINCIPLES (inherited from NEP Development Bible / Architecture
-- Constitution — kept identical so this schema drops into NEP later with
-- ZERO structural change):
--   1. Schema-per-capability. This service owns schema `wages` only.
--   2. NO cross-schema / cross-service foreign keys. External entities
--      (Employee master, Plant, Machine, Batch, Product, User) are stored
--      as plain UUID columns. Where local lookups/joins are needed, a
--      local "shadow" table is kept (see Section 1) — populated manually/
--      via API today, via domain events after NEP integration.
--   3. Every table: id UUID PK, tenant_id UUID NOT NULL, created_at,
--      updated_at, created_by, updated_by, deleted_at (soft delete).
--   4. Row-Level Security (RLS) enabled + tenant_isolation policy on
--      every tenant-scoped table.
--   5. Rule engines (OT, Incentives) are JSONB-configurable — never
--      hardcoded business logic in application code.
--   6. Outbox Pattern for every state change that must eventually notify
--      other capabilities (Payroll, Finance, Manufacturing).
--   7. Prisma Migrate, one migration history for this repo.
-- ══════════════════════════════════════════════════════════════════════════

CREATE SCHEMA IF NOT EXISTS wages;

-- ═══════════════════════════════════════════════════════════════════════
-- SECTION 1 — LOCAL SHADOW MASTER DATA
-- Standalone-mode source of truth. external_id stays NULL until this
-- service is wired into NEP; then a sync consumer backfills it and future
-- rows arrive via events (EmployeeCreated, PlantCreated, MachineRegistered).
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE wages.plants (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL,
    external_plant_id   UUID,                       -- organization.plants(id) once integrated, no FK
    code                VARCHAR(20) NOT NULL,
    name                VARCHAR(150) NOT NULL,
    address             TEXT,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by          UUID,
    updated_by          UUID,
    deleted_at          TIMESTAMPTZ,
    CONSTRAINT uq_plants_tenant_code UNIQUE (tenant_id, code)
);

CREATE TABLE wages.departments (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL,
    plant_id            UUID NOT NULL REFERENCES wages.plants(id),  -- FK OK: same schema
    name                VARCHAR(150) NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at          TIMESTAMPTZ
);

CREATE TABLE wages.machines (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL,
    external_machine_id UUID,                       -- manufacturing.machines(id) once integrated, no FK
    plant_id            UUID NOT NULL REFERENCES wages.plants(id),
    code                VARCHAR(30) NOT NULL,
    name                VARCHAR(150) NOT NULL,
    line_name           VARCHAR(100),
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at          TIMESTAMPTZ,
    CONSTRAINT uq_machines_tenant_code UNIQUE (tenant_id, code)
);

CREATE TABLE wages.contractors (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL,
    name                VARCHAR(150) NOT NULL,
    gst_number          VARCHAR(20),
    contact_person      VARCHAR(100),
    contact_phone       VARCHAR(20),
    billing_rate_type   VARCHAR(20) NOT NULL DEFAULT 'per_worker_day', -- per_worker_day | per_output | fixed_monthly
    status              VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at          TIMESTAMPTZ
);

CREATE TABLE wages.employees (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL,
    external_employee_id UUID,                      -- identity.users(id) / future HR module, no FK
    employee_code       VARCHAR(30) NOT NULL,
    full_name           VARCHAR(150) NOT NULL,
    plant_id            UUID NOT NULL REFERENCES wages.plants(id),
    department_id       UUID REFERENCES wages.departments(id),
    skill_category       VARCHAR(50),                -- e.g. mixer_operator, packer, helper
    employment_type      VARCHAR(20) NOT NULL DEFAULT 'permanent', -- permanent | contractor
    contractor_id         UUID REFERENCES wages.contractors(id),
    wage_type              VARCHAR(20) NOT NULL DEFAULT 'daily',     -- hourly | daily | monthly | piece_rate | mixed
    daily_wage_rate         NUMERIC(12,2),
    hourly_wage_rate        NUMERIC(12,2),
    ot_eligible              BOOLEAN NOT NULL DEFAULT true,
    default_shift_id         UUID,                     -- wages.shifts(id), set after shifts table exists (added via ALTER below)
    bank_account_number       VARCHAR(30),
    bank_ifsc                   VARCHAR(15),
    uan_number                    VARCHAR(20),
    esic_number                     VARCHAR(20),
    pf_number                         VARCHAR(20),
    status                              VARCHAR(20) NOT NULL DEFAULT 'active', -- active | inactive | terminated
    date_of_joining                      DATE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by          UUID,
    updated_by          UUID,
    deleted_at          TIMESTAMPTZ,
    CONSTRAINT uq_employees_tenant_code UNIQUE (tenant_id, employee_code)
);
CREATE INDEX idx_employees_tenant_plant ON wages.employees (tenant_id, plant_id) WHERE deleted_at IS NULL;
CREATE INDEX idx_employees_contractor ON wages.employees (contractor_id) WHERE contractor_id IS NOT NULL;

-- ═══════════════════════════════════════════════════════════════════════
-- SECTION 2 — SHIFT & CALENDAR MANAGEMENT
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE wages.shifts (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL,
    plant_id            UUID NOT NULL REFERENCES wages.plants(id),
    name                VARCHAR(50) NOT NULL,          -- Morning / General / Evening / Night
    start_time          TIME NOT NULL,
    end_time            TIME NOT NULL,
    is_night_shift      BOOLEAN NOT NULL DEFAULT false, -- crosses midnight
    grace_minutes       SMALLINT NOT NULL DEFAULT 10,
    standard_hours      NUMERIC(4,2) NOT NULL DEFAULT 8.00,
    breaks              JSONB NOT NULL DEFAULT '[]',    -- [{"start":"13:00","end":"13:30","paid":false}]
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at          TIMESTAMPTZ
);

ALTER TABLE wages.employees
    ADD CONSTRAINT fk_employees_default_shift FOREIGN KEY (default_shift_id) REFERENCES wages.shifts(id);

CREATE TABLE wages.shift_rosters (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL,
    employee_id         UUID NOT NULL REFERENCES wages.employees(id),
    shift_id            UUID NOT NULL REFERENCES wages.shifts(id),
    effective_from      DATE NOT NULL,
    effective_to        DATE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_shift_rosters_employee ON wages.shift_rosters (tenant_id, employee_id, effective_from DESC);

CREATE TABLE wages.holiday_calendar (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL,
    plant_id            UUID NOT NULL REFERENCES wages.plants(id),
    calendar_date       DATE NOT NULL,
    name                VARCHAR(100) NOT NULL,
    day_type            VARCHAR(20) NOT NULL,   -- national_holiday | festival_holiday | weekly_off
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_holiday_tenant_plant_date UNIQUE (tenant_id, plant_id, calendar_date)
);

-- ═══════════════════════════════════════════════════════════════════════
-- SECTION 3 — ATTENDANCE
-- Raw punches are immutable (audit trail); daily attendance is the
-- computed/derived row the rest of the system (OT, wages) actually uses.
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE wages.attendance_devices (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL,
    plant_id            UUID NOT NULL REFERENCES wages.plants(id),
    device_code         VARCHAR(50) NOT NULL,
    device_type         VARCHAR(20) NOT NULL,   -- fingerprint | face | tablet | manual
    ip_address          INET,
    status              VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_devices_tenant_code UNIQUE (tenant_id, device_code)
);

-- Immutable raw capture — never updated, only inserted. Source of truth for audit.
CREATE TABLE wages.attendance_raw_logs (
    id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id           UUID NOT NULL,
    employee_id         UUID NOT NULL REFERENCES wages.employees(id),
    device_id           UUID REFERENCES wages.attendance_devices(id),
    punch_time          TIMESTAMPTZ NOT NULL,
    punch_type          VARCHAR(10) NOT NULL,   -- in | out
    source               VARCHAR(20) NOT NULL DEFAULT 'biometric', -- biometric | manual | voice | ocr
    raw_payload           JSONB,                  -- device/OCR/voice-parser raw response for audit
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_attendance_raw_employee_time ON wages.attendance_raw_logs (tenant_id, employee_id, punch_time DESC);

-- Computed daily summary — one row per employee per calendar date.
CREATE TABLE wages.attendance_daily (
    id                      UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id               UUID NOT NULL,
    employee_id             UUID NOT NULL REFERENCES wages.employees(id),
    attendance_date         DATE NOT NULL,
    shift_id                UUID REFERENCES wages.shifts(id),
    first_in                TIMESTAMPTZ,
    last_out                TIMESTAMPTZ,
    working_minutes         INTEGER NOT NULL DEFAULT 0,
    late_minutes             INTEGER NOT NULL DEFAULT 0,
    early_leaving_minutes    INTEGER NOT NULL DEFAULT 0,
    break_minutes             INTEGER NOT NULL DEFAULT 0,
    status                     VARCHAR(20) NOT NULL DEFAULT 'present', -- present|absent|half_day|weekly_off|holiday|leave
    is_manual_override         BOOLEAN NOT NULL DEFAULT false,
    override_reason             TEXT,
    approved_by                   UUID,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at          TIMESTAMPTZ,
    CONSTRAINT uq_attendance_daily_emp_date UNIQUE (tenant_id, employee_id, attendance_date)
);
CREATE INDEX idx_attendance_daily_date ON wages.attendance_daily (tenant_id, attendance_date);

-- ═══════════════════════════════════════════════════════════════════════
-- SECTION 4 — PRODUCTION-LINKED LABOUR (the flagship differentiator)
-- Links an employee's working day to a machine/batch so labour cost can
-- be sliced per batch/product/machine — not just per employee.
-- batch_id / product_id are external (Manufacturing owns them) — plain
-- UUID, no FK, resolved via API or event-fed projection later.
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE wages.production_assignments (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id            UUID NOT NULL,
    employee_id          UUID NOT NULL REFERENCES wages.employees(id),
    attendance_daily_id  UUID NOT NULL REFERENCES wages.attendance_daily(id),
    machine_id           UUID REFERENCES wages.machines(id),
    plant_id             UUID NOT NULL REFERENCES wages.plants(id),
    batch_id             UUID,              -- manufacturing.production_batches(id), no FK
    product_id           UUID,              -- product.items(id), no FK
    assigned_minutes     INTEGER NOT NULL,
    output_quantity      NUMERIC(18,4),
    uom                  VARCHAR(10),
    supervisor_employee_id UUID REFERENCES wages.employees(id),
    remarks              TEXT,
    created_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at           TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at           TIMESTAMPTZ
);
CREATE INDEX idx_prod_assign_batch ON wages.production_assignments (tenant_id, batch_id);
CREATE INDEX idx_prod_assign_machine ON wages.production_assignments (tenant_id, machine_id);
CREATE INDEX idx_prod_assign_employee_date ON wages.production_assignments (tenant_id, employee_id, attendance_daily_id);

-- ═══════════════════════════════════════════════════════════════════════
-- SECTION 5 — OVERTIME (configurable rule engine, no hardcoded logic)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE wages.ot_rules (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id            UUID NOT NULL,
    plant_id             UUID REFERENCES wages.plants(id),   -- NULL = applies to all plants
    name                 VARCHAR(100) NOT NULL,
    trigger_after_minutes INTEGER NOT NULL,        -- e.g. 480 = OT starts after 8 hrs
    multiplier           NUMERIC(4,2) NOT NULL DEFAULT 2.00, -- 2x / 3x
    applicable_day_types JSONB NOT NULL DEFAULT '["weekday"]', -- weekday|sunday|holiday|festival|night
    priority              SMALLINT NOT NULL DEFAULT 1,
    effective_from        DATE NOT NULL,
    effective_to          DATE,
    is_active              BOOLEAN NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at          TIMESTAMPTZ
);

CREATE TABLE wages.overtime_requests (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id            UUID NOT NULL,
    employee_id          UUID NOT NULL REFERENCES wages.employees(id),
    attendance_daily_id  UUID NOT NULL REFERENCES wages.attendance_daily(id),
    ot_rule_id           UUID REFERENCES wages.ot_rules(id),
    ot_minutes           INTEGER NOT NULL,
    calculated_amount    NUMERIC(12,2) NOT NULL,
    status               VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending|approved|rejected
    approval_workflow_ref UUID,              -- future: NEP Workflow Engine instance id, no FK
    approved_by           UUID,
    approved_at            TIMESTAMPTZ,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_ot_request_attendance UNIQUE (tenant_id, attendance_daily_id)
);

-- ═══════════════════════════════════════════════════════════════════════
-- SECTION 6 — INCENTIVES
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE wages.incentive_rules (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id            UUID NOT NULL,
    plant_id             UUID REFERENCES wages.plants(id),
    name                 VARCHAR(100) NOT NULL,
    target_metric        VARCHAR(30) NOT NULL,   -- output_quantity | batch_count | attendance_days
    target_value          NUMERIC(18,4) NOT NULL,
    bonus_type              VARCHAR(20) NOT NULL,   -- fixed | percentage | per_unit
    bonus_value               NUMERIC(12,2) NOT NULL,
    conditions                 JSONB NOT NULL DEFAULT '{}',
    effective_from        DATE NOT NULL,
    effective_to          DATE,
    is_active              BOOLEAN NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    deleted_at          TIMESTAMPTZ
);

CREATE TABLE wages.incentive_awards (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id            UUID NOT NULL,
    employee_id          UUID NOT NULL REFERENCES wages.employees(id),
    incentive_rule_id    UUID NOT NULL REFERENCES wages.incentive_rules(id),
    period_start         DATE NOT NULL,
    period_end           DATE NOT NULL,
    achieved_value        NUMERIC(18,4) NOT NULL,
    bonus_amount           NUMERIC(12,2) NOT NULL,
    status                   VARCHAR(20) NOT NULL DEFAULT 'calculated', -- calculated|approved|paid
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_incentive_awards_period ON wages.incentive_awards (tenant_id, employee_id, period_start);

-- ═══════════════════════════════════════════════════════════════════════
-- SECTION 7 — WAGE COMPUTATION & PAYROLL EXPORT
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE wages.wage_rate_cards (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id            UUID NOT NULL,
    employee_id          UUID REFERENCES wages.employees(id),  -- NULL = applies via skill_category instead
    skill_category        VARCHAR(50),
    wage_type              VARCHAR(20) NOT NULL,
    base_rate               NUMERIC(12,2) NOT NULL,
    effective_from        DATE NOT NULL,
    effective_to          DATE,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE wages.wage_sheets (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id            UUID NOT NULL,
    plant_id             UUID NOT NULL REFERENCES wages.plants(id),
    period_start         DATE NOT NULL,
    period_end           DATE NOT NULL,
    status               VARCHAR(20) NOT NULL DEFAULT 'draft', -- draft|computed|approved|locked|exported
    generated_at         TIMESTAMPTZ,
    generated_by         UUID,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_wage_sheet_period UNIQUE (tenant_id, plant_id, period_start, period_end)
);

CREATE TABLE wages.wage_sheet_lines (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id            UUID NOT NULL,
    wage_sheet_id        UUID NOT NULL REFERENCES wages.wage_sheets(id) ON DELETE CASCADE,
    employee_id          UUID NOT NULL REFERENCES wages.employees(id),
    present_days         NUMERIC(5,2) NOT NULL DEFAULT 0,
    absent_days           NUMERIC(5,2) NOT NULL DEFAULT 0,
    ot_minutes             INTEGER NOT NULL DEFAULT 0,
    ot_amount               NUMERIC(12,2) NOT NULL DEFAULT 0,
    incentive_amount          NUMERIC(12,2) NOT NULL DEFAULT 0,
    gross_wage                  NUMERIC(12,2) NOT NULL DEFAULT 0,
    deductions                    JSONB NOT NULL DEFAULT '{}',  -- non-statutory: advance, fine, canteen, etc.
    employee_statutory_deduction    NUMERIC(12,2) NOT NULL DEFAULT 0,  -- sum of employee_contribution across wages.statutory_contributions
    employer_statutory_cost           NUMERIC(12,2) NOT NULL DEFAULT 0,  -- sum of employer_contribution — real labour cost, not on payslip
    net_wage                        NUMERIC(12,2) NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_wage_line_sheet_emp UNIQUE (wage_sheet_id, employee_id)
);
CREATE INDEX idx_wage_lines_sheet ON wages.wage_sheet_lines (wage_sheet_id);

-- Integration hook — this is the seam where "Payroll" (external, future
-- NEP Finance/Payroll capability) picks up computed wages. Standalone
-- mode: export as CSV/bank-file. Integrated mode: same table, an
-- outbox event fires instead.
CREATE TABLE wages.payroll_export_batches (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id            UUID NOT NULL,
    wage_sheet_id        UUID NOT NULL REFERENCES wages.wage_sheets(id),
    export_format        VARCHAR(20) NOT NULL DEFAULT 'bank_csv', -- bank_csv | nep_finance_api
    exported_at          TIMESTAMPTZ,
    status               VARCHAR(20) NOT NULL DEFAULT 'pending',
    external_reference_id UUID,        -- finance.vendor_payments(id) once integrated, no FK
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- ═══════════════════════════════════════════════════════════════════════
-- SECTION 7B — STATUTORY DEDUCTIONS & EMPLOYER CONTRIBUTIONS (PF / ESI / PT / LWF)
-- Same configurable rule-engine pattern as OT_RULES / INCENTIVE_RULES.
-- IMPORTANT: statutory schemes have BOTH an employee deduction and an
-- employer contribution. The employer side never appears on the worker's
-- payslip but IS a real labour cost — required for accurate cost-per-bag /
-- cost-per-batch analytics (the flagship differentiator feature).
-- Rates/ceilings change by government notification, so they are
-- versioned rows (effective_from/effective_to), never hardcoded —
-- historical wage sheets stay correct even after a rate change.
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE wages.statutory_rules (
    id                          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id                   UUID NOT NULL,
    plant_id                    UUID REFERENCES wages.plants(id),  -- NULL = applies to all plants
    scheme_type                 VARCHAR(20) NOT NULL,        -- PF | ESI | PT | LWF
    state                       VARCHAR(50),                  -- required for PT (state-specific slabs)
    employee_contribution_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
    employer_contribution_percent NUMERIC(5,2) NOT NULL DEFAULT 0,
    wage_ceiling                NUMERIC(12,2),                -- e.g. 15000 for PF, 21000 for ESI; NULL = no ceiling
    fixed_slab_amount           NUMERIC(12,2),                -- for PT/LWF which are often flat slabs, not %
    effective_from              DATE NOT NULL,
    effective_to                DATE,
    is_active                   BOOLEAN NOT NULL DEFAULT true,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    created_by          UUID,
    updated_by          UUID,
    deleted_at          TIMESTAMPTZ
);
CREATE INDEX idx_statutory_rules_scheme ON wages.statutory_rules (tenant_id, scheme_type, effective_from DESC);

CREATE TABLE wages.statutory_contributions (
    id                       UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id                UUID NOT NULL,
    wage_sheet_line_id       UUID NOT NULL REFERENCES wages.wage_sheet_lines(id) ON DELETE CASCADE,
    employee_id              UUID NOT NULL REFERENCES wages.employees(id),
    statutory_rule_id        UUID REFERENCES wages.statutory_rules(id),
    scheme_type               VARCHAR(20) NOT NULL,
    contribution_base_amount  NUMERIC(12,2) NOT NULL,   -- wage amount the % was applied on (after ceiling cap)
    employee_contribution      NUMERIC(12,2) NOT NULL DEFAULT 0,  -- deducted from worker's net wage
    employer_contribution       NUMERIC(12,2) NOT NULL DEFAULT 0,  -- company cost, not shown on payslip
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_statutory_contrib_line_scheme UNIQUE (wage_sheet_line_id, scheme_type)
);
CREATE INDEX idx_statutory_contrib_employee ON wages.statutory_contributions (tenant_id, employee_id);

-- ═══════════════════════════════════════════════════════════════════════
-- SECTION 8 — CONTRACTOR BILLING
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE wages.contractor_bills (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id            UUID NOT NULL,
    contractor_id        UUID NOT NULL REFERENCES wages.contractors(id),
    period_start         DATE NOT NULL,
    period_end           DATE NOT NULL,
    total_amount         NUMERIC(14,2) NOT NULL DEFAULT 0,
    status               VARCHAR(20) NOT NULL DEFAULT 'draft', -- draft|approved|paid
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_contractor_bill_period UNIQUE (tenant_id, contractor_id, period_start, period_end)
);

-- ═══════════════════════════════════════════════════════════════════════
-- SECTION 9 — MODULE CONFIG (per-tenant/per-plant feature toggles)
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE wages.module_config (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id            UUID NOT NULL,
    plant_id             UUID REFERENCES wages.plants(id),  -- NULL = tenant-wide default
    config_key           VARCHAR(100) NOT NULL,   -- e.g. 'ot_calculation_mode', 'ai_ot_analysis_enabled'
    config_value         JSONB NOT NULL,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    updated_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    CONSTRAINT uq_module_config_key UNIQUE (tenant_id, plant_id, config_key)
);

-- ═══════════════════════════════════════════════════════════════════════
-- SECTION 10 — EVENT OUTBOX (integration-ready from day one)
-- Standalone mode: rows just accumulate / get polled by a local worker
-- that logs them. Integrated mode: a publisher process drains this table
-- to RabbitMQ — no schema or application-logic change needed.
-- ═══════════════════════════════════════════════════════════════════════

CREATE TABLE wages.outbox_events (
    id                   UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    tenant_id            UUID NOT NULL,
    event_type           VARCHAR(100) NOT NULL,   -- PascalCase: AttendanceRecorded, OvertimeApproved,
                                                    -- WageSheetGenerated, ContractorBillGenerated, etc.
    correlation_id       UUID,
    payload              JSONB NOT NULL,
    occurred_at          TIMESTAMPTZ NOT NULL DEFAULT now(),
    published_at         TIMESTAMPTZ,
    status               VARCHAR(20) NOT NULL DEFAULT 'pending', -- pending|published|failed
    retry_count          SMALLINT NOT NULL DEFAULT 0,
    created_at          TIMESTAMPTZ NOT NULL DEFAULT now()
);
CREATE INDEX idx_outbox_pending ON wages.outbox_events (status, occurred_at) WHERE status = 'pending';

-- ═══════════════════════════════════════════════════════════════════════
-- SECTION 11 — ROW LEVEL SECURITY (repeat identically on every table)
-- ═══════════════════════════════════════════════════════════════════════

ALTER TABLE wages.plants ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.plants USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.departments ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.departments USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.machines ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.machines USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.contractors ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.contractors USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.employees ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.employees USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.shifts ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.shifts USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.shift_rosters ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.shift_rosters USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.holiday_calendar ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.holiday_calendar USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.attendance_devices ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.attendance_devices USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.attendance_raw_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.attendance_raw_logs USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.attendance_daily ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.attendance_daily USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.production_assignments ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.production_assignments USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.ot_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.ot_rules USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.overtime_requests ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.overtime_requests USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.incentive_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.incentive_rules USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.incentive_awards ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.incentive_awards USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.wage_rate_cards ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.wage_rate_cards USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.wage_sheets ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.wage_sheets USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.wage_sheet_lines ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.wage_sheet_lines USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.statutory_rules ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.statutory_rules USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.statutory_contributions ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.statutory_contributions USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.payroll_export_batches ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.payroll_export_batches USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.contractor_bills ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.contractor_bills USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.module_config ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.module_config USING (tenant_id = current_setting('app.tenant_id')::uuid);

ALTER TABLE wages.outbox_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY tenant_isolation ON wages.outbox_events USING (tenant_id = current_setting('app.tenant_id')::uuid);

-- ══════════════════════════════════════════════════════════════════════════
-- END OF v1.1 — Tables: 25  |  Schema: wages  |  Ready for Prisma introspection
-- ══════════════════════════════════════════════════════════════════════════
