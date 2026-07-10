import { ModulePage } from "@/components/factory/module-page";

export default function VisitorApprovalsPage() {
  return (
    <ModulePage
      title="Visitor Approvals"
      description="Approve or reject visitor requests pending authorization. Security managers review visit purpose, host confirmation, and access area before granting entry."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Visitor Management" },
        { label: "Approvals" },
      ]}
      columns={[
        { key: "requestId", label: "Request ID" },
        { key: "visitorName", label: "Visitor Name" },
        { key: "company", label: "Company" },
        { key: "visitDate", label: "Visit Date" },
        { key: "approver", label: "Approver" },
        { key: "approvedAt", label: "Approved At" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Review Requests"
    />
  );
}
