import { ModulePage } from "@/components/factory/module-page";

export default function VehicleEntryPage() {
  return (
    <ModulePage
      title="Vehicle Entry"
      description="Track all vehicle entries and exits at factory gates. Record vehicle registration, driver details, purpose, and load information."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Smart Factory Access" },
        { label: "Vehicle Entry" },
      ]}
      columns={[
        { key: "vehicleNo", label: "Vehicle No." },
        { key: "type", label: "Type" },
        { key: "driver", label: "Driver Name" },
        { key: "purpose", label: "Purpose" },
        { key: "gate", label: "Gate" },
        { key: "entryTime", label: "Entry Time" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Log Vehicle"
    />
  );
}
