import { ModulePage } from "@/components/factory/module-page";

export default function SmartAccessMaterialOutPage() {
  return (
    <ModulePage
      title="Material Out"
      description="Record all outgoing materials from the factory gate. Capture dispatch details, material type, quantity, destination, and gate pass references."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Smart Factory Access" },
        { label: "Material Out" },
      ]}
      columns={[
        { key: "gatePassNo", label: "Gate Pass No." },
        { key: "material", label: "Material" },
        { key: "quantity", label: "Quantity" },
        { key: "destination", label: "Destination" },
        { key: "vehicleNo", label: "Vehicle No." },
        { key: "exitTime", label: "Exit Time" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Record Material Out"
    />
  );
}
