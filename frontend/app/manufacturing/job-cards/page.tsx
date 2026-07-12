import { ModulePage } from "@/components/factory/module-page";

export default function JobCardsPage() {
  return (
    <ModulePage
      title="Job Cards"
      description="Operation-level work orders assigned to machines and operators."
      breadcrumbs={[
        { label: "Manufacturing", href: "/manufacturing/dashboard" },
        { label: "Job Cards" },
      ]}
      addNewLabel="New Job Card"
      columns={[
        { key: "jobNo", label: "Job No." },
        { key: "poNo", label: "PO No." },
        { key: "operation", label: "Operation" },
        { key: "machine", label: "Machine" },
        { key: "operator", label: "Operator" },
        { key: "plannedHours", label: "Planned Hrs" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
