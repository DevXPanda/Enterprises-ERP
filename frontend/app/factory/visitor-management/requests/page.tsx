import { ModulePage } from "@/components/factory/module-page";

export default function VisitorRequestsPage() {
  return (
    <ModulePage
      title="Visit Requests"
      description="Manage incoming visitor visit requests. Review request details, purpose of visit, host employee authorization, and approve or reject access."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Visitor Management" },
        { label: "Requests" },
      ]}
      columns={[
        { key: "requestId", label: "Request ID" },
        { key: "visitorName", label: "Visitor Name" },
        { key: "company", label: "Company" },
        { key: "host", label: "Host Employee" },
        { key: "visitDate", label: "Visit Date" },
        { key: "purpose", label: "Purpose" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="New Request"
    />
  );
}
