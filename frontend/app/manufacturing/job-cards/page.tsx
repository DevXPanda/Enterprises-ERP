"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  CreditCard,
  CheckCircle2,
  Users,
  Timer,
  AlertCircle,
  Factory,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { jobCardsKpis, jobCards, type MfgKpi, type JobCard } from "@/data/manufacturing-data";
import { useApi } from "@/hooks/use-api";
import { apiSend } from "@/lib/api";
import { RecordModal } from "@/components/ui/record-modal";
import { Pencil, Trash2 } from "lucide-react";

const iconMap: Record<string, React.ReactNode> = {
  CreditCard: <CreditCard className="w-4 h-4" />,
  CheckCircle2: <CheckCircle2 className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  Timer: <Timer className="w-4 h-4" />,
  AlertCircle: <AlertCircle className="w-4 h-4" />,
  Factory: <Factory className="w-4 h-4" />,
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
        {iconMap[data.icon] ?? <CreditCard className="w-4 h-4" />}
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

type CardRow = JobCard & { dbId?: number };

const CARD_FIELDS = [
  { key: "task", label: "Operation Task", required: true },
  { key: "machine", label: "Machine" },
  { key: "operator", label: "Operator" },
  { key: "shift", label: "Shift", type: "select" as const, options: ["Shift 1", "Shift 2", "Shift 3", "—"] },
  { key: "startTime", label: "Start Time", type: "time" as const },
  { key: "endTime", label: "End Time", type: "time" as const },
  { key: "output", label: "Output", type: "number" as const },
  { key: "target", label: "Target", type: "number" as const },
  { key: "status", label: "Status", type: "select" as const, options: ["pending", "in-progress", "completed", "overdue"] },
];
const CARD_NUM_KEYS = ["output", "target"];

export default function JobCardsPage() {
  const [search, setSearch] = useState("");
  const [version, setVersion] = useState(0);
  const [modal, setModal] = useState<"create" | CardRow | null>(null);
  const kpiLive = useApi<{ kpis: MfgKpi[] }>("/manufacturing/job-cards/analytics", version);
  const listLive = useApi<{ data: Record<string, unknown>[] }>("/manufacturing/job-cards?pageSize=50", version);

  const saveCard = async (values: Record<string, string>) => {
    const payload: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(values)) {
      if (v === "") continue;
      payload[k] = CARD_NUM_KEYS.includes(k) ? Number(v) : v;
    }
    if (modal !== "create" && modal?.dbId !== undefined) {
      await apiSend("PATCH", `/manufacturing/job-cards/${modal.dbId}`, payload);
    } else {
      await apiSend("POST", "/manufacturing/job-cards", payload);
    }
    setVersion((v) => v + 1);
  };

  const removeRow = async (row: CardRow) => {
    if (row.dbId === undefined || !window.confirm(`Delete ${row.id}?`)) return;
    await apiSend("DELETE", `/manufacturing/job-cards/${row.dbId}`);
    setVersion((v) => v + 1);
  };

  const kpis = kpiLive?.kpis ?? jobCardsKpis;
  const cards: CardRow[] = listLive
    ? listLive.data.map((r) => ({
        dbId: Number(r.id),
        id: String(r.jobNo ?? r.id),
        task: String(r.task ?? "—"),
        machine: String(r.machine ?? "—"),
        operator: String(r.operator ?? "—"),
        shift: String(r.shift ?? "—"),
        startTime: String(r.startTime ?? "—"),
        endTime: String(r.endTime ?? "—"),
        status: (r.status ?? "pending") as JobCard["status"],
        output: Number(r.output ?? 0),
        target: Number(r.target ?? 0),
      }))
    : jobCards;

  const filtered = cards.filter(
    (card) =>
      card.id.toLowerCase().includes(search.toLowerCase()) ||
      card.task.toLowerCase().includes(search.toLowerCase()) ||
      card.machine.toLowerCase().includes(search.toLowerCase()) ||
      card.operator.toLowerCase().includes(search.toLowerCase())
  );

  const statusVariant = (s: string) => {
    if (s === "completed") return "success";
    if (s === "in-progress") return "warning";
    if (s === "overdue") return "danger";
    return "default";
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Job Cards"
        description="Generate, schedule, and assign work orders and checklists to plant operators and machines."
        breadcrumbs={[
          { label: "Manufacturing", href: "/manufacturing/dashboard" },
          { label: "Job Cards" },
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
            placeholder="Search job cards…"
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
            New Job Card
          </button>
        </div>
      </div>

      {/* Job Cards Table */}
      <div className="glass-card overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/20">
                {["Card ID", "Operation Task", "Machine Asset", "Operator", "Shift", "Timeline", "Target Progress", "Status", "Manage"].map((h) => (
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
              {filtered.map((card) => {
                const targetPct = card.target > 0 ? Math.round((card.output / card.target) * 100) : 0;
                return (
                  <tr
                    key={card.id}
                    className="border-t border-border/10 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3.5 text-xs font-medium text-primary">{card.id}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-white">{card.task}</td>
                    <td className="px-5 py-3.5 text-xs text-white">{card.machine}</td>
                    <td className="px-5 py-3.5 text-xs text-muted">{card.operator}</td>
                    <td className="px-5 py-3.5 text-xs">
                      <Badge variant="default" className="bg-navy-300/30 text-white border-none text-[10px]">
                        {card.shift}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted">
                      {card.startTime} – {card.endTime}
                    </td>
                    <td className="px-5 py-3.5">
                      {card.target > 0 ? (
                        <div className="space-y-1 w-28">
                          <div className="flex items-center justify-between text-[10px] text-muted">
                            <span>{card.output} produced</span>
                            <span>{targetPct}%</span>
                          </div>
                          <div className="h-1 bg-navy-300/30 rounded-full overflow-hidden">
                            <div
                              className={cn(
                                "h-full rounded-full transition-all",
                                targetPct >= 90 ? "bg-success" : targetPct >= 70 ? "bg-primary" : "bg-warning"
                              )}
                              style={{ width: `${Math.min(targetPct, 100)}%` }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-xs text-muted">No Target</span>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={statusVariant(card.status)} dot>
                        {card.status.replace("-", " ")}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5">
                      {card.dbId !== undefined ? (
                        <div className="flex items-center gap-1.5">
                        <button onClick={() => setModal(card)} className="p-1 text-muted hover:text-primary transition-colors" title="Edit">
                          <Pencil className="w-3.5 h-3.5" />
                        </button>
                        <button onClick={() => removeRow(card)} className="p-1 text-muted hover:text-danger transition-colors" title="Delete">
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      ) : (
                        <span className="text-[10px] text-muted/40">—</span>
                      )}
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-xs text-muted">
                    No Job Cards match the search query.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <RecordModal
          title={modal === "create" ? "New Job Card" : `Edit ${modal.id}`}
          fields={CARD_FIELDS}
          initial={
            modal === "create"
              ? {}
              : {
                  task: modal.task, machine: modal.machine, operator: modal.operator,
                  shift: modal.shift, startTime: modal.startTime === "—" ? "" : modal.startTime,
                  endTime: modal.endTime === "—" ? "" : modal.endTime,
                  output: String(modal.output), target: String(modal.target), status: modal.status,
                }
          }
          submitLabel={modal === "create" ? "Create Card" : "Save Changes"}
          onSubmit={saveCard}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
