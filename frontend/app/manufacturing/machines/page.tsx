import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Cog } from "lucide-react";

export default function MachinesPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Machines"
        description="Deep logs on Crusher, Raw Mill, Kiln, Cement Mill, and Packer runtime diagnostics."
        breadcrumbs={[
          { label: "Manufacturing", href: "/manufacturing/dashboard" },
          { label: "Machines" },
        ]}
      />
      <EmptyState
        title="Machine Telemetry & Asset Logs"
        description="View real-time sensor logs, temperature meters, crusher vibration metrics, and pre-load scheduled shutdowns."
        moduleName="Manufacturing"
        icon={Cog}
        features={[
          "Real-time sensor warning triggers",
          "Scheduled maintenance planners",
          "Asset life expectancy charts",
          "Telemetry raw data dashboards",
        ]}
      />
    </div>
  );
}
