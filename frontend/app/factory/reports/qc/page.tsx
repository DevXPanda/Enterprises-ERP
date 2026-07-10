import { ModulePage } from "@/components/factory/module-page";

export default function QcReportPage() {
  return (
    <ModulePage
      title="QC Report"
      description="Quality control performance reports across all inspection stages. Analyze pass/fail rates, common defects, batch rejection trends, and corrective action effectiveness."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Reports" },
        { label: "QC" },
      ]}
      columns={[
        { key: "reportId", label: "Report ID" },
        { key: "period", label: "Period" },
        { key: "stage", label: "QC Stage" },
        { key: "totalChecked", label: "Total Checked" },
        { key: "passed", label: "Passed" },
        { key: "rejected", label: "Rejected" },
        { key: "format", label: "Format" },
      ]}
      addNewLabel="Generate Report"
    />
  );
}
