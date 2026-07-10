import { ModulePage } from "@/components/factory/module-page";

export default function ProductionQcPage() {
  return (
    <ModulePage
      title="Production QC"
      description="Monitor and record quality checks at each production stage. Track in-process quality parameters, process deviations, and ensure compliance with product specifications."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Quality Control" },
        { label: "Production QC" },
      ]}
      columns={[
        { key: "qcId", label: "QC ID" },
        { key: "batchNo", label: "Batch No." },
        { key: "product", label: "Product" },
        { key: "line", label: "Line" },
        { key: "stage", label: "Stage" },
        { key: "checkedBy", label: "Checked By" },
        { key: "result", label: "Result" },
      ]}
      addNewLabel="New QC Entry"
    />
  );
}
