import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { BarChart3 } from "lucide-react";

export default function ManufacturingDashboardPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Manufacturing Dashboard"
        description="Consolidated views of machine performance, production lines, quality metrics, and operational efficiency."
        breadcrumbs={[
          { label: "Manufacturing", href: "/manufacturing/dashboard" },
          { label: "Dashboard" },
        ]}
      />
      <EmptyState
        title="Manufacturing Dashboard"
        description="This dashboard compiles sensor data and line efficiencies across all manufacturing plants. Get deep insights into daily targets, shift logs, and active operators once connected."
        moduleName="Manufacturing"
        icon={BarChart3}
        features={[
          "Real-time line throughput tracking",
          "Overall Equipment Effectiveness (OEE) trends",
          "Live status maps of factory machinery",
          "Custom shift performance logs",
        ]}
      />
    </div>
  );
}
