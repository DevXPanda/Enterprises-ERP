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

export const factoryKpiData: FactoryKpi[] = [];

/* ------------------------------------------------------------------ */
/*  ATTENDANCE TREND (7 days)                                          */
/* ------------------------------------------------------------------ */

export const attendanceTrend = [];

/* ------------------------------------------------------------------ */
/*  GATE ENTRIES BY TYPE                                               */
/* ------------------------------------------------------------------ */

export const gateEntriesByType = [];

/* ------------------------------------------------------------------ */
/*  RECENT ACTIVITY                                                    */
/* ------------------------------------------------------------------ */

export const recentActivity: ActivityItem[] = [];

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

export const factoryMachineStatus: FactoryMachineStatus[] = [];

/* ------------------------------------------------------------------ */
/*  ANNOUNCEMENTS                                                      */
/* ------------------------------------------------------------------ */

export const announcements: AnnouncementItem[] = [];
