"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Users,
  UserCheck,
  UserMinus,
  Shield,
  FileText,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus,
  X,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { workersKpis, workersList, type WagesKpi, type Worker } from "@/data/wages-data";
import { useApi } from "@/hooks/use-api";
import { exportCsv } from "@/lib/export";
import { apiSend } from "@/lib/api";

const iconMap: Record<string, React.ReactNode> = {
  Users: <Users className="w-4 h-4" />,
  UserCheck: <UserCheck className="w-4 h-4" />,
  UserMinus: <UserMinus className="w-4 h-4" />,
  Shield: <Shield className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  AlertTriangle: <AlertTriangle className="w-4 h-4" />,
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

export default function WorkersPage() {
  const [search, setSearch] = useState("");
  const [version, setVersion] = useState(0);
  const live = useApi<{ kpis: WagesKpi[]; data: Record<string, unknown>[] }>("/wages/workers", version);

  // Add Worker modal
  const [modalOpen, setModalOpen] = useState(false);
  const [form, setForm] = useState({
    name: "",
    department: "Production",
    type: "permanent",
    dailyRate: "",
    bankAccount: "",
    shift: "Morning",
  });
  const [saving, setSaving] = useState(false);
  const [modalError, setModalError] = useState<string | null>(null);

  const submitWorker = async () => {
    setSaving(true);
    setModalError(null);
    try {
      await apiSend("POST", "/wages/workers", {
        name: form.name,
        department: form.department,
        type: form.type,
        dailyRate: Number(form.dailyRate),
        bankAccount: form.bankAccount || undefined,
        shift: form.shift,
      });
      setModalOpen(false);
      setForm({ name: "", department: "Production", type: "permanent", dailyRate: "", bankAccount: "", shift: "Morning" });
      setVersion((v) => v + 1); // refetch the live list
    } catch (err) {
      setModalError(err instanceof Error ? err.message : "Failed to add worker — is the backend running?");
    } finally {
      setSaving(false);
    }
  };

  const kpis = live?.kpis ?? workersKpis;
  const workers: Worker[] = live
    ? live.data.map((r) => ({
        id: String(r.id ?? "—"),
        name: String(r.name ?? "—"),
        department: String(r.department ?? "—"),
        type: (r.type ?? "permanent") as Worker["type"],
        dailyRate: Number(r.dailyRate ?? 0),
        bankAccount: String(r.bankAccount ?? "******0000"),
        attendancePct: Number(r.attendancePct ?? 0),
        status: (r.status ?? "active") as Worker["status"],
      }))
    : workersList;

  const filtered = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(search.toLowerCase()) ||
      worker.id.toLowerCase().includes(search.toLowerCase()) ||
      worker.department.toLowerCase().includes(search.toLowerCase())
  );

  const statusVariant = (s: string) => {
    if (s === "active") return "success";
    if (s === "leave") return "warning";
    return "danger";
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Workers Directory"
        description="Register and manage plant operators, track their wages parameters, departments, and bank credentials."
        breadcrumbs={[
          { label: "Wages", href: "/wages/dashboard" },
          { label: "Workers" },
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
            placeholder="Search workers…"
            className="w-full pl-9 pr-4 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white placeholder:text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
          <button onClick={() => exportCsv("workers-directory", filtered, [["id","Worker ID"],["name","Name"],["department","Department"],["type","Type"],["dailyRate","Daily Rate"],["bankAccount","Bank Account"],["attendancePct","Attendance %"],["status","Status"]])} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all">
            <Download className="w-3.5 h-3.5" />
            Export Directory
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Worker
          </button>
        </div>
      </div>

      {/* Workers Table */}
      <div className="glass-card overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/20">
                {["Worker ID", "Name", "Department", "Type", "Daily Rate", "Bank Account", "Attendance (Avg)", "Status"].map((h) => (
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
              {filtered.map((worker) => (
                <tr
                  key={worker.id}
                  className="border-t border-border/10 hover:bg-white/[0.02] transition-colors"
                >
                  <td className="px-5 py-3.5 text-xs font-medium text-primary">{worker.id}</td>
                  <td className="px-5 py-3.5 text-xs font-semibold text-white">{worker.name}</td>
                  <td className="px-5 py-3.5 text-xs text-white">{worker.department}</td>
                  <td className="px-5 py-3.5 text-xs text-muted">
                    <Badge variant="default" className="bg-navy-300/30 text-white border-none text-[10px]">
                      {worker.type}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-xs font-bold text-white">₹{worker.dailyRate}/day</td>
                  <td className="px-5 py-3.5 text-xs text-muted font-mono">{worker.bankAccount}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-navy-300/30 rounded-full overflow-hidden w-16">
                        <div
                          className={cn(
                            "h-full rounded-full",
                            worker.attendancePct >= 95 ? "bg-success" : worker.attendancePct >= 90 ? "bg-primary" : "bg-warning"
                          )}
                          style={{ width: `${worker.attendancePct}%` }}
                        />
                      </div>
                      <span className="text-[10px] text-muted">{worker.attendancePct}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={statusVariant(worker.status)} dot>
                      {worker.status}
                    </Badge>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={8} className="px-5 py-8 text-center text-xs text-muted">
                    No workers matching search parameters found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Worker modal */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 animate-fade-in">
          <div className="glass-card w-full max-w-md p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-white">Add Worker</h2>
              <button
                onClick={() => setModalOpen(false)}
                className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/5"
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="space-y-1 sm:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted/70">Full Name *</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                  placeholder="e.g. Arun Sharma"
                  className="w-full px-3 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white outline-none focus:border-primary/50 transition-all"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted/70">Department</span>
                <input
                  type="text"
                  value={form.department}
                  onChange={(e) => setForm((f) => ({ ...f, department: e.target.value }))}
                  className="w-full px-3 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white outline-none focus:border-primary/50 transition-all"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted/70">Type</span>
                <select
                  value={form.type}
                  onChange={(e) => setForm((f) => ({ ...f, type: e.target.value }))}
                  className="w-full px-3 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white outline-none focus:border-primary/50 transition-all cursor-pointer"
                >
                  <option value="permanent" className="bg-navy-100">Permanent</option>
                  <option value="contractual" className="bg-navy-100">Contractual</option>
                </select>
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted/70">Daily Rate (₹) *</span>
                <input
                  type="number"
                  value={form.dailyRate}
                  onChange={(e) => setForm((f) => ({ ...f, dailyRate: e.target.value }))}
                  placeholder="e.g. 550"
                  className="w-full px-3 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white outline-none focus:border-primary/50 transition-all"
                />
              </label>
              <label className="space-y-1">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted/70">Shift</span>
                <select
                  value={form.shift}
                  onChange={(e) => setForm((f) => ({ ...f, shift: e.target.value }))}
                  className="w-full px-3 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white outline-none focus:border-primary/50 transition-all cursor-pointer"
                >
                  <option value="Morning" className="bg-navy-100">Morning</option>
                  <option value="Evening" className="bg-navy-100">Evening</option>
                  <option value="Night" className="bg-navy-100">Night</option>
                </select>
              </label>
              <label className="space-y-1 sm:col-span-2">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-muted/70">Bank Account (optional)</span>
                <input
                  type="text"
                  value={form.bankAccount}
                  onChange={(e) => setForm((f) => ({ ...f, bankAccount: e.target.value }))}
                  placeholder="Account number"
                  className="w-full px-3 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white outline-none focus:border-primary/50 transition-all"
                />
              </label>
            </div>

            {modalError && (
              <p className="text-xs text-danger flex items-center gap-1.5">
                <AlertTriangle className="w-3.5 h-3.5" /> {modalError}
              </p>
            )}

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 hover:bg-white/5 hover:text-white transition-all"
              >
                Cancel
              </button>
              <button
                onClick={submitWorker}
                disabled={saving || !form.name || !form.dailyRate}
                className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-all disabled:opacity-50"
              >
                {saving ? "Adding…" : "Add Worker"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
