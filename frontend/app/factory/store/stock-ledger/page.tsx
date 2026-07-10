import { ModulePage } from "@/components/factory/module-page";

export default function StockLedgerPage() {
  return (
    <ModulePage
      title="Stock Ledger"
      description="Complete chronological record of all stock movements. View receipts, issues, transfers, and adjustments for any material over any date range for audit purposes."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Store" },
        { label: "Stock Ledger" },
      ]}
      columns={[
        { key: "txnId", label: "Txn ID" },
        { key: "material", label: "Material" },
        { key: "txnType", label: "Transaction Type" },
        { key: "quantity", label: "Quantity" },
        { key: "balance", label: "Balance" },
        { key: "reference", label: "Reference" },
        { key: "date", label: "Date" },
      ]}
      addNewLabel="Manual Adjustment"
    />
  );
}
