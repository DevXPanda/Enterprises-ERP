"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  ScrollText,
  Layers,
  IndianRupee,
  BookOpen,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { bomKpis, bomItems, type MfgKpi, type BomItem } from "@/data/manufacturing-data";
import { useApi } from "@/hooks/use-api";
import { apiSend } from "@/lib/api";
import { RecordModal } from "@/components/ui/record-modal";
import { Pencil, Trash2 } from "lucide-react";

const fmtDate = (d?: unknown) =>
  d ? new Date(String(d)).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

// Custom GitBranch icon stand-in since we want to be safe with lucide icons
import { GitCommit as GitBranch } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  ScrollText: <ScrollText className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  IndianRupee: <IndianRupee className="w-4 h-4" />,
  GitBranch: <GitBranch className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  AlertCircle: <AlertCircle className="w-4 h-4" />,
};

function KpiCard({ data, index }: { data: MfgKpi; index: number }) {
  const colorMap: Record<string, string> = {
    blue: "bg-primary/10 text-primary",
    green: "bg-success/10 text-success",
    purple: "bg-purple/10 text-purple",
    orange: "bg-warning/10 text-warning",
    red: "bg-danger/10 text-danger",
  };
  const isPos = data.change !== undefined && data.change > 0;
  const isNeg = data.change !== undefined && data.change < 0;

  return (
    <div
      className="bg-card/60 border border-border/30 rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={cn("p-2 rounded-lg shrink-0", colorMap[data.color] || colorMap.blue)}>
        {iconMap[data.icon] ?? <ScrollText className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-lg font-bold text-white tracking-tight leading-tight">{data.value}</p>
        <p className="text-[11px] text-muted truncate">{data.label}</p>
      </div>
      {data.change !== undefined && (
        <div
          className={cn(
            "flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0",
            isPos && "text-success bg-success/10",
            isNeg && "text-danger bg-danger/10",
            !isPos && !isNeg && "text-muted bg-muted/10"
          )}
        >
          {isPos ? (
            <TrendingUp className="w-2.5 h-2.5" />
          ) : isNeg ? (
            <TrendingDown className="w-2.5 h-2.5" />
          ) : (
            <Minus className="w-2.5 h-2.5" />
          )}
          {Math.abs(data.change)}%
        </div>
      )}
    </div>
  );
}

type BomRow = BomItem & { dbId?: number; isoUpdated?: string };

const BOM_FIELDS = [
  { key: "product", label: "Product", required: true },
  { key: "grade", label: "Grade" },
  { key: "materials", label: "Materials Count", type: "number" as const },
  { key: "costPerUnit", label: "Cost / Bag (₹)", type: "number" as const, required: true },
  { key: "version", label: "Version" },
  { key: "createdBy", label: "Created By" },
  { key: "lastUpdated", label: "Last Updated", type: "date" as const },
  { key: "status", label: "Status", type: "select" as const, options: ["active", "draft", "archived"] },
];
const BOM_NUM_KEYS = ["materials", "costPerUnit"];

export default function BomPage() {
  const [search, setSearch] = useState("");
  const [version, setVersion] = useState(0);
  const [modal, setModal] = useState<"create" | BomRow | null>(null);
  const kpiLive = useApi<{ kpis: MfgKpi[] }>("/manufacturing/bom/analytics", version);
  const listLive = useApi<{ data: Record<string, unknown>[] }>("/manufacturing/bom?pageSize=50", version);

  const saveBom = async (values: Record<string, string>) => {
    const payload: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(values)) {
      if (v === "") continue;
      payload[k] = BOM_NUM_KEYS.includes(k) ? Number(v) : v;
    }
    if (modal !== "create" && modal?.dbId !== undefined) {
      await apiSend("PATCH", `/manufacturing/bom/${modal.dbId}`, payload);
    } else {
      await apiSend("POST", "/manufacturing/bom", payload);
    }
    setVersion((v) => v + 1);
  };

  const removeRow = async (row: BomRow) => {
    if (row.dbId === undefined || !window.confirm(`Delete ${row.id}?`)) return;
    await apiSend("DELETE", `/manufacturing/bom/${row.dbId}`);
    setVersion((v) => v + 1);
  };

  const kpis = kpiLive?.kpis ?? bomKpis;
  const items: BomRow[] = listLive
    ? listLive.data.map((r) => ({
        dbId: Number(r.id),
        isoUpdated: r.lastUpdated ? String(r.lastUpdated) : "",
        id: String(r.bomNo ?? r.id),
        product: String(r.product ?? "—"),
        grade: String(r.grade ?? ""),
        materials: Number(r.materials ?? 0),
        costPerUnit: Number(r.costPerUnit ?? 0),
        lastUpdated: fmtDate(r.lastUpdated),
        status: (r.status ?? "draft") as BomItem["status"],
        version: String(r.version ?? "v1.0"),
        createdBy: String(r.createdBy ?? "—"),
      }))
    : bomItems;

  const filtered = items.filter(
    (item) =>
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.product.toLowerCase().includes(search.toLowerCase()) ||
      item.grade.toLowerCase().includes(search.toLowerCase())
  );

  const statusVariant = (s: string) => {
    if (s === "active") return "success";
    if (s === "draft") return "warning";
    return "default";
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Bill of Materials"
        description="Formulate raw material proportions and track ingredient recipes and version logs for cement grades."
        breadcrumbs={[
          { label: "Manufacturing", href: "/manufacturing/dashboard" },
          { label: "BOM" },
        ]}
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.id} data={kpi} index={i} />
        ))}
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
        <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search BOMs…"
            className="w-full pl-9 pr-4 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white placeholder:text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button onClick={() => setModal("create")} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-all">
            <Plus className="w-3.5 h-3.5" />
            New BOM
          </button>
        </div>
      </div>

      {/* BOM Table */}
      <div className="glass-card overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/20">
                {["BOM ID", "Product & Grade", "Version", "Materials Count", "Cost per Bag", "Last Updated", "Created By", "Status", "Manage"].map((h) => (
                  <th
                    key={h}
                    className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted/70 text-left whitespace-nowrap"
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((item) => (
                <tr
                  key={item.id}
                  className="border-t border-border/10 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3.5 text-xs font-medium text-primary">{item.id}</td>
                  <td className="px-5 py-3.5">
                    <p className="text-xs font-medium text-white">{item.product}</p>
                    <p className="text-[10px] text-muted">{item.grade}</p>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-white">
                    <Badge variant="default" className="bg-navy-300/30 text-white border-none">
                      {item.version}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-white">{item.materials} ingredients</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-success">
                    ₹{item.costPerUnit}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted">{item.lastUpdated}</td>
                  <td className="px-5 py-3.5 text-xs text-muted">{item.createdBy}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={statusVariant(item.status)} dot>
                      {item.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    {item.dbId !== undefined ? (
                      <div className="flex items-center gap-1.5">
                        <button onClick={() => setModal(item)} className="p-1 text-muted hover:text-primary transition-colors" title="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => removeRow(item)} className="p-1 text-muted hover:text-danger transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    ) : (
                      <span className="text-[10px] text-muted/40">—</span>
                    )}
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-xs text-muted">
                    No Bill of Materials matches search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <RecordModal
          title={modal === "create" ? "New BOM" : `Edit ${modal.id}`}
          fields={BOM_FIELDS}
          initial={
            modal === "create"
              ? {}
              : {
                  product: modal.product, grade: modal.grade, materials: String(modal.materials),
                  costPerUnit: String(modal.costPerUnit), version: modal.version,
                  createdBy: modal.createdBy, lastUpdated: modal.isoUpdated ?? "", status: modal.status,
                }
          }
          submitLabel={modal === "create" ? "Create BOM" : "Save Changes"}
          onSubmit={saveBom}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
