import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Users } from "lucide-react";

export default function WorkersPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Workers"
        description="Manage worker profiles, assignments, shift schedules, production-linked performance, and efficiency ratings."
        breadcrumbs={[
          { label: "Wages", href: "/wages/dashboard" },
          { label: "Workers" },
        ]}
      />
      <EmptyState
        title="Workers Profile Directory"
        description="Access structural profile cards for every line operator. Log efficiency categories (High/Avg/Low) and shift history."
        moduleName="Wages"
        icon={Users}
        features={[
          "Worker registration & profiles",
          "Assigned line shifts & logs",
          "Performance rating cards",
          "Direct bank details verification",
        ]}
      />
    </div>
  );
}
