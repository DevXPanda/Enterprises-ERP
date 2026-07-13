"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Factory,
  Wallet,
  Settings,
  ChevronDown,
  ChevronRight,
  ClipboardList,
  ScrollText,
  CreditCard,
  Users,
  CalendarCheck,
  BarChart3,
  Boxes,
  Cog,
  FileBarChart,
  PanelLeftClose,
  PanelLeftOpen,
  Menu,
  // --- Factory module icons ---
  Building2,
  ScanLine,
  Users2,
  CalendarDays,
  UserCheck,
  PackageCheck,
  ShieldCheck,
  Warehouse,
  Truck,
  RefreshCw,
  UserPlus,
  Briefcase,
  Car,
  PackagePlus,
  PackageMinus,
  FileCheck,
  QrCode,
  Layers,
  FlaskConical,
  PauseCircle,
  XSquare,
  ArrowRightLeft,
  BookOpen,
  Receipt,
  LogOut,
  Database,
  RotateCcw,
  AlertCircle,
  CheckCircle2,
  Activity,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  isMobileOpen: boolean;
  closeMobileMenu: () => void;
  expandedMenus: string[];
  toggleMenu: (menu: string) => void;
  onLogout?: () => void;
}

const iconMap: Record<string, React.ReactNode> = {
  // --- Existing modules ---
  dashboard: <LayoutDashboard className="w-5 h-5 shrink-0" />,
  manufacturing: <Factory className="w-5 h-5 shrink-0" />,
  wages: <Wallet className="w-5 h-5 shrink-0" />,
  settings: <Settings className="w-5 h-5 shrink-0" />,
  logout: <LogOut className="w-5 h-5 shrink-0" />,
  "production-orders": <ClipboardList className="w-4 h-4 shrink-0" />,
  bom: <ScrollText className="w-4 h-4 shrink-0" />,
  "job-cards": <CreditCard className="w-4 h-4 shrink-0" />,
  machines: <Cog className="w-4 h-4 shrink-0" />,
  reports: <FileBarChart className="w-4 h-4 shrink-0" />,
  workers: <Users className="w-4 h-4 shrink-0" />,
  attendance: <CalendarCheck className="w-4 h-4 shrink-0" />,
  payroll: <Boxes className="w-4 h-4 shrink-0" />,
  "mfg-dashboard": <BarChart3 className="w-4 h-4 shrink-0" />,
  "wages-dashboard": <BarChart3 className="w-4 h-4 shrink-0" />,

  // --- Factory module: parent sections ---
  factory: <Building2 className="w-5 h-5 shrink-0" />,
  "factory-dashboard": <LayoutDashboard className="w-4 h-4 shrink-0" />,
  "smart-access": <ScanLine className="w-5 h-5 shrink-0" />,
  "factory-emp-mgmt": <Users2 className="w-5 h-5 shrink-0" />,
  "factory-attendance": <CalendarDays className="w-5 h-5 shrink-0" />,
  "visitor-management": <UserCheck className="w-5 h-5 shrink-0" />,
  "material-gate": <PackageCheck className="w-5 h-5 shrink-0" />,
  "factory-production": <Cog className="w-5 h-5 shrink-0" />,
  "quality-control": <ShieldCheck className="w-5 h-5 shrink-0" />,
  store: <Warehouse className="w-5 h-5 shrink-0" />,
  "factory-dispatch": <Truck className="w-5 h-5 shrink-0" />,
  "factory-reports": <BarChart3 className="w-5 h-5 shrink-0" />,
  "tally-connector": <RefreshCw className="w-5 h-5 shrink-0" />,

  // --- Factory: Smart Access children ---
  "employee-entry": <UserPlus className="w-4 h-4 shrink-0" />,
  "visitor-entry": <UserCheck className="w-4 h-4 shrink-0" />,
  "contractor-entry": <Briefcase className="w-4 h-4 shrink-0" />,
  "vehicle-entry": <Car className="w-4 h-4 shrink-0" />,
  "access-mat-in": <PackagePlus className="w-4 h-4 shrink-0" />,
  "access-mat-out": <PackageMinus className="w-4 h-4 shrink-0" />,
  "access-gate-pass": <FileCheck className="w-4 h-4 shrink-0" />,
  "qr-verification": <QrCode className="w-4 h-4 shrink-0" />,

  // --- Factory: Employee Management children ---
  "emp-employees": <Users className="w-4 h-4 shrink-0" />,
  "emp-departments": <Layers className="w-4 h-4 shrink-0" />,
  "emp-designation": <FileCheck className="w-4 h-4 shrink-0" />,
  "emp-shifts": <CalendarDays className="w-4 h-4 shrink-0" />,
  "emp-documents": <BookOpen className="w-4 h-4 shrink-0" />,

  // --- Factory: Attendance children ---
  "att-dashboard": <BarChart3 className="w-4 h-4 shrink-0" />,
  "dept-checkin": <CalendarCheck className="w-4 h-4 shrink-0" />,
  "supervisor-approval": <CheckCircle2 className="w-4 h-4 shrink-0" />,
  "shift-management": <CalendarDays className="w-4 h-4 shrink-0" />,
  "att-reports": <FileBarChart className="w-4 h-4 shrink-0" />,

  // --- Factory: Visitor Management children ---
  "vm-visitors": <UserCheck className="w-4 h-4 shrink-0" />,
  "vm-requests": <ClipboardList className="w-4 h-4 shrink-0" />,
  "vm-approvals": <CheckCircle2 className="w-4 h-4 shrink-0" />,
  "vm-history": <BookOpen className="w-4 h-4 shrink-0" />,

  // --- Factory: Material Gate children ---
  "mg-mat-in": <PackagePlus className="w-4 h-4 shrink-0" />,
  "mg-mat-out": <PackageMinus className="w-4 h-4 shrink-0" />,
  "mg-gate-pass": <FileCheck className="w-4 h-4 shrink-0" />,
  "mg-qc": <FlaskConical className="w-4 h-4 shrink-0" />,

  // --- Factory: Production children ---
  "prod-orders": <ClipboardList className="w-4 h-4 shrink-0" />,
  "prod-machines": <Cog className="w-4 h-4 shrink-0" />,
  "prod-operators": <Users className="w-4 h-4 shrink-0" />,
  "prod-batches": <Layers className="w-4 h-4 shrink-0" />,
  "prod-output": <Activity className="w-4 h-4 shrink-0" />,

  // --- Factory: Quality Control children ---
  "incoming-qc": <FlaskConical className="w-4 h-4 shrink-0" />,
  "production-qc": <FlaskConical className="w-4 h-4 shrink-0" />,
  "dispatch-qc": <FlaskConical className="w-4 h-4 shrink-0" />,
  "hold-items": <PauseCircle className="w-4 h-4 shrink-0" />,
  "rejected-items": <XSquare className="w-4 h-4 shrink-0" />,

  // --- Factory: Store children ---
  "mat-receipt": <PackageCheck className="w-4 h-4 shrink-0" />,
  "mat-issue": <PackageMinus className="w-4 h-4 shrink-0" />,
  "stock-transfer": <ArrowRightLeft className="w-4 h-4 shrink-0" />,
  "current-stock": <Warehouse className="w-4 h-4 shrink-0" />,
  "stock-ledger": <BookOpen className="w-4 h-4 shrink-0" />,

  // --- Factory: Dispatch children ---
  "dispatch-orders": <ClipboardList className="w-4 h-4 shrink-0" />,
  "dispatch-vehicles": <Car className="w-4 h-4 shrink-0" />,
  "invoice-ref": <Receipt className="w-4 h-4 shrink-0" />,
  "dispatch-gate-pass": <FileCheck className="w-4 h-4 shrink-0" />,
  "mat-exit": <LogOut className="w-4 h-4 shrink-0" />,

  // --- Factory: Reports children ---
  "rpt-attendance": <CalendarCheck className="w-4 h-4 shrink-0" />,
  "rpt-visitor": <UserCheck className="w-4 h-4 shrink-0" />,
  "rpt-material": <PackageCheck className="w-4 h-4 shrink-0" />,
  "rpt-production": <BarChart3 className="w-4 h-4 shrink-0" />,
  "rpt-qc": <FlaskConical className="w-4 h-4 shrink-0" />,
  "rpt-dispatch": <Truck className="w-4 h-4 shrink-0" />,
  "audit-logs": <Database className="w-4 h-4 shrink-0" />,

  // --- Factory: Tally Connector children ---
  "sync-queue": <RefreshCw className="w-4 h-4 shrink-0" />,
  "failed-txns": <AlertCircle className="w-4 h-4 shrink-0" />,
  "retry-queue": <RotateCcw className="w-4 h-4 shrink-0" />,
  "error-logs": <Database className="w-4 h-4 shrink-0" />,
};

// Leaf item — deepest level, always a route
interface LeafItem {
  key: string;
  label: string;
  href: string;
  icon: string;
}

// Section item — level-2 child: either a direct link OR a collapsible group with leaves
interface SectionItem {
  key: string;
  label: string;
  href?: string;
  icon: string;
  children?: LeafItem[];
}

// Top-level menu item
interface MenuItem {
  key: string;
  label: string;
  href?: string;
  icon: string;
  children?: SectionItem[];
}

const menuItems: MenuItem[] = [
  {
    key: "dashboard",
    label: "Dashboard",
    href: "/",
    icon: "dashboard",
  },
  {
    key: "manufacturing",
    label: "Manufacturing",
    icon: "manufacturing",
    children: [
      { key: "mfg-dashboard", label: "Dashboard", href: "/manufacturing/dashboard", icon: "mfg-dashboard" },
      { key: "production-orders", label: "Production Orders", href: "/manufacturing/production-orders", icon: "production-orders" },
      { key: "bom", label: "BOM", href: "/manufacturing/bom", icon: "bom" },
      { key: "job-cards", label: "Job Cards", href: "/manufacturing/job-cards", icon: "job-cards" },
      { key: "machines", label: "Machines", href: "/manufacturing/machines", icon: "machines" },
      { key: "mfg-reports", label: "Reports", href: "/manufacturing/reports", icon: "reports" },
    ],
  },
  {
    key: "wages",
    label: "Wages",
    icon: "wages",
    children: [
      { key: "wages-dashboard", label: "Dashboard", href: "/wages/dashboard", icon: "wages-dashboard" },
      { key: "workers", label: "Workers", href: "/wages/workers", icon: "workers" },
      { key: "attendance", label: "Attendance", href: "/wages/attendance", icon: "attendance" },
      { key: "payroll", label: "Payroll", href: "/wages/payroll", icon: "payroll" },
      { key: "wages-reports", label: "Reports", href: "/wages/reports", icon: "reports" },
    ],
  },
  // ----------------------------------------------------------------
  //  FACTORY MODULE  — single top-level item, nested 3 levels deep
  // ----------------------------------------------------------------
  {
    key: "factory",
    label: "Factory",
    icon: "factory",
    children: [
      // ── Dashboard (direct link, no sub-menu)
      { key: "factory-dashboard", label: "Dashboard", href: "/factory", icon: "factory-dashboard" },

      // ── Smart Factory Access
      {
        key: "smart-access",
        label: "Smart Factory Access",
        icon: "smart-access",
        children: [
          { key: "employee-entry",   label: "Employee Entry",   href: "/factory/smart-access/employee-entry",   icon: "employee-entry" },
          { key: "visitor-entry",    label: "Visitor Entry",    href: "/factory/smart-access/visitor-entry",    icon: "visitor-entry" },
          { key: "contractor-entry", label: "Contractor Entry", href: "/factory/smart-access/contractor-entry", icon: "contractor-entry" },
          { key: "vehicle-entry",    label: "Vehicle Entry",    href: "/factory/smart-access/vehicle-entry",    icon: "vehicle-entry" },
          { key: "access-mat-in",    label: "Material In",      href: "/factory/smart-access/material-in",      icon: "access-mat-in" },
          { key: "access-mat-out",   label: "Material Out",     href: "/factory/smart-access/material-out",     icon: "access-mat-out" },
          { key: "access-gate-pass", label: "Gate Pass",        href: "/factory/smart-access/gate-pass",        icon: "access-gate-pass" },
          { key: "qr-verification",  label: "QR Verification",  href: "/factory/smart-access/qr-verification",  icon: "qr-verification" },
        ],
      },

      // ── Employee Management
      {
        key: "factory-emp-mgmt",
        label: "Employee Management",
        icon: "factory-emp-mgmt",
        children: [
          { key: "emp-employees",   label: "Employees",   href: "/factory/employee-management/employees",   icon: "emp-employees" },
          { key: "emp-departments", label: "Departments", href: "/factory/employee-management/departments", icon: "emp-departments" },
          { key: "emp-designation", label: "Designation", href: "/factory/employee-management/designation", icon: "emp-designation" },
          { key: "emp-shifts",      label: "Shifts",      href: "/factory/employee-management/shifts",      icon: "emp-shifts" },
          { key: "emp-documents",   label: "Documents",   href: "/factory/employee-management/documents",   icon: "emp-documents" },
        ],
      },

      // ── Attendance
      {
        key: "factory-attendance",
        label: "Attendance",
        icon: "factory-attendance",
        children: [
          { key: "att-dashboard",       label: "Dashboard",           href: "/factory/attendance/dashboard",          icon: "att-dashboard" },
          { key: "dept-checkin",        label: "Department Check-In", href: "/factory/attendance/department-checkin",  icon: "dept-checkin" },
          { key: "supervisor-approval", label: "Supervisor Approval", href: "/factory/attendance/supervisor-approval", icon: "supervisor-approval" },
          { key: "shift-management",    label: "Shift Management",    href: "/factory/attendance/shift-management",   icon: "shift-management" },
          { key: "att-reports",         label: "Attendance Reports",  href: "/factory/attendance/reports",           icon: "att-reports" },
        ],
      },

      // ── Visitor Management
      {
        key: "visitor-management",
        label: "Visitor Management",
        icon: "visitor-management",
        children: [
          { key: "vm-visitors",  label: "Visitors",      href: "/factory/visitor-management/visitors",      icon: "vm-visitors" },
          { key: "vm-requests",  label: "Requests",      href: "/factory/visitor-management/requests",      icon: "vm-requests" },
          { key: "vm-approvals", label: "Approvals",     href: "/factory/visitor-management/approvals",     icon: "vm-approvals" },
          { key: "vm-history",   label: "Visit History", href: "/factory/visitor-management/visit-history", icon: "vm-history" },
        ],
      },

      // ── Material Gate
      {
        key: "material-gate",
        label: "Material Gate",
        icon: "material-gate",
        children: [
          { key: "mg-mat-in",    label: "Material In",    href: "/factory/material-gate/material-in",    icon: "mg-mat-in" },
          { key: "mg-mat-out",   label: "Material Out",   href: "/factory/material-gate/material-out",   icon: "mg-mat-out" },
          { key: "mg-gate-pass", label: "Gate Pass",      href: "/factory/material-gate/gate-pass",      icon: "mg-gate-pass" },
          { key: "mg-qc",        label: "QC Verification",href: "/factory/material-gate/qc-verification",icon: "mg-qc" },
        ],
      },

      // ── Production
      {
        key: "factory-production",
        label: "Production",
        icon: "factory-production",
        children: [
          { key: "prod-orders",    label: "Production Orders", href: "/factory/production/production-orders", icon: "prod-orders" },
          { key: "prod-machines",  label: "Machines",          href: "/factory/production/machines",          icon: "prod-machines" },
          { key: "prod-operators", label: "Operators",         href: "/factory/production/operators",         icon: "prod-operators" },
          { key: "prod-batches",   label: "Batch Management",  href: "/factory/production/batch-management",  icon: "prod-batches" },
          { key: "prod-output",    label: "Output",            href: "/factory/production/output",            icon: "prod-output" },
        ],
      },

      // ── Quality Control
      {
        key: "quality-control",
        label: "Quality Control",
        icon: "quality-control",
        children: [
          { key: "incoming-qc",    label: "Incoming QC",   href: "/factory/quality-control/incoming-qc",   icon: "incoming-qc" },
          { key: "production-qc",  label: "Production QC", href: "/factory/quality-control/production-qc", icon: "production-qc" },
          { key: "dispatch-qc",    label: "Dispatch QC",   href: "/factory/quality-control/dispatch-qc",   icon: "dispatch-qc" },
          { key: "hold-items",     label: "Hold Items",    href: "/factory/quality-control/hold-items",    icon: "hold-items" },
          { key: "rejected-items", label: "Rejected Items",href: "/factory/quality-control/rejected-items",icon: "rejected-items" },
        ],
      },

      // ── Store
      {
        key: "store",
        label: "Store",
        icon: "store",
        children: [
          { key: "mat-receipt",    label: "Material Receipt", href: "/factory/store/material-receipt", icon: "mat-receipt" },
          { key: "mat-issue",      label: "Material Issue",   href: "/factory/store/material-issue",   icon: "mat-issue" },
          { key: "stock-transfer", label: "Stock Transfer",   href: "/factory/store/stock-transfer",   icon: "stock-transfer" },
          { key: "current-stock",  label: "Current Stock",    href: "/factory/store/current-stock",    icon: "current-stock" },
          { key: "stock-ledger",   label: "Stock Ledger",     href: "/factory/store/stock-ledger",     icon: "stock-ledger" },
        ],
      },

      // ── Dispatch
      {
        key: "factory-dispatch",
        label: "Dispatch",
        icon: "factory-dispatch",
        children: [
          { key: "dispatch-orders",    label: "Dispatch Orders",  href: "/factory/dispatch/dispatch-orders",  icon: "dispatch-orders" },
          { key: "dispatch-vehicles",  label: "Vehicles",         href: "/factory/dispatch/vehicles",         icon: "dispatch-vehicles" },
          { key: "invoice-ref",        label: "Invoice Reference",href: "/factory/dispatch/invoice-reference", icon: "invoice-ref" },
          { key: "dispatch-gate-pass", label: "Gate Pass",        href: "/factory/dispatch/gate-pass",        icon: "dispatch-gate-pass" },
          { key: "mat-exit",           label: "Material Exit",    href: "/factory/dispatch/material-exit",    icon: "mat-exit" },
        ],
      },

      // ── Reports
      {
        key: "factory-reports",
        label: "Reports",
        icon: "factory-reports",
        children: [
          { key: "rpt-attendance", label: "Attendance", href: "/factory/reports/attendance", icon: "rpt-attendance" },
          { key: "rpt-visitor",    label: "Visitor",    href: "/factory/reports/visitor",    icon: "rpt-visitor" },
          { key: "rpt-material",   label: "Material",   href: "/factory/reports/material",   icon: "rpt-material" },
          { key: "rpt-production", label: "Production", href: "/factory/reports/production", icon: "rpt-production" },
          { key: "rpt-qc",         label: "QC",         href: "/factory/reports/qc",         icon: "rpt-qc" },
          { key: "rpt-dispatch",   label: "Dispatch",   href: "/factory/reports/dispatch",   icon: "rpt-dispatch" },
          { key: "audit-logs",     label: "Audit Logs", href: "/factory/reports/audit-logs", icon: "audit-logs" },
        ],
      },

      // ── Tally Connector
      {
        key: "tally-connector",
        label: "Tally Connector",
        icon: "tally-connector",
        children: [
          { key: "sync-queue",  label: "Sync Queue",          href: "/factory/tally-connector/sync-queue",          icon: "sync-queue" },
          { key: "failed-txns", label: "Failed Transactions", href: "/factory/tally-connector/failed-transactions", icon: "failed-txns" },
          { key: "retry-queue", label: "Retry Queue",         href: "/factory/tally-connector/retry-queue",         icon: "retry-queue" },
          { key: "error-logs",  label: "Error Logs",          href: "/factory/tally-connector/error-logs",          icon: "error-logs" },
        ],
      },
    ],
  },
  {
    key: "settings",
    label: "Settings",
    href: "/settings",
    icon: "settings",
  },
];

export function Sidebar({
  isCollapsed,
  toggleSidebar,
  isMobileOpen,
  closeMobileMenu,
  expandedMenus,
  toggleMenu,
  onLogout,
}: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isParentActive = (item: MenuItem) => {
    if (item.href) return isActive(item.href);
    return (
      item.children?.some(
        (child) =>
          (child.href && isActive(child.href)) ||
          child.children?.some((leaf) => isActive(leaf.href))
      ) || false
    );
  };

  const isSectionActive = (section: SectionItem) => {
    if (section.href) return isActive(section.href);
    return section.children?.some((leaf) => isActive(leaf.href)) || false;
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen z-40 flex flex-col",
        "bg-sidebar border-r border-border/30",
        "transition-transform md:transition-all duration-300 ease-in-out",
        "w-[260px]",
        isCollapsed ? "md:w-[68px]" : "md:w-[260px]",
        isMobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
      )}
      role="navigation"
      aria-label="Main Navigation"
    >
      {/* Logo */}
      <div className="flex items-center justify-between px-4 h-16 border-b border-border/30 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl overflow-hidden flex items-center justify-center shrink-0 bg-white/10">
            <img src="/logo.png" alt="NK Tech Logo" className="w-full h-full object-contain" />
          </div>
          {!isCollapsed && (
            <div className="overflow-hidden animate-fade-in">
              <p className="text-sm font-bold text-white leading-tight truncate">
                NKTech ERP
              </p>
              <p className="text-[10px] text-muted leading-tight">
                Enterprise Platform
              </p>
            </div>
          )}
        </div>
        <button
          onClick={toggleSidebar}
          className="w-7 h-7 flex items-center justify-center rounded-lg text-muted hover:text-white hover:bg-white/10 transition-all duration-200"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <Menu className="w-4.5 h-4.5" />
          ) : (
            <Menu className="w-4.5 h-4.5" />
          )}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        {menuItems.map((item) => (
          <div key={item.key}>
            {item.children ? (
              /* Parent with children */
              <>
                <button
                  onClick={() => toggleMenu(item.key)}
                  className={cn(
                    "sidebar-item w-full hover:translate-x-0.5",
                    isParentActive(item) && "active"
                  )}
                  aria-expanded={expandedMenus.includes(item.key)}
                  aria-label={`Toggle ${item.label} menu`}
                >
                  {iconMap[item.icon]}
                  {!isCollapsed && (
                    <>
                      <span className="flex-1 text-left">{item.label}</span>
                      <ChevronDown
                        className={cn(
                          "w-4 h-4 transition-transform duration-300",
                          expandedMenus.includes(item.key) ? "rotate-0" : "-rotate-90"
                        )}
                      />
                    </>
                  )}
                </button>

                {/* Level-2 children — either a direct link OR a collapsible section */}
                {!isCollapsed && expandedMenus.includes(item.key) && (
                  <div className="mt-1 space-y-0.5 animate-slide-in">
                    {item.children.map((child) =>
                      child.children ? (
                        /* ── Collapsible section (level-2 parent, e.g. "Employee Management") */
                        <div key={child.key}>
                          <button
                            onClick={() => toggleMenu(child.key)}
                            className={cn(
                              "sidebar-item-child w-full hover:translate-x-0.5",
                              isSectionActive(child) && "text-white"
                            )}
                            aria-expanded={expandedMenus.includes(child.key)}
                            aria-label={`Toggle ${child.label}`}
                          >
                            {iconMap[child.icon] || <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                            <span className="flex-1 text-left">{child.label}</span>
                            <ChevronDown
                              className={cn(
                                "w-3 h-3 transition-transform duration-200 shrink-0",
                                expandedMenus.includes(child.key) ? "rotate-0" : "-rotate-90"
                              )}
                            />
                          </button>

                          {/* Level-3 leaf pages */}
                          {expandedMenus.includes(child.key) && (
                            <div className="mt-0.5 space-y-0.5 animate-slide-in">
                              {child.children.map((leaf) => (
                                  <Link
                                    key={leaf.key}
                                    href={leaf.href}
                                    onClick={closeMobileMenu}
                                    className={cn(
                                      "flex items-center gap-2 pl-[56px] pr-3 py-1.5 rounded-lg text-[11px] font-medium",
                                      "text-muted/75 transition-all duration-150 cursor-pointer relative",
                                      "hover:text-white hover:bg-white/[0.05] hover:translate-x-0.5",
                                      isActive(leaf.href) && "text-white bg-white/[0.06] pl-[60px]"
                                    )}
                                    aria-label={leaf.label}
                                  >
                                    {isActive(leaf.href) && (
                                      <span className="absolute left-[46px] top-1/4 bottom-1/4 w-[2px] bg-primary rounded-r animate-fade-in" />
                                    )}
                                    {iconMap[leaf.icon] || <ChevronRight className="w-3 h-3 shrink-0" />}
                                    <span>{leaf.label}</span>
                                  </Link>
                                ))}
                              </div>
                            )}
                          </div>
                        ) : (
                          /* ── Direct link child (e.g. "Dashboard" inside Factory) */
                          <Link
                            key={child.key}
                            href={child.href!}
                            onClick={closeMobileMenu}
                            className={cn(
                              "sidebar-item-child relative hover:translate-x-0.5",
                              isActive(child.href) && "active pl-[48px]"
                            )}
                            aria-label={child.label}
                          >
                            {isActive(child.href) && (
                              <span className="absolute left-[34px] top-1/4 bottom-1/4 w-[3px] bg-primary rounded-r animate-fade-in" />
                            )}
                            {iconMap[child.icon] || <ChevronRight className="w-3.5 h-3.5 shrink-0" />}
                            <span>{child.label}</span>
                          </Link>
                        )
                      )}
                    </div>
                  )}
                </>
              ) : (
                /* Simple link */
                <Link
                  href={item.href!}
                  onClick={closeMobileMenu}
                  className={cn(
                    "sidebar-item relative hover:translate-x-0.5",
                    isActive(item.href) && "active pl-4"
                  )}
                  aria-label={item.label}
                >
                  {isActive(item.href) && (
                    <span className="absolute left-0 top-1/4 bottom-1/4 w-[3px] bg-primary rounded-r animate-fade-in" />
                  )}
                  {iconMap[item.icon]}
                  {!isCollapsed && <span>{item.label}</span>}
                </Link>
              )}
          </div>
        ))}
      </nav>

      {/* Footer info */}
      {!isCollapsed ? (
        <div className="px-5 py-4 border-t border-border/20 shrink-0 text-[11px] text-muted/60 space-y-0.5 animate-fade-in">
          <p className="font-semibold text-white/70">NKTech Enterprises</p>
          <div className="flex items-center justify-between">
            <span>Version 1.0.0</span>
            <span>© NKTech</span>
          </div>
        </div>
      ) : (
        <div className="py-4 border-t border-border/20 shrink-0 text-[9px] text-center text-muted/50 font-semibold">
          v1.0
        </div>
      )}


    </aside>
  );
}
