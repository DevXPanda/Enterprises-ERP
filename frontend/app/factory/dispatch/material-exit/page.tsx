import { ModulePage } from "@/components/factory/module-page";

export default function MaterialExitPage() {
  return (
    <ModulePage
      title="Material Exit"
      description="Confirm and record the final material exit from the factory. Capture weighbridge readings, validate gate passes, and close dispatch transactions after vehicle departure."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Dispatch" },
        { label: "Material Exit" },
      ]}
      columns={[
        { key: "exitId", label: "Exit ID" },
        { key: "gatePassNo", label: "Gate Pass No." },
        { key: "vehicle", label: "Vehicle No." },
        { key: "material", label: "Material" },
        { key: "grossWeight", label: "Gross Wt (MT)" },
        { key: "netWeight", label: "Net Wt (MT)" },
        { key: "exitTime", label: "Exit Time" },
      ]}
      addNewLabel="Record Exit"
    />
  );
}
