import { ModulePage } from "@/components/factory/module-page";

export default function SmartAccessMaterialInPage() {
  return (
    <ModulePage
      title="Material In"
      description="Record all incoming materials at the factory gate. Capture vendor details, material type, quantity, vehicle number, and challan references."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Smart Factory Access" },
        { label: "Material In" },
      ]}
      columns={[
        { key: "challanNo", label: "Challan No." },
        { key: "vendor", label: "Vendor" },
        { key: "material", label: "Material" },
        { key: "quantity", label: "Quantity" },
        { key: "vehicleNo", label: "Vehicle No." },
        { key: "entryTime", label: "Entry Time" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Record Material In"
    />
  );
}
