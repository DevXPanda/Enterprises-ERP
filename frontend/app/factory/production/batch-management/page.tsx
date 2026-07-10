import { ModulePage } from "@/components/factory/module-page";

export default function BatchManagementPage() {
  return (
    <ModulePage
      title="Batch Management"
      description="Track and manage production batches from start to completion. Monitor batch progress, raw material consumption, quality parameters, and batch completion status."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Production" },
        { label: "Batch Management" },
      ]}
      columns={[
        { key: "batchNo", label: "Batch No." },
        { key: "product", label: "Product" },
        { key: "quantity", label: "Quantity" },
        { key: "line", label: "Line" },
        { key: "startTime", label: "Start Time" },
        { key: "endTime", label: "End Time" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="New Batch"
    />
  );
}
