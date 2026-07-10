import { ModulePage } from "@/components/factory/module-page";

export default function ShiftsPage() {
  return (
    <ModulePage
      title="Shifts"
      description="Define and manage factory shift schedules. Configure shift timings, break periods, overtime rules, and department-wise shift rotations."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Employee Management" },
        { label: "Shifts" },
      ]}
      columns={[
        { key: "shiftCode", label: "Shift Code" },
        { key: "name", label: "Shift Name" },
        { key: "startTime", label: "Start Time" },
        { key: "endTime", label: "End Time" },
        { key: "breakDuration", label: "Break" },
        { key: "employees", label: "Employees" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Add Shift"
    />
  );
}
