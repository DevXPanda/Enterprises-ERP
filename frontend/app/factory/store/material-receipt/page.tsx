import { ModulePage } from "@/components/factory/module-page";

export default function MaterialReceiptPage() {
  return (
    <ModulePage
      title="Material Receipt"
      description="Record all material receipts into the factory store. Capture GRN details, supplier information, quantity received, quality status, and storage location."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Store" },
        { label: "Material Receipt" },
      ]}
      columns={[
        { key: "mrrNo", label: "MRR No." },
        { key: "grnNo", label: "GRN No." },
        { key: "material", label: "Material" },
        { key: "quantity", label: "Quantity" },
        { key: "unit", label: "Unit" },
        { key: "location", label: "Location" },
        { key: "receivedAt", label: "Received At" },
      ]}
      addNewLabel="New Receipt"
    />
  );
}
