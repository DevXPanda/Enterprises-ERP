import { ModulePage } from "@/components/factory/module-page";

export default function MfgMachinesPage() {
  return (
    <ModulePage
      title="Machines"
      description="Machine master with uptime and maintenance history."
      breadcrumbs={[
        { label: "Manufacturing", href: "/manufacturing/dashboard" },
        { label: "Machines" },
      ]}
      addNewLabel="Add Machine"
      columns={[
        { key: "machineId", label: "Machine ID" },
        { key: "name", label: "Machine Name" },
        { key: "type", label: "Type" },
        { key: "line", label: "Line" },
        { key: "uptime", label: "Uptime %" },
        { key: "lastMaintenance", label: "Last Maintenance" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
