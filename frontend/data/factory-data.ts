// ============================================================
//  Factory Module — Static Data
//  All placeholder data for the Factory dashboard and pages.
//  No backend. No API calls. Frontend-only.
// ============================================================

export interface FactoryKpi {
  id: string;
  label: string;
  value: string;
  change?: number;
  changeLabel?: string;
  icon: string;
  color: "blue" | "green" | "orange" | "purple" | "red";
}

export interface ActivityItem {
  id: string;
  title: string;
  description: string;
  type: "entry" | "exit" | "material" | "alert" | "approval" | "production";
  time: string;
  user: string;
}

export interface QuickAction {
  id: string;
  label: string;
  description: string;
  icon: string;
  href: string;
  color: "blue" | "green" | "orange" | "purple";
}

export interface AnnouncementItem {
  id: string;
  title: string;
  body: string;
  priority: "high" | "medium" | "low";
  date: string;
  author: string;
}

export interface FactoryMachineStatus {
  id: string;
  name: string;
  line: string;
  status: "running" | "idle" | "maintenance";
  uptime: number;
}

/* ------------------------------------------------------------------ */
/*  KPI CARDS                                                          */
/* ------------------------------------------------------------------ */

export const factoryKpiData: FactoryKpi[] = [
  {
    id: "employees",
    label: "Total Employees",
    value: "428",
    change: 3,
    changeLabel: "vs last month",
    icon: "Users2",
    color: "blue",
  },
  {
    id: "visitors",
    label: "Visitors Today",
    value: "23",
    change: 15,
    changeLabel: "vs yesterday",
    icon: "UserCheck",
    color: "green",
  },
  {
    id: "gate-entries",
    label: "Gate Entries",
    value: "156",
    change: 8,
    changeLabel: "since 6 AM",
    icon: "ScanLine",
    color: "purple",
  },
  {
    id: "material-in",
    label: "Material In",
    value: "24",
    changeLabel: "trucks today",
    icon: "PackagePlus",
    color: "blue",
  },
  {
    id: "material-out",
    label: "Material Out",
    value: "18",
    changeLabel: "trucks today",
    icon: "PackageMinus",
    color: "orange",
  },
  {
    id: "prod-orders",
    label: "Active Orders",
    value: "67",
    change: 5,
    changeLabel: "vs yesterday",
    icon: "ClipboardList",
    color: "purple",
  },
  {
    id: "machines",
    label: "Machines Running",
    value: "18/22",
    changeLabel: "82% operational",
    icon: "Cog",
    color: "green",
  },
  {
    id: "qc-pending",
    label: "QC Pending",
    value: "12",
    change: -3,
    changeLabel: "vs yesterday",
    icon: "FlaskConical",
    color: "orange",
  },
  {
    id: "dispatch-ready",
    label: "Dispatch Ready",
    value: "8",
    changeLabel: "awaiting exit",
    icon: "Truck",
    color: "green",
  },
];

/* ------------------------------------------------------------------ */
/*  ATTENDANCE TREND (7 days)                                          */
/* ------------------------------------------------------------------ */

export const attendanceTrend = [
  { day: "Mon", present: 398, absent: 30 },
  { day: "Tue", present: 412, absent: 16 },
  { day: "Wed", present: 405, absent: 23 },
  { day: "Thu", present: 421, absent: 7 },
  { day: "Fri", present: 418, absent: 10 },
  { day: "Sat", present: 380, absent: 48 },
  { day: "Sun", present: 195, absent: 233 },
];

/* ------------------------------------------------------------------ */
/*  GATE ENTRIES BY TYPE                                               */
/* ------------------------------------------------------------------ */

export const gateEntriesByType = [
  { type: "Employees", count: 418 },
  { type: "Visitors", count: 23 },
  { type: "Contractors", count: 14 },
  { type: "Vehicles", count: 38 },
  { type: "Material", count: 42 },
];

/* ------------------------------------------------------------------ */
/*  RECENT ACTIVITY                                                    */
/* ------------------------------------------------------------------ */

export const recentActivity: ActivityItem[] = [
  {
    id: "a1",
    title: "Employee Entry",
    description: "EMP-1024 Ramesh Kumar entered via Gate 1",
    type: "entry",
    time: "2 min ago",
    user: "Gate Officer",
  },
  {
    id: "a2",
    title: "Material In",
    description: "Truck MH12-AB-3456 — Limestone 12 MT",
    type: "material",
    time: "5 min ago",
    user: "Gate Officer",
  },
  {
    id: "a3",
    title: "QC Alert",
    description: "Batch B-2947 failed moisture check — on hold",
    type: "alert",
    time: "12 min ago",
    user: "QC Supervisor",
  },
  {
    id: "a4",
    title: "Gate Pass Issued",
    description: "GP-4512 for visitor Mr. Ajay Sharma (TATA Projects)",
    type: "approval",
    time: "18 min ago",
    user: "Admin",
  },
  {
    id: "a5",
    title: "Production Order Released",
    description: "PO-2891 → Line A — OPC 53 Grade, 5000 bags",
    type: "production",
    time: "25 min ago",
    user: "Production Manager",
  },
  {
    id: "a6",
    title: "Material Out",
    description: "Truck MH14-CD-7890 dispatched — Cement 240 MT",
    type: "exit",
    time: "32 min ago",
    user: "Gate Officer",
  },
  {
    id: "a7",
    title: "Visitor Entry",
    description: "Mr. Suresh Patel (Infra Consultants) — Gate 2",
    type: "entry",
    time: "41 min ago",
    user: "Gate Officer",
  },
  {
    id: "a8",
    title: "Shift Change",
    description: "Evening shift started — 214 employees checked in",
    type: "entry",
    time: "1 hr ago",
    user: "System",
  },
];

/* ------------------------------------------------------------------ */
/*  QUICK ACTIONS                                                      */
/* ------------------------------------------------------------------ */

export const quickActions: QuickAction[] = [
  {
    id: "qa1",
    label: "New Gate Pass",
    description: "Issue pass for visitor or contractor",
    icon: "FileCheck",
    href: "/factory/smart-access/gate-pass",
    color: "blue",
  },
  {
    id: "qa2",
    label: "Employee Entry",
    description: "Log factory employee entry",
    icon: "UserPlus",
    href: "/factory/smart-access/employee-entry",
    color: "green",
  },
  {
    id: "qa3",
    label: "Material In",
    description: "Record incoming material",
    icon: "PackagePlus",
    href: "/factory/material-gate/material-in",
    color: "purple",
  },
  {
    id: "qa4",
    label: "Production Order",
    description: "Create new production order",
    icon: "ClipboardList",
    href: "/factory/production/production-orders",
    color: "orange",
  },
  {
    id: "qa5",
    label: "QC Inspection",
    description: "Start quality control check",
    icon: "FlaskConical",
    href: "/factory/quality-control/incoming-qc",
    color: "green",
  },
  {
    id: "qa6",
    label: "Dispatch Order",
    description: "Process a dispatch order",
    icon: "Truck",
    href: "/factory/dispatch/dispatch-orders",
    color: "blue",
  },
];

/* ------------------------------------------------------------------ */
/*  MACHINE STATUS                                                     */
/* ------------------------------------------------------------------ */

export const factoryMachineStatus: FactoryMachineStatus[] = [
  { id: "m1", name: "Crusher #1", line: "Line A", status: "running", uptime: 98.2 },
  { id: "m2", name: "Raw Mill", line: "Line B", status: "running", uptime: 94.7 },
  { id: "m3", name: "Kiln #1", line: "Line A", status: "running", uptime: 99.1 },
  { id: "m4", name: "Kiln #2", line: "Line B", status: "maintenance", uptime: 0 },
  { id: "m5", name: "Cement Mill #2", line: "Line C", status: "idle", uptime: 88.3 },
  { id: "m6", name: "Packer #1", line: "Line A", status: "running", uptime: 97.8 },
];

/* ------------------------------------------------------------------ */
/*  ANNOUNCEMENTS                                                      */
/* ------------------------------------------------------------------ */

export const announcements: AnnouncementItem[] = [
  {
    id: "an1",
    title: "Safety Audit Scheduled",
    body: "Annual safety audit on 15th July. All departments must prepare documentation and ensure compliance checklists are complete.",
    priority: "high",
    date: "10 Jul 2026",
    author: "Safety Manager",
  },
  {
    id: "an2",
    title: "System Maintenance Window",
    body: "NEP platform maintenance scheduled for Sunday 13th July 02:00–04:00 AM. Gate access will be manual during this window.",
    priority: "medium",
    date: "09 Jul 2026",
    author: "IT Admin",
  },
  {
    id: "an3",
    title: "New Morning Shift Timings",
    body: "Effective 15th July, morning shift begins at 06:30 AM. Update biometric and shift schedules accordingly.",
    priority: "medium",
    date: "08 Jul 2026",
    author: "HR Manager",
  },
];
