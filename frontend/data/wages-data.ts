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

export const wagesDashboardKpis: WagesKpi[] = [
  { id: "active-workers", label: "Active Workers", value: "342/350", changeLabel: "on-duty today", icon: "Users", color: "blue" },
  { id: "wages-today", label: "Total Wages Today", value: "₹1,84,500", change: 4.2, changeLabel: "vs yesterday", icon: "IndianRupee", color: "green" },
  { id: "avg-daily-wage", label: "Avg Wage / Worker", value: "₹539", icon: "DollarSign", color: "purple" },
  { id: "payroll-status", label: "Payroll Status", value: "Approved", changeLabel: "for June", icon: "FileCheck", color: "blue" },
  { id: "attendance-rate", label: "Attendance Rate", value: "97.7%", change: 0.8, changeLabel: "vs target 95%", icon: "CalendarCheck", color: "green" },
  { id: "pending-approvals", label: "Pending Approvals", value: "4", change: -2, changeLabel: "timesheets", icon: "Clock", color: "orange" },
];

/* ------------------------------------------------------------------ */
/*  WAGE COST TREND (Area chart — 7 days)                              */
/* ------------------------------------------------------------------ */

export interface WageCostTrend {
  day: string;
  cost: number; // in ₹ Thousands
  target: number;
}

export const wageCostTrend: WageCostTrend[] = [
  { day: "Mon", cost: 178, target: 180 },
  { day: "Tue", cost: 184.5, target: 180 },
  { day: "Wed", cost: 181, target: 180 },
  { day: "Thu", cost: 189, target: 180 },
  { day: "Fri", cost: 185.2, target: 180 },
  { day: "Sat", cost: 120, target: 120 },
  { day: "Sun", cost: 95, target: 90 },
];

/* ------------------------------------------------------------------ */
/*  ATTENDANCE BY DEPARTMENT (Bar chart)                               */
/* ------------------------------------------------------------------ */

export interface DeptAttendance {
  department: string;
  present: number;
  total: number;
}

export const deptAttendance: DeptAttendance[] = [
  { department: "Crushing", present: 45, total: 46 },
  { department: "Raw Mill", present: 32, total: 34 },
  { department: "Kiln Dept", present: 58, total: 58 },
  { department: "Cement Mill", present: 41, total: 42 },
  { department: "Packing Line", present: 88, total: 90 },
  { department: "Dispatch Dept", present: 78, total: 80 },
];

/* ------------------------------------------------------------------ */
/*  SHIFT COST BREAKDOWN                                               */
/* ------------------------------------------------------------------ */

export interface ShiftCost {
  shift: string;
  cost: number;
  percentage: number;
  color: string;
}

export const shiftCostBreakdown: ShiftCost[] = [
  { shift: "Shift A (Morning)", cost: 72400, percentage: 39, color: "#2563EB" },
  { shift: "Shift B (Evening)", cost: 65100, percentage: 35, color: "#8B5CF6" },
  { shift: "Shift C (Night)", cost: 47000, percentage: 26, color: "#F59E0B" },
];

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

export const recentPayouts: RecentPayout[] = [
  { id: "PAY-9812", workerName: "Arun Sharma", department: "Kiln Dept", type: "Daily Wage", amount: 620, status: "paid", date: "12 Jul" },
  { id: "PAY-9811", workerName: "Vikram Singh", department: "Packing Line", type: "Daily Wage", amount: 480, status: "paid", date: "12 Jul" },
  { id: "PAY-9810", workerName: "Sanjay Patel", department: "Crushing", type: "Overtime Pay", amount: 240, status: "paid", date: "12 Jul" },
  { id: "PAY-9809", workerName: "Rajesh Kumar", department: "Raw Mill", type: "Daily Wage", amount: 550, status: "processing", date: "12 Jul" },
  { id: "PAY-9808", workerName: "Amit Verma", department: "Dispatch Dept", type: "Daily Wage", amount: 510, status: "hold", date: "11 Jul" },
];

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

export const pendingWageApprovals: PendingWageApproval[] = [
  { id: "APP-521", workerName: "Gopal Yadav", department: "Crushing", shift: "Shift B", regularHours: 8, otHours: 2.5, amount: 720 },
  { id: "APP-520", workerName: "Dinesh Prasad", department: "Packing Line", shift: "Shift B", regularHours: 8, otHours: 4.0, amount: 840 },
  { id: "APP-519", workerName: "Harish Gupta", department: "Raw Mill", shift: "Shift C", regularHours: 8, otHours: 0, amount: 550 },
  { id: "APP-518", workerName: "Karan Johar", department: "Dispatch Dept", shift: "Shift A", regularHours: 8, otHours: 1.5, amount: 610 },
];

/* ================================================================== */
/*  WORKERS PAGE DATA                                                  */
/* ================================================================== */

export const workersKpis: WagesKpi[] = [
  { id: "total-workers", label: "Total Workforce", value: "350", icon: "Users", color: "blue" },
  { id: "active-w", label: "Active Workers", value: "342", change: 4, icon: "UserCheck", color: "green" },
  { id: "onleave-w", label: "On Leave", value: "6", change: -2, icon: "UserMinus", color: "purple" },
  { id: "permanent-w", label: "Permanent", value: "148", icon: "Shield", color: "blue" },
  { id: "contractual-w", label: "Contractual", value: "202", icon: "FileText", color: "orange" },
  { id: "suspended-w", label: "Suspended", value: "2", icon: "AlertTriangle", color: "red" },
];

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

export const workersList: Worker[] = [
  { id: "WRK-001", name: "Arun Sharma", department: "Kiln Dept", type: "permanent", dailyRate: 620, bankAccount: "******4321", attendancePct: 98.4, status: "active" },
  { id: "WRK-002", name: "Vikram Singh", department: "Packing Line", type: "contractual", dailyRate: 480, bankAccount: "******8821", attendancePct: 94.2, status: "active" },
  { id: "WRK-003", name: "Sanjay Patel", department: "Crushing", type: "contractual", dailyRate: 510, bankAccount: "******1209", attendancePct: 92.8, status: "active" },
  { id: "WRK-004", name: "Rajesh Kumar", department: "Raw Mill", type: "permanent", dailyRate: 550, bankAccount: "******5491", attendancePct: 99.1, status: "active" },
  { id: "WRK-005", name: "Amit Verma", department: "Dispatch Dept", type: "permanent", dailyRate: 510, bankAccount: "******7732", attendancePct: 95.6, status: "leave" },
  { id: "WRK-006", name: "Gopal Yadav", department: "Crushing", type: "contractual", dailyRate: 480, bankAccount: "******0982", attendancePct: 91.2, status: "active" },
  { id: "WRK-007", name: "Dinesh Prasad", department: "Packing Line", type: "contractual", dailyRate: 480, bankAccount: "******3411", attendancePct: 93.5, status: "active" },
  { id: "WRK-008", name: "Harish Gupta", department: "Raw Mill", type: "permanent", dailyRate: 550, bankAccount: "******2290", attendancePct: 88.4, status: "suspended" },
];

/* ================================================================== */
/*  ATTENDANCE PAGE DATA                                                */
/* ================================================================== */

export const attendanceKpis: WagesKpi[] = [
  { id: "present-today", label: "Present Today", value: "342", change: 3, icon: "UserCheck", color: "green" },
  { id: "absent-today", label: "Absent Today", value: "2", change: -1, icon: "UserX", color: "red" },
  { id: "on-leave", label: "On Leave", value: "6", icon: "UserMinus", color: "purple" },
  { id: "late-entries", label: "Late Entries", value: "14", change: -4, icon: "Clock", color: "orange" },
  { id: "overtime-hrs", label: "Overtime Hours", value: "48.5h", change: 12, icon: "Timer", color: "blue" },
  { id: "shift-coverage", label: "Shift Coverage", value: "97.7%", icon: "Target", color: "green" },
];

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

export const attendanceList: WorkerAttendance[] = [
  { id: "WRK-001", name: "Arun Sharma", date: "12 Jul 2026", shift: "Shift A", inTime: "05:55", outTime: "14:02", workingHours: 8, otHours: 0, status: "present" },
  { id: "WRK-002", name: "Vikram Singh", date: "12 Jul 2026", shift: "Shift A", inTime: "06:12", outTime: "14:00", workingHours: 8, otHours: 0, status: "present" },
  { id: "WRK-003", name: "Sanjay Patel", date: "12 Jul 2026", shift: "Shift B", inTime: "13:58", outTime: "22:00", workingHours: 8, otHours: 1.5, status: "present" },
  { id: "WRK-004", name: "Rajesh Kumar", date: "12 Jul 2026", shift: "Shift B", inTime: "14:00", outTime: "22:05", workingHours: 8, otHours: 0.5, status: "present" },
  { id: "WRK-005", name: "Amit Verma", date: "12 Jul 2026", shift: "Shift A", inTime: "—", outTime: "—", workingHours: 0, otHours: 0, status: "leave" },
  { id: "WRK-006", name: "Gopal Yadav", date: "12 Jul 2026", shift: "Shift B", inTime: "14:30", outTime: "22:00", workingHours: 7.5, otHours: 0, status: "present" },
  { id: "WRK-007", name: "Dinesh Prasad", date: "12 Jul 2026", shift: "Shift A", inTime: "06:00", outTime: "12:00", workingHours: 6, otHours: 0, status: "half-day" },
  { id: "WRK-008", name: "Harish Gupta", date: "12 Jul 2026", shift: "—", inTime: "—", outTime: "—", workingHours: 0, otHours: 0, status: "absent" },
];

/* ================================================================== */
/*  PAYROLL PAGE DATA                                                  */
/* ================================================================== */

export const payrollKpis: WagesKpi[] = [
  { id: "monthly-payroll", label: "Monthly Payroll", value: "₹45.2L", change: 3.8, icon: "IndianRupee", color: "blue" },
  { id: "paid-payouts", label: "Paid", value: "338", icon: "CheckCircle", color: "green" },
  { id: "processing-p", label: "Processing", value: "8", icon: "RefreshCw", color: "purple" },
  { id: "hold-payouts", label: "On Hold", value: "4", icon: "AlertTriangle", color: "orange" },
  { id: "avg-deductions", label: "Avg Deductions", value: "₹1,240", icon: "Percent", color: "blue" },
  { id: "bonuses-paid", label: "Bonuses Paid", value: "₹1.8L", icon: "Gift", color: "green" },
];

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

export const payrollList: PayrollRow[] = [
  { payoutId: "PAY-9812", workerId: "WRK-001", name: "Arun Sharma", baseWages: 18600, overtimePay: 1200, deductions: 500, bonuses: 1000, netPayable: 20300, status: "paid" },
  { payoutId: "PAY-9811", workerId: "WRK-002", name: "Vikram Singh", baseWages: 14400, overtimePay: 800, deductions: 400, bonuses: 500, netPayable: 15300, status: "paid" },
  { payoutId: "PAY-9810", workerId: "WRK-003", name: "Sanjay Patel", baseWages: 15300, overtimePay: 1500, deductions: 600, bonuses: 500, netPayable: 16700, status: "paid" },
  { payoutId: "PAY-9809", workerId: "WRK-004", name: "Rajesh Kumar", baseWages: 16500, overtimePay: 0, deductions: 500, bonuses: 1000, netPayable: 17000, status: "processing" },
  { payoutId: "PAY-9808", workerId: "WRK-005", name: "Amit Verma", baseWages: 15300, overtimePay: 400, deductions: 1200, bonuses: 0, netPayable: 14500, status: "hold" },
  { payoutId: "PAY-9807", workerId: "WRK-006", name: "Gopal Yadav", baseWages: 14400, overtimePay: 1200, deductions: 400, bonuses: 500, netPayable: 15700, status: "paid" },
];

/* ================================================================== */
/*  REPORTS PAGE DATA                                                  */
/* ================================================================== */

export const wagesReportsKpis: WagesKpi[] = [
  { id: "reports-gen", label: "Reports Generated", value: "94", icon: "FileText", color: "blue" },
  { id: "avg-monthly-r", label: "Avg Monthly Cost", value: "₹44.8L", change: 1.5, icon: "TrendingUp", color: "green" },
  { id: "ytd-wages", label: "YTD Wages", value: "₹2.68Cr", icon: "IndianRupee", color: "purple" },
  { id: "payout-accuracy", label: "Payout Accuracy", value: "99.9%", change: 0.1, icon: "Check", color: "green" },
  { id: "ot-expense-r", label: "OT Expenses", value: "₹2.4L", change: -8.5, icon: "Timer", color: "orange" },
  { id: "bonus-impact-r", label: "Bonus Impact", value: "₹1.8L", icon: "Sparkles", color: "blue" },
];

export interface MonthlyWageReport {
  month: string;
  cost: number; // in ₹ Lakhs
  target: number;
}

export const monthlyWageReport: MonthlyWageReport[] = [
  { month: "Jan", cost: 41.2, target: 40.0 },
  { month: "Feb", cost: 42.0, target: 40.0 },
  { month: "Mar", cost: 43.8, target: 42.0 },
  { month: "Apr", cost: 45.1, target: 44.0 },
  { month: "May", cost: 44.6, target: 44.0 },
  { month: "Jun", cost: 45.2, target: 45.0 },
];

export interface OvertimeTrend {
  month: string;
  overtimeHours: number;
  cost: number; // in ₹ Thousands
}

export const overtimeTrend: OvertimeTrend[] = [
  { month: "Jan", overtimeHours: 320, cost: 48 },
  { month: "Feb", overtimeHours: 290, cost: 43.5 },
  { month: "Mar", overtimeHours: 410, cost: 61.5 },
  { month: "Apr", overtimeHours: 380, cost: 57 },
  { month: "May", overtimeHours: 350, cost: 52.5 },
  { month: "Jun", overtimeHours: 425, cost: 63.8 },
];

export interface CategoryCost {
  category: string;
  cost: number;
  color: string;
}

export const categoryCost: CategoryCost[] = [
  { category: "Permanent Workers", cost: 2460000, color: "#2563EB" },
  { category: "Contract Workers", cost: 1880000, color: "#8B5CF6" },
  { category: "Supervisors/Staff", cost: 180000, color: "#F59E0B" },
];
