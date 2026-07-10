import { ModulePage } from "@/components/factory/module-page";

export default function VisitorsPage() {
  return (
    <ModulePage
      title="Visitors"
      description="Maintain a complete registry of all factory visitors. Track visitor profiles, visit history, badge issuance, and access authorizations."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Visitor Management" },
        { label: "Visitors" },
      ]}
      columns={[
        { key: "visitorId", label: "Visitor ID" },
        { key: "name", label: "Full Name" },
        { key: "company", label: "Company" },
        { key: "mobile", label: "Mobile" },
        { key: "totalVisits", label: "Total Visits" },
        { key: "lastVisit", label: "Last Visit" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Add Visitor"
    />
  );
}
