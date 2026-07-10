import { ModulePage } from "@/components/factory/module-page";

export default function AttendanceReportsPage() {
  return (
    <ModulePage
      title="Attendance Reports"
      description="Generate comprehensive attendance reports for any date range, department, or shift. Export monthly muster rolls, late arrival reports, and overtime summaries."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Attendance" },
        { label: "Attendance Reports" },
      ]}
      columns={[
        { key: "reportId", label: "Report ID" },
        { key: "name", label: "Report Name" },
        { key: "type", label: "Type" },
        { key: "period", label: "Period" },
        { key: "department", label: "Department" },
        { key: "generatedAt", label: "Generated At" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Generate Report"
    />
  );
}
