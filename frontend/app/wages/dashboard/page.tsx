import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { BarChart3 } from "lucide-react";

export default function WagesDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Wages Dashboard"
        description="Overview of workforce wages, attendance metrics, payroll summaries, and cost-per-unit analytics."
        breadcrumbs={[
          { label: "Wages", href: "/wages/dashboard" },
          { label: "Dashboard" },
        ]}
      />
      <EmptyState
        title="Wages Dashboard Insights"
        description="Track plant wage costs linked to production. Cross-compare line performance indicators against budget lines once live."
        moduleName="Wages"
        icon={BarChart3}
        features={[
          "Aggregated total daily wage expense",
          "Productivity-to-payout charts",
          "Shift cost distributions",
          "Pro-rata bonus suggestions",
        ]}
      />
    </div>
  );
}
