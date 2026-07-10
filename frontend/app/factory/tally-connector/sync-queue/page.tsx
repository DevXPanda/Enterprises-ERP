import { ModulePage } from "@/components/factory/module-page";

export default function SyncQueuePage() {
  return (
    <ModulePage
      title="Sync Queue"
      description="Monitor the Tally synchronization queue. View all pending transactions waiting to be synced to Tally ERP, including voucher types, amounts, and scheduled sync times."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Tally Connector" },
        { label: "Sync Queue" },
      ]}
      columns={[
        { key: "queueId", label: "Queue ID" },
        { key: "voucherType", label: "Voucher Type" },
        { key: "reference", label: "Reference" },
        { key: "amount", label: "Amount (₹)" },
        { key: "scheduledAt", label: "Scheduled At" },
        { key: "attempts", label: "Attempts" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Manual Sync"
    />
  );
}
