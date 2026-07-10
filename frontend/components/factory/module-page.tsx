"use client";

// ============================================================
//  ModulePage — Reusable Enterprise Page Template
//  Used by every Factory sub-page. Zero duplication.
//  Renders: PageHeader · Search/Filter/Export/Add · Table
// ============================================================

import { useState } from "react";
import { Search, Filter, Download, Plus } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";

export interface ModuleColumn {
  key: string;
  label: string;
}

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface ModulePageProps {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
  columns: ModuleColumn[];
  addNewLabel?: string;
}

// Static widths prevent hydration mismatch (no Math.random)
const SKELETON_WIDTHS: readonly string[] = ["72%", "58%", "80%", "64%", "68%"];

export function ModulePage({
  title,
  description,
  breadcrumbs,
  columns,
  addNewLabel = "Add New",
}: ModulePageProps) {
  const [search, setSearch] = useState("");

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <PageHeader
        title={title}
        description={description}
        breadcrumbs={breadcrumbs}
      />

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
        {/* Search */}
        <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={`Search ${title.toLowerCase()}…`}
            className="w-full pl-9 pr-4 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white placeholder:text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all"
          >
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-all shadow-glow"
          >
            <Plus className="w-3.5 h-3.5" />
            {addNewLabel}
          </button>
        </div>
      </div>

      {/* Placeholder Table */}
      <div className="glass-card overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border/20">
                {columns.map((col) => (
                  <th
                    key={col.key}
                    className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted/70 text-left whitespace-nowrap"
                  >
                    {col.label}
                  </th>
                ))}
                <th className="px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted/70 text-right whitespace-nowrap">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {SKELETON_WIDTHS.map((width, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="border-t border-border/10 hover:bg-white/[0.02] transition-colors"
                >
                  {columns.map((col, colIdx) => (
                    <td key={col.key} className="px-5 py-3.5">
                      <div
                        className="h-3 bg-white/[0.06] rounded-full animate-pulse"
                        style={{
                          width:
                            colIdx === 0
                              ? "75%"
                              : colIdx === columns.length - 1
                              ? "45%"
                              : width,
                          animationDelay: `${rowIdx * 60}ms`,
                        }}
                      />
                    </td>
                  ))}
                  <td className="px-5 py-3.5">
                    <div className="flex items-center justify-end gap-2">
                      <div
                        className="h-6 w-12 bg-white/[0.05] rounded-lg animate-pulse"
                        style={{ animationDelay: `${rowIdx * 60 + 20}ms` }}
                      />
                      <div
                        className="h-6 w-12 bg-white/[0.05] rounded-lg animate-pulse"
                        style={{ animationDelay: `${rowIdx * 60 + 40}ms` }}
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Empty State */}
        <div className="px-5 py-8 border-t border-border/10 text-center">
          <p className="text-sm font-medium text-white/40">
            No {title.toLowerCase()} records yet
          </p>
          <p className="text-xs text-muted/35 mt-1">
            Click &ldquo;{addNewLabel}&rdquo; to add your first entry
          </p>
        </div>
      </div>
    </div>
  );
}
