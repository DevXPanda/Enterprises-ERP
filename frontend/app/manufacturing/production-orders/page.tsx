import { ModulePage } from "@/components/factory/module-page";

export default function MfgProductionOrdersPage() {
  return (
    <ModulePage
      title="Production Orders"
      description="Plan and track manufacturing production orders across lines."
      breadcrumbs={[
        { label: "Manufacturing", href: "/manufacturing/dashboard" },
        { label: "Production Orders" },
      ]}
      addNewLabel="New Order"
      columns={[
        { key: "poNo", label: "PO No." },
        { key: "product", label: "Product" },
        { key: "quantity", label: "Quantity" },
        { key: "line", label: "Line" },
        { key: "startDate", label: "Start Date" },
        { key: "dueDate", label: "Due Date" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
