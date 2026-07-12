// MWMS wages schema v1.1 resources — DDL owned by sql/mwms_wages_v1.1.sql.
import { defineResource, DefineOptions, ResourceDef } from '../resource.types';

function mwms(
  slug: string,
  label: string,
  table: string,
  cols: string,
  extra: Partial<DefineOptions> = {},
): ResourceDef {
  return defineResource(`wages/${slug}`, label, cols, [], {
    schema: 'wages',
    table,
    pk: 'uuid',
    external: true,
    tenantScoped: true,
    ...extra,
  });
}

export const wagesMwms: ResourceDef[] = [

  mwms(
    'plants',
    'Plants',
    'plants',
    'tenant_id:uuid external_plant_id:uuid code name address created_at:ts updated_at:ts created_by:uuid updated_by:uuid deleted_at:ts',
    { softDelete: true },
  ),
  mwms(
    'departments',
    'Wage Departments',
    'departments',
    'tenant_id:uuid plant_id:uuid name created_at:ts updated_at:ts deleted_at:ts',
    { softDelete: true },
  ),
  mwms(
    'machines',
    'Wage Machines',
    'machines',
    'tenant_id:uuid external_machine_id:uuid plant_id:uuid code name line_name created_at:ts updated_at:ts deleted_at:ts',
    { softDelete: true },
  ),
  mwms(
    'contractors',
    'Contractors',
    'contractors',
    'tenant_id:uuid name gst_number contact_person contact_phone billing_rate_type status created_at:ts updated_at:ts deleted_at:ts',
    { softDelete: true },
  ),
  mwms(
    'employees',
    'Wage Employees',
    'employees',
    'tenant_id:uuid external_employee_id:uuid employee_code full_name plant_id:uuid department_id:uuid skill_category employment_type contractor_id:uuid wage_type daily_wage_rate:num hourly_wage_rate:num ot_eligible:bool default_shift_id:uuid bank_account_number bank_ifsc uan_number esic_number pf_number status date_of_joining:date created_at:ts updated_at:ts created_by:uuid updated_by:uuid deleted_at:ts',
    { softDelete: true, search: ['employee_code', 'full_name', 'skill_category', 'status'] },
  ),

  mwms(
    'shifts',
    'Wage Shifts',
    'shifts',
    'tenant_id:uuid plant_id:uuid name start_time:time end_time:time is_night_shift:bool grace_minutes:int standard_hours:num breaks:json created_at:ts updated_at:ts deleted_at:ts',
    { softDelete: true },
  ),
  mwms(
    'shift-rosters',
    'Shift Rosters',
    'shift_rosters',
    'tenant_id:uuid employee_id:uuid shift_id:uuid effective_from:date effective_to:date created_at:ts',
  ),
  mwms(
    'holiday-calendar',
    'Holiday Calendar',
    'holiday_calendar',
    'tenant_id:uuid plant_id:uuid calendar_date:date name day_type created_at:ts',
  ),

  mwms(
    'attendance-devices',
    'Attendance Devices',
    'attendance_devices',
    'tenant_id:uuid plant_id:uuid device_code device_type ip_address status created_at:ts',
  ),
  mwms(
    'attendance-raw-logs',
    'Attendance Raw Logs',
    'attendance_raw_logs',
    'tenant_id:uuid employee_id:uuid device_id:uuid punch_time:ts punch_type source raw_payload:json created_at:ts',
  ),
  mwms(
    'attendance-daily',
    'Attendance Daily',
    'attendance_daily',
    'tenant_id:uuid employee_id:uuid attendance_date:date shift_id:uuid first_in:ts last_out:ts working_minutes:int late_minutes:int early_leaving_minutes:int break_minutes:int status is_manual_override:bool override_reason approved_by:uuid created_at:ts updated_at:ts deleted_at:ts',
    { softDelete: true },
  ),

  mwms(
    'production-assignments',
    'Production Assignments',
    'production_assignments',
    'tenant_id:uuid employee_id:uuid attendance_daily_id:uuid machine_id:uuid plant_id:uuid batch_id:uuid product_id:uuid assigned_minutes:int output_quantity:num uom supervisor_employee_id:uuid remarks created_at:ts updated_at:ts deleted_at:ts',
    { softDelete: true },
  ),

  mwms(
    'ot-rules',
    'OT Rules',
    'ot_rules',
    'tenant_id:uuid plant_id:uuid name trigger_after_minutes:int multiplier:num applicable_day_types:json priority:int effective_from:date effective_to:date is_active:bool created_at:ts updated_at:ts deleted_at:ts',
    { softDelete: true },
  ),
  mwms(
    'overtime-requests',
    'Overtime Requests',
    'overtime_requests',
    'tenant_id:uuid employee_id:uuid attendance_daily_id:uuid ot_rule_id:uuid ot_minutes:int calculated_amount:num status approval_workflow_ref:uuid approved_by:uuid approved_at:ts created_at:ts updated_at:ts',
  ),

  mwms(
    'incentive-rules',
    'Incentive Rules',
    'incentive_rules',
    'tenant_id:uuid plant_id:uuid name target_metric target_value:num bonus_type bonus_value:num conditions:json effective_from:date effective_to:date is_active:bool created_at:ts updated_at:ts deleted_at:ts',
    { softDelete: true },
  ),
  mwms(
    'incentive-awards',
    'Incentive Awards',
    'incentive_awards',
    'tenant_id:uuid employee_id:uuid incentive_rule_id:uuid period_start:date period_end:date achieved_value:num bonus_amount:num status created_at:ts',
  ),

  mwms(
    'wage-rate-cards',
    'Wage Rate Cards',
    'wage_rate_cards',
    'tenant_id:uuid employee_id:uuid skill_category wage_type base_rate:num effective_from:date effective_to:date created_at:ts',
  ),
  mwms(
    'wage-sheets',
    'Wage Sheets',
    'wage_sheets',
    'tenant_id:uuid plant_id:uuid period_start:date period_end:date status generated_at:ts generated_by:uuid created_at:ts updated_at:ts',
  ),
  mwms(
    'wage-sheet-lines',
    'Wage Sheet Lines',
    'wage_sheet_lines',
    'tenant_id:uuid wage_sheet_id:uuid employee_id:uuid present_days:num absent_days:num ot_minutes:int ot_amount:num incentive_amount:num gross_wage:num deductions:json employee_statutory_deduction:num employer_statutory_cost:num net_wage:num created_at:ts',
  ),

  mwms(
    'statutory-rules',
    'Statutory Rules',
    'statutory_rules',
    'tenant_id:uuid plant_id:uuid scheme_type state employee_contribution_percent:num employer_contribution_percent:num wage_ceiling:num fixed_slab_amount:num effective_from:date effective_to:date is_active:bool created_at:ts updated_at:ts created_by:uuid updated_by:uuid deleted_at:ts',
    { softDelete: true },
  ),
  mwms(
    'statutory-contributions',
    'Statutory Contributions',
    'statutory_contributions',
    'tenant_id:uuid wage_sheet_line_id:uuid employee_id:uuid statutory_rule_id:uuid scheme_type contribution_base_amount:num employee_contribution:num employer_contribution:num created_at:ts',
  ),
  mwms(
    'payroll-export-batches',
    'Payroll Export Batches',
    'payroll_export_batches',
    'tenant_id:uuid wage_sheet_id:uuid export_format exported_at:ts status external_reference_id:uuid created_at:ts',
  ),

  mwms(
    'contractor-bills',
    'Contractor Bills',
    'contractor_bills',
    'tenant_id:uuid contractor_id:uuid period_start:date period_end:date total_amount:num status created_at:ts',
  ),
  mwms(
    'module-config',
    'Wages Module Config',
    'module_config',
    'tenant_id:uuid plant_id:uuid config_key config_value:json created_at:ts updated_at:ts',
  ),
  mwms(
    'outbox-events',
    'Outbox Events',
    'outbox_events',
    'tenant_id:uuid event_type correlation_id:uuid payload:json occurred_at:ts published_at:ts status retry_count:int created_at:ts',
  ),
];
