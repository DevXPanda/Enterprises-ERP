import { ModulePage } from "@/components/factory/module-page";

export default function VisitorEntryPage() {
  return (
    <ModulePage
      title="Visitor Entry"
      description="Register and track all visitor entries into the factory premises. Capture visitor details, purpose of visit, host employee, and gate pass issuance."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Smart Factory Access" },
        { label: "Visitor Entry" },
      ]}
      columns={[
        { key: "visitId", label: "Visit ID" },
        { key: "name", label: "Visitor Name" },
        { key: "company", label: "Company" },
        { key: "host", label: "Host Employee" },
        { key: "purpose", label: "Purpose" },
        { key: "entryTime", label: "Entry Time" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Register Visitor"
    />
  );
}
