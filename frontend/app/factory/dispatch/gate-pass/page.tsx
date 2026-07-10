import { ModulePage } from "@/components/factory/module-page";

export default function DispatchGatePassPage() {
  return (
    <ModulePage
      title="Gate Pass"
      description="Issue dispatch gate passes for outgoing vehicles. Each gate pass authorizes material exit and is validated at the factory exit gate before the vehicle departs."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Dispatch" },
        { label: "Gate Pass" },
      ]}
      columns={[
        { key: "passNo", label: "Gate Pass No." },
        { key: "doNo", label: "DO No." },
        { key: "vehicle", label: "Vehicle No." },
        { key: "material", label: "Material" },
        { key: "quantity", label: "Quantity" },
        { key: "issuedAt", label: "Issued At" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Issue Gate Pass"
    />
  );
}
