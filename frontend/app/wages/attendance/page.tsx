"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  UserCheck,
  UserX,
  UserMinus,
  Clock,
  Timer,
  Target,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { attendanceKpis, attendanceList, type WagesKpi } from "@/data/wages-data";

const iconMap: Record<string, React.ReactNode> = {
  UserCheck: <UserCheck className="w-4 h-4" />,
  UserX: <UserX className="w-4 h-4" />,
  UserMinus: <UserMinus className="w-4 h-4" />,
  Clock: <Clock className="w-4 h-4" />,
  Timer: <Timer className="w-4 h-4" />,
  Target: <Target className="w-4 h-4" />,
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
        {iconMap[data.icon] ?? <Clock className="w-4 h-4" />}
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

export default function AttendancePage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const filtered = attendanceList.filter((log) => {
    const matchesSearch =
      log.name.toLowerCase().includes(search.toLowerCase()) ||
      log.id.toLowerCase().includes(search.toLowerCase()) ||
      log.shift.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || log.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusVariant = (s: string) => {
    if (s === "present") return "success";
    if (s === "half-day") return "warning";
    if (s === "leave") return "info";
    return "danger";
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Attendance Ledger"
        description="Monitor daily shift check-ins, overtime calculations, late entries, and supervisor approvals."
        breadcrumbs={[
          { label: "Wages", href: "/wages/dashboard" },
          { label: "Attendance" },
        ]}
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {attendanceKpis.map((kpi, i) => (
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
              placeholder="Search attendance…"
              className="w-full pl-9 pr-4 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white placeholder:text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-card/60 border border-border/40 rounded-xl text-xs text-white outline-none focus:border-primary/50 transition-all cursor-pointer"
          >
            <option value="all" className="bg-navy-100">All Status</option>
            <option value="present" className="bg-navy-100">Present</option>
            <option value="half-day" className="bg-navy-100">Half Day</option>
            <option value="leave" className="bg-navy-100">On Leave</option>
            <option value="absent" className="bg-navy-100">Absent</option>
          </select>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all">
            <Download className="w-3.5 h-3.5" />
            Export Timesheet
          </button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-all">
            <Plus className="w-3.5 h-3.5" />
            Log Attendance
          </button>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="glass-card overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/20">
                {["Worker ID", "Name", "Date", "Shift", "Clock In", "Clock Out", "Working Hours", "OT Hours", "Status"].map((h) => (
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
              {filtered.map((log) => (
                <tr
                  key={log.id}
                  className="border-t border-border/10 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3.5 text-xs font-medium text-primary">{log.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-white">{log.name}</td>
                  <td className="px-5 py-3.5 text-xs text-white">{log.date}</td>
                  <td className="px-5 py-3.5 text-xs text-muted">
                    <Badge variant="default" className="bg-navy-300/30 text-white border-none text-[10px]">
                      {log.shift}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-xs text-muted font-mono">{log.inTime}</td>
                  <td className="px-5 py-3.5 text-xs text-muted font-mono">{log.outTime}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-white">{log.workingHours} hrs</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-warning">{log.otHours > 0 ? `+${log.otHours} hrs` : "—"}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={statusVariant(log.status)} dot>
                      {log.status.replace("-", " ")}
                    </Badge>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-xs text-muted">
                    No attendance records match selection criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
