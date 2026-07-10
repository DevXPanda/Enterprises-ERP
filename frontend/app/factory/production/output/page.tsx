import { ModulePage } from "@/components/factory/module-page";

export default function ProductionOutputPage() {
  return (
    <ModulePage
      title="Output"
      description="Record and track daily production output for all lines. Log finished goods quantities, reject quantities, and compare actual output against production targets."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Production" },
        { label: "Output" },
      ]}
      columns={[
        { key: "outputId", label: "Output ID" },
        { key: "product", label: "Product" },
        { key: "line", label: "Line" },
        { key: "produced", label: "Produced Qty" },
        { key: "target", label: "Target Qty" },
        { key: "rejects", label: "Rejects" },
        { key: "date", label: "Date" },
      ]}
      addNewLabel="Log Output"
    />
  );
}
