"use client";

import { useState } from "react";
import {
  Cog,
  Activity,
  Wrench,
  PauseCircle,
  Gauge,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Filter,
  Download,
  Plus,
  Thermometer,
  User,
  Clock,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { machinesKpis, mfgMachines, type MfgKpi, type MfgMachine } from "@/data/manufacturing-data";
import { useApi } from "@/hooks/use-api";
import { exportCsv } from "@/lib/export";
import { apiSend } from "@/lib/api";
import { RecordModal } from "@/components/ui/record-modal";
import { Pencil, Trash2 } from "lucide-react";

const fmtDay = (d?: unknown) =>
  d ? new Date(String(d)).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—";

const iconMap: Record<string, React.ReactNode> = {
  Cog: <Cog className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  Wrench: <Wrench className="w-4 h-4" />,
  PauseCircle: <PauseCircle className="w-4 h-4" />,
  Gauge: <Gauge className="w-4 h-4" />,
  Calendar: <Calendar className="w-4 h-4" />,
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
        {iconMap[data.icon] ?? <Cog className="w-4 h-4" />}
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

type MachineRow = MfgMachine & { dbId?: number; isoLast?: string; isoNext?: string };

const MACHINE_FIELDS = [
  { key: "name", label: "Machine Name", required: true },
  { key: "line", label: "Line", type: "select" as const, options: ["Line A", "Line B", "Line C", "Line D"] },
  { key: "status", label: "Status", type: "select" as const, options: ["running", "idle", "maintenance"] },
  { key: "uptime", label: "Uptime %", type: "number" as const },
  { key: "temperature", label: "Temperature", placeholder: "e.g. 68°C" },
  { key: "lastMaintenance", label: "Last Maintenance", type: "date" as const },
  { key: "nextMaintenance", label: "Next Maintenance", type: "date" as const },
  { key: "operator", label: "Operator" },
  { key: "hoursToday", label: "Hours Today", type: "number" as const },
];
const MACHINE_NUM_KEYS = ["uptime", "hoursToday"];

export default function MachinesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [version, setVersion] = useState(0);
  const [modal, setModal] = useState<"create" | MachineRow | null>(null);
  const kpiLive = useApi<{ kpis: MfgKpi[] }>("/manufacturing/machines/analytics", version);
  const listLive = useApi<{ data: Record<string, unknown>[] }>("/manufacturing/machines?pageSize=50", version);

  const saveMachine = async (values: Record<string, string>) => {
    const payload: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(values)) {
      if (v === "") continue;
      payload[k] = MACHINE_NUM_KEYS.includes(k) ? Number(v) : v;
    }
    if (modal !== "create" && modal !== null && modal.dbId !== undefined) {
      await apiSend("PATCH", `/manufacturing/machines/${modal.dbId}`, payload);
    } else {
      await apiSend("POST", "/manufacturing/machines", payload);
    }
    setVersion((v) => v + 1);
  };

  const removeMachine = async (row: MachineRow) => {
    if (row.dbId === undefined || !window.confirm(`Delete ${row.name}?`)) return;
    await apiSend("DELETE", `/manufacturing/machines/${row.dbId}`);
    setVersion((v) => v + 1);
  };

  const kpis = kpiLive?.kpis ?? machinesKpis;
  const machines: MachineRow[] = listLive
    ? listLive.data.map((r) => ({
        dbId: Number(r.id),
        isoLast: r.lastMaintenance ? String(r.lastMaintenance) : "",
        isoNext: r.nextMaintenance ? String(r.nextMaintenance) : "",
        id: String(r.machineId ?? r.id),
        name: String(r.name ?? "—"),
        line: String(r.line ?? "—"),
        status: (r.status ?? "idle") as MfgMachine["status"],
        uptime: Number(r.uptime ?? 0),
        temperature: String(r.temperature ?? "—"),
        lastMaintenance: fmtDay(r.lastMaintenance),
        nextMaintenance: fmtDay(r.nextMaintenance),
        operator: String(r.operator ?? "—"),
        hoursToday: Number(r.hoursToday ?? 0),
      }))
    : mfgMachines;

  const filtered = machines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.line.toLowerCase().includes(search.toLowerCase()) ||
      m.operator.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: "running" | "maintenance" | "idle") => {
    if (status === "running") return <Badge variant="success" dot>Running</Badge>;
    if (status === "maintenance") return <Badge variant="warning" dot>Maintenance</Badge>;
    return <Badge variant="default" dot>Idle</Badge>;
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Machines"
        description="Monitor runtime diagnostic telemetry, vibration alerts, temperature status, and maintenance planners."
        breadcrumbs={[
          { label: "Manufacturing", href: "/manufacturing/dashboard" },
          { label: "Machines" },
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
        <div className="flex items-center gap-3 w-full sm:w-auto sm:flex-1 sm:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search machinery…"
              className="w-full pl-9 pr-4 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white placeholder:text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-card/60 border border-border/40 rounded-xl text-xs text-white outline-none focus:border-primary/50 transition-all cursor-pointer"
          >
            <option value="all" className="bg-navy-100">All Status</option>
            <option value="running" className="bg-navy-100">Running</option>
            <option value="maintenance" className="bg-navy-100">Maintenance</option>
            <option value="idle" className="bg-navy-100">Idle</option>
          </select>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => exportCsv("machines", filtered, [["id","Machine ID"],["name","Name"],["line","Line"],["status","Status"],["uptime","Uptime %"],["temperature","Temperature"],["lastMaintenance","Last Maintenance"],["nextMaintenance","Next Maintenance"],["operator","Operator"],["hoursToday","Hours Today"]])} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all">
            <Download className="w-3.5 h-3.5" />
            Export Logs
          </button>
          <button onClick={() => setModal("create")} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-all">
            <Plus className="w-3.5 h-3.5" />
            Register Asset
          </button>
        </div>
      </div>

      {/* Grid of Machine Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
        {filtered.map((machine, i) => (
          <div
            key={machine.id}
            className="bg-card/85 backdrop-blur-sm border border-border/40 rounded-2xl p-5 space-y-4 hover:border-border/60 transition-all duration-300 flex flex-col justify-between"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            {/* Header: Name + Badge */}
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-sm font-semibold text-white">{machine.name}</h3>
                <p className="text-[11px] text-muted mt-0.5">{machine.line}</p>
              </div>
              <div className="flex items-center gap-1.5">
                {getStatusBadge(machine.status)}
                {machine.dbId !== undefined && (
                  <>
                    <button onClick={() => setModal(machine)} className="p-1 text-muted hover:text-primary transition-colors" title="Edit">
                      <Pencil className="w-3.5 h-3.5" />
                    </button>
                    <button onClick={() => removeMachine(machine)} className="p-1 text-muted hover:text-danger transition-colors" title="Delete">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Diagnostics Stats */}
            <div className="grid grid-cols-2 gap-3 py-1.5 border-y border-border/10">
              <div className="flex items-center gap-2">
                <Gauge className="w-4 h-4 text-primary shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">
                    {machine.status === "maintenance" ? "—" : `${machine.uptime}%`}
                  </p>
                  <p className="text-[10px] text-muted">Uptime Rate</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Thermometer className="w-4 h-4 text-warning shrink-0" />
                <div>
                  <p className="text-xs font-bold text-white">{machine.temperature}</p>
                  <p className="text-[10px] text-muted">Temperature</p>
                </div>
              </div>
            </div>

            {/* Extra details */}
            <div className="space-y-2 text-[11px] text-muted">
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <User className="w-3 h-3 text-muted/65" />
                  Operator
                </span>
                <span className="text-white font-medium">{machine.operator}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Clock className="w-3 h-3 text-muted/65" />
                  Hours Logged Today
                </span>
                <span className="text-white font-medium">{machine.hoursToday} hrs</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Wrench className="w-3 h-3 text-muted/65" />
                  Last Serviced
                </span>
                <span>{machine.lastMaintenance}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <Calendar className="w-3 h-3 text-muted/65" />
                  Next Service Due
                </span>
                <span className={cn(machine.status === "maintenance" ? "text-warning" : "")}>
                  {machine.nextMaintenance}
                </span>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="col-span-full bg-card/30 border border-border/20 rounded-2xl p-8 text-center text-xs text-muted">
            No machines matching the filter settings found.
          </div>
        )}
      </div>

      {modal && (
        <RecordModal
          title={modal === "create" ? "Register Asset" : `Edit ${modal.name}`}
          fields={MACHINE_FIELDS}
          initial={
            modal === "create"
              ? {}
              : {
                  name: modal.name, line: modal.line, status: modal.status,
                  uptime: String(modal.uptime), temperature: modal.temperature,
                  lastMaintenance: modal.isoLast ?? "", nextMaintenance: modal.isoNext ?? "",
                  operator: modal.operator, hoursToday: String(modal.hoursToday),
                }
          }
          submitLabel={modal === "create" ? "Register" : "Save Changes"}
          onSubmit={saveMachine}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
