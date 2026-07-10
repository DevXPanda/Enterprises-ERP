import { ModulePage } from "@/components/factory/module-page";

export default function AttendanceDashboardPage() {
  return (
    <ModulePage
      title="Attendance Dashboard"
      description="Overview of today's factory attendance across all departments and shifts. Monitor present, absent, late arrivals, and early departures in real time."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Attendance" },
        { label: "Dashboard" },
      ]}
      columns={[
        { key: "department", label: "Department" },
        { key: "strength", label: "Strength" },
        { key: "present", label: "Present" },
        { key: "absent", label: "Absent" },
        { key: "late", label: "Late" },
        { key: "attendance", label: "Attendance %" },
        { key: "shift", label: "Shift" },
      ]}
      addNewLabel="Mark Attendance"
    />
  );
}
