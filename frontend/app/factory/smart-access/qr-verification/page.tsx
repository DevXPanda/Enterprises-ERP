import { ModulePage } from "@/components/factory/module-page";

export default function QrVerificationPage() {
  return (
    <ModulePage
      title="QR Verification"
      description="Verify entry credentials using QR codes. Scan and validate employee badges, visitor passes, gate passes, and material challans at factory checkpoints."
      breadcrumbs={[
        { label: "Factory", href: "/factory" },
        { label: "Smart Factory Access" },
        { label: "QR Verification" },
      ]}
      columns={[
        { key: "qrCode", label: "QR Code" },
        { key: "type", label: "Type" },
        { key: "issuedTo", label: "Issued To" },
        { key: "gate", label: "Checkpoint" },
        { key: "scannedAt", label: "Scanned At" },
        { key: "officer", label: "Scanned By" },
        { key: "result", label: "Result" },
      ]}
      addNewLabel="Scan QR Code"
    />
  );
}
