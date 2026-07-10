import { ModulePage } from "@/components/factory/module-page";

export default function AttendanceReportPage() {
  return (
    <ModulePage
      title="Attendance Report"
      description="Generate factory attendance reports with detailed breakdowns by department, shift, and employee. Export monthly muster rolls, late arrival summaries, and overtime reports."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Reports" },
        { label: "Attendance" },
      ]}
      columns={[
        { key: "reportId", label: "Report ID" },
        { key: "period", label: "Period" },
        { key: "department", label: "Department" },
        { key: "totalDays", label: "Working Days" },
        { key: "avgAttendance", label: "Avg. Attendance %" },
        { key: "generatedAt", label: "Generated At" },
        { key: "format", label: "Format" },
      ]}
      addNewLabel="Generate Report"
    />
  );
}
