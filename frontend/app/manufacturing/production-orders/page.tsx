import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ClipboardList } from "lucide-react";

export default function ProductionOrdersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Production Orders"
        description="Manage, schedule, and execute manufacturing operations for OPC, PPC, and special cement batches."
        breadcrumbs={[
          { label: "Manufacturing", href: "/manufacturing/dashboard" },
          { label: "Production Orders" },
        ]}
      />
      <EmptyState
        title="Production Orders Management"
        description="Track production schedules, order backlogs, and batch details. Organize materials based on incoming dealer and builder demands."
        moduleName="Manufacturing"
        icon={ClipboardList}
        features={[
          "Order queue scheduling & priorities",
          "Raw material batch calculations",
          "Dispatch packaging schedules",
          "Order progress indicators",
        ]}
      />
    </div>
  );
}
