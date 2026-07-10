import { ModulePage } from "@/components/factory/module-page";

export default function TallyErrorLogsPage() {
  return (
    <ModulePage
      title="Error Logs"
      description="Complete log of all Tally connector errors and exceptions. Analyze error patterns, identify recurring issues, and access detailed stack traces for debugging and resolution."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Tally Connector" },
        { label: "Error Logs" },
      ]}
      columns={[
        { key: "logId", label: "Log ID" },
        { key: "timestamp", label: "Timestamp" },
        { key: "level", label: "Level" },
        { key: "module", label: "Module" },
        { key: "message", label: "Error Message" },
        { key: "reference", label: "Reference" },
        { key: "resolved", label: "Resolved" },
      ]}
      addNewLabel="Export Logs"
    />
  );
}
