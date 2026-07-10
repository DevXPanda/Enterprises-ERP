import { ModulePage } from "@/components/factory/module-page";

export default function MaterialGateInPage() {
  return (
    <ModulePage
      title="Material In"
      description="Record and track all incoming materials at the factory gate. Capture GRN details, vendor information, material specifications, weight, and challan numbers."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Material Gate" },
        { label: "Material In" },
      ]}
      columns={[
        { key: "grnNo", label: "GRN No." },
        { key: "challanNo", label: "Challan No." },
        { key: "vendor", label: "Vendor" },
        { key: "material", label: "Material" },
        { key: "quantity", label: "Quantity (MT)" },
        { key: "vehicleNo", label: "Vehicle No." },
        { key: "receivedAt", label: "Received At" },
      ]}
      addNewLabel="New GRN"
    />
  );
}
