import { ModulePage } from "@/components/factory/module-page";

export default function SmartAccessGatePassPage() {
  return (
    <ModulePage
      title="Gate Pass"
      description="Issue and manage gate passes for visitors, contractors, material movements, and vehicles. Track pass validity, approvals, and usage history."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Smart Factory Access" },
        { label: "Gate Pass" },
      ]}
      columns={[
        { key: "passNo", label: "Pass No." },
        { key: "type", label: "Pass Type" },
        { key: "issuedTo", label: "Issued To" },
        { key: "purpose", label: "Purpose" },
        { key: "validFrom", label: "Valid From" },
        { key: "validTo", label: "Valid To" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Issue Gate Pass"
    />
  );
}
