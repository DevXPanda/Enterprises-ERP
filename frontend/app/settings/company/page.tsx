"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { 
  FormField, FormGrid, FormSection, FormFooter, ActionButtons 
} from "@/components/ui/enterprise-form";
import { Building2, Save } from "lucide-react";

export default function CompanySettingsPage() {
  const [formValues, setFormValues] = useState({
    companyName: "NKTech Enterprises Ltd.",
    address: "Plot No. 42-45, MIDC Industrial Area, Nagpur, Maharashtra - 440016",
    phone: "+91 712 2548791",
    email: "info@nktech.in",
    gstin: "27AAACN0021F1ZX",
    currency: "INR",
    fyStart: "2026-04-01",
    taxRate: "18",
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleInputChange = (key: string, value: string) => {
    setFormValues((prev) => ({ ...prev, [key]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);
    setTimeout(() => {
      setSaving(false);
      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    }, 1000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Company Settings"
        description="Configure your enterprise corporate profile parameters, taxation rates, billing currency options, and financial calendar defaults."
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Company Settings" }
        ]}
      />

      {success && (
        <div className="flex items-center gap-2 p-3.5 bg-success/15 border border-success/30 text-success-light rounded-xl text-xs font-semibold animate-fade-in">
          Company profile configuration parameters updated successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="glass-card overflow-hidden animate-fade-in">
        <div className="p-6 space-y-6">
          <FormSection title="Corporate Identity Details">
            <FormGrid cols={2}>
              <FormField label="Registered Company Name" required>
                <input
                  type="text"
                  value={formValues.companyName}
                  onChange={(e) => handleInputChange("companyName", e.target.value)}
                  placeholder="e.g. Acme Corp"
                />
              </FormField>

              <FormField label="GSTIN Registry Number" required>
                <input
                  type="text"
                  value={formValues.gstin}
                  onChange={(e) => handleInputChange("gstin", e.target.value)}
                  placeholder="e.g. 27AAAAA0000A1Z0"
                />
              </FormField>
            </FormGrid>

            <FormField label="Registered Corporate Office Address" required>
              <textarea
                value={formValues.address}
                onChange={(e) => handleInputChange("address", e.target.value)}
                placeholder="Enter office address"
              />
            </FormField>
          </FormSection>

          <FormSection title="Corporate Contact Info">
            <FormGrid cols={2}>
              <FormField label="Corporate Contact Phone" required>
                <input
                  type="text"
                  value={formValues.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                  placeholder="e.g. +91 712..."
                />
              </FormField>

              <FormField label="Billing Support Email" required>
                <input
                  type="email"
                  value={formValues.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                  placeholder="e.g. contact@company.com"
                />
              </FormField>
            </FormGrid>
          </FormSection>

          <FormSection title="Localization & Accounting Setup">
            <FormGrid cols={3}>
              <FormField label="Base Currency Code" required>
                <select
                  value={formValues.currency}
                  onChange={(e) => handleInputChange("currency", e.target.value)}
                >
                  <option value="INR">Indian Rupee (₹)</option>
                  <option value="USD">US Dollar ($)</option>
                  <option value="EUR">Euro (€)</option>
                  <option value="GBP">Pound Sterling (£)</option>
                </select>
              </FormField>

              <FormField label="Financial Year Start" required>
                <input
                  type="date"
                  value={formValues.fyStart}
                  onChange={(e) => handleInputChange("fyStart", e.target.value)}
                />
              </FormField>

              <FormField label="Default GST Rate (%)" required>
                <input
                  type="number"
                  value={formValues.taxRate}
                  onChange={(e) => handleInputChange("taxRate", e.target.value)}
                  placeholder="e.g. 18"
                />
              </FormField>
            </FormGrid>
          </FormSection>
        </div>

        <FormFooter>
          <ActionButtons
            onCancel={() => {}}
            submitLabel={saving ? "Saving..." : "Save Config"}
            isSubmitting={saving}
            cancelLabel="Reset Defaults"
            onSubmit={handleSubmit}
          />
        </FormFooter>
      </form>
    </div>
  );
}
