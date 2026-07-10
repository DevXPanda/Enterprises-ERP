import { ModulePage } from "@/components/factory/module-page";

export default function ProductionOrdersPage() {
  return (
    <ModulePage
      title="Production Orders"
      description="Create and manage factory production orders. Define product specifications, target quantities, assigned lines, scheduled dates, and production priorities."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Production" },
        { label: "Production Orders" },
      ]}
      columns={[
        { key: "poNo", label: "PO No." },
        { key: "product", label: "Product" },
        { key: "quantity", label: "Target Qty" },
        { key: "line", label: "Production Line" },
        { key: "scheduledDate", label: "Scheduled Date" },
        { key: "priority", label: "Priority" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="New Order"
    />
  );
}
