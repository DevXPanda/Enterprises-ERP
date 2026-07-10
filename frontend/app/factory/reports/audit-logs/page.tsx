import { ModulePage } from "@/components/factory/module-page";

export default function AuditLogsPage() {
  return (
    <ModulePage
      title="Audit Logs"
      description="Comprehensive system audit trail for all factory module activities. Track user actions, data modifications, access events, and system-generated entries for compliance."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Reports" },
        { label: "Audit Logs" },
      ]}
      columns={[
        { key: "logId", label: "Log ID" },
        { key: "user", label: "User" },
        { key: "module", label: "Module" },
        { key: "action", label: "Action" },
        { key: "entity", label: "Record" },
        { key: "ipAddress", label: "IP Address" },
        { key: "timestamp", label: "Timestamp" },
      ]}
      addNewLabel="Export Logs"
    />
  );
}
