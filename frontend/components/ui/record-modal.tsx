"use client";

// Generic add/edit modal: renders a field list, submits to the given
// handler, shows API errors inline. Used by the manufacturing and
// wages pages for their CRUD actions.
import { useState } from "react";
import { X, AlertTriangle } from "lucide-react";

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

  const submit = async () => {
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

  const inputClass =
    "w-full px-3 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white outline-none focus:border-primary/50 transition-all";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in">
      <div className="glass-card w-full max-w-md max-h-[85vh] overflow-y-auto p-6 space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-base font-bold text-white">{title}</h2>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/5"
            aria-label="Close"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {fields.map((f) => (
            <label key={f.key} className="space-y-1">
              <span className="text-[11px] font-semibold uppercase tracking-wider text-muted/70">
                {f.label}
                {f.required ? " *" : ""}
              </span>
              {f.type === "select" ? (
                <select
                  value={form[f.key]}
                  onChange={(e) => setForm((s) => ({ ...s, [f.key]: e.target.value }))}
                  className={`${inputClass} cursor-pointer`}
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
                  className={inputClass}
                />
              )}
            </label>
          ))}
        </div>

        {error && (
          <p className="text-xs text-danger flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5" /> {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-2 pt-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 hover:bg-white/5 hover:text-white transition-all"
          >
            Cancel
          </button>
          <button
            onClick={submit}
            disabled={saving || missingRequired}
            className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-all disabled:opacity-50"
          >
            {saving ? "Saving…" : submitLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
