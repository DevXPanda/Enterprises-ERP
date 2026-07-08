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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  expandedMenus: string[];
  toggleMenu: (menu: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  dashboard: <LayoutDashboard className="w-5 h-5 shrink-0" />,
  manufacturing: <Factory className="w-5 h-5 shrink-0" />,
  wages: <Wallet className="w-5 h-5 shrink-0" />,
  settings: <Settings className="w-5 h-5 shrink-0" />,
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
};

interface MenuItem {
  key: string;
  label: string;
  href?: string;
  icon: string;
  children?: { key: string; label: string; href: string; icon: string }[];
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
  {
    key: "settings",
    label: "Settings",
    href: "/settings",
    icon: "settings",
  },
];

export function Sidebar({ isCollapsed, toggleSidebar, expandedMenus, toggleMenu }: SidebarProps) {
  const pathname = usePathname();

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/") return pathname === "/";
    return pathname.startsWith(href);
  };

  const isParentActive = (item: MenuItem) => {
    if (item.href) return isActive(item.href);
    return item.children?.some((child) => isActive(child.href)) || false;
  };

  return (
    <aside
      className={cn(
        "fixed left-0 top-0 h-screen z-40 flex flex-col",
        "bg-sidebar border-r border-border/30",
        "transition-all duration-300 ease-in-out",
        isCollapsed ? "w-[68px]" : "w-[260px]"
      )}
      role="navigation"
      aria-label="Main Navigation"
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-border/30 shrink-0">
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

                {/* Children */}
                {!isCollapsed && expandedMenus.includes(item.key) && (
                  <div className="mt-1 space-y-0.5 animate-slide-in">
                    {item.children.map((child) => (
                      <Link
                        key={child.key}
                        href={child.href}
                        className={cn(
                          "sidebar-item-child relative hover:translate-x-0.5",
                          isActive(child.href) && "active pl-[48px]"
                        )}
                        aria-label={child.label}
                      >
                        {isActive(child.href) && (
                          <span className="absolute left-[34px] top-1/4 bottom-1/4 w-[3px] bg-primary rounded-r animate-fade-in" />
                        )}
                        {iconMap[child.icon] || (
                          <ChevronRight className="w-3.5 h-3.5 shrink-0" />
                        )}
                        <span>{child.label}</span>
                      </Link>
                    ))}
                  </div>
                )}
              </>
            ) : (
              /* Simple link */
              <Link
                href={item.href!}
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

      {/* Collapse toggle button */}
      <div className="px-3 py-3 border-t border-border/20 shrink-0">
        <button
          onClick={toggleSidebar}
          className="sidebar-item w-full justify-center hover:translate-x-0"
          title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? (
            <PanelLeftOpen className="w-5 h-5" />
          ) : (
            <>
              <PanelLeftClose className="w-5 h-5" />
              <span>Collapse</span>
            </>
          )}
        </button>
      </div>
    </aside>
  );
}
