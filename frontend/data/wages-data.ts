// ============================================================
//  Wages Module — Static Mock Data
//  Used by all 5 Wages sub-pages.
// ============================================================

export interface WagesKpi {
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

export const wagesDashboardKpis: WagesKpi[] = [];

/* ------------------------------------------------------------------ */
/*  WAGE COST TREND (Area chart — 7 days)                              */
/* ------------------------------------------------------------------ */

export interface WageCostTrend {
  day: string;
  cost: number; // in ₹ Thousands
  target: number;
}

export const wageCostTrend: WageCostTrend[] = [];

/* ------------------------------------------------------------------ */
/*  ATTENDANCE BY DEPARTMENT (Bar chart)                               */
/* ------------------------------------------------------------------ */

export interface DeptAttendance {
  department: string;
  present: number;
  total: number;
}

export const deptAttendance: DeptAttendance[] = [];

/* ------------------------------------------------------------------ */
/*  SHIFT COST BREAKDOWN                                               */
/* ------------------------------------------------------------------ */

export interface ShiftCost {
  shift: string;
  cost: number;
  percentage: number;
  color: string;
}

export const shiftCostBreakdown: ShiftCost[] = [];

/* ------------------------------------------------------------------ */
/*  RECENT PAYOUTS TABLE                                               */
/* ------------------------------------------------------------------ */

export interface RecentPayout {
  id: string;
  workerName: string;
  department: string;
  type: string;
  amount: number;
  status: "paid" | "processing" | "hold";
  date: string;
}

export const recentPayouts: RecentPayout[] = [];

/* ------------------------------------------------------------------ */
/*  PENDING APPROVALS TABLE                                             */
/* ------------------------------------------------------------------ */

export interface PendingWageApproval {
  id: string;
  workerName: string;
  department: string;
  shift: string;
  regularHours: number;
  otHours: number;
  amount: number;
}

export const pendingWageApprovals: PendingWageApproval[] = [];

/* ================================================================== */
/*  WORKERS PAGE DATA                                                  */
/* ================================================================== */

export const workersKpis: WagesKpi[] = [];

export interface Worker {
  id: string;
  name: string;
  department: string;
  type: "permanent" | "contractual";
  dailyRate: number;
  bankAccount: string;
  attendancePct: number;
  status: "active" | "leave" | "suspended";
}

export const workersList: Worker[] = [];

/* ================================================================== */
/*  ATTENDANCE PAGE DATA                                                */
/* ================================================================== */

export const attendanceKpis: WagesKpi[] = [];

export interface WorkerAttendance {
  id: string;
  name: string;
  date: string;
  shift: string;
  inTime: string;
  outTime: string;
  workingHours: number;
  otHours: number;
  status: "present" | "absent" | "leave" | "half-day";
}

export const attendanceList: WorkerAttendance[] = [];

/* ================================================================== */
/*  PAYROLL PAGE DATA                                                  */
/* ================================================================== */

export const payrollKpis: WagesKpi[] = [];

export interface PayrollRow {
  payoutId: string;
  workerId: string;
  name: string;
  baseWages: number;
  overtimePay: number;
  deductions: number;
  bonuses: number;
  netPayable: number;
  status: "paid" | "processing" | "hold";
}

export const payrollList: PayrollRow[] = [];

/* ================================================================== */
/*  REPORTS PAGE DATA                                                  */
/* ================================================================== */

export const wagesReportsKpis: WagesKpi[] = [];

export interface MonthlyWageReport {
  month: string;
  cost: number; // in ₹ Lakhs
  target: number;
}

export const monthlyWageReport: MonthlyWageReport[] = [];

export interface OvertimeTrend {
  month: string;
  overtimeHours: number;
  cost: number; // in ₹ Thousands
}

export const overtimeTrend: OvertimeTrend[] = [];

export interface CategoryCost {
  category: string;
  cost: number;
  color: string;
}

export const categoryCost: CategoryCost[] = [];
