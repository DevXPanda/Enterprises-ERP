import { ModulePage } from "@/components/factory/module-page";

export default function DispatchQcPage() {
  return (
    <ModulePage
      title="Dispatch QC"
      description="Final quality control checks before dispatch. Verify product quality, packaging integrity, weight accuracy, and certify shipments for customer delivery."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Quality Control" },
        { label: "Dispatch QC" },
      ]}
      columns={[
        { key: "qcId", label: "QC ID" },
        { key: "dispatchId", label: "Dispatch ID" },
        { key: "product", label: "Product" },
        { key: "quantity", label: "Quantity" },
        { key: "packagingOk", label: "Packaging" },
        { key: "checkedBy", label: "Checked By" },
        { key: "result", label: "Result" },
      ]}
      addNewLabel="New Dispatch QC"
    />
  );
}
