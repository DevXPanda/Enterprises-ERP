"use client";

// Mobile-only category grid (md:hidden), shown at the top of module pages.
// Same card style as the Dashboard's Quick Access: icon + label tiles for
// every page in the current category; the active page is highlighted.
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutGrid } from "lucide-react";
import { cn } from "@/lib/utils";
import { menuItems, iconMap } from "./sidebar";

interface Tile {
  key: string;
  label: string;
  href: string;
  icon: string;
}

export function MobileSubnav() {
  const pathname = usePathname();

  const module = menuItems.find(
    (m) => m.key !== "dashboard" && pathname.startsWith(`/${m.key}`),
  );
  if (!module?.children) return null;

  let tiles: Tile[] = [];

  if (module.key === "factory") {
    const section = module.children.find((s) =>
      s.children?.some((l) => pathname.startsWith(l.href)),
    );
    if (section?.children) {
      tiles = [
        { key: "factory-home", label: "Factory Home", href: "/factory", icon: "factory-dashboard" },
        ...section.children.map((l) => ({ key: l.key, label: l.label, href: l.href, icon: l.icon })),
      ];
    } else {
      tiles = module.children.map((s) => ({
        key: s.key,
        label: s.label,
        href: s.href ?? s.children?.[0]?.href ?? "/factory",
        icon: s.icon,
      }));
    }
  } else {
    tiles = module.children
      .filter((s) => s.href)
      .map((s) => ({ key: s.key, label: s.label, href: s.href!, icon: s.icon }));
  }

  const isActive = (href: string) =>
    href === "/factory" ? pathname === "/factory" : pathname.startsWith(href);

  // Filter out the page the user is already on — show only the other pages.
  tiles = tiles.filter((tile) => !isActive(tile.href));

  if (tiles.length < 1) return null;

  return (
    <div className="md:hidden px-4 pt-4">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted/70 mb-3">
        {module.label} Pages
      </h2>
      <div className="grid grid-cols-2 gap-3">
        {tiles.map((tile) => {
          const active = isActive(tile.href);
          return (
            <Link
              key={tile.key}
              href={tile.href}
              className={cn(
                "flex flex-col items-start p-3.5 rounded-xl border shadow-sm transition-all duration-150 select-none group text-left",
                active
                  ? "bg-primary/10 border-primary/40"
                  : "bg-card border-border/30 hover:scale-[1.02] active:scale-[0.98]",
              )}
            >
              <div
                className={cn(
                  "p-2 rounded-full mb-2.5 shrink-0 transition-colors",
                  active ? "bg-primary text-white" : "bg-primary/10 text-primary",
                )}
              >
                {iconMap[tile.icon] ?? <LayoutGrid className="w-4 h-4" />}
              </div>
              <span className={cn("text-[13px] font-semibold", active ? "text-primary" : "text-white")}>
                {tile.label}
              </span>
            </Link>
          );
        })}
      </div>
    </div>
  );
}
