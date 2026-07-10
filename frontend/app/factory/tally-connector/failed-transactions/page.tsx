import { ModulePage } from "@/components/factory/module-page";

export default function FailedTransactionsPage() {
  return (
    <ModulePage
      title="Failed Transactions"
      description="View all Tally sync transactions that failed. Examine failure reasons, Tally error codes, affected vouchers, and take corrective actions to resolve sync issues."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Tally Connector" },
        { label: "Failed Transactions" },
      ]}
      columns={[
        { key: "txnId", label: "Txn ID" },
        { key: "voucherType", label: "Voucher Type" },
        { key: "reference", label: "Reference" },
        { key: "failedAt", label: "Failed At" },
        { key: "errorCode", label: "Error Code" },
        { key: "errorMsg", label: "Error Message" },
        { key: "action", label: "Action" },
      ]}
      addNewLabel="Retry All"
    />
  );
}
