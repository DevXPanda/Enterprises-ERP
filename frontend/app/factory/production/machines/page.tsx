import { ModulePage } from "@/components/factory/module-page";

export default function ProductionMachinesPage() {
  return (
    <ModulePage
      title="Machines"
      description="Monitor and manage all factory machines and equipment. Track machine status, uptime, maintenance schedules, operator assignments, and performance metrics."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Production" },
        { label: "Machines" },
      ]}
      columns={[
        { key: "machineId", label: "Machine ID" },
        { key: "name", label: "Machine Name" },
        { key: "type", label: "Type" },
        { key: "line", label: "Line" },
        { key: "operator", label: "Operator" },
        { key: "uptime", label: "Uptime %" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Add Machine"
    />
  );
}
