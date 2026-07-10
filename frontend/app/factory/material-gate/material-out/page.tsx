import { ModulePage } from "@/components/factory/module-page";

export default function MaterialGateOutPage() {
  return (
    <ModulePage
      title="Material Out"
      description="Record all outgoing materials at the factory gate. Validate gate pass, capture weighbridge data, destination details, and driver information before exit."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Material Gate" },
        { label: "Material Out" },
      ]}
      columns={[
        { key: "exitId", label: "Exit ID" },
        { key: "gatePassNo", label: "Gate Pass No." },
        { key: "material", label: "Material" },
        { key: "quantity", label: "Quantity (MT)" },
        { key: "destination", label: "Destination" },
        { key: "vehicleNo", label: "Vehicle No." },
        { key: "exitAt", label: "Exit Time" },
      ]}
      addNewLabel="Record Exit"
    />
  );
}
