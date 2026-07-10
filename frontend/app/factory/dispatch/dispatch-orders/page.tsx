import { ModulePage } from "@/components/factory/module-page";

export default function DispatchOrdersPage() {
  return (
    <ModulePage
      title="Dispatch Orders"
      description="Create and manage customer dispatch orders. Link to sales orders, allocate stock, assign transport, schedule dispatch dates, and track delivery status."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Dispatch" },
        { label: "Dispatch Orders" },
      ]}
      columns={[
        { key: "doNo", label: "DO No." },
        { key: "customer", label: "Customer" },
        { key: "product", label: "Product" },
        { key: "quantity", label: "Quantity" },
        { key: "vehicle", label: "Vehicle No." },
        { key: "scheduledDate", label: "Scheduled Date" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="New Dispatch Order"
    />
  );
}
