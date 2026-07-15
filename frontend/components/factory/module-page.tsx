"use client";

// ============================================================
//  ModulePage — Reusable Enterprise Page Template
//  Used by every Factory sub-page (and Wages read models).
//  Fetches live data from the NestJS API — the endpoint mirrors
//  the page route unless `endpoint` is given. Full CRUD: search,
//  pagination, add/edit modal, delete, CSV export.
// ============================================================

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import {
  Search,
  Download,
  Plus,
  Trash2,
  X,
  RefreshCw,
  AlertTriangle,
  Eye,
  Edit,
  ClipboardList,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  apiGet,
  apiSend,
  formatCell,
  type ApiColumn,
  type ListResponse,
} from "@/lib/api";
import { 
  FormDialog, 
  FormHeader, 
  FormSection, 
  FormGrid, 
  FormField, 
  FormFooter, 
  ActionButtons, 
  EmptyTableState 
} from "@/components/ui/enterprise-form";

export interface ModuleColumn {
  key: string;
  label: string;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ModulePageProps {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  columns: ModuleColumn[];
  addNewLabel?: string;
  /** API path override; defaults to the current route (paths mirror). */
  endpoint?: string;
  /** Hide Add/Edit/Delete for computed read models. */
  readOnly?: boolean;
}

type Row = Record<string, unknown>;

const SKELETON_WIDTHS: readonly string[] = ["72%", "58%", "80%", "64%", "68%"];
const PAGE_SIZE = 10;

function statusVariant(value: string): "success" | "warning" | "danger" | "default" | null {
  const v = value.toLowerCase();
  if (/(active|present|passed|cleared|ready|approved|paid|running|synced|published|valid|verified|ok|used|exited|completed|dispatched|inside|in)$/.test(v) || /^(active|present|passed|cleared|ready|approved|paid|running|completed|verified)/.test(v))
    return "success";
  if (/(pending|awaiting|progress|testing|queued|scheduled|generating|accruing|loading|waiting|working|open|issued|planned|released|retrying|syncing|half)/.test(v))
    return "warning";
  if (/(failed|rejected|expired|absent|critical|overdue|blacklisted|inactive|escalated|cancelled|low|maintenance|hold|suspended)/.test(v))
    return "danger";
  return null;
}

export function ModulePage({
  title,
  description,
  breadcrumbs,
  columns,
  addNewLabel = "Add New",
  endpoint,
  readOnly = false,
}: ModulePageProps) {
  const pathname = usePathname();
  const apiPath = endpoint ?? pathname;

  const [search, setSearch] = useState("");
  const [debounced, setDebounced] = useState("");
  const [page, setPage] = useState(1);
  const [rows, setRows] = useState<Row[]>([]);
  const [apiColumns, setApiColumns] = useState<ApiColumn[]>([]);
  const [total, setTotal] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [paginated, setPaginated] = useState(true);

  // Form Modal States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create");
  const [activeRow, setActiveRow] = useState<Row | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const searchTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiGet<ListResponse>(apiPath, {
        search: debounced || undefined,
        page,
        pageSize: PAGE_SIZE,
      });
      setRows(res.data ?? []);
      setApiColumns(res.columns ?? []);
      setTotal(res.total ?? res.data?.length ?? 0);
      setTotalPages(res.totalPages ?? 1);
      setPaginated(res.totalPages !== undefined);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reach the API");
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [apiPath, debounced, page]);

  useEffect(() => {
    load();
  }, [load]);

  const onSearch = (value: string) => {
    setSearch(value);
    if (searchTimer.current) clearTimeout(searchTimer.current);
    searchTimer.current = setTimeout(() => {
      setPage(1);
      setDebounced(value);
    }, 350);
  };

  const colType = useMemo(() => {
    const map = new Map<string, ApiColumn["type"]>();
    for (const c of apiColumns) map.set(c.key, c.type);
    return map;
  }, [apiColumns]);

  // Client-side filter fallback for read-only endpoints without ?search=
  const visibleRows = useMemo(() => {
    if (paginated || !debounced) return rows;
    const q = debounced.toLowerCase();
    return rows.filter((row) =>
      columns.some((c) => String(row[c.key] ?? "").toLowerCase().includes(q)),
    );
  }, [rows, columns, debounced, paginated]);

  // Open FormDialog in "Create" mode
  const handleAddClick = () => {
    setActiveRow(null);
    const initial: Record<string, string> = {};
    for (const col of columns) {
      initial[col.key] = "";
    }
    setFormValues(initial);
    setValidationErrors({});
    setModalError(null);
    setDialogMode("create");
    setIsDialogOpen(true);
  };

  // Open FormDialog in "Edit" mode
  const handleEditClick = (row: Row) => {
    setActiveRow(row);
    const initial: Record<string, string> = {};
    for (const col of columns) {
      const v = row[col.key];
      initial[col.key] = v === null || v === undefined ? "" : String(v);
    }
    setFormValues(initial);
    setValidationErrors({});
    setModalError(null);
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  // Open FormDialog in "View" mode
  const handleViewClick = (row: Row) => {
    setActiveRow(row);
    const initial: Record<string, string> = {};
    for (const col of columns) {
      const v = row[col.key];
      initial[col.key] = v === null || v === undefined ? "" : String(v);
    }
    setFormValues(initial);
    setValidationErrors({});
    setModalError(null);
    setDialogMode("view");
    setIsDialogOpen(true);
  };

  // Handle Input Changes
  const handleInputChange = (key: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (validationErrors[key]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // Handle Form Submission with Validation & NestJS CRUD
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dialogMode === "view") {
      setIsDialogOpen(false);
      return;
    }

    // Dynamic field validation
    const errors: Record<string, string> = {};
    columns.forEach((col) => {
      const isRequired = 
        col.label.toLowerCase().includes("name") || 
        col.label.toLowerCase().includes("product") || 
        col.label.toLowerCase().includes("customer") || 
        col.label.toLowerCase().includes("operator") || 
        col.label.toLowerCase().includes("department") || 
        col.label.toLowerCase().includes("type") ||
        col.label.toLowerCase().includes("qty") ||
        col.label.toLowerCase().includes("quantity");

      if (isRequired && !formValues[col.key]) {
        errors[col.key] = `${col.label} is required.`;
      }
    });

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    setSaving(true);
    setModalError(null);
    try {
      const payload: Record<string, unknown> = {};
      for (const col of columns) {
        const raw = formValues[col.key];
        if (raw === undefined || raw === "") continue;
        const t = colType.get(col.key);
        payload[col.key] = t === "int" || t === "num" ? Number(raw) : raw;
      }

      if (dialogMode === "edit" && activeRow) {
        await apiSend("PATCH", `${apiPath}/${activeRow.id}`, payload);
      } else {
        await apiSend("POST", apiPath, payload);
      }
      setIsDialogOpen(false);
      await load();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  // Delete Action
  const handleDelete = async (row: Row) => {
    if (!window.confirm(`Delete this ${title.replace(/s$/, "").toLowerCase()} record?`)) return;
    try {
      await apiSend("DELETE", `${apiPath}/${row.id}`);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  // CSV Export Action
  const exportCsv = () => {
    const header = columns.map((c) => c.label).join(",");
    const lines = visibleRows.map((row) =>
      columns
        .map((c) => {
          const cell = formatCell(row[c.key], colType.get(c.key)).replace(/"/g, '""');
          return /[",\n]/.test(cell) ? `"${cell}"` : cell;
        })
        .join(","),
    );
    const blob = new Blob([[header, ...lines].join("\n")], { type: "text/csv" });
    const a = document.createElement("a");
    a.href = URL.createObjectURL(blob);
    a.download = `${title.toLowerCase().replace(/\s+/g, "-")}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  // Option lists helper for select fields
  const getSelectOptions = (key: string) => {
    const k = key.toLowerCase();
    if (k.includes("status") || k === "qrcheck") {
      if (title.toLowerCase().includes("gate") || title.toLowerCase().includes("exit") || title.toLowerCase().includes("entry")) {
        return ["In", "Out", "Scan Pending"];
      }
      return ["Active", "Pending", "Approved", "Completed", "In Progress", "Verified"];
    }
    if (k.includes("shift")) {
      return ["Shift A", "Shift B", "Shift C"];
    }
    if (k.includes("dept") || k.includes("department")) {
      return ["Production", "Packing", "Quality Control", "Maintenance", "Store", "Dispatch"];
    }
    if (k.includes("grade")) {
      return ["53 Grade", "43 Grade", "PSC", "PPC", "Premium"];
    }
    if (k.includes("type")) {
      return ["Contractor", "Permanent", "Regular", "Temporary"];
    }
    if (k.includes("priority")) {
      return ["High", "Medium", "Low"];
    }
    return [];
  };

  return (
    <div className="space-y-6">
      <PageHeader title={title} description={description} breadcrumbs={breadcrumbs} />

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
        <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}…`}
            className="w-full pl-9 pr-4 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white placeholder:text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2 shrink-0 w-full sm:w-auto justify-end sm:justify-start">
          <button
            type="button"
            onClick={load}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all"
          >
            <RefreshCw className={cn("w-3.5 h-3.5", loading && "animate-spin")} />
            Refresh
          </button>
          <button
            type="button"
            onClick={exportCsv}
            disabled={visibleRows.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          {!readOnly && (
            <button
              onClick={handleAddClick}
              type="button"
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary/90 transition-all shadow-md shadow-primary/10"
            >
              <Plus className="w-3.5 h-3.5" />
              {addNewLabel}
            </button>
          )}
        </div>
      </div>

      {/* API error */}
      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-danger/30 bg-danger/10 text-sm text-danger animate-fade-in">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span className="flex-1">
            API unreachable: {error}. Start the backend with <code>cd backend && npm start</code>
          </span>
          <button onClick={load} className="text-xs font-semibold underline underline-offset-2">
            Retry
          </button>
        </div>
      )}

      {/* Main Table Area */}
      {!loading && !error && rows.length === 0 ? (
        <EmptyTableState
          title={`No ${title.toLowerCase()} records found`}
          description={`Get started by adding your first record to the database. Every record will be verified automatically.`}
          actionLabel={addNewLabel}
          onAction={handleAddClick}
        />
      ) : !loading && !error && visibleRows.length === 0 ? (
        <EmptyTableState
          title="No search results found"
          description={`Your query "${search}" did not match any fields in the ${title.toLowerCase()} registry.`}
          actionLabel="Clear Filter"
          onAction={() => setSearch("")}
        />
      ) : (
        <div className="glass-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/20 bg-navy-900/10">
                  {columns.map((col) => (
                    <th
                      key={col.key}
                      className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted/70 text-left whitespace-nowrap"
                    >
                      {col.label}
                    </th>
                  ))}
                  {!readOnly && (
                    <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted/70 text-right whitespace-nowrap">
                      Actions
                    </th>
                  )}
                </tr>
              </thead>
              <tbody>
                {loading
                  ? SKELETON_WIDTHS.map((width, rowIdx) => (
                      <tr key={`s-${rowIdx}`} className="border-t border-border/10">
                        {columns.map((col, colIdx) => (
                          <td key={col.key} className="px-5 py-3.5">
                            <div
                              className="h-3 bg-white/[0.06] rounded-full animate-pulse"
                              style={{
                                width:
                                  colIdx === 0
                                    ? "75%"
                                    : colIdx === columns.length - 1
                                    ? "45%"
                                    : width,
                                animationDelay: `${rowIdx * 60}ms`,
                              }}
                            />
                          </td>
                        ))}
                        {!readOnly && <td className="px-5 py-3.5" />}
                      </tr>
                    ))
                  : visibleRows.map((row, rowIdx) => (
                      <tr
                        key={String(row.id ?? rowIdx)}
                        className="border-t border-border/10 hover:bg-white/[0.02] transition-colors"
                      >
                        {columns.map((col, colIdx) => {
                          const display = formatCell(row[col.key], colType.get(col.key));
                          const isStatusCol =
                            col.key.toLowerCase().includes("status") ||
                            col.key === "result" ||
                            col.key === "rating" ||
                            col.key === "attendance" ||
                            col.key === "priority";
                          const variant =
                            isStatusCol && display !== "—" ? statusVariant(display) : null;
                          return (
                            <td key={col.key} className="px-5 py-3.5 text-xs whitespace-nowrap">
                              {variant ? (
                                <Badge variant={variant} dot>
                                  {display}
                                </Badge>
                              ) : (
                                <span className={colIdx === 0 ? "font-semibold text-white" : "text-white/85"}>
                                  {display}
                                </span>
                              )}
                            </td>
                          );
                        })}
                        {!readOnly && (
                          <td className="px-5 py-3.5 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button 
                                onClick={() => handleViewClick(row)}
                                className="p-1.5 text-muted hover:text-white rounded-lg hover:bg-white/5 transition-all" 
                                title="View details"
                              >
                                <Eye className="w-3.5 h-3.5" />
                              </button>
                              <button 
                                onClick={() => handleEditClick(row)}
                                className="p-1.5 text-muted hover:text-primary rounded-lg hover:bg-white/5 transition-all" 
                                title="Edit row"
                              >
                                <Edit className="w-3.5 h-3.5" />
                              </button>
                              <button
                                onClick={() => handleDelete(row)}
                                className="p-1.5 text-muted hover:text-danger rounded-lg hover:bg-white/5 transition-all"
                                title="Delete row"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        )}
                      </tr>
                    ))}
              </tbody>
            </table>
          </div>

          {/* Footer: count + pagination */}
          {!error && (visibleRows.length > 0 || loading) && (
            <div className="flex items-center justify-between px-5 py-3 border-t border-border/10 text-xs text-muted">
              <span>{loading ? "Loading…" : `${total} record${total === 1 ? "" : "s"}`}</span>
              {paginated && totalPages > 1 && (
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                    disabled={page <= 1 || loading}
                    className="px-2.5 py-1 rounded-lg border border-border/40 hover:bg-white/5 disabled:opacity-40 transition-all"
                  >
                    Prev
                  </button>
                  <span>
                    Page {page} / {totalPages}
                  </span>
                  <button
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                    disabled={page >= totalPages || loading}
                    className="px-2.5 py-1 rounded-lg border border-border/40 hover:bg-white/5 disabled:opacity-40 transition-all"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Reusable Enterprise Dialog */}
      <FormDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} size="2xl">
        <FormHeader
          title={
            dialogMode === "create"
              ? `${addNewLabel}`
              : dialogMode === "edit"
              ? `Edit ${title}`
              : `${title} Details`
          }
          description={
            dialogMode === "create"
              ? `Create a new entry in the ${title.toLowerCase()} registry.`
              : dialogMode === "edit"
              ? `Update existing details for this ${title.toLowerCase()} entry.`
              : `Viewing read-only record details for the current ${title.toLowerCase()} entry.`
          }
          icon={<ClipboardList className="w-6 h-6" />}
          onClose={() => setIsDialogOpen(false)}
        />

        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <FormSection title="General Information">
            <FormGrid cols={2}>
              {columns.map((col) => {
                const key = col.key;
                const label = col.label;
                const isRequired = 
                  label.toLowerCase().includes("name") || 
                  label.toLowerCase().includes("product") || 
                  label.toLowerCase().includes("customer") || 
                  label.toLowerCase().includes("operator") || 
                  label.toLowerCase().includes("department") || 
                  label.toLowerCase().includes("type") ||
                  label.toLowerCase().includes("qty") ||
                  label.toLowerCase().includes("quantity");

                const value = formValues[key] || "";
                const selectOptions = getSelectOptions(key);
                const isCodeField = key.toLowerCase().includes("id") || 
                                     key.toLowerCase().includes("no") || 
                                     key.toLowerCase() === "code";
                
                // Helper text resolver
                let fieldHelp = `Enter the ${label.toLowerCase()} parameter.`;
                if (key.toLowerCase().includes("date")) {
                  fieldHelp = "Select the scheduling calendar date.";
                } else if (selectOptions.length > 0) {
                  fieldHelp = `Select the configured ${label.toLowerCase()} option.`;
                }

                return (
                  <FormField
                    key={key}
                    label={label}
                    fieldName={key}
                    required={isRequired && dialogMode !== "view"}
                    error={validationErrors[key]}
                    success={value && !validationErrors[key] && dialogMode !== "view"}
                    helpText={dialogMode === "view" ? undefined : fieldHelp}
                  >
                    {dialogMode === "view" ? (
                      <input
                        type="text"
                        value={value}
                        readOnly
                        disabled
                      />
                    ) : selectOptions.length > 0 ? (
                      <select
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        disabled={isCodeField && dialogMode === "edit"}
                      >
                        <option value="">Select Option...</option>
                        {selectOptions.map((opt) => (
                          <option key={opt} value={opt} className="bg-navy-100">
                            {opt}
                          </option>
                        ))}
                      </select>
                    ) : key.toLowerCase().includes("date") ? (
                      <input
                        type="date"
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        disabled={isCodeField && dialogMode === "edit"}
                      />
                    ) : key.toLowerCase().includes("qty") || key.toLowerCase().includes("quantity") || key.toLowerCase().includes("strength") || key.toLowerCase().includes("rate") || key.toLowerCase().includes("wage") || key.toLowerCase().includes("pay") || key.toLowerCase().includes("amount") ? (
                      <input
                        type="number"
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        disabled={isCodeField && dialogMode === "edit"}
                      />
                    ) : (
                      <input
                        type="text"
                        value={value}
                        onChange={(e) => handleInputChange(key, e.target.value)}
                        disabled={isCodeField && dialogMode === "edit"}
                      />
                    )}
                  </FormField>
                );
              })}
            </FormGrid>
          </FormSection>

          {modalError && (
            <p className="text-xs text-danger flex items-center gap-1.5">
              <AlertTriangle className="w-3.5 h-3.5" /> {modalError}
            </p>
          )}

          {/* Hidden submit trigger for keyboard 'Enter' support */}
          <button type="submit" className="hidden" />
        </form>

        <FormFooter>
          <ActionButtons
            onCancel={() => setIsDialogOpen(false)}
            submitLabel={
              dialogMode === "create"
                ? "Create Entry"
                : dialogMode === "edit"
                ? "Save Changes"
                : "Close"
            }
            onSubmit={handleFormSubmit}
          />
        </FormFooter>
      </FormDialog>
    </div>
  );
}
