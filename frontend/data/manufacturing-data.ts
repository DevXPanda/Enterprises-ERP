// ============================================================
//  Manufacturing Module — Static Mock Data
//  Used by all 6 manufacturing sub-pages.
// ============================================================

/* ------------------------------------------------------------------ */
/*  SHARED TYPES                                                       */
/* ------------------------------------------------------------------ */

export interface MfgKpi {
  id: string;
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: string;
  color: string;
}

/* ------------------------------------------------------------------ */
/*  DASHBOARD KPIs                                                     */
/* ------------------------------------------------------------------ */

export const mfgDashboardKpis: MfgKpi[] = [
  { id: "total-prod", label: "Total Production", value: "12,847", change: 8.2, changeLabel: "vs yesterday", icon: "Factory", color: "blue" },
  { id: "active-lines", label: "Active Lines", value: "3/4", changeLabel: "running", icon: "Activity", color: "green" },
  { id: "machine-uptime", label: "Machine Uptime", value: "96.2%", change: 1.4, changeLabel: "vs last week", icon: "Cog", color: "purple" },
  { id: "oee", label: "OEE", value: "87.4%", change: 3.1, changeLabel: "vs target 85%", icon: "Gauge", color: "blue" },
  { id: "qc-pass", label: "QC Pass Rate", value: "98.1%", change: 0.5, changeLabel: "vs yesterday", icon: "ShieldCheck", color: "green" },
  { id: "pending-orders", label: "Pending Orders", value: "47", change: -5, changeLabel: "vs last week", icon: "ClipboardList", color: "orange" },
];

/* ------------------------------------------------------------------ */
/*  PRODUCTION BY LINE (Bar chart)                                     */
/* ------------------------------------------------------------------ */

export interface ProductionByLine {
  line: string;
  produced: number;
  target: number;
}

export const productionByLine: ProductionByLine[] = [
  { line: "Line A", produced: 4820, target: 5000 },
  { line: "Line B", produced: 3650, target: 4000 },
  { line: "Line C", produced: 2890, target: 3200 },
  { line: "Line D", produced: 1487, target: 1800 },
];

/* ------------------------------------------------------------------ */
/*  OEE TREND (Area chart — 7 days)                                    */
/* ------------------------------------------------------------------ */

export interface OeeTrend {
  day: string;
  oee: number;
  target: number;
}

export const oeeTrend: OeeTrend[] = [
  { day: "Mon", oee: 85.2, target: 85 },
  { day: "Tue", oee: 87.8, target: 85 },
  { day: "Wed", oee: 84.1, target: 85 },
  { day: "Thu", oee: 89.3, target: 85 },
  { day: "Fri", oee: 87.4, target: 85 },
  { day: "Sat", oee: 82.5, target: 85 },
  { day: "Sun", oee: 78.9, target: 85 },
];

/* ------------------------------------------------------------------ */
/*  MACHINE STATUS (Table)                                             */
/* ------------------------------------------------------------------ */

export interface MfgMachine {
  id: string;
  name: string;
  line: string;
  status: "running" | "maintenance" | "idle";
  uptime: number;
  temperature: string;
  lastMaintenance: string;
  nextMaintenance: string;
  operator: string;
  hoursToday: number;
}

export const mfgMachines: MfgMachine[] = [
  { id: "m1", name: "Crusher #1", line: "Line A", status: "running", uptime: 98.2, temperature: "68°C", lastMaintenance: "28 Jun", nextMaintenance: "28 Jul", operator: "Ramesh K.", hoursToday: 7.5 },
  { id: "m2", name: "Crusher #2", line: "Line A", status: "running", uptime: 95.7, temperature: "72°C", lastMaintenance: "25 Jun", nextMaintenance: "25 Jul", operator: "Suresh P.", hoursToday: 7.5 },
  { id: "m3", name: "Raw Mill", line: "Line B", status: "running", uptime: 92.1, temperature: "55°C", lastMaintenance: "20 Jun", nextMaintenance: "20 Jul", operator: "Mahesh S.", hoursToday: 6.8 },
  { id: "m4", name: "Kiln #1", line: "Line A", status: "running", uptime: 99.1, temperature: "1450°C", lastMaintenance: "15 Jun", nextMaintenance: "15 Jul", operator: "Dinesh R.", hoursToday: 7.5 },
  { id: "m5", name: "Kiln #2", line: "Line B", status: "maintenance", uptime: 0, temperature: "—", lastMaintenance: "10 Jul", nextMaintenance: "12 Jul", operator: "—", hoursToday: 0 },
  { id: "m6", name: "Cement Mill #1", line: "Line A", status: "running", uptime: 94.5, temperature: "82°C", lastMaintenance: "01 Jul", nextMaintenance: "01 Aug", operator: "Vikram T.", hoursToday: 7.2 },
  { id: "m7", name: "Cement Mill #2", line: "Line C", status: "idle", uptime: 88.3, temperature: "32°C", lastMaintenance: "05 Jul", nextMaintenance: "05 Aug", operator: "—", hoursToday: 0 },
  { id: "m8", name: "Packer #1", line: "Line A", status: "running", uptime: 97.8, temperature: "42°C", lastMaintenance: "30 Jun", nextMaintenance: "30 Jul", operator: "Anil M.", hoursToday: 7.4 },
  { id: "m9", name: "Packer #2", line: "Line B", status: "running", uptime: 96.1, temperature: "40°C", lastMaintenance: "02 Jul", nextMaintenance: "02 Aug", operator: "Pradeep G.", hoursToday: 6.9 },
];

/* ------------------------------------------------------------------ */
/*  PRODUCTION LINES TABLE                                             */
/* ------------------------------------------------------------------ */

export interface ProductionLineRow {
  id: string;
  name: string;
  product: string;
  produced: number;
  target: number;
  efficiency: number;
  status: "running" | "idle" | "stopped";
  operator: string;
}

export const productionLines: ProductionLineRow[] = [
  { id: "pl1", name: "Line A", product: "OPC 53 Grade", produced: 4820, target: 5000, efficiency: 96.4, status: "running", operator: "Ramesh K." },
  { id: "pl2", name: "Line B", product: "PPC Cement", produced: 3650, target: 4000, efficiency: 91.3, status: "running", operator: "Suresh P." },
  { id: "pl3", name: "Line C", product: "White Cement", produced: 2890, target: 3200, efficiency: 90.3, status: "running", operator: "Mahesh S." },
  { id: "pl4", name: "Line D", product: "OPC 43 Grade", produced: 1487, target: 1800, efficiency: 82.6, status: "idle", operator: "Dinesh R." },
];

/* ------------------------------------------------------------------ */
/*  QC ALERTS                                                          */
/* ------------------------------------------------------------------ */

export interface QcAlertItem {
  id: string;
  line: string;
  issue: string;
  severity: "critical" | "warning" | "info";
  time: string;
  batch: string;
}

export const qcAlerts: QcAlertItem[] = [
  { id: "qc1", line: "Line A", issue: "Moisture content above 2.5%", severity: "warning", time: "10 min ago", batch: "B-2851" },
  { id: "qc2", line: "Line B", issue: "Bag weight variance ±1.2kg", severity: "critical", time: "25 min ago", batch: "B-2847" },
  { id: "qc3", line: "Line C", issue: "Color consistency deviation", severity: "info", time: "1 hr ago", batch: "B-2843" },
  { id: "qc4", line: "Line A", issue: "Compressive strength low", severity: "critical", time: "2 hr ago", batch: "B-2839" },
  { id: "qc5", line: "Line B", issue: "Setting time extended by 15min", severity: "warning", time: "3 hr ago", batch: "B-2835" },
];

/* ------------------------------------------------------------------ */
/*  SHIFT SUMMARY                                                      */
/* ------------------------------------------------------------------ */

export interface ShiftSummary {
  shift: string;
  time: string;
  production: number;
  operators: number;
  efficiency: number;
  status: "active" | "completed" | "upcoming";
}

export const shiftSummary: ShiftSummary[] = [
  { shift: "Shift 1", time: "06:00 – 14:00", production: 5240, operators: 12, efficiency: 94.2, status: "completed" },
  { shift: "Shift 2", time: "14:00 – 22:00", production: 4820, operators: 11, efficiency: 91.8, status: "active" },
  { shift: "Shift 3", time: "22:00 – 06:00", production: 0, operators: 10, efficiency: 0, status: "upcoming" },
];

/* ================================================================== */
/*  PRODUCTION ORDERS PAGE                                             */
/* ================================================================== */

export const productionOrdersKpis: MfgKpi[] = [
  { id: "total-orders", label: "Total Orders", value: "284", icon: "ClipboardList", color: "blue" },
  { id: "in-progress", label: "In Progress", value: "38", change: 12, icon: "Activity", color: "purple" },
  { id: "completed-today", label: "Completed Today", value: "14", change: 8, icon: "CheckCircle2", color: "green" },
  { id: "pending-po", label: "Pending", value: "47", change: -5, icon: "Clock", color: "orange" },
  { id: "avg-time", label: "Avg Completion", value: "4.2 hrs", change: -8, icon: "Timer", color: "blue" },
  { id: "ontime", label: "On-Time Rate", value: "94.7%", change: 2.1, icon: "Target", color: "green" },
];

export interface ProductionOrder {
  id: string;
  product: string;
  grade: string;
  quantity: number;
  unit: string;
  priority: "high" | "medium" | "low";
  startDate: string;
  dueDate: string;
  status: "in-progress" | "completed" | "pending" | "on-hold";
  progress: number;
  line: string;
}

export const productionOrders: ProductionOrder[] = [
  { id: "PO-2847", product: "OPC Cement", grade: "53 Grade", quantity: 5000, unit: "bags", priority: "high", startDate: "10 Jul", dueDate: "12 Jul", status: "in-progress", progress: 72, line: "Line A" },
  { id: "PO-2846", product: "PPC Cement", grade: "Standard", quantity: 3200, unit: "bags", priority: "medium", startDate: "10 Jul", dueDate: "13 Jul", status: "in-progress", progress: 45, line: "Line B" },
  { id: "PO-2845", product: "White Cement", grade: "Premium", quantity: 1800, unit: "bags", priority: "high", startDate: "09 Jul", dueDate: "11 Jul", status: "in-progress", progress: 88, line: "Line C" },
  { id: "PO-2844", product: "OPC Cement", grade: "43 Grade", quantity: 4500, unit: "bags", priority: "low", startDate: "11 Jul", dueDate: "14 Jul", status: "pending", progress: 0, line: "Line D" },
  { id: "PO-2843", product: "OPC Cement", grade: "53 Grade", quantity: 6000, unit: "bags", priority: "medium", startDate: "08 Jul", dueDate: "10 Jul", status: "completed", progress: 100, line: "Line A" },
  { id: "PO-2842", product: "PPC Cement", grade: "Standard", quantity: 2800, unit: "bags", priority: "high", startDate: "09 Jul", dueDate: "12 Jul", status: "on-hold", progress: 35, line: "Line B" },
  { id: "PO-2841", product: "OPC Cement", grade: "53 Grade", quantity: 7500, unit: "bags", priority: "medium", startDate: "07 Jul", dueDate: "09 Jul", status: "completed", progress: 100, line: "Line A" },
  { id: "PO-2840", product: "White Cement", grade: "Premium", quantity: 1200, unit: "bags", priority: "low", startDate: "08 Jul", dueDate: "11 Jul", status: "completed", progress: 100, line: "Line C" },
];

/* ================================================================== */
/*  BOM PAGE                                                           */
/* ================================================================== */

export const bomKpis: MfgKpi[] = [
  { id: "active-bom", label: "Active BOMs", value: "12", icon: "ScrollText", color: "blue" },
  { id: "raw-mat", label: "Raw Materials", value: "24", icon: "Layers", color: "purple" },
  { id: "avg-cost", label: "Avg Cost/Bag", value: "₹287", change: -2.3, icon: "IndianRupee", color: "green" },
  { id: "latest-rev", label: "Latest Revision", value: "v3.2", icon: "GitBranch", color: "orange" },
  { id: "total-recipes", label: "Total Recipes", value: "8", icon: "BookOpen", color: "blue" },
  { id: "pending-rev", label: "Pending Reviews", value: "2", icon: "AlertCircle", color: "red" },
];

export interface BomItem {
  id: string;
  product: string;
  grade: string;
  materials: number;
  costPerUnit: number;
  lastUpdated: string;
  status: "active" | "draft" | "archived";
  version: string;
  createdBy: string;
}

export const bomItems: BomItem[] = [
  { id: "BOM-001", product: "OPC Cement", grade: "53 Grade", materials: 6, costPerUnit: 295, lastUpdated: "08 Jul 2026", status: "active", version: "v3.2", createdBy: "Plant Manager" },
  { id: "BOM-002", product: "OPC Cement", grade: "43 Grade", materials: 6, costPerUnit: 275, lastUpdated: "05 Jul 2026", status: "active", version: "v2.8", createdBy: "Plant Manager" },
  { id: "BOM-003", product: "PPC Cement", grade: "Standard", materials: 7, costPerUnit: 268, lastUpdated: "03 Jul 2026", status: "active", version: "v4.1", createdBy: "QC Head" },
  { id: "BOM-004", product: "White Cement", grade: "Premium", materials: 5, costPerUnit: 420, lastUpdated: "01 Jul 2026", status: "active", version: "v2.0", createdBy: "R&D Team" },
  { id: "BOM-005", product: "Slag Cement", grade: "PSC", materials: 8, costPerUnit: 255, lastUpdated: "28 Jun 2026", status: "draft", version: "v1.3", createdBy: "QC Head" },
  { id: "BOM-006", product: "Rapid Set Cement", grade: "Special", materials: 9, costPerUnit: 385, lastUpdated: "25 Jun 2026", status: "draft", version: "v1.0", createdBy: "R&D Team" },
];

/* ================================================================== */
/*  JOB CARDS PAGE                                                     */
/* ================================================================== */

export const jobCardsKpis: MfgKpi[] = [
  { id: "active-cards", label: "Active Cards", value: "18", icon: "CreditCard", color: "blue" },
  { id: "completed-jc", label: "Completed Today", value: "24", change: 15, icon: "CheckCircle2", color: "green" },
  { id: "operators-shift", label: "Operators On-Shift", value: "33", icon: "Users", color: "purple" },
  { id: "avg-duration", label: "Avg Task Duration", value: "2.4 hrs", change: -6, icon: "Timer", color: "orange" },
  { id: "overdue-cards", label: "Overdue Cards", value: "3", icon: "AlertCircle", color: "red" },
  { id: "output-today", label: "Output Today", value: "12,847", change: 8.2, icon: "Factory", color: "blue" },
];

export interface JobCard {
  id: string;
  task: string;
  machine: string;
  operator: string;
  shift: string;
  startTime: string;
  endTime: string;
  status: "in-progress" | "completed" | "pending" | "overdue";
  output: number;
  target: number;
}

export const jobCards: JobCard[] = [
  { id: "JC-4501", task: "Crushing — Limestone", machine: "Crusher #1", operator: "Ramesh K.", shift: "Shift 2", startTime: "14:00", endTime: "18:00", status: "in-progress", output: 2400, target: 3000 },
  { id: "JC-4502", task: "Raw Grinding", machine: "Raw Mill", operator: "Mahesh S.", shift: "Shift 2", startTime: "14:00", endTime: "20:00", status: "in-progress", output: 1800, target: 2500 },
  { id: "JC-4503", task: "Kiln Operation", machine: "Kiln #1", operator: "Dinesh R.", shift: "Shift 2", startTime: "14:00", endTime: "22:00", status: "in-progress", output: 3200, target: 4000 },
  { id: "JC-4504", task: "Cement Grinding", machine: "Cement Mill #1", operator: "Vikram T.", shift: "Shift 2", startTime: "14:00", endTime: "20:00", status: "in-progress", output: 2100, target: 2800 },
  { id: "JC-4505", task: "Packing — 50kg bags", machine: "Packer #1", operator: "Anil M.", shift: "Shift 2", startTime: "14:00", endTime: "20:00", status: "in-progress", output: 1920, target: 2500 },
  { id: "JC-4496", task: "Crushing — Limestone", machine: "Crusher #1", operator: "Ramesh K.", shift: "Shift 1", startTime: "06:00", endTime: "14:00", status: "completed", output: 3100, target: 3000 },
  { id: "JC-4497", task: "Kiln Operation", machine: "Kiln #1", operator: "Suresh P.", shift: "Shift 1", startTime: "06:00", endTime: "14:00", status: "completed", output: 4200, target: 4000 },
  { id: "JC-4498", task: "Packing — 50kg bags", machine: "Packer #2", operator: "Pradeep G.", shift: "Shift 1", startTime: "06:00", endTime: "14:00", status: "completed", output: 2600, target: 2500 },
  { id: "JC-4499", task: "Kiln Maintenance", machine: "Kiln #2", operator: "Maintenance", shift: "—", startTime: "08:00", endTime: "—", status: "overdue", output: 0, target: 0 },
];

/* ================================================================== */
/*  MACHINES KPIs                                                      */
/* ================================================================== */

export const machinesKpis: MfgKpi[] = [
  { id: "total-m", label: "Total Machines", value: "9", icon: "Cog", color: "blue" },
  { id: "running-m", label: "Running", value: "7", icon: "Activity", color: "green" },
  { id: "maint-m", label: "Maintenance", value: "1", icon: "Wrench", color: "orange" },
  { id: "idle-m", label: "Idle", value: "1", icon: "PauseCircle", color: "purple" },
  { id: "avg-uptime-m", label: "Avg Uptime", value: "95.2%", change: 1.4, icon: "Gauge", color: "blue" },
  { id: "next-maint", label: "Next Maintenance", value: "12 Jul", icon: "Calendar", color: "red" },
];

/* ================================================================== */
/*  REPORTS PAGE                                                       */
/* ================================================================== */

export const reportsKpis: MfgKpi[] = [
  { id: "reports-gen", label: "Reports Generated", value: "156", icon: "FileBarChart", color: "blue" },
  { id: "avg-oee-r", label: "Avg OEE (Month)", value: "86.8%", change: 2.4, icon: "Gauge", color: "green" },
  { id: "total-prod-r", label: "Total Production", value: "3,85,420", icon: "Factory", color: "purple" },
  { id: "downtime-r", label: "Downtime Hours", value: "42.5 hrs", change: -12, icon: "Clock", color: "orange" },
  { id: "quality-r", label: "Quality Score", value: "97.8%", change: 1.1, icon: "ShieldCheck", color: "green" },
  { id: "fuel-cost-r", label: "Fuel Cost", value: "₹12.4L", change: -3.2, icon: "Flame", color: "red" },
];

export interface MonthlyProdReport {
  month: string;
  production: number;
  target: number;
}

export const monthlyProdReport: MonthlyProdReport[] = [
  { month: "Jan", production: 320000, target: 330000 },
  { month: "Feb", production: 310000, target: 330000 },
  { month: "Mar", production: 345000, target: 340000 },
  { month: "Apr", production: 355000, target: 350000 },
  { month: "May", production: 372000, target: 360000 },
  { month: "Jun", production: 385000, target: 370000 },
];

export interface OeeByLine {
  line: string;
  availability: number;
  performance: number;
  quality: number;
  oee: number;
}

export const oeeByLine: OeeByLine[] = [
  { line: "Line A", availability: 96.2, performance: 94.1, quality: 98.5, oee: 89.2 },
  { line: "Line B", availability: 92.8, performance: 91.5, quality: 97.2, oee: 82.4 },
  { line: "Line C", availability: 94.1, performance: 89.3, quality: 98.8, oee: 83.1 },
  { line: "Line D", availability: 88.5, performance: 85.2, quality: 96.1, oee: 72.4 },
];

export interface DowntimeData {
  reason: string;
  hours: number;
  color: string;
}

export const downtimeData: DowntimeData[] = [
  { reason: "Planned Maint.", hours: 18.5, color: "#2563EB" },
  { reason: "Breakdown", hours: 12.2, color: "#EF4444" },
  { reason: "Material Shortage", hours: 6.8, color: "#F59E0B" },
  { reason: "Power Outage", hours: 3.5, color: "#8B5CF6" },
  { reason: "Other", hours: 1.5, color: "#94A3B8" },
];
