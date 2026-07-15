"use client";

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
} from "recharts";
import {
  Users,
  IndianRupee,
  DollarSign,
  FileCheck,
  CalendarCheck,
  Clock,
  TrendingUp,
  TrendingDown,
  Minus,
  Zap,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { ChartCard } from "@/components/dashboard/chart-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  wagesDashboardKpis,
  wageCostTrend,
  deptAttendance,
  shiftCostBreakdown,
  recentPayouts,
  pendingWageApprovals,
  type WagesKpi,
} from "@/data/wages-data";
import { useApi } from "@/hooks/use-api";

interface WagesDashboardData {
  kpis: WagesKpi[];
  wageCostTrend: typeof wageCostTrend;
  deptAttendance: typeof deptAttendance;
  shiftCostBreakdown: typeof shiftCostBreakdown;
  recentPayouts: typeof recentPayouts;
  pendingWageApprovals: typeof pendingWageApprovals;
}

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users className="w-4 h-4" />,
  IndianRupee: <IndianRupee className="w-4 h-4" />,
  DollarSign: <DollarSign className="w-4 h-4" />,
  FileCheck: <FileCheck className="w-4 h-4" />,
  CalendarCheck: <CalendarCheck className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
};

function KpiCard({ data, index }: { data: WagesKpi; index: number }) {
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
        {iconMap[data.icon] ?? <Users className="w-4 h-4" />}
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

export default function WagesDashboardPage() {
  const live = useApi<WagesDashboardData>("/wages/dashboard");
  const kpis = live?.kpis ?? wagesDashboardKpis;
  const costTrend = live?.wageCostTrend ?? wageCostTrend;
  const deptAtt = live?.deptAttendance ?? deptAttendance;
  const shiftCosts = live?.shiftCostBreakdown ?? shiftCostBreakdown;
  const payouts = live?.recentPayouts ?? recentPayouts;
  const approvals = live?.pendingWageApprovals ?? pendingWageApprovals;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Wages Dashboard"
        description="Comprehensive labor wage costs, overtime trackers, and shift payroll metrics."
        breadcrumbs={[
          { label: "Wages", href: "/wages/dashboard" },
          { label: "Dashboard" },
        ]}
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.id} data={kpi} index={i} />
        ))}
      </div>

      {/* Row 1: Wage Cost Trend + Attendance by Department + Shift Cost Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Wage Cost Trend */}
        <ChartCard title="Daily Wage Cost Trend" subtitle="Daily labor cost variance (₹ Thousands)">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={costTrend}>
                <defs>
                  <linearGradient id="wageGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f20" />
                <XAxis dataKey="day" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="cost" name="Wage Cost (k)" stroke="#2563EB" strokeWidth={2} fill="url(#wageGrad)" />
                <Area type="monotone" dataKey="target" name="Budget Cap" stroke="#8B5CF6" strokeWidth={1.5} strokeDasharray="5 5" fill="transparent" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Attendance by Dept */}
        <ChartCard title="Attendance by Department" subtitle="Active headcount presence vs total roster">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={deptAtt} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f20" />
                <XAxis dataKey="department" tick={{ fill: "#94A3B8", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="present" name="Present" fill="#22C55E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="total" name="Total Roster" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Shift Cost Breakdown */}
        <div className="glass-card animate-fade-in p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Shift Cost Breakdown</h3>
            <p className="text-xs text-muted mt-0.5">Shift cost distribution</p>
          </div>
          <div className="space-y-3.5 my-3">
            {shiftCosts.map((item, idx) => (
              <div key={idx} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted truncate">{item.shift}</span>
                  <span className="text-white font-semibold">₹{item.cost.toLocaleString()}</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-navy-300/30 rounded-full overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{ width: `${item.percentage}%`, backgroundColor: item.color }}
                    />
                  </div>
                  <span className="text-[10px] text-muted w-8 text-right">{item.percentage}%</span>
                </div>
              </div>
            ))}
          </div>
          <div className="border-t border-border/10 pt-2.5 flex items-center justify-between">
            <span className="text-[10px] text-muted flex items-center gap-1">
              <Zap className="w-3 h-3 text-warning" /> Shift B Currently Active
            </span>
            <span className="text-xs font-bold text-white">
              Total: ₹{(shiftCosts.reduce((acc, curr) => acc + curr.cost, 0)).toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      {/* Row 2: Recent Payouts + Pending Wage Approvals + Daily Summary Announcement */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Recent Payouts */}
        <div className="glass-card animate-fade-in">
          <div className="px-5 pt-5 pb-3">
            <h3 className="text-sm font-semibold text-white">Recent Payout Logs</h3>
            <p className="text-xs text-muted mt-0.5">Workforce wage payouts status</p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t border-border/20">
                  <th className="px-5 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted/70 text-left">Worker</th>
                  <th className="px-5 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted/70 text-left">Amount</th>
                  <th className="px-5 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted/70 text-right">Status</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((row) => (
                  <tr key={row.id} className="border-t border-border/10 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-2.5">
                      <p className="text-xs font-medium text-white">{row.workerName}</p>
                      <p className="text-[9px] text-muted">{row.department} · {row.type}</p>
                    </td>
                    <td className="px-5 py-2.5 text-xs text-white">₹{row.amount}</td>
                    <td className="px-5 py-2.5 text-right">
                      <Badge variant={row.status === "paid" ? "success" : row.status === "processing" ? "warning" : "danger"} dot>
                        {row.status}
                      </Badge>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Approvals */}
        <div className="glass-card animate-fade-in">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-semibold text-white">Timesheet Approvals</h3>
              <p className="text-xs text-muted mt-0.5">Pending supervisor verification</p>
            </div>
            <Badge variant="warning">{approvals.length} pending</Badge>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-t border-border/20">
                  <th className="px-5 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted/70 text-left">Worker</th>
                  <th className="px-5 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted/70 text-left">OT / Regular</th>
                  <th className="px-5 py-2 text-[10px] font-semibold uppercase tracking-wider text-muted/70 text-right">Wages</th>
                </tr>
              </thead>
              <tbody>
                {approvals.map((row) => (
                  <tr key={row.id} className="border-t border-border/10 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-2.5">
                      <p className="text-xs font-medium text-white">{row.workerName}</p>
                      <p className="text-[9px] text-muted">{row.department} · {row.shift}</p>
                    </td>
                    <td className="px-5 py-2.5 text-xs text-muted">
                      {row.regularHours}h reg / {row.otHours > 0 ? `${row.otHours}h OT` : "No OT"}
                    </td>
                    <td className="px-5 py-2.5 text-xs text-right font-semibold text-white">
                      ₹{row.amount}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Wage Audit Alerts */}
        <div className="glass-card animate-fade-in p-5 flex flex-col justify-between">
          <div>
            <h3 className="text-sm font-semibold text-white">Daily Wage Audit Logs</h3>
            <p className="text-xs text-muted mt-0.5">Important alerts regarding labor accounts</p>
          </div>
          <div className="space-y-3 my-2 flex-1">
            <div className="p-2.5 rounded-xl border border-border/20 bg-white/[0.01] flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-danger mt-1.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-white">Bank Account Mismatch</p>
                <p className="text-[10px] text-muted">Amit Verma (Dispatch) transfer hold due to invalid account digits.</p>
              </div>
            </div>
            <div className="p-2.5 rounded-xl border border-border/20 bg-white/[0.01] flex items-start gap-2.5">
              <span className="w-1.5 h-1.5 rounded-full bg-warning mt-1.5 shrink-0" />
              <div>
                <p className="text-xs font-medium text-white">Timesheet Variance Detected</p>
                <p className="text-[10px] text-muted">Dinesh Prasad clocked 4.0h OT. Packing Line target exceeded by 10%.</p>
              </div>
            </div>
          </div>
          <button className="w-full py-2 bg-navy-300/40 hover:bg-navy-300/60 border border-border/30 rounded-xl text-xs font-medium text-white transition-all">
            Review Timesheet Audit Logs
          </button>
        </div>
      </div>
    </div>
  );
}
