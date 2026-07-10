import { ModulePage } from "@/components/factory/module-page";

export default function EmployeesPage() {
  return (
    <ModulePage
      title="Employees"
      description="Manage all factory employee records. Maintain employee profiles, contact information, designations, departments, and employment status."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Employee Management" },
        { label: "Employees" },
      ]}
      columns={[
        { key: "empId", label: "Emp. ID" },
        { key: "name", label: "Full Name" },
        { key: "department", label: "Department" },
        { key: "designation", label: "Designation" },
        { key: "shift", label: "Shift" },
        { key: "mobile", label: "Mobile" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Add Employee"
    />
  );
}
