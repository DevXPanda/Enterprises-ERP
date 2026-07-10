import { ModulePage } from "@/components/factory/module-page";

export default function MaterialQcVerificationPage() {
  return (
    <ModulePage
      title="QC Verification"
      description="Perform quality control verification on incoming materials at the gate. Record sample collection, test results, and approve or reject material consignments."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Material Gate" },
        { label: "QC Verification" },
      ]}
      columns={[
        { key: "qcId", label: "QC ID" },
        { key: "grnNo", label: "GRN No." },
        { key: "material", label: "Material" },
        { key: "vendor", label: "Vendor" },
        { key: "sampleNo", label: "Sample No." },
        { key: "checkedBy", label: "Checked By" },
        { key: "result", label: "Result" },
      ]}
      addNewLabel="New QC Check"
    />
  );
}
