import { ModulePage } from "@/components/factory/module-page";

export default function MfgReportsPage() {
  return (
    <ModulePage
      title="Manufacturing Reports"
      description="Production summaries, OEE trends and downtime analysis."
      breadcrumbs={[
        { label: "Manufacturing", href: "/manufacturing/dashboard" },
        { label: "Reports" },
      ]}
      addNewLabel="Generate Report"
      columns={[
        { key: "reportId", label: "Report ID" },
        { key: "name", label: "Report Name" },
        { key: "type", label: "Type" },
        { key: "period", label: "Period" },
        { key: "generatedAt", label: "Generated At" },
        { key: "format", label: "Format" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
