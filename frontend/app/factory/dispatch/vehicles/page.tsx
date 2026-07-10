import { ModulePage } from "@/components/factory/module-page";

export default function DispatchVehiclesPage() {
  return (
    <ModulePage
      title="Vehicles"
      description="Manage transport vehicles used for factory dispatch. Track vehicle registration, driver assignments, fitness certificates, permit validity, and trip history."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Dispatch" },
        { label: "Vehicles" },
      ]}
      columns={[
        { key: "vehicleNo", label: "Vehicle No." },
        { key: "type", label: "Vehicle Type" },
        { key: "driver", label: "Driver Name" },
        { key: "capacity", label: "Capacity (MT)" },
        { key: "fitnessExpiry", label: "Fitness Expiry" },
        { key: "permitExpiry", label: "Permit Expiry" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Add Vehicle"
    />
  );
}
