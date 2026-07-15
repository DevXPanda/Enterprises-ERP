"use client";

import {
  BarChart, Bar, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from "recharts";
import {
  Factory, Activity, Cog, Gauge, ShieldCheck, ClipboardList, Zap,
  TrendingUp, TrendingDown, Minus, AlertTriangle, CheckCircle2, Info, Clock,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ChartCard } from "@/components/dashboard/chart-card";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";
import {
  mfgDashboardKpis, productionByLine, oeeTrend, mfgMachines,
  productionLines, qcAlerts, shiftSummary,
  type MfgKpi, type QcAlertItem, type ShiftSummary as ShiftType,
  type MfgMachine, type ProductionLineRow,
} from "@/data/manufacturing-data";
import { useApi } from "@/hooks/use-api";

interface MfgDashboardData {
  kpis: MfgKpi[];
  productionByLine: typeof productionByLine;
  oeeTrend: typeof oeeTrend;
  machines: MfgMachine[];
  productionLines: ProductionLineRow[];
  qcAlerts: QcAlertItem[];
  shiftSummary: ShiftType[];
}

/* ---- Icon map ---- */
const iconMap: Record<string, React.ReactNode> = {
  Factory: <Factory className="w-4 h-4" />, Activity: <Activity className="w-4 h-4" />,
  Cog: <Cog className="w-4 h-4" />, Gauge: <Gauge className="w-4 h-4" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4" />, ClipboardList: <ClipboardList className="w-4 h-4" />,
};

/* ---- KPI Card ---- */
function MfgKpiCard({ data, index }: { data: MfgKpi; index: number }) {
  const colorMap: Record<string, string> = {
    blue: "bg-primary/10 text-primary", green: "bg-success/10 text-success",
    purple: "bg-purple/10 text-purple", orange: "bg-warning/10 text-warning",
    red: "bg-danger/10 text-danger",
  };
  const isPos = data.change !== undefined && data.change > 0;
  const isNeg = data.change !== undefined && data.change < 0;
  return (
    <div className="bg-card/60 border border-border/30 rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
      <div className={cn("p-2 rounded-lg shrink-0", colorMap[data.color] || colorMap.blue)}>
        {iconMap[data.icon] ?? <Factory className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-lg font-bold text-white tracking-tight leading-tight">{data.value}</p>
        <p className="text-[11px] text-muted truncate">{data.label}</p>
      </div>
      {data.change !== undefined && (
        <div className={cn("flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0",
          isPos && "text-success bg-success/10", isNeg && "text-danger bg-danger/10",
          !isPos && !isNeg && "text-muted bg-muted/10"
        )}>
          {isPos ? <TrendingUp className="w-2.5 h-2.5" /> : isNeg ? <TrendingDown className="w-2.5 h-2.5" /> : <Minus className="w-2.5 h-2.5" />}
          {Math.abs(data.change)}%
        </div>
      )}
    </div>
  );
}

/* ---- Tooltip ---- */
function CustomTooltip({ active, payload, label }: { active?: boolean; payload?: Array<{ value: number; name: string; color: string }>; label?: string }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-navy-100 border border-border/50 rounded-lg px-3 py-2">
      <p className="text-xs font-medium text-white mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-[11px] text-muted"><span style={{ color: p.color }}>●</span> {p.name}: {p.value.toLocaleString("en-IN")}</p>
      ))}
    </div>
  );
}

/* ---- Severity Icon ---- */
function SeverityIcon({ severity }: { severity: QcAlertItem["severity"] }) {
  if (severity === "critical") return <AlertTriangle className="w-3.5 h-3.5 text-danger" />;
  if (severity === "warning") return <Info className="w-3.5 h-3.5 text-warning" />;
  return <CheckCircle2 className="w-3.5 h-3.5 text-success" />;
}

/* ================================================================== */
/*  MANUFACTURING DASHBOARD                                            */
/* ================================================================== */

export default function ManufacturingDashboardPage() {
  const live = useApi<MfgDashboardData>("/manufacturing/dashboard");
  const kpis = live?.kpis ?? mfgDashboardKpis;
  const byLine = live?.productionByLine ?? productionByLine;
  const oee = live?.oeeTrend ?? oeeTrend;
  const machines = live?.machines ?? mfgMachines;
  const lines = live?.productionLines ?? productionLines;
  const alerts = live?.qcAlerts ?? qcAlerts;
  const shifts = live?.shiftSummary ?? shiftSummary;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Manufacturing Dashboard"
        description="Real-time overview of production lines, machine performance, and quality metrics."
        breadcrumbs={[{ label: "Manufacturing" }, { label: "Dashboard" }]}
      />

      {/* KPI Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => <MfgKpiCard key={kpi.id} data={kpi} index={i} />)}
      </div>

      {/* Row 1: Production by Line + OEE Trend + Machine Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <ChartCard title="Production by Line" subtitle="Today — bags produced vs target">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={byLine} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f20" />
                <XAxis dataKey="line" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="produced" name="Produced" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Target" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="OEE Trend" subtitle="Last 7 days — % effectiveness">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={oee}>
                <defs>
                  <linearGradient id="oeeGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f20" />
                <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[70, 100]} tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="oee" name="OEE" stroke="#2563EB" strokeWidth={2} fill="url(#oeeGrad)" />
                <Area type="monotone" dataKey="target" name="Target" stroke="#8B5CF6" strokeWidth={1.5} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Machine Status Table */}
        <div className="glass-card animate-fade-in">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Machine Status</h3>
              <p className="text-xs text-muted mt-0.5">Current shift — live</p>
            </div>
            <Badge variant="success" dot>{machines.filter(m => m.status === "running").length} Running</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t border-border/20">
                  <th className="px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted/70 text-left">Machine</th>
                  <th className="px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted/70 text-left">Status</th>
                  <th className="px-5 py-2 text-[11px] font-semibold uppercase tracking-wider text-muted/70 text-right">Uptime</th>
                </tr>
              </thead>
              <tbody>
                {machines.slice(0, 6).map(m => (
                  <tr key={m.id} className="border-t border-border/10 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-2.5 text-xs font-medium text-white">{m.name}</td>
                    <td className="px-5 py-2.5">
                      <Badge variant={m.status === "running" ? "success" : m.status === "maintenance" ? "warning" : "default"} dot>
                        {m.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-2.5 text-xs text-right">
                      <span className={m.status === "running" ? "text-success" : m.status === "maintenance" ? "text-warning" : "text-muted"}>
                        {m.status === "maintenance" ? "—" : `${m.uptime}%`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Row 2: Production Lines + QC Alerts + Shift Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Production Lines */}
        <div className="glass-card animate-fade-in">
          <div className="px-5 pt-5 pb-3">
            <h3 className="text-sm font-semibold text-white">Production Lines</h3>
            <p className="text-xs text-muted mt-0.5">Today's line-wise output</p>
          </div>
          <div className="px-5 pb-4 space-y-3">
            {lines.map(line => {
              const pct = Math.round((line.produced / line.target) * 100);
              return (
                <div key={line.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-white">{line.name}</span>
                      <span className="text-[10px] text-muted">· {line.product}</span>
                    </div>
                    <Badge variant={line.status === "running" ? "success" : "default"} dot>{line.status}</Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-navy-300/30 rounded-full overflow-hidden">
                      <div className={cn("h-full rounded-full transition-all", pct >= 90 ? "bg-success" : pct >= 75 ? "bg-primary" : "bg-warning")} style={{ width: `${Math.min(pct, 100)}%` }} />
                    </div>
                    <span className="text-[10px] text-muted w-20 text-right">{line.produced.toLocaleString()}/{line.target.toLocaleString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* QC Alerts */}
        <div className="glass-card animate-fade-in">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Recent QC Alerts</h3>
              <p className="text-xs text-muted mt-0.5">Quality control issues</p>
            </div>
            <Badge variant="danger">{alerts.filter(a => a.severity === "critical").length} critical</Badge>
          </div>
          <div className="px-5 pb-4 space-y-2">
            {alerts.map(alert => (
              <div key={alert.id} className="flex items-start gap-3 p-2.5 rounded-xl border border-border/20 hover:border-border/40 hover:bg-white/[0.02] transition-all">
                <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0",
                  alert.severity === "critical" ? "bg-danger/10" : alert.severity === "warning" ? "bg-warning/10" : "bg-primary/10"
                )}>
                  <SeverityIcon severity={alert.severity} />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white">{alert.issue}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className="text-[10px] text-muted">{alert.line}</span>
                    <span className="text-[10px] text-muted">· {alert.batch}</span>
                    <span className="text-[10px] text-muted/50 ml-auto">{alert.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Shift Summary */}
        <div className="glass-card animate-fade-in">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Shift Summary</h3>
              <p className="text-xs text-muted mt-0.5">Today's shift breakdown</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs text-warning bg-warning/10 px-2 py-1 rounded-lg border border-warning/10">
              <Zap className="w-3 h-3" /> Shift 2 Active
            </span>
          </div>
          <div className="px-5 pb-4 space-y-3">
            {shifts.map(s => (
              <div key={s.shift} className={cn("p-3 rounded-xl border transition-all",
                s.status === "active" ? "border-primary/30 bg-primary/5" : "border-border/20 bg-white/[0.01]"
              )}>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-semibold text-white">{s.shift}</span>
                    <Badge variant={s.status === "active" ? "success" : s.status === "completed" ? "default" : "warning"} dot>
                      {s.status}
                    </Badge>
                  </div>
                  <span className="text-[10px] text-muted">{s.time}</span>
                </div>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <p className="text-xs font-bold text-white">{s.production > 0 ? s.production.toLocaleString() : "—"}</p>
                    <p className="text-[10px] text-muted">Production</p>
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white">{s.operators}</p>
                    <p className="text-[10px] text-muted">Operators</p>
                  </div>
                  <div>
                    <p className={cn("text-xs font-bold", s.efficiency >= 90 ? "text-success" : s.efficiency > 0 ? "text-warning" : "text-muted")}>
                      {s.efficiency > 0 ? `${s.efficiency}%` : "—"}
                    </p>
                    <p className="text-[10px] text-muted">Efficiency</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
