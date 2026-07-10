import { ModulePage } from "@/components/factory/module-page";

export default function IncomingQcPage() {
  return (
    <ModulePage
      title="Incoming QC"
      description="Perform quality control inspections on all incoming raw materials. Record test parameters, sample analysis results, and approve or reject material consignments."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Quality Control" },
        { label: "Incoming QC" },
      ]}
      columns={[
        { key: "qcId", label: "QC ID" },
        { key: "grnNo", label: "GRN No." },
        { key: "material", label: "Material" },
        { key: "vendor", label: "Vendor" },
        { key: "parameters", label: "Parameters Tested" },
        { key: "checkedBy", label: "Checked By" },
        { key: "result", label: "Result" },
      ]}
      addNewLabel="New Inspection"
    />
  );
}
