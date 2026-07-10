import { ModulePage } from "@/components/factory/module-page";

export default function DepartmentsPage() {
  return (
    <ModulePage
      title="Departments"
      description="Configure and manage factory departments. Define department heads, team sizes, shift assignments, and reporting hierarchies."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Employee Management" },
        { label: "Departments" },
      ]}
      columns={[
        { key: "deptCode", label: "Dept. Code" },
        { key: "name", label: "Department Name" },
        { key: "head", label: "Department Head" },
        { key: "strength", label: "Strength" },
        { key: "shift", label: "Shift" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Add Department"
    />
  );
}
