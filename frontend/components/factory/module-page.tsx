"use client";

// ============================================================
//  ModulePage — Reusable Enterprise Page Template
//  Used by every Factory sub-page (and the Manufacturing/Wages
//  table pages). Fetches live data from the NestJS API — the
//  endpoint mirrors the page route unless `endpoint` is given.
//  Renders: PageHeader · Search/Filter/Export/Add · Table · CRUD
// ============================================================

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { Search, Download, Plus, Pencil, Trash2, X, RefreshCw, AlertTriangle } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { apiGet, apiSend, formatCell, type ApiColumn, type ListResponse } from "@/lib/api";
import { cn } from "@/lib/utils";

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
  /** Hide Add/Edit/Delete for read-only views (e.g. computed read models). */
  readOnly?: boolean;
}

type Row = Record<string, unknown>;

const SKELETON_WIDTHS: readonly string[] = ["72%", "58%", "80%", "64%", "68%"];
const PAGE_SIZE = 10;

/* Status-ish values get a subtle colored pill. */
function statusTone(value: string): string | null {
  const v = value.toLowerCase();
  if (/(active|present|passed|cleared|ready|approved|paid|running|synced|published|valid|verified|ok|used|exited|completed|dispatched|inside)/.test(v))
    return "bg-success/10 text-success border-success/20";
  if (/(pending|awaiting|in progress|in testing|queued|scheduled|generating|accruing|loading|waiting|working|open|issued|planned|released|retrying|syncing)/.test(v))
    return "bg-warning/10 text-warning border-warning/20";
  if (/(failed|rejected|expired|absent|critical|overdue|blacklisted|inactive|escalated|cancelled|low stock|maintenance|hold)/.test(v))
    return "bg-danger/10 text-danger border-danger/20";
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

  // Modal state (create / edit share one form)
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Row | null>(null);
  const [form, setForm] = useState<Record<string, string>>({});
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

  /* ── CRUD helpers ─────────────────────────────────────────── */

  const openCreate = () => {
    setEditing(null);
    setForm({});
    setModalError(null);
    setModalOpen(true);
  };

  const openEdit = (row: Row) => {
    setEditing(row);
    const initial: Record<string, string> = {};
    for (const col of columns) {
      const v = row[col.key];
      initial[col.key] = v === null || v === undefined ? "" : String(v);
    }
    setForm(initial);
    setModalError(null);
    setModalOpen(true);
  };

  const submit = async () => {
    setSaving(true);
    setModalError(null);
    try {
      const payload: Record<string, unknown> = {};
      for (const col of columns) {
        const raw = form[col.key];
        if (raw === undefined || raw === "") continue;
        const t = colType.get(col.key);
        payload[col.key] = t === "int" || t === "num" ? Number(raw) : raw;
      }
      if (editing) {
        await apiSend("PATCH", `${apiPath}/${editing.id}`, payload);
      } else {
        await apiSend("POST", apiPath, payload);
      }
      setModalOpen(false);
      await load();
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  };

  const remove = async (row: Row) => {
    if (!window.confirm(`Delete this ${title.replace(/s$/, "").toLowerCase()} record?`)) return;
    try {
      await apiSend("DELETE", `${apiPath}/${row.id}`);
      await load();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  };

  const exportCsv = () => {
    const header = columns.map((c) => c.label).join(",");
    const lines = rows.map((row) =>
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

  /* ── Render ───────────────────────────────────────────────── */

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

        <div className="flex items-center gap-2 shrink-0">
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
            disabled={rows.length === 0}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all disabled:opacity-40"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          {!readOnly && (
            <button
              type="button"
              onClick={openCreate}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-all shadow-glow"
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
            API unreachable: {error}. Is the backend running on port 4000? (<code>cd backend &amp;&amp; npm start</code>)
          </span>
          <button onClick={load} className="text-xs font-semibold underline underline-offset-2">
            Retry
          </button>
        </div>
      )}

      {/* Table */}
      <div className="glass-card overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/20">
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
                              width: colIdx === 0 ? "75%" : colIdx === columns.length - 1 ? "45%" : width,
                              animationDelay: `${rowIdx * 60}ms`,
                            }}
                          />
                        </td>
                      ))}
                      {!readOnly && <td className="px-5 py-3.5" />}
                    </tr>
                  ))
                : rows.map((row) => (
                    <tr
                      key={String(row.id)}
                      className="border-t border-border/10 hover:bg-white/[0.02] transition-colors"
                    >
                      {columns.map((col, colIdx) => {
                        const display = formatCell(row[col.key], colType.get(col.key));
                        const tone =
                          colIdx >= columns.length - 2 && display !== "—" ? statusTone(display) : null;
                        return (
                          <td key={col.key} className="px-5 py-3.5 text-[13px] whitespace-nowrap">
                            {tone ? (
                              <span className={cn("inline-block px-2 py-0.5 rounded-md border text-[11px] font-medium", tone)}>
                                {display}
                              </span>
                            ) : (
                              <span className={colIdx === 0 ? "font-semibold text-white" : "text-white/80"}>
                                {display}
                              </span>
                            )}
                          </td>
                        );
                      })}
                      {!readOnly && (
                        <td className="px-5 py-3.5">
                          <div className="flex items-center justify-end gap-1.5">
                            <button
                              onClick={() => openEdit(row)}
                              className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-all"
                              aria-label="Edit"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                            </button>
                            <button
                              onClick={() => remove(row)}
                              className="p-1.5 rounded-lg text-muted hover:text-danger hover:bg-danger/10 transition-all"
                              aria-label="Delete"
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

        {/* Empty state */}
        {!loading && !error && rows.length === 0 && (
          <div className="px-5 py-8 border-t border-border/10 text-center">
            <p className="text-sm font-medium text-white/40">
              No {title.toLowerCase()} records{debounced ? ` matching “${debounced}”` : " yet"}
            </p>
            {!readOnly && !debounced && (
              <p className="text-xs text-muted/35 mt-1">
                Click &ldquo;{addNewLabel}&rdquo; to add your first entry
              </p>
            )}
          </div>
        )}

        {/* Footer: count + pagination */}
        {!error && (rows.length > 0 || loading) && (
          <div className="flex items-center justify-between px-5 py-3 border-t border-border/10 text-xs text-muted">
            <span>
              {loading ? "Loading…" : `${total} record${total === 1 ? "" : "s"}`}
            </span>
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

      {/* Create / Edit modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in">
          <div className="glass-card w-full max-w-lg max-h-[85vh] overflow-y-auto p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">
                {editing ? `Edit ${title}` : addNewLabel}
              </h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/5"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {columns.map((col) => {
                const t = colType.get(col.key);
                return (
                  <label key={col.key} className="space-y-1">
                    <span className="text-[11px] font-semibold uppercase tracking-wider text-muted/70">
                      {col.label}
                    </span>
                    <input
                      type={t === "int" || t === "num" ? "number" : t === "date" ? "date" : t === "ts" ? "datetime-local" : "text"}
                      value={form[col.key] ?? ""}
                      onChange={(e) => setForm((f) => ({ ...f, [col.key]: e.target.value }))}
                      className="w-full px-3 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white outline-none focus:border-primary/50 transition-all"
                    />
                  </label>
                );
              })}
            </div>

            {modalError && (
              <p className="text-xs text-danger flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> {modalError}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 hover:bg-white/5 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={submit}
                disabled={saving}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-all shadow-glow disabled:opacity-50"
              >
                {saving ? "Saving…" : editing ? "Save Changes" : "Create"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
