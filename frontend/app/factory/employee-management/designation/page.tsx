import { ModulePage } from "@/components/factory/module-page";

export default function DesignationPage() {
  return (
    <ModulePage
      title="Designation"
      description="Manage employee designations and job roles. Define role hierarchies, pay grades, access levels, and department associations."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Employee Management" },
        { label: "Designation" },
      ]}
      columns={[
        { key: "code", label: "Code" },
        { key: "title", label: "Designation Title" },
        { key: "department", label: "Department" },
        { key: "grade", label: "Pay Grade" },
        { key: "employees", label: "Employees" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Add Designation"
    />
  );
}
