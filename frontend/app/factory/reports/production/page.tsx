import { ModulePage } from "@/components/factory/module-page";

export default function ProductionReportPage() {
  return (
    <ModulePage
      title="Production Report"
      description="Comprehensive production performance reports. Analyze output vs targets, line efficiency, batch completion rates, reject percentages, and daily production trends."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Reports" },
        { label: "Production" },
      ]}
      columns={[
        { key: "reportId", label: "Report ID" },
        { key: "period", label: "Period" },
        { key: "product", label: "Product" },
        { key: "produced", label: "Produced (MT)" },
        { key: "target", label: "Target (MT)" },
        { key: "efficiency", label: "Efficiency %" },
        { key: "format", label: "Format" },
      ]}
      addNewLabel="Generate Report"
    />
  );
}
