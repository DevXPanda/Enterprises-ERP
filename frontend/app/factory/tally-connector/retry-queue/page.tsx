import { ModulePage } from "@/components/factory/module-page";

export default function RetryQueuePage() {
  return (
    <ModulePage
      title="Retry Queue"
      description="Manage the Tally retry queue for previously failed transactions. Review transactions scheduled for re-processing, set retry priorities, and monitor retry outcomes."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Tally Connector" },
        { label: "Retry Queue" },
      ]}
      columns={[
        { key: "retryId", label: "Retry ID" },
        { key: "originalTxnId", label: "Original Txn ID" },
        { key: "voucherType", label: "Voucher Type" },
        { key: "retryCount", label: "Retry Count" },
        { key: "nextRetry", label: "Next Retry" },
        { key: "lastError", label: "Last Error" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Add to Retry"
    />
  );
}
