"use client";

// ============================================================
//  ModulePage — Reusable Enterprise Page Template
//  Used by every Factory sub-page. Zero duplication.
//  Renders: PageHeader · Search/Filter/Export/Add · Interactive Table
// ============================================================

import { useState, useEffect } from "react";
import { Search, Filter, Download, Plus, Trash2, Eye, Edit } from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

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

export function ModulePage({
  title,
  description,
  breadcrumbs,
  columns,
  addNewLabel = "Add New",
}: ModulePageProps) {
  const [search, setSearch] = useState("");
  const [data, setData] = useState<any[]>([]);

  // Generate realistic mock data on mount to avoid Next.js hydration mismatch
  useEffect(() => {
    const mockRows = Array.from({ length: 6 }).map((_, index) => {
      const row: any = { id: index };
      columns.forEach((col) => {
        row[col.key] = generateMockVal(col.key, index, title);
      });
      return row;
    });
    setData(mockRows);
  }, [columns, title]);

  const handleDelete = (rowId: number) => {
    setData((prev) => prev.filter((r) => r.id !== rowId));
  };

  const handleAddRow = () => {
    const newId = data.length > 0 ? Math.max(...data.map((r) => r.id)) + 1 : 1;
    const newRow: any = { id: newId };
    columns.forEach((col) => {
      newRow[col.key] = generateMockVal(col.key, newId, title);
    });
    setData((prev) => [newRow, ...prev]);
  };

  const filteredData = data.filter((row) => {
    return columns.some((col) => {
      const val = row[col.key];
      return val && String(val).toLowerCase().includes(search.toLowerCase());
    });
  });

  const getStatusBadge = (val: string) => {
    const s = String(val).toLowerCase();
    if (s === "active" || s === "present" || s === "approved" || s === "verified" || s === "completed" || s === "in") {
      return <Badge variant="success" dot>{val}</Badge>;
    }
    if (s === "pending" || s === "in-progress" || s === "half-day" || s === "warning") {
      return <Badge variant="warning" dot>{val}</Badge>;
    }
    if (s === "inactive" || s === "absent" || s === "rejected" || s === "suspended" || s === "out") {
      return <Badge variant="danger" dot>{val}</Badge>;
    }
    return <Badge variant="default" dot>{val}</Badge>;
  };

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
        <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
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
            onClick={handleAddRow}
            type="button"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary-dark transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            {addNewLabel}
          </button>
        </div>
      </div>

      {/* Interactive Table */}
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
              {filteredData.map((row) => (
                <tr
                  key={row.id}
                  className="border-t border-border/10 hover:bg-white/[0.02] transition-colors"
                >
                  {columns.map((col) => {
                    const cellVal = row[col.key];
                    const isStatus = col.key.toLowerCase().includes("status") || col.key.toLowerCase() === "qrcheck" || cellVal === "Verified" || cellVal === "Scan Pending" || cellVal === "active" || cellVal === "leave" || cellVal === "suspended";
                    return (
                      <td key={col.key} className="px-5 py-3.5 text-xs text-white">
                        {isStatus ? getStatusBadge(cellVal) : String(cellVal || "—")}
                      </td>
                    );
                  })}
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button className="p-1 text-muted hover:text-white transition-colors" title="View details">
                        <Eye className="w-3.5 h-3.5" />
                      </button>
                      <button className="p-1 text-muted hover:text-primary transition-colors" title="Edit row">
                        <Edit className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(row.id)}
                        className="p-1 text-muted hover:text-danger transition-colors"
                        title="Delete row"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filteredData.length === 0 && (
                <tr>
                  <td colSpan={columns.length + 1} className="px-5 py-8 text-center text-xs text-muted">
                    No matching records found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// ============================================================
//  Mock Value Generator Helper
// ============================================================
function generateMockVal(key: string, index: number, title: string) {
  const k = key.toLowerCase();
  
  if (k.includes("id") || k.includes("no") || k === "code") {
    if (k.includes("emp")) return `EMP-0${421 + index}`;
    if (k.includes("visit")) return `VIS-0${712 + index}`;
    if (k.includes("pass") || k.includes("gate")) return `GP-88${31 + index}`;
    if (k.includes("veh") || k.includes("truck")) return `MH-12-GP-${4108 + index}`;
    if (k.includes("order")) return `ORD-52${23 + index}`;
    if (k.includes("batch")) return `BAT-99${12 + index}`;
    return `ID-0${184 + index}`;
  }
  
  if (k.includes("name") || k.includes("to") || k === "operator" || k === "author" || k === "employee") {
    const names = ["Ramesh Kumar", "Amit Sharma", "Vikram Singh", "Suresh Patel", "Sunita Devi", "Anil Mehta", "Pradeep G.", "Karan Johar", "Mahesh Sen"];
    return names[index % names.length];
  }
  
  if (k.includes("dept") || k === "department") {
    const depts = ["Production", "Packing", "Quality Control", "Maintenance", "Store", "Dispatch"];
    return depts[index % depts.length];
  }
  
  if (k.includes("desig") || k.includes("role")) {
    const roles = ["Line Supervisor", "Machine Operator", "QC Analyst", "Material Loader", "Maintenance Tech"];
    return roles[index % roles.length];
  }
  
  if (k.includes("shift")) {
    const shifts = ["Shift A", "Shift B", "Shift C"];
    return shifts[index % shifts.length];
  }
  
  if (k.includes("time") || k === "in" || k === "out") {
    if (k.includes("in")) return `06:${10 + index * 5}`;
    if (k.includes("out")) return `14:${index * 5}`;
    return `${10 + index}:30 AM`;
  }
  
  if (k.includes("date") || k === "validfrom" || k === "validto" || k === "updated") {
    return `${10 + index} Jul 2026`;
  }
  
  if (k.includes("status")) {
    const statuses = ["Active", "Pending", "Approved", "Completed", "In Progress", "Verified"];
    return statuses[index % statuses.length];
  }
  
  if (k.includes("material") || k === "item" || k.includes("product")) {
    const mats = ["Limestone", "Gypsum", "Coal (Thermal)", "OPC 53 Grade", "PPC Cement", "Fly Ash"];
    return mats[index % mats.length];
  }
  
  if (k.includes("qty") || k.includes("quantity") || k === "produced" || k === "target" || k === "employees" || k === "total") {
    return (1500 + index * 250).toLocaleString();
  }
  
  if (k.includes("cost") || k.includes("price") || k.includes("amount") || k === "grade") {
    if (k === "grade") {
      const grades = ["53 Grade", "43 Grade", "PSC", "PPC", "Premium"];
      return grades[index % grades.length];
    }
    return `₹${(15000 + index * 4200).toLocaleString("en-IN")}`;
  }
  
  if (k.includes("bank") || k.includes("account")) {
    return `******${2040 + index * 12}`;
  }
  
  if (k.includes("qr") || k.includes("verification")) {
    return index % 2 === 0 ? "Verified" : "Scan Pending";
  }
  
  if (k.includes("purpose") || k.includes("reason")) {
    const reasons = ["Raw Material Delivery", "Client Visit", "Equipment Repair", "Audit Check", "Shift Handover"];
    return reasons[index % reasons.length];
  }
  
  if (k.includes("phone") || k.includes("contact")) {
    return `+91 98765 0000${index}`;
  }
  
  if (k.includes("vehicle") || k === "truck") {
    return `MH-12-GP-${4000 + index}`;
  }
  
  if (k.includes("doc")) {
    const docs = ["Aadhaar Card", "PAN Card", "Labor License", "Driving License", "Gate Pass ID"];
    return docs[index % docs.length];
  }
  
  return `${title} Item ${index + 1}`;
}
