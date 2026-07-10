import { ModulePage } from "@/components/factory/module-page";

export default function EmployeeEntryPage() {
  return (
    <ModulePage
      title="Employee Entry"
      description="Log and manage factory employee gate entries. Scan employee ID cards, record entry time, and track daily attendance at the gate."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Smart Factory Access" },
        { label: "Employee Entry" },
      ]}
      columns={[
        { key: "empId", label: "Emp. ID" },
        { key: "name", label: "Employee Name" },
        { key: "department", label: "Department" },
        { key: "shift", label: "Shift" },
        { key: "gate", label: "Gate" },
        { key: "entryTime", label: "Entry Time" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Log Entry"
    />
  );
}
