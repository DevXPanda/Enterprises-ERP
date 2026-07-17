"use client";

// Mobile-only floating bottom tab bar (md:hidden), visible on all pages.
// Module icons switch between the five areas; in-module pages are reached
// via each module's category grid. Desktop/tablet unchanged.
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Wallet,
  Building2,
  Factory,
  Settings,
} from "lucide-react";
import { cn } from "@/lib/utils";

const TABS = [
  { key: "dashboard", label: "Home", href: "/", icon: <LayoutDashboard className="w-5 h-5" /> },
  { key: "wages", label: "Wages", href: "/wages/dashboard", icon: <Wallet className="w-5 h-5" /> },
  { key: "factory", label: "Factory", href: "/factory", icon: <Building2 className="w-5 h-5" /> },
  { key: "manufacturing", label: "Mfg", href: "/manufacturing/dashboard", icon: <Factory className="w-5 h-5" /> },
  { key: "settings", label: "Settings", href: "/settings", icon: <Settings className="w-5 h-5" /> },
];

export function MobileTabbar() {
  const pathname = usePathname();

  const isActive = (key: string) =>
    key === "dashboard" ? pathname === "/" : pathname.startsWith(`/${key}`);

  return (
    <nav
      className="md:hidden fixed bottom-3 inset-x-3 z-40 bg-navy/95 backdrop-blur-xl border border-border/40 rounded-2xl shadow-2xl"
      aria-label="Mobile Navigation"
    >
      <div className="flex items-center justify-around px-1 py-1.5">
        {TABS.map((tab) => {
          const active = isActive(tab.key);
          return (
            <Link
              key={tab.key}
              href={tab.href}
              className={cn(
                "flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-colors min-w-[56px]",
                active ? "text-primary" : "text-muted hover:text-white",
              )}
              aria-current={active ? "page" : undefined}
            >
              <span
                className={cn(
                  "p-1.5 rounded-xl transition-colors",
                  active && "bg-primary/15",
                )}
              >
                {tab.icon}
              </span>
              <span className="text-[10px] font-medium leading-none">{tab.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
