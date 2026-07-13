"use client";

import { useState } from "react";
import { Search, Filter, Download, Plus, Factory, Activity, CheckCircle2, Clock, Timer, Target, TrendingUp, TrendingDown, Minus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { productionOrdersKpis, productionOrders, type MfgKpi } from "@/data/manufacturing-data";

const iconMap: Record<string, React.ReactNode> = {
  ClipboardList: <Factory className="w-4 h-4" />, Activity: <Activity className="w-4 h-4" />,
  CheckCircle2: <CheckCircle2 className="w-4 h-4" />, Clock: <Clock className="w-4 h-4" />,
  Timer: <Timer className="w-4 h-4" />, Target: <Target className="w-4 h-4" />,
};

function KpiCard({ data, index }: { data: MfgKpi; index: number }) {
  const colorMap: Record<string, string> = { blue: "bg-primary/10 text-primary", green: "bg-success/10 text-success", purple: "bg-purple/10 text-purple", orange: "bg-warning/10 text-warning", red: "bg-danger/10 text-danger" };
  const isPos = data.change !== undefined && data.change > 0;
  const isNeg = data.change !== undefined && data.change < 0;
  return (
    <div className="bg-card/60 border border-border/30 rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
      <div className={cn("p-2 rounded-lg shrink-0", colorMap[data.color] || colorMap.blue)}>{iconMap[data.icon] ?? <Factory className="w-4 h-4" />}</div>
      <div className="flex-1 min-w-0">
        <p className="text-lg font-bold text-white tracking-tight leading-tight">{data.value}</p>
        <p className="text-[11px] text-muted truncate">{data.label}</p>
      </div>
      {data.change !== undefined && (
        <div className={cn("flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0", isPos && "text-success bg-success/10", isNeg && "text-danger bg-danger/10", !isPos && !isNeg && "text-muted bg-muted/10")}>
          {isPos ? <TrendingUp className="w-2.5 h-2.5" /> : isNeg ? <TrendingDown className="w-2.5 h-2.5" /> : <Minus className="w-2.5 h-2.5" />}
          {Math.abs(data.change)}%
        </div>
      )}
    </div>
  );
}

const priorityColors: Record<string, string> = { high: "text-danger bg-danger/10", medium: "text-warning bg-warning/10", low: "text-muted bg-muted/10" };
const statusVariant = (s: string) => s === "completed" ? "success" : s === "in-progress" ? "warning" : s === "on-hold" ? "danger" : "default";

export default function ProductionOrdersPage() {
  const [search, setSearch] = useState("");
  const filtered = productionOrders.filter(o => o.id.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="space-y-5">
      <PageHeader
        title="Production Orders"
        description="Manage, schedule, and track manufacturing production orders across all lines."
        breadcrumbs={[{ label: "Manufacturing", href: "/manufacturing/dashboard" }, { label: "Production Orders" }]}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {productionOrdersKpis.map((kpi, i) => <KpiCard key={kpi.id} data={kpi} index={i} />)}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
        <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders…"
            className="w-full pl-9 pr-4 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white placeholder:text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all"><Filter className="w-3.5 h-3.5" />Filter</button>
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all"><Download className="w-3.5 h-3.5" />Export</button>
          <button className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-all"><Plus className="w-3.5 h-3.5" />New Order</button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/20">
                {["Order ID", "Product", "Qty", "Priority", "Line", "Start", "Due", "Progress", "Status"].map(h => (
                  <th key={h} className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted/70 text-left whitespace-nowrap">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map(order => (
                <tr key={order.id} className="border-t border-border/10 hover:bg-white/[0.02] transition-colors">
                  <td className="px-5 py-3 text-xs font-medium text-primary">{order.id}</td>
                  <td className="px-5 py-3">
                    <p className="text-xs font-medium text-white">{order.product}</p>
                    <p className="text-[10px] text-muted">{order.grade}</p>
                  </td>
                  <td className="px-5 py-3 text-xs text-white">{order.quantity.toLocaleString()} {order.unit}</td>
                  <td className="px-5 py-3">
                    <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize", priorityColors[order.priority])}>{order.priority}</span>
                  </td>
                  <td className="px-5 py-3 text-xs text-muted">{order.line}</td>
                  <td className="px-5 py-3 text-xs text-muted">{order.startDate}</td>
                  <td className="px-5 py-3 text-xs text-muted">{order.dueDate}</td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-2">
                      <div className="flex-1 h-1.5 bg-navy-300/30 rounded-full overflow-hidden w-16">
                        <div className={cn("h-full rounded-full", order.progress === 100 ? "bg-success" : order.progress >= 50 ? "bg-primary" : "bg-warning")} style={{ width: `${order.progress}%` }} />
                      </div>
                      <span className="text-[10px] text-muted w-8">{order.progress}%</span>
                    </div>
                  </td>
                  <td className="px-5 py-3">
                    <Badge variant={statusVariant(order.status)} dot>{order.status.replace("-", " ")}</Badge>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
