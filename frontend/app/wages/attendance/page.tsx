import { PageHeader } from "@/components/ui/page-header";
import { EmptyState } from "@/components/ui/empty-state";
import { CalendarCheck } from "lucide-react";

export default function AttendancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="Attendance"
        description="Track daily attendance, shift-wise check-in/out, overtime hours, and absence management for all workers."
        breadcrumbs={[
          { label: "Wages", href: "/wages/dashboard" },
          { label: "Attendance" },
        ]}
      />
      <EmptyState
        title="Time & Attendance Tracking"
        description="Log worker shifts, attendance logs, and overtime (OT) hours. Filter logs by line or supervisor approvals."
        moduleName="Wages"
        icon={CalendarCheck}
        features={[
          "Biometric login integrations",
          "Overtime approval gates",
          "Shift attendance summaries",
          "Leave tracker & approvals",
        ]}
      />
    </div>
  );
}
