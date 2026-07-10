import { ModulePage } from "@/components/factory/module-page";

export default function CurrentStockPage() {
  return (
    <ModulePage
      title="Current Stock"
      description="View real-time inventory levels for all materials in the factory store. Monitor available quantities, minimum stock thresholds, and identify low-stock conditions."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Store" },
        { label: "Current Stock" },
      ]}
      columns={[
        { key: "materialCode", label: "Material Code" },
        { key: "name", label: "Material Name" },
        { key: "category", label: "Category" },
        { key: "currentQty", label: "Current Qty" },
        { key: "unit", label: "Unit" },
        { key: "minStock", label: "Min. Stock" },
        { key: "status", label: "Stock Status" },
      ]}
      addNewLabel="Stock Adjustment"
    />
  );
}
