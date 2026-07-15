"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  IndianRupee,
  CheckCircle,
  RefreshCw,
  AlertTriangle,
  Percent,
  Gift,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { payrollKpis, payrollList, type WagesKpi, type PayrollRow } from "@/data/wages-data";
import { useApi } from "@/hooks/use-api";
import { apiSend } from "@/lib/api";
import { RecordModal } from "@/components/ui/record-modal";

const iconMap: Record<string, React.ReactNode> = {
  IndianRupee: <IndianRupee className="w-4 h-4" />,
  CheckCircle: <CheckCircle className="w-4 h-4" />,
  RefreshCw: <RefreshCw className="w-4 h-4" />,
  AlertTriangle: <AlertTriangle className="w-4 h-4" />,
  Percent: <Percent className="w-4 h-4" />,
  Gift: <Gift className="w-4 h-4" />,
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
        {iconMap[data.icon] ?? <IndianRupee className="w-4 h-4" />}
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

export default function PayrollPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  const [version, setVersion] = useState(0);
  const [modal, setModal] = useState(false);
  const live = useApi<{ kpis: WagesKpi[]; data: Record<string, unknown>[] }>("/wages/payroll", version);

  const runPayroll = async (values: Record<string, string>) => {
    await apiSend("POST", "/wages/payroll/generate", { month: values.month });
    setVersion((v) => v + 1);
  };

  const kpis = live?.kpis ?? payrollKpis;
  const rows: PayrollRow[] = live
    ? live.data.map((r) => ({
        payoutId: String(r.payoutId ?? "—"),
        workerId: String(r.workerId ?? "—"),
        name: String(r.name ?? "—"),
        baseWages: Number(r.baseWages ?? 0),
        overtimePay: Number(r.overtimePay ?? 0),
        deductions: Number(r.deductions ?? 0),
        bonuses: Number(r.bonuses ?? 0),
        netPayable: Number(r.netPayable ?? 0),
        status: (r.status ?? "processing") as PayrollRow["status"],
      }))
    : payrollList;

  const filtered = rows.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.workerId.toLowerCase().includes(search.toLowerCase()) ||
      p.payoutId.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || p.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const statusVariant = (s: string) => {
    if (s === "paid") return "success";
    if (s === "processing") return "warning";
    return "danger";
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Payroll Processing Ledger"
        description="Verify monthly gross calculations, configure overtime premiums, deduct structural costs, and approve payout orders."
        breadcrumbs={[
          { label: "Wages", href: "/wages/dashboard" },
          { label: "Payroll" },
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
              placeholder="Search payroll…"
              className="w-full pl-9 pr-4 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white placeholder:text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-card/60 border border-border/40 rounded-xl text-xs text-white outline-none focus:border-primary/50 transition-all cursor-pointer"
          >
            <option value="all" className="bg-navy-100">All Status</option>
            <option value="paid" className="bg-navy-100">Paid</option>
            <option value="processing" className="bg-navy-100">Processing</option>
            <option value="hold" className="bg-navy-100">Hold</option>
          </select>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all">
            <Filter className="w-3.5 h-3.5" />
            Tax Rules
          </button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all">
            <Download className="w-3.5 h-3.5" />
            Export Payslips
          </button>
          <button onClick={() => setModal(true)} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-all">
            <RefreshCw className="w-3.5 h-3.5" />
            Run Payroll Engine
          </button>
        </div>
      </div>

      {/* Payroll Table */}
      <div className="glass-card overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/20">
                {["Payout ID", "Worker ID", "Name", "Base Wages", "Overtime Pay", "Deductions", "Bonuses", "Net Payable", "Status"].map((h) => (
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
              {filtered.map((p) => (
                <tr
                  key={p.payoutId}
                  className="border-t border-border/10 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3.5 text-xs font-medium text-primary">{p.payoutId}</td>
                  <td className="px-5 py-3.5 text-xs text-white">{p.workerId}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-white">{p.name}</td>
                  <td className="px-5 py-3.5 text-xs text-white">₹{p.baseWages.toLocaleString()}</td>
                  <td className="px-5 py-3.5 text-xs text-warning font-semibold">
                    {p.overtimePay > 0 ? `+₹${p.overtimePay.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-danger font-semibold">
                    {p.deductions > 0 ? `-₹${p.deductions.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-xs text-success font-semibold">
                    {p.bonuses > 0 ? `+₹${p.bonuses.toLocaleString()}` : "—"}
                  </td>
                  <td className="px-5 py-3.5 text-xs font-bold text-white">₹{p.netPayable.toLocaleString()}</td>
                  <td className="px-5 py-3.5">
                    <Badge variant={statusVariant(p.status)} dot>
                      {p.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={9} className="px-5 py-8 text-center text-xs text-muted">
                    No payroll logs match selection criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {modal && (
        <RecordModal
          title="Run Payroll Engine"
          fields={[
            { key: "month", label: "Period (YYYY-MM)", required: true, placeholder: "e.g. 2026-07" },
          ]}
          submitLabel="Generate Wage Sheet"
          onSubmit={runPayroll}
          onClose={() => setModal(false)}
        />
      )}
    </div>
  );
}
