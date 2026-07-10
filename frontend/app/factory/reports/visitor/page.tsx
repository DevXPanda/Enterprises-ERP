import { ModulePage } from "@/components/factory/module-page";

export default function VisitorReportPage() {
  return (
    <ModulePage
      title="Visitor Report"
      description="Comprehensive visitor analytics and reports. Track visitor frequency, average visit duration, frequent visitors, peak hours, and department-wise visitor trends."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Reports" },
        { label: "Visitor" },
      ]}
      columns={[
        { key: "reportId", label: "Report ID" },
        { key: "period", label: "Period" },
        { key: "totalVisitors", label: "Total Visitors" },
        { key: "avgDuration", label: "Avg. Duration" },
        { key: "peakDay", label: "Peak Day" },
        { key: "generatedAt", label: "Generated At" },
        { key: "format", label: "Format" },
      ]}
      addNewLabel="Generate Report"
    />
  );
}
