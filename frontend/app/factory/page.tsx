"use client";

// ============================================================
//  Factory Dashboard
//  Top-level overview of all factory operations.
//  Static data only — no backend connection.
// ============================================================

import {
  Users2,
  UserCheck,
  ScanLine,
  PackagePlus,
  PackageMinus,
  ClipboardList,
  Cog,
  FlaskConical,
  Truck,
  TrendingUp,
  TrendingDown,
  Minus,
  FileCheck,
  UserPlus,
  ArrowUpRight,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Info,
  Building2,
  Zap,
} from "lucide-react";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ChartCard } from "@/components/dashboard/chart-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  factoryKpiData,
  attendanceTrend,
  gateEntriesByType,
  recentActivity,
  quickActions,
  factoryMachineStatus,
  announcements,
  type FactoryKpi,
  type ActivityItem,
  type QuickAction,
  type AnnouncementItem,
  type FactoryMachineStatus,
} from "@/data/factory-data";
import { useApi } from "@/hooks/use-api";

interface FactoryDashboardData {
  kpis: FactoryKpi[];
  attendanceTrend: typeof attendanceTrend;
  gateEntriesByType: typeof gateEntriesByType;
  recentActivity: ActivityItem[];
  machineStatus: FactoryMachineStatus[];
  announcements: AnnouncementItem[];
}

/* ------------------------------------------------------------------ */
// Icon resolver
/* ------------------------------------------------------------------ */

const iconMap: Record<string, React.ReactNode> = {
  Users2: <Users2 className="w-4 h-4" />,
  UserCheck: <UserCheck className="w-4 h-4" />,
  ScanLine: <ScanLine className="w-4 h-4" />,
  PackagePlus: <PackagePlus className="w-4 h-4" />,
  PackageMinus: <PackageMinus className="w-4 h-4" />,
  ClipboardList: <ClipboardList className="w-4 h-4" />,
  Cog: <Cog className="w-4 h-4" />,
  FlaskConical: <FlaskConical className="w-4 h-4" />,
  Truck: <Truck className="w-4 h-4" />,
  FileCheck: <FileCheck className="w-4 h-4" />,
  UserPlus: <UserPlus className="w-4 h-4" />,
};

const quickIconMap: Record<string, React.ReactNode> = {
  FileCheck: <FileCheck className="w-5 h-5" />,
  UserPlus: <UserPlus className="w-5 h-5" />,
  PackagePlus: <PackagePlus className="w-5 h-5" />,
  ClipboardList: <ClipboardList className="w-5 h-5" />,
  FlaskConical: <FlaskConical className="w-5 h-5" />,
  Truck: <Truck className="w-5 h-5" />,
};

const colorClasses: Record<
  string,
  { icon: string; glow: string }
> = {
  blue: { icon: "bg-primary/10 text-primary", glow: "" },
  green: { icon: "bg-success/10 text-success", glow: "" },
  orange: { icon: "bg-warning/10 text-warning", glow: "" },
  purple: { icon: "bg-purple/10 text-purple", glow: "" },
  red: { icon: "bg-danger/10 text-danger", glow: "" },
};

const quickColorClasses: Record<string, string> = {
  blue: "bg-primary/10 text-primary border-primary/20 hover:border-primary/40",
  green: "bg-success/10 text-success border-success/20 hover:border-success/40",
  purple: "bg-purple/10 text-purple border-purple/20 hover:border-purple/40",
  orange: "bg-warning/10 text-warning border-warning/20 hover:border-warning/40",
};

/* ------------------------------------------------------------------ */
// Custom Tooltip
/* ------------------------------------------------------------------ */

function CustomTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: Array<{ value: number; name: string; color: string }>;
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-navy-100 border border-border/50 rounded-lg px-3 py-2">
      <p className="text-xs font-medium text-white mb-1">{label}</p>
      {payload.map((p, i) => (
        <p key={i} className="text-[11px] text-muted">
          <span style={{ color: p.color }}>●</span> {p.name}:{" "}
          {p.value.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
// Compact KPI Card
/* ------------------------------------------------------------------ */

function FactoryKpiCard({
  data,
  index,
}: {
  data: FactoryKpi;
  index: number;
}) {
  const colors = colorClasses[data.color] || colorClasses.blue;
  const isPositive = data.change !== undefined && data.change > 0;
  const isNegative = data.change !== undefined && data.change < 0;

  return (
    <div
      className="bg-card/60 border border-border/30 rounded-xl px-3 py-2.5 flex items-center gap-2.5 animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      {/* Icon */}
      <div className={cn("p-1.5 rounded-lg shrink-0", colors.icon)}>
        {iconMap[data.icon] ?? <Building2 className="w-4 h-4" />}
      </div>

      {/* Value + Label */}
      <div className="flex-1 min-w-0">
        <p className="text-base font-bold text-white tracking-tight leading-tight">
          {data.value}
        </p>
        <p className="text-[10px] text-muted truncate">{data.label}</p>
      </div>

      {/* Change badge */}
      {data.change !== undefined && (
        <div
          className={cn(
            "flex items-center gap-0.5 text-[9px] font-semibold px-1.5 py-0.5 rounded-md shrink-0",
            isPositive && "text-success bg-success/10",
            isNegative && "text-danger bg-danger/10",
            !isPositive && !isNegative && "text-muted bg-muted/10"
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-2 h-2" />
          ) : isNegative ? (
            <TrendingDown className="w-2 h-2" />
          ) : (
            <Minus className="w-2 h-2" />
          )}
          {Math.abs(data.change)}%
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------ */
// Activity Icon
/* ------------------------------------------------------------------ */

function ActivityIcon({ type }: { type: ActivityItem["type"] }) {
  const config: Record<
    ActivityItem["type"],
    { icon: React.ReactNode; bg: string; color: string }
  > = {
    entry: {
      icon: <UserPlus className="w-3.5 h-3.5" />,
      bg: "bg-success/10",
      color: "text-success",
    },
    exit: {
      icon: <ArrowUpRight className="w-3.5 h-3.5" />,
      bg: "bg-muted/10",
      color: "text-muted",
    },
    material: {
      icon: <PackagePlus className="w-3.5 h-3.5" />,
      bg: "bg-primary/10",
      color: "text-primary",
    },
    alert: {
      icon: <AlertTriangle className="w-3.5 h-3.5" />,
      bg: "bg-danger/10",
      color: "text-danger",
    },
    approval: {
      icon: <FileCheck className="w-3.5 h-3.5" />,
      bg: "bg-warning/10",
      color: "text-warning",
    },
    production: {
      icon: <Cog className="w-3.5 h-3.5" />,
      bg: "bg-purple/10",
      color: "text-purple",
    },
  };
  const c = config[type] ?? config.entry;
  return (
    <div className={cn("w-7 h-7 rounded-lg flex items-center justify-center shrink-0", c.bg, c.color)}>
      {c.icon}
    </div>
  );
}

function machineStatusBadge(status: FactoryMachineStatus["status"]) {
  if (status === "running")
    return <Badge variant="success" dot>Running</Badge>;
  if (status === "maintenance")
    return <Badge variant="warning" dot>Maintenance</Badge>;
  return <Badge variant="default" dot>Idle</Badge>;
}

function AnnouncementIcon({ priority }: { priority: AnnouncementItem["priority"] }) {
  if (priority === "high")
    return <AlertTriangle className="w-4 h-4 text-danger shrink-0" />;
  if (priority === "medium")
    return <Info className="w-4 h-4 text-warning shrink-0" />;
  return <CheckCircle2 className="w-4 h-4 text-success shrink-0" />;
}

/* ================================================================== */
// FACTORY DASHBOARD PAGE
/* ================================================================== */

export default function FactoryDashboardPage() {
  const live = useApi<FactoryDashboardData>("/factory/dashboard");
  const kpis = live?.kpis ?? factoryKpiData;
  const attTrend = live?.attendanceTrend ?? attendanceTrend;
  const gateEntries = live?.gateEntriesByType ?? gateEntriesByType;
  const activity = live?.recentActivity ?? recentActivity;
  const machines = live?.machineStatus ?? factoryMachineStatus;
  const notices = live?.announcements ?? announcements;

  return (
    <div className="space-y-5">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <Building2 className="w-5 h-5 text-primary" />
            <span className="text-xs font-semibold uppercase tracking-wider text-primary">
              Factory Module
            </span>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">
            Factory Dashboard
          </h1>
          <p className="text-sm text-muted mt-1">
            Real-time overview of factory operations — access, production, quality &amp; dispatch
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span
            className="flex items-center gap-1.5 text-xs text-success bg-success/10 px-3 py-1.5 rounded-lg border border-success/10"
            role="status"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-soft" />
            Factory Online
          </span>
          <span className="flex items-center gap-1.5 text-xs text-warning bg-warning/10 px-3 py-1.5 rounded-lg border border-warning/10">
            <Zap className="w-3 h-3" />
            Shift 2 Active
          </span>
        </div>
      </div>

      {/* KPI Cards Row — 9 cards in one line on desktop */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-9 gap-3">
        {kpis.map((kpi, i) => (
          <FactoryKpiCard key={kpi.id} data={kpi} index={i} />
        ))}
      </div>

      {/* Row 1: Attendance Trend + Gate Entries by Type + Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <ChartCard
          title="Attendance Trend"
          subtitle="Present vs Absent — last 7 days"
          action={
            <span className="text-[10px] text-muted bg-card px-2 py-1 rounded-md border border-border/20">
              This Week
            </span>
          }
        >
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={attTrend}>
                <defs>
                  <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#22C55E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22C55E" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="absentGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EF4444" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#EF4444" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f20" />
                <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="present" name="Present" stroke="#22C55E" strokeWidth={2} fill="url(#presentGrad)" />
                <Area type="monotone" dataKey="absent" name="Absent" stroke="#EF4444" strokeWidth={2} fill="url(#absentGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Gate Entries by Type"
          subtitle="Today's breakdown"
        >
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={gateEntries} layout="vertical" barSize={10}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f20" horizontal={false} />
                <XAxis type="number" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis dataKey="type" type="category" tick={{ fill: "#94A3B8", fontSize: 9 }} axisLine={false} tickLine={false} width={68} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="count" name="Entries" fill="#2563EB" radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Quick Actions */}
        <div className="glass-card animate-fade-in p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Quick Actions</h3>
            <p className="text-xs text-muted mt-0.5">Common factory tasks</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 my-3">
            {quickActions.slice(0, 4).map((action) => (
              <a
                key={action.id}
                href={action.href}
                className={cn(
                  "flex flex-col gap-1.5 p-2.5 rounded-xl border transition-all duration-200 hover:scale-[1.01]",
                  quickColorClasses[action.color]
                )}
              >
                <div>{quickIconMap[action.icon]}</div>
                <div>
                  <p className="text-[11px] font-semibold text-white leading-tight">{action.label}</p>
                  <p className="text-[9px] text-muted/80 mt-0.5 leading-tight line-clamp-1">{action.description}</p>
                </div>
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Row 2: Recent Activity + Machine Status + Announcements */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Recent Activity */}
        <div className="glass-card animate-fade-in">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between border-b border-border/10">
            <div>
              <h3 className="text-sm font-semibold text-white">Recent Activity</h3>
              <p className="text-xs text-muted mt-0.5">Live factory events</p>
            </div>
            <span className="flex items-center gap-1 text-[10px] text-success bg-success/10 px-2 py-1 rounded-md border border-success/10">
              <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-soft" />
              Live
            </span>
          </div>
          <div className="px-5 py-3 space-y-2 max-h-[220px] overflow-y-auto">
            {activity.map((item) => (
              <div key={item.id} className="flex items-start gap-3 py-2 border-b border-border/10 last:border-0">
                <ActivityIcon type={item.type} />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white">{item.title}</p>
                  <p className="text-[10px] text-muted mt-0.5 line-clamp-1">{item.description}</p>
                  <div className="flex items-center gap-1 mt-1 text-muted/50">
                    <Clock className="w-2.5 h-2.5" />
                    <span className="text-[9px]">{item.time}</span>
                    <span className="text-[9px] ml-1">· {item.user}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Machine Status */}
        <div className="glass-card animate-fade-in">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Machine Status</h3>
              <p className="text-xs text-muted mt-0.5">Current shift — live status</p>
            </div>
            <Badge variant="success" dot>
              {machines.filter((m) => m.status === "running").length} Running
            </Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t border-border/20">
                  <th className="px-5 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted/70 text-left">Machine</th>
                  <th className="px-5 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted/70 text-left">Line</th>
                  <th className="px-5 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted/70 text-right">Uptime</th>
                </tr>
              </thead>
              <tbody>
                {machines.slice(0, 5).map((m) => (
                  <tr key={m.id} className="border-t border-border/10 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-2 text-xs font-medium text-white">{m.name}</td>
                    <td className="px-5 py-2 text-xs text-muted">{m.line}</td>
                    <td className="px-5 py-2 text-right">
                      <span className={m.status === "running" ? "text-success text-xs font-semibold" : m.status === "maintenance" ? "text-warning text-xs font-semibold" : "text-muted text-xs"}>
                        {m.status === "maintenance" ? "Maint." : `${m.uptime}%`}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Announcements */}
        <div className="glass-card animate-fade-in">
          <div className="px-5 pt-5 pb-3 border-b border-border/10">
            <h3 className="text-sm font-semibold text-white">Announcements</h3>
            <p className="text-xs text-muted mt-0.5">Factory notices &amp; updates</p>
          </div>
          <div className="px-5 py-3 space-y-2.5 max-h-[220px] overflow-y-auto">
            {notices.map((ann) => (
              <div
                key={ann.id}
                className="flex items-start gap-2.5 p-2.5 rounded-xl border border-border/20 hover:border-border/40 hover:bg-white/[0.02] transition-all"
              >
                <AnnouncementIcon priority={ann.priority} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5 flex-wrap">
                    <p className="text-xs font-medium text-white">{ann.title}</p>
                    <Badge
                      variant={ann.priority === "high" ? "danger" : ann.priority === "medium" ? "warning" : "success"}
                    >
                      {ann.priority}
                    </Badge>
                  </div>
                  <p className="text-[10px] text-muted mt-1 line-clamp-2 leading-normal">{ann.body}</p>
                  <p className="text-[9px] text-muted/50 mt-1">
                    {ann.date} · {ann.author}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
