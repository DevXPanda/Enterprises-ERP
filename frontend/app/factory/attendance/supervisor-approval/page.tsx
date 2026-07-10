import { ModulePage } from "@/components/factory/module-page";

export default function SupervisorApprovalPage() {
  return (
    <ModulePage
      title="Supervisor Approval"
      description="Supervisors review and approve attendance corrections, leave requests, overtime claims, and late-mark regularizations submitted by employees."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Attendance" },
        { label: "Supervisor Approval" },
      ]}
      columns={[
        { key: "requestId", label: "Request ID" },
        { key: "empName", label: "Employee" },
        { key: "type", label: "Request Type" },
        { key: "date", label: "Date" },
        { key: "reason", label: "Reason" },
        { key: "supervisor", label: "Supervisor" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="New Request"
    />
  );
}
