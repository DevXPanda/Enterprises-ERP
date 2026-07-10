import { ModulePage } from "@/components/factory/module-page";

export default function InvoiceReferencePage() {
  return (
    <ModulePage
      title="Invoice Reference"
      description="Manage invoice references linked to dispatch orders. Record invoice numbers, amounts, tax details, and link invoices to their respective dispatch and gate pass records."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Dispatch" },
        { label: "Invoice Reference" },
      ]}
      columns={[
        { key: "invoiceNo", label: "Invoice No." },
        { key: "doNo", label: "DO No." },
        { key: "customer", label: "Customer" },
        { key: "amount", label: "Amount (₹)" },
        { key: "taxAmount", label: "Tax (₹)" },
        { key: "invoiceDate", label: "Invoice Date" },
        { key: "status", label: "Status" },
      ]}
      addNewLabel="Link Invoice"
    />
  );
}
