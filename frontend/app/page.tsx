"use client";

import {
  AreaChart,
  Area,
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import {
  AlertTriangle,
  Package,
  IndianRupee,
  Bell,
  ArrowUpRight,
  LayoutDashboard,
  Wallet,
  Building2,
  Factory,
  Settings,
} from "lucide-react";
import Link from "next/link";

import { KpiCard } from "@/components/dashboard/kpi-card";
import { ChartCard } from "@/components/dashboard/chart-card";
import { AlertCard } from "@/components/dashboard/alert-card";
import { StatTable } from "@/components/dashboard/stat-table";
import { ProgressRing } from "@/components/dashboard/progress-ring";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, getStatusBgColor } from "@/lib/utils";

import { useEffect, useState } from "react";
import { apiGet } from "@/lib/api";
import {
  kpiData as staticKpis,
  productionTrend as staticProductionTrend,
  revenueTrend as staticRevenueTrend,
  profitTrend as staticProfitTrend,
  monthlyPerformance as staticMonthlyPerformance,
  factoryComparison as staticFactoryComparison,
  dealerOrders as staticDealerOrders,
  purchasePending as staticPurchasePending,
  cashCollection as staticCashCollection,
  recentAlerts as staticRecentAlerts,
  qcAlerts as staticQcAlerts,
  lowStockItems as staticLowStockItems,
  notifications as staticNotifications,
} from "@/data/dashboard-data";

/** Shape of GET /api/dashboard — mirrors the static dashboard data. */
interface DashboardData {
  kpis: typeof staticKpis;
  productionTrend: typeof staticProductionTrend;
  revenueTrend: typeof staticRevenueTrend;
  profitTrend: typeof staticProfitTrend;
  monthlyPerformance: typeof staticMonthlyPerformance;
  factoryComparison: typeof staticFactoryComparison;
  dealerOrders: typeof staticDealerOrders;
  purchasePending: typeof staticPurchasePending;
  cashCollection: typeof staticCashCollection;
  recentAlerts: typeof staticRecentAlerts;
  qcAlerts: typeof staticQcAlerts;
  lowStockItems: typeof staticLowStockItems;
  notifications: typeof staticNotifications;
}

const staticDashboard: DashboardData = {
  kpis: staticKpis,
  productionTrend: staticProductionTrend,
  revenueTrend: staticRevenueTrend,
  profitTrend: staticProfitTrend,
  monthlyPerformance: staticMonthlyPerformance,
  factoryComparison: staticFactoryComparison,
  dealerOrders: staticDealerOrders,
  purchasePending: staticPurchasePending,
  cashCollection: staticCashCollection,
  recentAlerts: staticRecentAlerts,
  qcAlerts: staticQcAlerts,
  lowStockItems: staticLowStockItems,
  notifications: staticNotifications,
};

/* ------------------------------------------------------------------ */
/*  Custom Tooltip                                                     */
/* ------------------------------------------------------------------ */

function CustomTooltip({ active, payload, label }: {
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
          <span style={{ color: p.color }}>●</span> {p.name}: {p.value.toLocaleString("en-IN")}
        </p>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/*  DASHBOARD PAGE                                                     */
/* ------------------------------------------------------------------ */

export default function DashboardPage() {
  const [dash, setDash] = useState<DashboardData>(staticDashboard);

  useEffect(() => {
    apiGet<DashboardData>("/dashboard")
      .then((d) => setDash((prev) => ({ ...prev, ...d })))
      .catch(() => {}); // offline -> static fallback
  }, []);

  const {
    kpis: kpiData,
    productionTrend,
    revenueTrend,
    profitTrend,
    monthlyPerformance,
    factoryComparison,
    dealerOrders,
    purchasePending,
    cashCollection,
    recentAlerts,
    qcAlerts,
    lowStockItems,
    notifications,
  } = dash;

  return (
    <div className="space-y-6">
      {/* Quick Access Section (Mobile Only) */}
      <div className="md:hidden space-y-3">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted/70">
          Quick Access
        </h2>
        <div className="grid grid-cols-2 gap-4">
          <Link
            href="/"
            className="flex flex-col items-start p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 select-none group text-left"
          >
            <div className="p-2 bg-blue-50 text-blue-600 rounded-full mb-3 shrink-0 group-hover:bg-blue-100 transition-colors">
              <LayoutDashboard className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-[#0F172A]">Dashboard</span>
            <span className="text-[10px] text-[#64748B] mt-0.5">System Overview</span>
          </Link>

          <Link
            href="/wages/dashboard"
            className="flex flex-col items-start p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 select-none group text-left"
          >
            <div className="p-2 bg-green-50 text-green-600 rounded-full mb-3 shrink-0 group-hover:bg-green-100 transition-colors">
              <Wallet className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-[#0F172A]">Wages</span>
            <span className="text-[10px] text-[#64748B] mt-0.5">Employee & Payroll</span>
          </Link>

          <Link
            href="/factory/dashboard"
            className="flex flex-col items-start p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 select-none group text-left"
          >
            <div className="p-2 bg-purple-50 text-purple-600 rounded-full mb-3 shrink-0 group-hover:bg-purple-100 transition-colors">
              <Building2 className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-[#0F172A]">Factory</span>
            <span className="text-[10px] text-[#64748B] mt-0.5">Factory Operations</span>
          </Link>

          <Link
            href="/manufacturing/dashboard"
            className="flex flex-col items-start p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 select-none group text-left"
          >
            <div className="p-2 bg-orange-50 text-orange-600 rounded-full mb-3 shrink-0 group-hover:bg-orange-100 transition-colors">
              <Factory className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-[#0F172A]">Manufacturing</span>
            <span className="text-[10px] text-[#64748B] mt-0.5">Production Management</span>
          </Link>

          <Link
            href="/settings/dashboard"
            className="flex flex-col items-start p-4 bg-[#FFFFFF] border border-[#E2E8F0] rounded-xl shadow-sm hover:scale-[1.02] active:scale-[0.98] transition-all duration-150 select-none group text-left col-span-2"
          >
            <div className="p-2 bg-slate-100 text-slate-600 rounded-full mb-3 shrink-0 group-hover:bg-slate-200 transition-colors">
              <Settings className="w-5 h-5" />
            </div>
            <span className="text-sm font-semibold text-[#0F172A]">Settings</span>
            <span className="text-[10px] text-[#64748B] mt-0.5">System Configuration</span>
          </Link>
        </div>
      </div>

      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Executive Dashboard</h1>
          <p className="text-sm text-muted mt-1">
            Real-time overview of your manufacturing operations
          </p>
        </div>
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="flex items-center gap-1.5 text-xs text-success bg-success/10 px-3 py-1.5 rounded-lg border border-success/10" role="status" aria-label="System Status: Online">
            <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse-soft" />
            All Systems Operational
          </span>
        </div>
      </div>

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpiData.map((kpi, i) => (
          <KpiCard key={kpi.id} data={kpi} index={i} />
        ))}
      </div>

      {/* Row 1: Production Trend + Revenue Trend + Profit Trend */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <ChartCard
          title="Production Trend"
          subtitle="Daily production vs target (bags)"
          action={
            <span className="text-[10px] text-muted bg-card px-2 py-1 rounded-md border border-border/20">
              Last 7 Days
            </span>
          }
        >
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={productionTrend}>
                <defs>
                  <linearGradient id="prodGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#2563EB" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#2563EB" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="targetGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.2} />
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f20" />
                <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="value" name="Produced" stroke="#2563EB" strokeWidth={2} fill="url(#prodGrad)" />
                <Area type="monotone" dataKey="value2" name="Target" stroke="#8B5CF6" strokeWidth={2} strokeDasharray="5 5" fill="url(#targetGrad)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard
          title="Revenue Trend"
          subtitle="Monthly revenue (₹ Lakhs)"
          action={
            <span className="flex items-center gap-1 text-[10px] text-success">
              <ArrowUpRight className="w-3 h-3" /> +12.4% YoY
            </span>
          }
        >
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={revenueTrend}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f20" />
                <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Line type="monotone" dataKey="value" name="Revenue" stroke="#22C55E" strokeWidth={2.5} dot={{ fill: "#22C55E", r: 3 }} activeDot={{ r: 5 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <ChartCard title="Profit Trend" subtitle="Gross vs Net (₹ Lakhs)">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={profitTrend} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f20" />
                <XAxis dataKey="name" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="value" name="Gross" fill="#2563EB" radius={[4, 4, 0, 0]} />
                <Bar dataKey="value2" name="Net" fill="#8B5CF6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>
      </div>

      {/* Row 2: OEE + Monthly Performance + Factory Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <ChartCard title="Overall Equipment Effectiveness" subtitle="Current shift performance">
          <div className="flex items-center justify-center py-2">
            <ProgressRing
              value={87.4}
              color="#2563EB"
              sublabel="of 85% target"
              size={140}
              strokeWidth={10}
            />
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            <div className="text-center p-2 rounded-lg bg-navy/50">
              <p className="text-sm font-bold text-success">94.2%</p>
              <p className="text-[10px] text-muted">Availability</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-navy/50">
              <p className="text-sm font-bold text-primary">91.8%</p>
              <p className="text-[10px] text-muted">Performance</p>
            </div>
            <div className="text-center p-2 rounded-lg bg-navy/50">
              <p className="text-sm font-bold text-warning">95.1%</p>
              <p className="text-[10px] text-muted">Quality</p>
            </div>
          </div>
        </ChartCard>

        <ChartCard title="Monthly Performance" subtitle="Production vs Target (K bags)">
          <div className="h-[200px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={monthlyPerformance} barGap={4}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1e3a5f20" />
                <XAxis dataKey="month" tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "#94A3B8", fontSize: 10 }} axisLine={false} tickLine={false} tickFormatter={(v) => `${(v / 1000).toFixed(0)}K`} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="production" name="Production" fill="#22C55E" radius={[4, 4, 0, 0]} />
                <Bar dataKey="target" name="Target" fill="#1e3a5f" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </ChartCard>

        <StatTable
          title="Factory Comparison"
          subtitle="Today's performance across plants"
          columns={[
            { key: "factory", label: "Plant", render: (r) => <span className="text-white font-medium">{r.factory as string}</span> },
            { key: "production", label: "Prod.", render: (r) => <span className="text-white">{(r.production as number).toLocaleString("en-IN")}</span> },
            {
              key: "efficiency",
              label: "Eff.",
              render: (r) => {
                const v = r.efficiency as number;
                return (
                  <span className={v >= 95 ? "text-success" : v >= 90 ? "text-warning" : "text-danger"}>
                    {v}%
                  </span>
                );
              },
            },
            {
              key: "oee",
              label: "OEE",
              render: (r) => {
                const v = r.oee as number;
                return (
                  <Badge variant={v >= 90 ? "success" : v >= 85 ? "warning" : "danger"}>
                    {v}%
                  </Badge>
                );
              },
            },
          ]}
          data={factoryComparison as unknown as Record<string, unknown>[]}
        />
      </div>

      {/* Row 3: Dealer Orders + Purchase Pending + Cash Collection */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatTable
          title="Dealer Orders"
          subtitle="Recent orders overview"
          columns={[
            { key: "id", label: "Order ID", render: (r) => <span className="text-primary font-medium">{r.id as string}</span> },
            { key: "dealer", label: "Dealer", render: (r) => <span className="text-white">{r.dealer as string}</span> },
            { key: "qty", label: "Qty", render: (r) => (r.qty as number).toLocaleString("en-IN") },
            {
              key: "status",
              label: "Status",
              render: (r) => <Badge status={r.status as string} dot>{r.status as string}</Badge>,
            },
          ]}
          data={dealerOrders as unknown as Record<string, unknown>[]}
        />

        <StatTable
          title="Purchase Pending"
          subtitle="Pending purchase orders"
          columns={[
            { key: "id", label: "PO", render: (r) => <span className="text-primary font-medium">{r.id as string}</span> },
            { key: "item", label: "Item", render: (r) => <span className="text-white">{r.item as string}</span> },
            { key: "amount", label: "Amount", render: (r) => formatCurrency(r.amount as number), align: "right" },
            {
              key: "status",
              label: "Status",
              render: (r) => <Badge status={r.status as string} dot>{r.status as string}</Badge>,
            },
          ]}
          data={purchasePending as unknown as Record<string, unknown>[]}
        />

        <StatTable
          title="Cash Collection"
          subtitle="Dealer payment status"
          columns={[
            { key: "id", label: "Invoice", render: (r) => <span className="text-primary font-medium">{r.id as string}</span> },
            { key: "dealer", label: "Dealer", render: (r) => <span className="text-white">{r.dealer as string}</span> },
            { key: "amount", label: "Amount", render: (r) => formatCurrency(r.amount as number), align: "right" },
            {
              key: "status",
              label: "Status",
              render: (r) => <Badge status={r.status as string} dot>{r.status as string}</Badge>,
            },
          ]}
          data={cashCollection as unknown as Record<string, unknown>[]}
        />
      </div>

      {/* Row 4: Alerts + Low Stock + Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        <AlertCard title="Recent Alerts" alerts={recentAlerts} />

        {/* Low Stock */}
        <div className="glass-card animate-fade-in">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Low Stock Items</h3>
            <Badge variant="danger">{lowStockItems.length} items</Badge>
          </div>
          <div className="px-5 pb-5 space-y-3">
            {lowStockItems.map((item) => {
              const pct = Math.round((item.current / item.minimum) * 100);
              return (
                <div key={item.id} className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-white font-medium truncate">
                      {item.material}
                    </span>
                    <span className="text-[10px] text-muted shrink-0 ml-2">
                      {item.daysLeft}d left
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 h-1.5 bg-navy-300/30 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all ${
                          pct <= 30 ? "bg-danger" : pct <= 60 ? "bg-warning" : "bg-success"
                        }`}
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                    <span className="text-[10px] text-muted w-12 text-right">
                      {item.current}/{item.minimum} {item.unit}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Notifications */}
        <div className="glass-card animate-fade-in">
          <div className="px-5 pt-5 pb-3 flex items-center justify-between">
            <h3 className="text-sm font-semibold text-white">Notifications</h3>
            <span className="flex items-center gap-1 text-[10px] text-primary">
              <Bell className="w-3 h-3" />
              {notifications.filter((n) => !n.read).length} new
            </span>
          </div>
          <div className="px-5 pb-5 space-y-2 max-h-[320px] overflow-y-auto">
            {notifications.map((n) => (
              <div
                key={n.id}
                className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-white/[0.02] transition-colors"
              >
                <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                  <Bell className="w-4 h-4 text-primary" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-white flex items-center gap-1.5">
                    {n.title}
                    {!n.read && (
                      <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                    )}
                  </p>
                  <p className="text-[11px] text-muted line-clamp-1">{n.message}</p>
                  <p className="text-[10px] text-muted/50 mt-0.5">{n.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
