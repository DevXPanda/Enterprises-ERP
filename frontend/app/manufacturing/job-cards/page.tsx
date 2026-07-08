import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { CreditCard } from "lucide-react";

export default function JobCardsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Job Cards"
        description="Generate work orders and assign operators to specific crushing, mixing, and packing tasks."
        breadcrumbs={[
          { label: "Manufacturing", href: "/manufacturing/dashboard" },
          { label: "Job Cards" },
        ]}
      />
      <EmptyState
        title="Job Cards & Shift Tasks"
        description="Issue task sheets for plant operators. Track check-ins, hourly production counts, and operator sign-offs."
        moduleName="Manufacturing"
        icon={CreditCard}
        features={[
          "Individual shift worker scheduling",
          "Operation run checklists",
          "Completed batch reporting cards",
          "Idle time cause records",
        ]}
      />
    </div>
  );
}
