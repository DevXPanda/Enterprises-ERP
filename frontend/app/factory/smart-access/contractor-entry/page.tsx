import { ModulePage } from "@/components/factory/module-page";

export default function ContractorEntryPage() {
  return (
    <ModulePage
      title="Contractor Entry"
      description="Manage contractor and third-party vendor entries. Record contractor details, work order references, safety inductions, and access permissions."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Smart Factory Access" },
        { label: "Contractor Entry" },
      ]}
      columns={[
        { key: "contractorId", label: "Contractor ID" },
        { key: "name", label: "Contractor Name" },
        { key: "company", label: "Agency / Company" },
        { key: "workOrder", label: "Work Order" },
        { key: "area", label: "Work Area" },
        { key: "entryTime", label: "Entry Time" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Register Contractor"
    />
  );
}
