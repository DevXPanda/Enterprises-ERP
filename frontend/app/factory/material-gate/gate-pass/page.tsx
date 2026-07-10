import { ModulePage } from "@/components/factory/module-page";

export default function MaterialGatePassPage() {
  return (
    <ModulePage
      title="Gate Pass"
      description="Issue and track material gate passes for outgoing shipments. Each gate pass authorizes material exit and links to the corresponding dispatch or delivery order."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Material Gate" },
        { label: "Gate Pass" },
      ]}
      columns={[
        { key: "passNo", label: "Gate Pass No." },
        { key: "material", label: "Material" },
        { key: "quantity", label: "Quantity" },
        { key: "issuedTo", label: "Issued To" },
        { key: "vehicleNo", label: "Vehicle No." },
        { key: "issuedAt", label: "Issued At" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Issue Gate Pass"
    />
  );
}
