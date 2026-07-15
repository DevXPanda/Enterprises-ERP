"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  ScrollText,
  Layers,
  IndianRupee,
  BookOpen,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Minus,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { bomKpis, bomItems, type MfgKpi, type BomItem } from "@/data/manufacturing-data";
import { useApi } from "@/hooks/use-api";
import { exportCsv } from "@/lib/export";
import { apiSend } from "@/lib/api";
import { 
  FormDialog, 
  FormHeader, 
  FormSection, 
  FormGrid, 
  FormField, 
  FormFooter, 
  ActionButtons, 
  EmptyTableState 
} from "@/components/ui/enterprise-form";

// Custom GitBranch icon stand-in since we want to be safe with lucide icons
import { GitCommit as GitBranch } from "lucide-react";

const fmtDate = (d?: unknown) =>
  d ? new Date(String(d)).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—";

const iconMap: Record<string, React.ReactNode> = {
  ScrollText: <ScrollText className="w-4 h-4" />,
  Layers: <Layers className="w-4 h-4" />,
  IndianRupee: <IndianRupee className="w-4 h-4" />,
  GitBranch: <GitBranch className="w-4 h-4" />,
  BookOpen: <BookOpen className="w-4 h-4" />,
  AlertCircle: <AlertCircle className="w-4 h-4" />,
};

function KpiCard({ data, index }: { data: MfgKpi; index: number }) {
  const colorMap: Record<string, string> = {
    blue: "bg-primary/10 text-primary",
    green: "bg-success/10 text-success",
    purple: "bg-purple/10 text-purple",
    orange: "bg-warning/10 text-warning",
    red: "bg-danger/10 text-danger",
  };
  const isPos = data.change !== undefined && data.change > 0;
  const isNeg = data.change !== undefined && data.change < 0;

  return (
    <div
      className="bg-card/60 border border-border/30 rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in"
      style={{ animationDelay: `${index * 60}ms` }}
    >
      <div className={cn("p-2 rounded-lg shrink-0", colorMap[data.color] || colorMap.blue)}>
        {iconMap[data.icon] ?? <ScrollText className="w-4 h-4" />}
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-lg font-bold text-white tracking-tight leading-tight">{data.value}</p>
        <p className="text-[11px] text-muted truncate">{data.label}</p>
      </div>
      {data.change !== undefined && (
        <div
          className={cn(
            "flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0",
            isPos && "text-success bg-success/10",
            isNeg && "text-danger bg-danger/10",
            !isPos && !isNeg && "text-muted bg-muted/10"
          )}
        >
          {isPos ? (
            <TrendingUp className="w-2.5 h-2.5" />
          ) : isNeg ? (
            <TrendingDown className="w-2.5 h-2.5" />
          ) : (
            <Minus className="w-2.5 h-2.5" />
          )}
          {Math.abs(data.change)}%
        </div>
      )}
    </div>
  );
}

type BomRow = BomItem & { dbId?: number; isoUpdated?: string };
const BOM_NUM_KEYS = ["materials", "costPerUnit"];

export default function BomPage() {
  const [search, setSearch] = useState("");
  const [version, setVersion] = useState(0);

  // Live API hooks
  const kpiLive = useApi<{ kpis: MfgKpi[] }>("/manufacturing/bom/analytics", version);
  const listLive = useApi<{ data: Record<string, unknown>[] }>("/manufacturing/bom?pageSize=50", version);

  // Dialog States
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create");
  const [activeRow, setActiveRow] = useState<BomRow | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const kpis = kpiLive?.kpis ?? bomKpis;
  const items: BomRow[] = listLive
    ? listLive.data.map((r) => ({
        dbId: Number(r.id),
        isoUpdated: r.lastUpdated ? String(r.lastUpdated) : "",
        id: String(r.bomNo ?? r.id),
        product: String(r.product ?? "—"),
        grade: String(r.grade ?? ""),
        materials: Number(r.materials ?? 0),
        costPerUnit: Number(r.costPerUnit ?? 0),
        lastUpdated: fmtDate(r.lastUpdated),
        status: (r.status ?? "draft") as BomItem["status"],
        version: String(r.version ?? "v1.0"),
        createdBy: String(r.createdBy ?? "—"),
      }))
    : bomItems;

  const filtered = items.filter(
    (item) =>
      item.id.toLowerCase().includes(search.toLowerCase()) ||
      item.product.toLowerCase().includes(search.toLowerCase()) ||
      item.grade.toLowerCase().includes(search.toLowerCase())
  );

  const statusVariant = (s: string) => {
    if (s === "active") return "success";
    if (s === "draft") return "warning";
    return "default";
  };

  // Open Dialog for New BOM
  const handleAddClick = () => {
    const newIdNum = items.length > 0 ? Math.max(...items.map(d => parseInt(d.id.split("-")[1] || "0"))) + 1 : 1;
    const initialValues = {
      product: "",
      grade: "53 Grade",
      version: "v1.0",
      materials: "",
      costPerUnit: "",
      status: "draft",
      createdBy: "Plant Manager",
    };
    setFormValues(initialValues);
    setValidationErrors({});
    setDialogMode("create");
    setIsDialogOpen(true);
  };

  // Open Dialog for Edit
  const handleEditClick = (row: BomRow) => {
    setActiveRow(row);
    setFormValues({
      product: row.product,
      grade: row.grade,
      version: row.version,
      materials: String(row.materials),
      costPerUnit: String(row.costPerUnit),
      status: row.status,
      createdBy: row.createdBy,
    });
    setValidationErrors({});
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  // Open Dialog for View
  const handleViewClick = (row: BomRow) => {
    setActiveRow(row);
    setFormValues({
      product: row.product,
      grade: row.grade,
      version: row.version,
      materials: String(row.materials),
      costPerUnit: String(row.costPerUnit),
      status: row.status,
      createdBy: row.createdBy,
    });
    setValidationErrors({});
    setDialogMode("view");
    setIsDialogOpen(true);
  };

  // Delete handler
  const handleDeleteClick = async (row: BomRow) => {
    if (row.dbId === undefined || !window.confirm(`Delete BOM ${row.id}?`)) return;
    await apiSend("DELETE", `/manufacturing/bom/${row.dbId}`);
    setVersion((v) => v + 1);
  };

  // Input changes
  const handleInputChange = (key: string, value: any) => {
    setFormValues((prev) => ({
      ...prev,
      [key]: value,
    }));
    if (validationErrors[key]) {
      setValidationErrors((prev) => {
        const next = { ...prev };
        delete next[key];
        return next;
      });
    }
  };

  // Form submission handler
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dialogMode === "view") {
      setIsDialogOpen(false);
      return;
    }

    // Validation check
    const errors: Record<string, string> = {};
    if (!formValues.product) errors.product = "Product Name is required.";
    if (!formValues.materials || isNaN(Number(formValues.materials))) errors.materials = "Valid ingredients count is required.";
    if (!formValues.costPerUnit || isNaN(Number(formValues.costPerUnit))) errors.costPerUnit = "Valid cost per bag is required.";

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const payload: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(formValues)) {
      if (v === "") continue;
      payload[k] = BOM_NUM_KEYS.includes(k) ? Number(v) : v;
    }

    if (dialogMode === "edit" && activeRow?.dbId !== undefined) {
      await apiSend("PATCH", `/manufacturing/bom/${activeRow.dbId}`, payload);
    } else {
      await apiSend("POST", "/manufacturing/bom", payload);
    }

    setVersion((v) => v + 1);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Bill of Materials"
        description="Formulate raw material proportions and track ingredient recipes and version logs for cement grades."
        breadcrumbs={[
          { label: "Manufacturing", href: "/manufacturing/dashboard" },
          { label: "BOM" },
        ]}
      />

      {/* KPI Cards Row */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => (
          <KpiCard key={kpi.id} data={kpi} index={i} />
        ))}
      </div>

      {/* Action Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
        <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search BOMs…"
            className="w-full pl-9 pr-4 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white placeholder:text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
          <button onClick={() => exportCsv("bom-list", filtered, [["id","BOM ID"],["product","Product"],["grade","Grade"],["version","Version"],["materials","Materials"],["costPerUnit","Cost/Bag"],["lastUpdated","Last Updated"],["createdBy","Created By"],["status","Status"]])} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button 
            onClick={handleAddClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
          >
            <Plus className="w-3.5 h-3.5" />
            New BOM
          </button>
        </div>
      </div>

      {/* BOM Table Section */}
      {items.length === 0 ? (
        <EmptyTableState
          title="No Bill of Materials found"
          description="Get started by creating a new Bill of Materials recipe configuration."
          actionLabel="New BOM"
          onAction={handleAddClick}
        />
      ) : filtered.length === 0 ? (
        <EmptyTableState
          title="No search results found"
          description={`Your query "${search}" did not match any fields in the BOM register.`}
          actionLabel="Clear Filter"
          onAction={() => setSearch("")}
        />
      ) : (
        <div className="glass-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/20 bg-navy-900/10">
                  {["BOM ID", "Product & Grade", "Version", "Materials Count", "Cost per Bag", "Last Updated", "Created By", "Status", "Actions"].map((h) => (
                    <th
                      key={h}
                      className={cn(
                        "px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted/70 text-left whitespace-nowrap",
                        h === "Actions" ? "text-right" : ""
                      )}
                    >
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((item) => (
                  <tr
                    key={item.id}
                    className="border-t border-border/10 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3.5 text-xs font-medium text-primary">{item.id}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-medium text-white">{item.product}</p>
                      <p className="text-[10px] text-muted">{item.grade}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-white">
                      <Badge variant="default" className="bg-navy-300/30 text-white border-none">
                        {item.version}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-white">{item.materials} ingredients</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-success">
                      ₹{item.costPerUnit}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted">{item.lastUpdated}</td>
                    <td className="px-5 py-3.5 text-xs text-muted">{item.createdBy}</td>
                    <td className="px-5 py-3.5">
                      <Badge variant={statusVariant(item.status)} dot>
                        {item.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleViewClick(item)}
                          className="p-1.5 text-muted hover:text-white rounded-lg hover:bg-white/5 transition-all"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEditClick(item)}
                          className="p-1.5 text-muted hover:text-primary rounded-lg hover:bg-white/5 transition-all"
                          title="Edit BOM"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(item)}
                          disabled={item.dbId === undefined}
                          className="p-1.5 text-muted hover:text-danger rounded-lg hover:bg-white/5 transition-all disabled:opacity-30 disabled:cursor-not-allowed"
                          title="Delete BOM"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Enterprise Dialog */}
      <FormDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} size="2xl">
        <FormHeader
          title={
            dialogMode === "create"
              ? "New Bill of Materials"
              : dialogMode === "edit"
              ? `Edit BOM Recipe`
              : `BOM Details`
          }
          description={
            dialogMode === "create"
              ? "Formulate raw material proportions and track version logs for cement grades."
              : dialogMode === "edit"
              ? "Modify constituent materials, cost parameters, and status indicators."
              : "Review recipe details, author metadata, and active status configurations."
          }
          icon={<ScrollText className="w-6 h-6" />}
          onClose={() => setIsDialogOpen(false)}
        />

        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <FormSection title="Recipe Properties">
            <FormGrid cols={2}>
              <FormField
                label="Product Name"
                fieldName="product"
                required
                error={validationErrors.product}
                success={formValues.product && !validationErrors.product && dialogMode !== "view"}
                helpText="Example: OPC Cement, PPC Cement, or White Cement."
              >
                <input
                  type="text"
                  value={formValues.product || ""}
                  onChange={(e) => handleInputChange("product", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="Enter product name"
                />
              </FormField>

              <FormField
                label="Cement Grade"
                fieldName="grade"
                required
                helpText="Cement configuration and performance standard."
              >
                {dialogMode === "view" ? (
                  <input type="text" value={formValues.grade || ""} disabled readOnly />
                ) : (
                  <select
                    value={formValues.grade || ""}
                    onChange={(e) => handleInputChange("grade", e.target.value)}
                  >
                    <option value="53 Grade">53 Grade</option>
                    <option value="43 Grade">43 Grade</option>
                    <option value="PSC">PSC</option>
                    <option value="PPC">PPC</option>
                    <option value="Premium">Premium</option>
                  </select>
                )}
              </FormField>

              <FormField
                label="Version Revision"
                fieldName="version"
                required
                helpText="Formulation revision index."
              >
                <input
                  type="text"
                  value={formValues.version || ""}
                  onChange={(e) => handleInputChange("version", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="e.g. v3.2"
                />
              </FormField>
            </FormGrid>
          </FormSection>

          <FormSection title="Cost & Composition Details">
            <FormGrid cols={2}>
              <FormField
                label="Ingredients Count"
                fieldName="materials"
                required
                error={validationErrors.materials}
                success={formValues.materials && !validationErrors.materials && dialogMode !== "view"}
                helpText="Count of raw materials in mixture."
              >
                <input
                  type="number"
                  value={formValues.materials || ""}
                  onChange={(e) => handleInputChange("materials", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="e.g. 7"
                />
              </FormField>

              <FormField
                label="Cost Per Bag"
                fieldName="cost"
                required
                error={validationErrors.costPerUnit}
                success={formValues.costPerUnit && !validationErrors.costPerUnit && dialogMode !== "view"}
                helpText="Calculated raw constituent cost in INR per unit."
              >
                <input
                  type="number"
                  value={formValues.costPerUnit || ""}
                  onChange={(e) => handleInputChange("costPerUnit", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="e.g. 280"
                />
              </FormField>

              <FormField
                label="Created By"
                fieldName="createdBy"
                helpText="Responsible author."
              >
                <input
                  type="text"
                  value={formValues.createdBy || ""}
                  onChange={(e) => handleInputChange("createdBy", e.target.value)}
                  disabled={dialogMode === "view"}
                />
              </FormField>

              <FormField
                label="Status"
                fieldName="status"
                helpText="Control availability of recipe."
              >
                {dialogMode === "view" ? (
                  <input type="text" value={formValues.status || ""} disabled readOnly />
                ) : (
                  <select
                    value={formValues.status || ""}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                )}
              </FormField>
            </FormGrid>
          </FormSection>

          <button type="submit" className="hidden" />
        </form>

        <FormFooter>
          <ActionButtons
            onCancel={() => setIsDialogOpen(false)}
            submitLabel={
              dialogMode === "create"
                ? "Create BOM"
                : dialogMode === "edit"
                ? "Save Changes"
                : "Close"
            }
            onSubmit={handleFormSubmit}
          />
        </FormFooter>
      </FormDialog>
    </div>
  );
}
