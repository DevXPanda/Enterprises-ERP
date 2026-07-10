import { ModulePage } from "@/components/factory/module-page";

export default function VisitHistoryPage() {
  return (
    <ModulePage
      title="Visit History"
      description="Complete historical log of all visitor entries and exits. Filter by date range, visitor name, company, or purpose for audit and compliance reporting."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Visitor Management" },
        { label: "Visit History" },
      ]}
      columns={[
        { key: "visitId", label: "Visit ID" },
        { key: "visitorName", label: "Visitor Name" },
        { key: "company", label: "Company" },
        { key: "entryTime", label: "Entry Time" },
        { key: "exitTime", label: "Exit Time" },
        { key: "duration", label: "Duration" },
        { key: "host", label: "Host" },
      ]}
      addNewLabel="Add Manual Entry"
    />
  );
}
