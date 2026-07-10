import { ModulePage } from "@/components/factory/module-page";

export default function HoldItemsPage() {
  return (
    <ModulePage
      title="Hold Items"
      description="Manage materials and products placed on quality hold. Track hold reasons, responsible personnel, hold duration, and disposition decisions (accept / reject / rework)."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Quality Control" },
        { label: "Hold Items" },
      ]}
      columns={[
        { key: "holdId", label: "Hold ID" },
        { key: "item", label: "Item / Batch" },
        { key: "type", label: "Hold Type" },
        { key: "reason", label: "Hold Reason" },
        { key: "quantity", label: "Quantity" },
        { key: "heldSince", label: "Held Since" },
        { key: "disposition", label: "Disposition" },
      ]}
      addNewLabel="Place on Hold"
    />
  );
}
