"use client";

// ============================================================
//  Wages Dashboard — production-linked labour cost analytics
//  computed live by the MWMS wages service (/api/wages/summary).
// ============================================================

import { useEffect, useState } from "react";
import {
  CalendarCheck,
  Clock,
  IndianRupee,
  Wallet,
  Sparkles,
  AlertTriangle,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { apiGet } from "@/lib/api";
import { cn } from "@/lib/utils";

interface MachineCost {
  machine: string;
  line: string;
  output: number;
  labourCost: number;
  costPerUnit: number | null;
}

interface WagesSummary {
  attendanceRate: number | null;
  overtime: { otHours: number; otAmount: number; pendingApprovals: number };
  avgCostPerBag: number | null;
  costPerMachine: MachineCost[];
  latestWageSheet: {
    grossWages: number;
    employeeStatutory: number;
    employerStatutory: number;
    netPayout: number;
    trueLabourCost: number;
  };
  aiRecommendation: string;
}

const inr = (n: number | null | undefined) =>
  n === null || n === undefined ? "—" : `₹${n.toLocaleString("en-IN")}`;

function StatCard({
  icon,
  label,
  value,
  note,
  tone = "blue",
  delay = 0,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  note?: string;
  tone?: "blue" | "green" | "orange" | "purple";
  delay?: number;
}) {
  const tones: Record<string, string> = {
    blue: "bg-primary/10 text-primary",
    green: "bg-success/10 text-success",
    orange: "bg-warning/10 text-warning",
    purple: "bg-purple/10 text-purple",
  };
  return (
    <div
      className="glass-card-hover p-5 flex flex-col gap-3 animate-fade-in"
      style={{ animationDelay: `${delay}ms` }}
    >
      <div className={cn("p-2.5 rounded-xl w-fit", tones[tone])}>{icon}</div>
      <div>
        <p className="text-2xl font-bold text-white tracking-tight">{value}</p>
        <p className="text-xs text-muted mt-0.5">{label}</p>
        {note && <p className="text-[10px] text-muted/60 mt-0.5">{note}</p>}
      </div>
    </div>
  );
}

export default function WagesDashboardPage() {
  const [summary, setSummary] = useState<WagesSummary | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    apiGet<WagesSummary>("/wages/summary")
      .then(setSummary)
      .catch((err) => setError(err instanceof Error ? err.message : "API unreachable"));
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title="Wages Dashboard"
        description="Production-linked labour cost analytics — computed live from the MWMS wages service (attendance, OT, wage sheets, statutory contributions)."
        breadcrumbs={[{ label: "Wages", href: "/wages/dashboard" }, { label: "Dashboard" }]}
      />

      {error && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-danger/30 bg-danger/10 text-sm text-danger">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          API unreachable: {error}. Start the backend with <code className="mx-1">cd backend && npm start</code>
        </div>
      )}

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<CalendarCheck className="w-5 h-5" />}
          label="Attendance Rate"
          value={summary ? `${summary.attendanceRate ?? "—"}%` : "…"}
          note="all recorded days"
          tone="green"
        />
        <StatCard
          icon={<Clock className="w-5 h-5" />}
          label="Overtime"
          value={summary ? `${summary.overtime.otHours} hrs` : "…"}
          note={summary ? `${inr(summary.overtime.otAmount)} · ${summary.overtime.pendingApprovals} pending` : undefined}
          tone="orange"
          delay={70}
        />
        <StatCard
          icon={<IndianRupee className="w-5 h-5" />}
          label="Avg. Labour Cost / Bag"
          value={summary ? inr(summary.avgCostPerBag) : "…"}
          note="from production assignments"
          tone="blue"
          delay={140}
        />
        <StatCard
          icon={<Wallet className="w-5 h-5" />}
          label="True Labour Cost"
          value={summary ? inr(summary.latestWageSheet.trueLabourCost) : "…"}
          note="latest sheet, incl. employer PF/ESI"
          tone="purple"
          delay={210}
        />
      </div>

      {/* AI recommendation */}
      {summary && (
        <div className="glass-card p-4 flex items-start gap-3 border border-primary/20 animate-fade-in">
          <div className="p-2 rounded-xl bg-primary/10 text-primary shrink-0">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-primary">
              Cost Insight
            </p>
            <p className="text-sm text-white/90 mt-1">{summary.aiRecommendation}</p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Cost per machine */}
        <div className="glass-card animate-fade-in">
          <div className="px-5 pt-5 pb-3 border-b border-border/10">
            <h3 className="text-sm font-semibold text-white">Labour Cost per Machine</h3>
            <p className="text-xs text-muted mt-0.5">
              Wages apportioned by assigned minutes vs output produced
            </p>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr>
                  {["Machine", "Line", "Output", "Labour Cost", "Cost / Unit"].map((h, i) => (
                    <th
                      key={h}
                      className={cn(
                        "px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted/70",
                        i >= 2 ? "text-right" : "text-left",
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(summary?.costPerMachine ?? []).map((m, i) => (
                  <tr key={m.machine} className="border-t border-border/10 hover:bg-white/[0.02]">
                    <td className="px-5 py-3 text-xs font-medium text-white">{m.machine}</td>
                    <td className="px-5 py-3 text-xs text-muted">{m.line}</td>
                    <td className="px-5 py-3 text-xs text-right text-white/80">
                      {m.output?.toLocaleString("en-IN")}
                    </td>
                    <td className="px-5 py-3 text-xs text-right text-white/80">{inr(m.labourCost)}</td>
                    <td className="px-5 py-3 text-xs text-right">
                      <span className={i === 0 ? "text-success font-semibold" : "text-white/80"}>
                        {inr(m.costPerUnit)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            {!summary && !error && (
              <p className="px-5 py-6 text-xs text-muted/60">Loading analytics…</p>
            )}
          </div>
        </div>

        {/* Latest wage sheet breakdown */}
        <div className="glass-card animate-fade-in">
          <div className="px-5 pt-5 pb-3 border-b border-border/10">
            <h3 className="text-sm font-semibold text-white">Latest Wage Sheet</h3>
            <p className="text-xs text-muted mt-0.5">
              Gross → statutory → net, plus the employer-side cost
            </p>
          </div>
          <div className="p-5 space-y-3">
            {summary ? (
              [
                { label: "Gross Wages", value: summary.latestWageSheet.grossWages, tone: "text-white" },
                { label: "Employee Statutory (PF/ESI/PT)", value: -summary.latestWageSheet.employeeStatutory, tone: "text-warning" },
                { label: "Net Payout", value: summary.latestWageSheet.netPayout, tone: "text-success" },
                { label: "Employer Statutory (hidden cost)", value: summary.latestWageSheet.employerStatutory, tone: "text-purple" },
                { label: "True Labour Cost", value: summary.latestWageSheet.trueLabourCost, tone: "text-primary font-bold" },
              ].map((row) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between py-2 border-b border-border/10 last:border-0"
                >
                  <span className="text-xs text-muted">{row.label}</span>
                  <span className={cn("text-sm font-semibold", row.tone)}>
                    {row.value < 0 ? `− ${inr(Math.abs(row.value))}` : inr(row.value)}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-muted/60">Loading…</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
