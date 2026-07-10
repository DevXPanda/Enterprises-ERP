import { ModulePage } from "@/components/factory/module-page";

export default function RejectedItemsPage() {
  return (
    <ModulePage
      title="Rejected Items"
      description="Track all rejected materials and products. Record rejection reasons, quantities, NCR references, disposal methods, and corrective action taken."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Quality Control" },
        { label: "Rejected Items" },
      ]}
      columns={[
        { key: "ncrNo", label: "NCR No." },
        { key: "item", label: "Item / Batch" },
        { key: "type", label: "Type" },
        { key: "rejectionReason", label: "Rejection Reason" },
        { key: "quantity", label: "Quantity" },
        { key: "rejectedBy", label: "Rejected By" },
        { key: "disposal", label: "Disposal" },
      ]}
      addNewLabel="Log Rejection"
    />
  );
}
