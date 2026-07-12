import { ModulePage } from "@/components/factory/module-page";

export default function WorkersPage() {
  return (
    <ModulePage
      title="Workers"
      description="Worker profiles from the MWMS wages service — shift, line, latest output, wage rate and production-linked cost per bag."
      breadcrumbs={[
        { label: "Wages", href: "/wages/dashboard" },
        { label: "Workers" },
      ]}
      endpoint="/wages/workers"
      readOnly
      columns={[
        { key: "workerId", label: "Worker ID" },
        { key: "name", label: "Name" },
        { key: "shift", label: "Shift" },
        { key: "line", label: "Line" },
        { key: "attendance", label: "Attendance" },
        { key: "bagsPerDay", label: "Bags / Day" },
        { key: "wagePerDay", label: "Wage / Day (₹)" },
        { key: "costPerBag", label: "Cost / Bag (₹)" },
        { key: "machineHours", label: "Machine Hrs" },
        { key: "rating", label: "Rating" },
      ]}
    />
  );
}
