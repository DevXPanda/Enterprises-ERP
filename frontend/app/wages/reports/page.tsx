import { ModulePage } from "@/components/factory/module-page";

export default function WagesReportsPage() {
  return (
    <ModulePage
      title="Wage Reports"
      description="Generated wage registers, OT analysis and statutory summaries."
      breadcrumbs={[
        { label: "Wages", href: "/wages/dashboard" },
        { label: "Reports" },
      ]}
      addNewLabel="Generate Report"
      columns={[
        { key: "reportId", label: "Report ID" },
        { key: "name", label: "Report Name" },
        { key: "period", label: "Period" },
        { key: "department", label: "Department" },
        { key: "generatedAt", label: "Generated At" },
        { key: "format", label: "Format" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
