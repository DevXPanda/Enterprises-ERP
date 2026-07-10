import { ModulePage } from "@/components/factory/module-page";

export default function StockTransferPage() {
  return (
    <ModulePage
      title="Stock Transfer"
      description="Manage inter-location stock transfers within the factory. Transfer materials between store locations, production floors, and warehouses with full traceability."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Store" },
        { label: "Stock Transfer" },
      ]}
      columns={[
        { key: "transferNo", label: "Transfer No." },
        { key: "material", label: "Material" },
        { key: "quantity", label: "Quantity" },
        { key: "fromLocation", label: "From Location" },
        { key: "toLocation", label: "To Location" },
        { key: "transferredBy", label: "Transferred By" },
        { key: "date", label: "Date" },
      ]}
      addNewLabel="New Transfer"
    />
  );
}
