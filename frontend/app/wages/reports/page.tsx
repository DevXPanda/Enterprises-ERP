import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { FileBarChart } from "lucide-react";

export default function WagesReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Wages Reports"
        description="Comprehensive wage analysis reports — cost-per-bag trends, overtime analysis, and workforce productivity summaries."
        breadcrumbs={[
          { label: "Wages", href: "/wages/dashboard" },
          { label: "Reports" },
        ]}
      />
      <EmptyState
        title="Wage Analysis & Financial Reports"
        description="Extract audits of daily wage expenses, overtime margins, rating cost breakdowns, and bank payout logs."
        moduleName="Wages"
        icon={FileBarChart}
        features={[
          "Cost-per-bag historical trends",
          "Overtime expense reports",
          "Line efficiency wage breakdown",
          "Regulatory audit export files",
        ]}
      />
    </div>
  );
}
