import { ModulePage } from "@/components/factory/module-page";

export default function MaterialReportPage() {
  return (
    <ModulePage
      title="Material Report"
      description="Detailed material movement reports including inward, outward, and stock transfer transactions. Analyze material consumption patterns and vendor-wise receipt summaries."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Reports" },
        { label: "Material" },
      ]}
      columns={[
        { key: "reportId", label: "Report ID" },
        { key: "period", label: "Period" },
        { key: "material", label: "Material" },
        { key: "totalIn", label: "Total In (MT)" },
        { key: "totalOut", label: "Total Out (MT)" },
        { key: "closingStock", label: "Closing Stock" },
        { key: "format", label: "Format" },
      ]}
      addNewLabel="Generate Report"
    />
  );
}
