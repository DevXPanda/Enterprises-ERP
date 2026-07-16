"use client";

// Generic add/edit modal rewritten to use the unified FormDialog system.
// Used by wages attendance and wages payroll for CRUD.
import React, { useState } from "react";
import { AlertTriangle } from "lucide-react";
import { 
  FormDialog, 
  FormHeader, 
  FormGrid,
  FormField, 
  FormFooter, 
  ActionButtons 
} from "./enterprise-form";

export interface ModalField {
  key: string;
  label: string;
  type?: "text" | "number" | "date" | "time" | "select";
  options?: string[];
  required?: boolean;
  placeholder?: string;
}

interface RecordModalProps {
  title: string;
  fields: ModalField[];
  initial?: Record<string, string>;
  submitLabel?: string;
  onSubmit: (values: Record<string, string>) => Promise<void>;
  onClose: () => void;
}

export function RecordModal({
  title,
  fields,
  initial = {},
  submitLabel = "Save",
  onSubmit,
  onClose,
}: RecordModalProps) {
  const [form, setForm] = useState<Record<string, string>>(() => {
    const base: Record<string, string> = {};
    for (const f of fields) {
      base[f.key] = initial[f.key] ?? (f.type === "select" ? f.options?.[0] ?? "" : "");
    }
    return base;
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const missingRequired = fields.some((f) => f.required && !form[f.key]);

  const submit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    setSaving(true);
    setError(null);
    try {
      await onSubmit(form);
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Save failed — is the backend running?");
    } finally {
      setSaving(false);
    }
  };

  return (
    <FormDialog isOpen={true} onClose={onClose} size="md">
      <FormHeader 
        title={title} 
        onClose={onClose}
      />
      <form onSubmit={submit} className="flex-1 overflow-y-auto p-6 space-y-6">
        <FormGrid cols={fields.length > 4 ? 2 : 1}>
          {fields.map((f) => (
            <FormField
              key={f.key}
              label={f.label}
              required={f.required}
            >
              {f.type === "select" ? (
                <select
                  value={form[f.key]}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                >
                  {(f.options ?? []).map((o) => (
                    <option key={o} value={o} className="bg-navy-100">
                      {o}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  type={f.type ?? "text"}
                  value={form[f.key]}
                  placeholder={f.placeholder}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                />
              )}
            </FormField>
          ))}
        </FormGrid>
        
        {error && (
          <p className="text-xs text-danger flex items-center gap-1.5 mt-2">
            <AlertTriangle className="w-3.5 h-3.5 shrink-0" /> {error}
          </p>
        )}
      </form>
      <FormFooter>
        <ActionButtons
          onCancel={onClose}
          submitLabel={saving ? "Saving..." : submitLabel}
          isSubmitting={saving || missingRequired}
          onSubmit={submit}
        />
      </FormFooter>
    </FormDialog>
  );
}
