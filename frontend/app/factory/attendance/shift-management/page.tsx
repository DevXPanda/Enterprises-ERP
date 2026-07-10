import { ModulePage } from "@/components/factory/module-page";

export default function ShiftManagementPage() {
  return (
    <ModulePage
      title="Shift Management"
      description="Manage factory shift rosters and scheduling. Assign shifts to employees, handle shift swaps, manage overtime allocations, and plan shift rotations."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Attendance" },
        { label: "Shift Management" },
      ]}
      columns={[
        { key: "empId", label: "Emp. ID" },
        { key: "name", label: "Employee Name" },
        { key: "department", label: "Department" },
        { key: "currentShift", label: "Current Shift" },
        { key: "nextShift", label: "Next Shift" },
        { key: "effectiveDate", label: "Effective Date" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Assign Shift"
    />
  );
}
