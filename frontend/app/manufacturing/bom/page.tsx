import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { ScrollText } from "lucide-react";

export default function BomPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Bill of Materials"
        description="Formulate raw material proportions and track ingredient costs for cement grades."
        breadcrumbs={[
          { label: "Manufacturing", href: "/manufacturing/dashboard" },
          { label: "BOM" },
        ]}
      />
      <EmptyState
        title="Bill of Materials (BOM) Editor"
        description="Verify raw input compositions including Limestone, Gypsum, and Slag ratios. Keep recipes consistent and optimize material pricing."
        moduleName="Manufacturing"
        icon={ScrollText}
        features={[
          "Limestone, Gypsum, and Coal ratios",
          "Multi-stage recipe versions",
          "Interactive raw ingredient cost sheets",
          "Material volume safety calculators",
        ]}
      />
    </div>
  );
}
