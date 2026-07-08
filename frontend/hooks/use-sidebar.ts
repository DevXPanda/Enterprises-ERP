"use client";

import { useState, useCallback } from "react";

export function useSidebar() {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["manufacturing"]);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const toggleMenu = useCallback((menu: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menu)
        ? prev.filter((m) => m !== menu)
        : [...prev, menu]
    );
  }, []);

  const isMenuExpanded = useCallback(
    (menu: string) => expandedMenus.includes(menu),
    [expandedMenus]
  );

  return {
    isCollapsed,
    toggleSidebar,
    toggleMenu,
    isMenuExpanded,
  };
}
