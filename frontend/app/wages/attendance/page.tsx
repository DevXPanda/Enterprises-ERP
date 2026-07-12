import { ModulePage } from "@/components/factory/module-page";

export default function AttendancePage() {
  return (
    <ModulePage
      title="Attendance"
      description="Computed daily attendance from biometric punches (MWMS attendance_daily) with shift, hours worked and overtime."
      breadcrumbs={[
        { label: "Wages", href: "/wages/dashboard" },
        { label: "Attendance" },
      ]}
      endpoint="/wages/attendance"
      readOnly
      columns={[
        { key: "empId", label: "Emp. ID" },
        { key: "name", label: "Name" },
        { key: "date", label: "Date" },
        { key: "shift", label: "Shift" },
        { key: "checkIn", label: "Check-In" },
        { key: "checkOut", label: "Check-Out" },
        { key: "hours", label: "Hours" },
        { key: "otHours", label: "OT Hrs" },
        { key: "status", label: "Status" },
      ]}
    />
  );
}
