import { ModulePage } from "@/components/factory/module-page";

export default function PayrollPage() {
  return (
    <ModulePage
      title="Payroll"
      description="Wage sheet lines from MWMS — gross wage, statutory deductions (PF/ESI/PT) and net pay, with the employer statutory cost that never appears on a payslip."
      breadcrumbs={[
        { label: "Wages", href: "/wages/dashboard" },
        { label: "Payroll" },
      ]}
      endpoint="/wages/payroll"
      readOnly
      columns={[
        { key: "empId", label: "Emp. ID" },
        { key: "name", label: "Name" },
        { key: "month", label: "Period" },
        { key: "presentDays", label: "Days" },
        { key: "baseWage", label: "Base (₹)" },
        { key: "otAmount", label: "OT (₹)" },
        { key: "incentive", label: "Incentive (₹)" },
        { key: "grossWage", label: "Gross (₹)" },
        { key: "statutoryDeduction", label: "Statutory (₹)" },
        { key: "employerStatutoryCost", label: "Employer Cost (₹)" },
        { key: "netPay", label: "Net Pay (₹)" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
