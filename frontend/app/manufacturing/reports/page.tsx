import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { FileBarChart } from "lucide-react";

export default function ManufacturingReportsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Manufacturing Reports"
        description="Comprehensive production history, batch variations, and plant output comparisons."
        breadcrumbs={[
          { label: "Manufacturing", href: "/manufacturing/dashboard" },
          { label: "Reports" },
        ]}
      />
      <EmptyState
        title="Production & Plant Output Reports"
        description="Analyze long-term trends in plant efficiency, downtime hours, fuel consumption costs, and waste volumes."
        moduleName="Manufacturing"
        icon={FileBarChart}
        features={[
          "Interactive PDF/CSV report exports",
          "Year-over-year production metrics",
          "Machine downtime breakdown graphs",
          "Fuel vs output cost reports",
        ]}
      />
    </div>
  );
}
