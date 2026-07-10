import { ModulePage } from "@/components/factory/module-page";

export default function DispatchReportPage() {
  return (
    <ModulePage
      title="Dispatch Report"
      description="Detailed dispatch performance reports including customer-wise summaries, vehicle utilization, on-time delivery rates, and pending order analysis."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Reports" },
        { label: "Dispatch" },
      ]}
      columns={[
        { key: "reportId", label: "Report ID" },
        { key: "period", label: "Period" },
        { key: "totalOrders", label: "Total Orders" },
        { key: "dispatched", label: "Dispatched" },
        { key: "pending", label: "Pending" },
        { key: "onTimeRate", label: "On-Time %" },
        { key: "format", label: "Format" },
      ]}
      addNewLabel="Generate Report"
    />
  );
}
