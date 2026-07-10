import { ModulePage } from "@/components/factory/module-page";

export default function DocumentsPage() {
  return (
    <ModulePage
      title="Documents"
      description="Manage employee document records. Track ID proofs, certificates, contracts, safety training records, and compliance documentation."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Employee Management" },
        { label: "Documents" },
      ]}
      columns={[
        { key: "docId", label: "Doc. ID" },
        { key: "empName", label: "Employee" },
        { key: "docType", label: "Document Type" },
        { key: "docNo", label: "Doc. Number" },
        { key: "issueDate", label: "Issue Date" },
        { key: "expiryDate", label: "Expiry Date" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Add Document"
    />
  );
}
