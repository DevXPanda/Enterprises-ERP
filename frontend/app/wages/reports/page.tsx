"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  FileText,
  IndianRupee,
  TrendingUp,
  Timer,
  Sparkles,
  Download,
  Filter,
  Calendar,
  Clock,
  ShieldAlert,
  TrendingDown,
  Minus,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { ChartCard } from "@/components/dashboard/chart-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  wagesReportsKpis,
  monthlyWageReport,
  overtimeTrend,
  categoryCost,
  type WagesKpi,
} from "@/data/wages-data";

const iconMap: Record<string, React.ReactNode> = {
  FileText: <FileText className="w-4 h-4" />,
  TrendingUp: <TrendingUp className="w-4 h-4" />,
  IndianRupee: <IndianRupee className="w-4 h-4" />,
  Timer: <Timer className="w-4 h-4" />,
  Sparkles: <Sparkles className="w-4 h-4" />,
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
        {iconMap[data.icon] ?? <FileText className="w-4 h-4" />}
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

export default function WagesReportsPage() {
  const [timeRange, setTimeRange] = useState("6m");

  return (
    <div className="space-y-5">
      <PageHeader
        title="Wages & Financial Reports"
        description="Extract regulatory wage audit dossiers, verify overtime costs, and check category disbursements."
        breadcrumbs={[
          { label: "Wages", href: "/wages/dashboard" },
          { label: "Reports" },
        ]}
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {wagesReportsKpis.map((kpi, i) => (
          <KpiCard key={kpi.id} data={kpi} index={i} />
        ))}
      </div>

      {/* Filter / Export Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
        <div className="flex items-center gap-3 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40">
            <Calendar className="w-3.5 h-3.5" />
            <span>Timeframe:</span>
          </div>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 bg-card/60 border border-border/40 rounded-xl text-xs text-white outline-none focus:border-primary/50 cursor-pointer"
          >
            <option value="1m" className="bg-navy-100">Last 30 Days</option>
            <option value="6m" className="bg-navy-100">Last 6 Months</option>
            <option value="1y" className="bg-navy-100">Last Year</option>
          </select>
        </div>
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all">
            <Filter className="w-3.5 h-3.5" />
            Filter Data
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-all">
            <Download className="w-3.5 h-3.5" />
            Export Wages Dossier
          </button>
        </div>
      </div>

      {/* Row 1: Monthly Wage Expense + Overtime Trend + Cost by Category */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Monthly Wage Expense */}
        <ChartCard title="Monthly Wage Expense" subtitle="Total payout cost vs monthly targets (₹ Lakhs)">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyWageReport} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f20" />
                <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10, color: "#94A3B8" }} />
                <Bar dataKey="cost" name="Actual Cost" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Target Cap" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Overtime Trend */}
        <ChartCard title="Overtime Expense Trend" subtitle="Monthly OT hours vs total cost (₹ Thousands)">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={overtimeTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f20" />
                <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="left" tick={{ fill: "#94A3B8", fontSize: 9 }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="right" orientation="right" tick={{ fill: "#94A3B8", fontSize: 9 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Line yAxisId="left" type="monotone" dataKey="overtimeHours" name="OT Hours" stroke="#8b5cf6" strokeWidth={2} dot={{ r: 3 }} />
                <Line yAxisId="right" type="monotone" dataKey="cost" name="OT Cost" stroke="#22c55e" strokeWidth={2} dot={{ r: 3 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Cost Category breakdown */}
        <ChartCard title="Labor Cost Distribution" subtitle="Distribution by worker category (₹)">
          <div className="h-[200px] flex items-center justify-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={categoryCost}
                    dataKey="cost"
                    nameKey="category"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                  >
                    {categoryCost.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-2 pl-2 text-[10px]">
              {categoryCost.map((entry, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-sm shrink-0" style={{ backgroundColor: entry.color }} />
                    <span className="text-muted truncate flex-1">{entry.category}</span>
                  </div>
                  <p className="text-white font-semibold pl-3.5">₹{entry.cost.toLocaleString()}</p>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Row 2: Wages dossier reports download */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
        {/* Payroll Summary Registry */}
        <div className="bg-card/60 border border-border/45 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-success/10 text-success">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Payroll Audit Registry</h3>
              <p className="text-[11px] text-muted">Weekly regulatory timesheet audits & ledger records</p>
            </div>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Consolidated payroll registry audit logs including gross pay, statutory withholdings, bonuses, and individual worker transaction records. Verified for bank upload compliance.
          </p>
          <button className="w-full py-2 bg-navy-300/40 hover:bg-navy-300/60 text-white rounded-xl text-xs font-semibold border border-border/30 transition-all">
            Download Payroll Registry (PDF)
          </button>
        </div>

        {/* Overtime Analysis Report */}
        <div className="bg-card/60 border border-border/45 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple/10 text-purple">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">OT Allocation Report</h3>
              <p className="text-[11px] text-muted">Overtime allocations, supervisor logs, & cost variances</p>
            </div>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Analytical breakdown of overtime hours logged across production departments. Includes supervisor checklists, shift comparisons, and budgetary target variance logs.
          </p>
          <button className="w-full py-2 bg-navy-300/40 hover:bg-navy-300/60 text-white rounded-xl text-xs font-semibold border border-border/30 transition-all">
            Download OT Audit Report (PDF)
          </button>
        </div>

        {/* Bank Transfer Sheets */}
        <div className="bg-card/60 border border-border/45 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Bank Transfer Sheets</h3>
              <p className="text-[11px] text-muted">Worker wages bank dispatch list & account summaries</p>
            </div>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Encrypted payment dispatch records containing direct worker bank credentials, verified IFSC codes, net pay amounts, and individual transaction status flags.
          </p>
          <button className="w-full py-2 bg-navy-300/40 hover:bg-navy-300/60 text-white rounded-xl text-xs font-semibold border border-border/30 transition-all">
            Download Bank Sheet (CSV)
          </button>
        </div>
      </div>
    </div>
  );
}
