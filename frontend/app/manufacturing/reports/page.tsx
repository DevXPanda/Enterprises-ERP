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
  FileBarChart,
  Gauge,
  Factory,
  Clock,
  ShieldCheck,
  Flame,
  Download,
  Filter,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { ChartCard } from "@/components/dashboard/chart-card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import {
  reportsKpis,
  monthlyProdReport,
  oeeByLine,
  downtimeData,
  type MfgKpi,
} from "@/data/manufacturing-data";
import { useApi } from "@/hooks/use-api";

interface MfgReportsAnalytics {
  kpis: MfgKpi[];
  monthlyProdReport: typeof monthlyProdReport;
  oeeByLine: typeof oeeByLine;
  downtimeData: typeof downtimeData;
}

const iconMap: Record<string, React.ReactNode> = {
  FileBarChart: <FileBarChart className="w-4 h-4" />,
  Gauge: <Gauge className="w-4 h-4" />,
  Factory: <Factory className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
  ShieldCheck: <ShieldCheck className="w-4 h-4" />,
  Flame: <Flame className="w-4 h-4" />,
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
        {iconMap[data.icon] ?? <FileBarChart className="w-4 h-4" />}
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

export default function ManufacturingReportsPage() {
  const [timeRange, setTimeRange] = useState("6m");
  const live = useApi<MfgReportsAnalytics>("/manufacturing/reports/analytics");
  const kpis = live?.kpis ?? reportsKpis;
  const monthlyProd = live?.monthlyProdReport ?? monthlyProdReport;
  const oeeLines = live?.oeeByLine ?? oeeByLine;
  const downtime = live?.downtimeData ?? downtimeData;

  return (
    <div className="space-y-5">
      <PageHeader
        title="Manufacturing Reports"
        description="Comprehensive analysis logs for monthly plant output, equipment effectiveness, and machine downtime breakdown."
        breadcrumbs={[
          { label: "Manufacturing", href: "/manufacturing/dashboard" },
          { label: "Reports" },
        ]}
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
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
            Filter Charts
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-all">
            <Download className="w-3.5 h-3.5" />
            Export Monthly Dossier
          </button>
        </div>
      </div>

      {/* Row 1: Monthly Production + OEE by Line + Downtime Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {/* Monthly Production */}
        <ChartCard title="Monthly Production Output" subtitle="Bags produced vs target goals (K bags)">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyProd} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f20" />
                <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10, color: "#94A3B8" }} />
                <Bar dataKey="production" name="Actual Prod." fill="#22C55E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Target Goal" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* OEE by Line */}
        <ChartCard title="OEE Breakdown by Line" subtitle="Availability, Performance, and Quality metrics">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={oeeLines} barGap={3}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f20" />
                <XAxis dataKey="line" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis domain={[60, 100]} tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 10 }} />
                <Bar dataKey="availability" name="Avail." fill="#3b82f6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="performance" name="Perf." fill="#8b5cf6" radius={[2, 2, 0, 0]} />
                <Bar dataKey="quality" name="Qual." fill="#10b981" radius={[2, 2, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        {/* Downtime Breakdown */}
        <ChartCard title="Downtime Cause Analysis" subtitle="Breakdown by primary causal issue (hours)">
          <div className="h-[200px] flex items-center justify-center">
            <div className="w-1/2 h-full">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={downtime}
                    dataKey="hours"
                    nameKey="reason"
                    cx="50%"
                    cy="50%"
                    innerRadius={50}
                    outerRadius={70}
                    paddingAngle={2}
                  >
                    {downtime.map((entry, idx) => (
                      <Cell key={`cell-${idx}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={(value) => `${value} hrs`} />
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="w-1/2 space-y-1.5 pl-2 text-[10px]">
              {downtime.map((entry, idx) => (
                <div key={idx} className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm shrink-0" style={{ backgroundColor: entry.color }} />
                  <span className="text-muted truncate flex-1">{entry.reason}</span>
                  <span className="text-white font-medium shrink-0">{entry.hours}h</span>
                </div>
              ))}
            </div>
          </div>
        </ChartCard>
      </div>

      {/* Row 2: Exportable Dossiers List (to match OEE/Quality/etc.) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
        {/* Quality Audit Summary */}
        <div className="bg-card/60 border border-border/45 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-success/10 text-success">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Quality Audit Summary</h3>
              <p className="text-[11px] text-muted">Weekly chemical & mechanical testing logs</p>
            </div>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Batch audits for OPC 53 Grade and PPC Cement batches. Total pass rate of 98.1% maintained over 42 tested lots this month. No severe structural alerts reported.
          </p>
          <button className="w-full py-2 bg-navy-300/40 hover:bg-navy-300/60 text-white rounded-xl text-xs font-semibold border border-border/30 transition-all">
            Download Audit Report (PDF)
          </button>
        </div>

        {/* Machine Telemetry Audit */}
        <div className="bg-card/60 border border-border/45 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple/10 text-purple">
              <Gauge className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Machine Telemetry Log</h3>
              <p className="text-[11px] text-muted">Vibration meters, temperature, runtime logs</p>
            </div>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Consolidated runtime logs from Crusher, raw mill grinders, Packer, and Kiln sensors. Average operating uptime rate is 95.2% against current 93% benchmark target.
          </p>
          <button className="w-full py-2 bg-navy-300/40 hover:bg-navy-300/60 text-white rounded-xl text-xs font-semibold border border-border/30 transition-all">
            Download Raw Telemetry (CSV)
          </button>
        </div>

        {/* Shift Dispatch Audit */}
        <div className="bg-card/60 border border-border/45 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-primary/10 text-primary">
              <FileBarChart className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Shift Dispatch Dossier</h3>
              <p className="text-[11px] text-muted">Hourly dispatch versus line output balance</p>
            </div>
          </div>
          <p className="text-xs text-muted leading-relaxed">
            Cross-reference of hourly line bagging counts against dispatcher gate pass exits. Daily variance of +0.3% falls safely within standard operational thresholds.
          </p>
          <button className="w-full py-2 bg-navy-300/40 hover:bg-navy-300/60 text-white rounded-xl text-xs font-semibold border border-border/30 transition-all">
            Download Dispatch Balance (PDF)
          </button>
        </div>
      </div>
    </div>
  );
}
