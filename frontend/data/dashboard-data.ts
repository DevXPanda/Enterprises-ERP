import type {
  KpiData,
  ProductionLine,
  MachineStatus,
  QcAlert,
  DealerOrder,
  FactoryComparison,
  AlertItem,
  LowStockItem,
  TrendDataPoint,
  MonthlyPerformance,
  NotificationItem,
  PurchasePending,
  CashCollection,
} from "@/types/dashboard";

/* ------------------------------------------------------------------ */
/*  KPI CARDS                                                          */
/* ------------------------------------------------------------------ */

export const kpiData: KpiData[] = [
  {
    id: "production",
    label: "Today's Production",
    value: "12,847",
    change: 8.2,
    changeLabel: "vs yesterday",
    icon: "Factory",
    color: "blue",
  },
  {
    id: "dispatch",
    label: "Today's Dispatch",
    value: "9,234",
    change: 5.1,
    changeLabel: "vs yesterday",
    icon: "Truck",
    color: "green",
  },
  {
    id: "orders",
    label: "Current Orders",
    value: "284",
    change: -2.3,
    changeLabel: "vs last week",
    icon: "ClipboardList",
    color: "orange",
  },
  {
    id: "machines",
    label: "Machine Status",
    value: "18/22",
    changeLabel: "running",
    icon: "Cog",
    color: "purple",
  },
  {
    id: "qc",
    label: "QC Alerts",
    value: "7",
    change: -12,
    changeLabel: "vs yesterday",
    icon: "ShieldAlert",
    color: "red",
  },
  {
    id: "oee",
    label: "OEE",
    value: "87.4%",
    change: 3.1,
    changeLabel: "vs target 85%",
    icon: "Gauge",
    color: "blue",
  },
];

/* ------------------------------------------------------------------ */
/*  PRODUCTION TREND (7 days)                                          */
/* ------------------------------------------------------------------ */

export const productionTrend: TrendDataPoint[] = [
  { name: "Mon", value: 11200, value2: 10500 },
  { name: "Tue", value: 12400, value2: 11000 },
  { name: "Wed", value: 11800, value2: 10800 },
  { name: "Thu", value: 13100, value2: 11500 },
  { name: "Fri", value: 12847, value2: 12000 },
  { name: "Sat", value: 9800, value2: 9500 },
  { name: "Sun", value: 7200, value2: 7000 },
];

/* ------------------------------------------------------------------ */
/*  REVENUE TREND (12 months)                                          */
/* ------------------------------------------------------------------ */

export const revenueTrend: TrendDataPoint[] = [
  { name: "Jan", value: 42 },
  { name: "Feb", value: 48 },
  { name: "Mar", value: 45 },
  { name: "Apr", value: 52 },
  { name: "May", value: 58 },
  { name: "Jun", value: 55 },
  { name: "Jul", value: 62 },
  { name: "Aug", value: 68 },
  { name: "Sep", value: 65 },
  { name: "Oct", value: 72 },
  { name: "Nov", value: 78 },
  { name: "Dec", value: 82 },
];

/* ------------------------------------------------------------------ */
/*  PROFIT TREND (6 months)                                            */
/* ------------------------------------------------------------------ */

export const profitTrend: TrendDataPoint[] = [
  { name: "Jul", value: 18.2, value2: 15.5 },
  { name: "Aug", value: 21.4, value2: 17.2 },
  { name: "Sep", value: 19.8, value2: 16.8 },
  { name: "Oct", value: 24.1, value2: 19.3 },
  { name: "Nov", value: 26.7, value2: 21.1 },
  { name: "Dec", value: 28.3, value2: 22.5 },
];

/* ------------------------------------------------------------------ */
/*  MONTHLY PERFORMANCE                                                */
/* ------------------------------------------------------------------ */

export const monthlyPerformance: MonthlyPerformance[] = [
  { month: "Jul", production: 345000, target: 350000, revenue: 42.5 },
  { month: "Aug", production: 368000, target: 350000, revenue: 46.2 },
  { month: "Sep", production: 352000, target: 360000, revenue: 44.8 },
  { month: "Oct", production: 385000, target: 370000, revenue: 49.1 },
  { month: "Nov", production: 398000, target: 380000, revenue: 52.3 },
  { month: "Dec", production: 412000, target: 400000, revenue: 55.8 },
];

/* ------------------------------------------------------------------ */
/*  FACTORY COMPARISON                                                 */
/* ------------------------------------------------------------------ */

export const factoryComparison: FactoryComparison[] = [
  { factory: "Plant A — Mumbai", production: 4820, target: 5000, efficiency: 96.4, oee: 91.2 },
  { factory: "Plant B — Pune", production: 3650, target: 4000, efficiency: 91.3, oee: 87.5 },
  { factory: "Plant C — Nagpur", production: 2890, target: 3200, efficiency: 90.3, oee: 84.1 },
  { factory: "Plant D — Nashik", production: 1487, target: 1800, efficiency: 82.6, oee: 78.9 },
];

/* ------------------------------------------------------------------ */
/*  DEALER ORDERS                                                      */
/* ------------------------------------------------------------------ */

export const dealerOrders: DealerOrder[] = [
  { id: "ORD-4521", dealer: "Sharma Enterprises", product: "Cement 50kg", qty: 2400, status: "processing", date: "08 Jul 2026" },
  { id: "ORD-4520", dealer: "Patel Traders", product: "Cement 50kg", qty: 1800, status: "dispatched", date: "07 Jul 2026" },
  { id: "ORD-4519", dealer: "Gupta Suppliers", product: "White Cement", qty: 600, status: "pending", date: "07 Jul 2026" },
  { id: "ORD-4518", dealer: "Singh Materials", product: "Cement 50kg", qty: 3200, status: "delivered", date: "06 Jul 2026" },
  { id: "ORD-4517", dealer: "Reddy & Sons", product: "PPC Cement", qty: 1500, status: "processing", date: "06 Jul 2026" },
];

/* ------------------------------------------------------------------ */
/*  PURCHASE PENDING                                                   */
/* ------------------------------------------------------------------ */

export const purchasePending: PurchasePending[] = [
  { id: "PO-891", item: "Limestone (Grade A)", vendor: "Rocky Minerals Ltd", amount: 425000, status: "in-transit", expectedDate: "10 Jul" },
  { id: "PO-890", item: "Gypsum", vendor: "Gypsum India Pvt Ltd", amount: 185000, status: "ordered", expectedDate: "12 Jul" },
  { id: "PO-889", item: "Coal (Thermal)", vendor: "Eastern Coal Corp", amount: 780000, status: "approval", expectedDate: "15 Jul" },
  { id: "PO-888", item: "Packing Bags 50kg", vendor: "PackWell Industries", amount: 92000, status: "in-transit", expectedDate: "09 Jul" },
];

/* ------------------------------------------------------------------ */
/*  CASH COLLECTION                                                    */
/* ------------------------------------------------------------------ */

export const cashCollection: CashCollection[] = [
  { id: "INV-3421", dealer: "Sharma Enterprises", amount: 1250000, dueDate: "05 Jul", status: "overdue" },
  { id: "INV-3418", dealer: "Patel Traders", amount: 840000, dueDate: "08 Jul", status: "due-today" },
  { id: "INV-3415", dealer: "Gupta Suppliers", amount: 520000, dueDate: "12 Jul", status: "upcoming" },
  { id: "INV-3412", dealer: "Reddy & Sons", amount: 960000, dueDate: "15 Jul", status: "upcoming" },
];

/* ------------------------------------------------------------------ */
/*  RECENT ALERTS                                                      */
/* ------------------------------------------------------------------ */

export const recentAlerts: AlertItem[] = [
  { id: "a1", title: "Kiln Temperature High", description: "Kiln #2 temperature exceeded 1500°C threshold", type: "critical", time: "5 min ago", read: false },
  { id: "a2", title: "Production Target Achieved", description: "Line A has met its daily target of 5000 bags", type: "success", time: "22 min ago", read: false },
  { id: "a3", title: "Maintenance Due", description: "Crusher #1 scheduled maintenance in 2 days", type: "warning", time: "1 hr ago", read: true },
  { id: "a4", title: "New Order Received", description: "ORD-4522 from Mumbai Builders for 4000 bags", type: "info", time: "2 hr ago", read: true },
  { id: "a5", title: "QC Batch Rejected", description: "Batch B-2847 failed compressive strength test", type: "critical", time: "3 hr ago", read: true },
];

/* ------------------------------------------------------------------ */
/*  QC ALERTS                                                          */
/* ------------------------------------------------------------------ */

export const qcAlerts: QcAlert[] = [
  { id: "qc1", line: "Line A", issue: "Moisture content above 2.5%", severity: "warning", time: "10 min ago" },
  { id: "qc2", line: "Line B", issue: "Bag weight variance ±1.2kg", severity: "critical", time: "25 min ago" },
  { id: "qc3", line: "Line C", issue: "Color consistency deviation", severity: "info", time: "1 hr ago" },
];

/* ------------------------------------------------------------------ */
/*  LOW STOCK                                                          */
/* ------------------------------------------------------------------ */

export const lowStockItems: LowStockItem[] = [
  { id: "ls1", material: "Limestone (Grade A)", current: 45, minimum: 100, unit: "MT", daysLeft: 3 },
  { id: "ls2", material: "Gypsum", current: 28, minimum: 50, unit: "MT", daysLeft: 5 },
  { id: "ls3", material: "Coal (Thermal)", current: 60, minimum: 120, unit: "MT", daysLeft: 4 },
  { id: "ls4", material: "Packing Bags 50kg", current: 8500, minimum: 15000, unit: "pcs", daysLeft: 2 },
  { id: "ls5", material: "Iron Ore", current: 35, minimum: 60, unit: "MT", daysLeft: 6 },
];

/* ------------------------------------------------------------------ */
/*  MACHINE STATUS                                                     */
/* ------------------------------------------------------------------ */

export const machineStatuses: MachineStatus[] = [
  { id: "m1", name: "Crusher #1", status: "running", uptime: 98.2, line: "Line A" },
  { id: "m2", name: "Crusher #2", status: "running", uptime: 95.7, line: "Line A" },
  { id: "m3", name: "Raw Mill", status: "running", uptime: 92.1, line: "Line B" },
  { id: "m4", name: "Kiln #1", status: "running", uptime: 99.1, line: "Line A" },
  { id: "m5", name: "Kiln #2", status: "maintenance", uptime: 0, line: "Line B" },
  { id: "m6", name: "Cement Mill #1", status: "running", uptime: 94.5, line: "Line A" },
  { id: "m7", name: "Cement Mill #2", status: "idle", uptime: 88.3, line: "Line C" },
  { id: "m8", name: "Packer #1", status: "running", uptime: 97.8, line: "Line A" },
];

/* ------------------------------------------------------------------ */
/*  NOTIFICATIONS                                                      */
/* ------------------------------------------------------------------ */

export const notifications: NotificationItem[] = [
  { id: "n1", title: "Shift Change", message: "Evening shift starts in 30 minutes", type: "system", time: "5 min ago", read: false },
  { id: "n2", title: "New Order", message: "ORD-4522 received from Mumbai Builders", type: "order", time: "15 min ago", read: false },
  { id: "n3", title: "Machine Alert", message: "Kiln #2 scheduled for maintenance", type: "machine", time: "1 hr ago", read: true },
  { id: "n4", title: "QC Report Ready", message: "Daily quality report is available", type: "alert", time: "2 hr ago", read: true },
  { id: "n5", title: "Dispatch Complete", message: "ORD-4520 dispatched to Patel Traders", type: "order", time: "3 hr ago", read: true },
];

/* ------------------------------------------------------------------ */
/*  PRODUCTION LINES                                                   */
/* ------------------------------------------------------------------ */

export const productionLines: ProductionLine[] = [
  { id: "pl1", name: "Line A", product: "OPC 53 Grade", produced: 4820, target: 5000, efficiency: 96.4, status: "running", operator: "Ramesh K." },
  { id: "pl2", name: "Line B", product: "PPC Cement", produced: 3650, target: 4000, efficiency: 91.3, status: "running", operator: "Suresh P." },
  { id: "pl3", name: "Line C", product: "White Cement", produced: 2890, target: 3200, efficiency: 90.3, status: "running", operator: "Mahesh S." },
  { id: "pl4", name: "Line D", product: "OPC 43 Grade", produced: 1487, target: 1800, efficiency: 82.6, status: "idle", operator: "Dinesh R." },
];
