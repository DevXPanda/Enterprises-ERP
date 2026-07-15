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

export const mfgDashboardKpis: MfgKpi[] = [];

/* ------------------------------------------------------------------ */
/*  PRODUCTION BY LINE (Bar chart)                                     */
/* ------------------------------------------------------------------ */

export interface ProductionByLine {
  line: string;
  produced: number;
  target: number;
}

export const productionByLine: ProductionByLine[] = [];

/* ------------------------------------------------------------------ */
/*  OEE TREND (Area chart — 7 days)                                    */
/* ------------------------------------------------------------------ */

export interface OeeTrend {
  day: string;
  oee: number;
  target: number;
}

export const oeeTrend: OeeTrend[] = [];

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

export const mfgMachines: MfgMachine[] = [];

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

export const productionLines: ProductionLineRow[] = [];

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

export const qcAlerts: QcAlertItem[] = [];

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

export const shiftSummary: ShiftSummary[] = [];

/* ================================================================== */
/*  PRODUCTION ORDERS PAGE                                             */
/* ================================================================== */

export const productionOrdersKpis: MfgKpi[] = [];

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

export const productionOrders: ProductionOrder[] = [];

/* ================================================================== */
/*  BOM PAGE                                                           */
/* ================================================================== */

export const bomKpis: MfgKpi[] = [];

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

export const bomItems: BomItem[] = [];

/* ================================================================== */
/*  JOB CARDS PAGE                                                     */
/* ================================================================== */

export const jobCardsKpis: MfgKpi[] = [];

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

export const jobCards: JobCard[] = [];

/* ================================================================== */
/*  MACHINES KPIs                                                      */
/* ================================================================== */

export const machinesKpis: MfgKpi[] = [];

/* ================================================================== */
/*  REPORTS PAGE                                                       */
/* ================================================================== */

export const reportsKpis: MfgKpi[] = [];

export interface MonthlyProdReport {
  month: string;
  production: number;
  target: number;
}

export const monthlyProdReport: MonthlyProdReport[] = [];

export interface OeeByLine {
  line: string;
  availability: number;
  performance: number;
  quality: number;
  oee: number;
}

export const oeeByLine: OeeByLine[] = [];

export interface DowntimeData {
  reason: string;
  hours: number;
  color: string;
}

export const downtimeData: DowntimeData[] = [];
