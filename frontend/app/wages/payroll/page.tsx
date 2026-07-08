import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Boxes } from "lucide-react";

export default function PayrollPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Payroll"
        description="Process payroll, manage deductions, generate payslips, and handle production-linked incentive calculations."
        breadcrumbs={[
          { label: "Wages", href: "/wages/dashboard" },
          { label: "Payroll" },
        ]}
      />
      <EmptyState
        title="Payroll processing Engine"
        description="Calculate final wage values based on bags produced and shift attendances. Set custom bonus rules and deduct advance leaves."
        moduleName="Wages"
        icon={Boxes}
        features={[
          "Automated gross wage calculator",
          "Deductions & tax configurations",
          "One-click payslip generation",
          "Bonus calculations engine",
        ]}
      />
    </div>
  );
}
