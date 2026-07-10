import { ModulePage } from "@/components/factory/module-page";

export default function OperatorsPage() {
  return (
    <ModulePage
      title="Operators"
      description="Manage machine operators and their assignments. Track certifications, skill levels, assigned equipment, productivity scores, and shift schedules."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Production" },
        { label: "Operators" },
      ]}
      columns={[
        { key: "empId", label: "Emp. ID" },
        { key: "name", label: "Operator Name" },
        { key: "machine", label: "Assigned Machine" },
        { key: "line", label: "Line" },
        { key: "shift", label: "Shift" },
        { key: "certification", label: "Certification" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Add Operator"
    />
  );
}
