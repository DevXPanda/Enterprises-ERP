import { ModulePage } from "@/components/factory/module-page";

export default function DepartmentCheckinPage() {
  return (
    <ModulePage
      title="Department Check-In"
      description="Record and manage department-wise employee check-in status. Track biometric entries, manual overrides, and department-level attendance summaries."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Attendance" },
        { label: "Department Check-In" },
      ]}
      columns={[
        { key: "empId", label: "Emp. ID" },
        { key: "name", label: "Employee Name" },
        { key: "department", label: "Department" },
        { key: "checkIn", label: "Check-In Time" },
        { key: "checkOut", label: "Check-Out Time" },
        { key: "hours", label: "Total Hours" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Manual Check-In"
    />
  );
}
