import { ModulePage } from "@/components/factory/module-page";

export default function BomPage() {
  return (
    <ModulePage
      title="Bill of Materials"
      description="Component structure per product with quantities and revisions."
      breadcrumbs={[
        { label: "Manufacturing", href: "/manufacturing/dashboard" },
        { label: "BOM" },
      ]}
      addNewLabel="Add Component"
      columns={[
        { key: "bomNo", label: "BOM No." },
        { key: "product", label: "Product" },
        { key: "component", label: "Component" },
        { key: "quantityPer", label: "Qty / Unit" },
        { key: "unit", label: "UOM" },
        { key: "revision", label: "Revision" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
