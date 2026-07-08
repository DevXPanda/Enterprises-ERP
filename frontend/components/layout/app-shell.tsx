"use client";

import { useState, useCallback } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { cn } from "@/lib/utils";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["manufacturing"]);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const toggleMenu = useCallback((menu: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]
    );
  }, []);

  return (
    <div className="min-h-screen bg-navy">
      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        expandedMenus={expandedMenus}
        toggleMenu={toggleMenu}
      />

      <div
        className={cn(
          "transition-all duration-300 ease-in-out",
          isCollapsed ? "ml-[68px]" : "ml-[260px]"
        )}
      >
        <Navbar />
        <main className="p-6">{children}</main>
      </div>
    </div>
  );
}
