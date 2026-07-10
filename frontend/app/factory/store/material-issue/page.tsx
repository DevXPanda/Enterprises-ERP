import { ModulePage } from "@/components/factory/module-page";

export default function MaterialIssuePage() {
  return (
    <ModulePage
      title="Material Issue"
      description="Manage material issue transactions from the factory store to production lines. Raise issue slips, track quantities issued, and maintain accurate store inventory balances."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Store" },
        { label: "Material Issue" },
      ]}
      columns={[
        { key: "issueNo", label: "Issue No." },
        { key: "material", label: "Material" },
        { key: "quantity", label: "Quantity" },
        { key: "issuedTo", label: "Issued To" },
        { key: "department", label: "Department" },
        { key: "issuedBy", label: "Issued By" },
        { key: "issuedAt", label: "Issued At" },
      ]}
      addNewLabel="Issue Material"
    />
  );
}
