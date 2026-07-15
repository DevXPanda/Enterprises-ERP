"use client";

import { useState } from "react";
import { 
  Search, Filter, Download, Plus, Factory, Activity, 
  CheckCircle2, Clock, Timer, Target, TrendingUp, 
  TrendingDown, Minus, Eye, Edit, Trash2 
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { productionOrdersKpis, productionOrders, type MfgKpi, type ProductionOrder } from "@/data/manufacturing-data";
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

const fmtDay = (d?: string | null) =>
  d ? new Date(d).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—";

const iconMap: Record<string, React.ReactNode> = {
  ClipboardList: <Factory className="w-4 h-4" />, 
  Activity: <Activity className="w-4 h-4" />,
  CheckCircle2: <CheckCircle2 className="w-4 h-4" />, 
  Clock: <Clock className="w-4 h-4" />,
  Timer: <Timer className="w-4 h-4" />, 
  Target: <Target className="w-4 h-4" />,
};

function KpiCard({ data, index }: { data: MfgKpi; index: number }) {
  const colorMap: Record<string, string> = { 
    blue: "bg-primary/10 text-primary", 
    green: "bg-success/10 text-success", 
    purple: "bg-purple/10 text-purple", 
    orange: "bg-warning/10 text-warning", 
    red: "bg-danger/10 text-danger" 
  };
  const isPos = data.change !== undefined && data.change > 0;
  const isNeg = data.change !== undefined && data.change < 0;
  return (
    <div className="bg-card/60 border border-border/30 rounded-xl px-4 py-3 flex items-center gap-3 animate-fade-in" style={{ animationDelay: `${index * 60}ms` }}>
      <div className={cn("p-2 rounded-lg shrink-0", colorMap[data.color] || colorMap.blue)}>{iconMap[data.icon] ?? <Factory className="w-4 h-4" />}</div>
      <div className="flex-1 min-w-0">
        <p className="text-lg font-bold text-white tracking-tight leading-tight">{data.value}</p>
        <p className="text-[11px] text-muted truncate">{data.label}</p>
      </div>
      {data.change !== undefined && (
        <div className={cn("flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0", isPos && "text-success bg-success/10", isNeg && "text-danger bg-danger/10", !isPos && !isNeg && "text-muted bg-muted/10")}>
          {isPos ? <TrendingUp className="w-2.5 h-2.5" /> : isNeg ? <TrendingDown className="w-2.5 h-2.5" /> : <Minus className="w-2.5 h-2.5" />}
          {Math.abs(data.change)}%
        </div>
      )}
    </div>
  );
}

const priorityColors: Record<string, string> = { high: "text-danger bg-danger/10", medium: "text-warning bg-warning/10", low: "text-muted bg-muted/10" };
const statusVariant = (s: string) => s === "completed" ? "success" : s === "in-progress" ? "warning" : s === "on-hold" ? "danger" : "default";

type OrderRow = ProductionOrder & { dbId?: number; isoStart?: string; isoDue?: string };
const ORDER_NUM_KEYS = ["quantity", "progress"];

export default function ProductionOrdersPage() {
  const [search, setSearch] = useState("");
  const [version, setVersion] = useState(0);

  // Live API hooks
  const kpiLive = useApi<{ kpis: MfgKpi[] }>("/manufacturing/production-orders/analytics", version);
  const listLive = useApi<{ data: Record<string, unknown>[] }>("/manufacturing/production-orders?pageSize=50", version);

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create");
  const [activeRow, setActiveRow] = useState<OrderRow | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const kpis = kpiLive?.kpis ?? productionOrdersKpis;
  const orders: OrderRow[] = listLive
    ? listLive.data.map((r) => ({
        dbId: Number(r.id),
        isoStart: r.startDate ? String(r.startDate) : "",
        isoDue: r.dueDate ? String(r.dueDate) : "",
        id: String(r.poNo ?? r.id),
        product: String(r.product ?? "—"),
        grade: String(r.grade ?? ""),
        quantity: Number(r.quantity ?? 0),
        unit: String(r.unit ?? "bags"),
        priority: (r.priority ?? "medium") as ProductionOrder["priority"],
        startDate: fmtDay(r.startDate as string),
        dueDate: fmtDay(r.dueDate as string),
        status: (r.status ?? "pending") as ProductionOrder["status"],
        progress: Number(r.progress ?? 0),
        line: String(r.line ?? "—"),
      }))
    : productionOrders;

  const filtered = orders.filter(o => o.id.toLowerCase().includes(search.toLowerCase()) || o.product.toLowerCase().includes(search.toLowerCase()));

  // Open dialog for new order
  const handleAddClick = () => {
    const initialValues = {
      product: "OPC Cement",
      grade: "53 Grade",
      quantity: "",
      unit: "bags",
      priority: "medium",
      startDate: new Date().toISOString().split("T")[0],
      dueDate: new Date(Date.now() + 86400000 * 2).toISOString().split("T")[0],
      status: "pending",
      progress: "0",
      line: "Line A",
    };
    setFormValues(initialValues);
    setValidationErrors({});
    setDialogMode("create");
    setIsDialogOpen(true);
  };

  // Open dialog for edit
  const handleEditClick = (order: OrderRow) => {
    setActiveRow(order);
    setFormValues({
      product: order.product,
      grade: order.grade,
      quantity: String(order.quantity),
      unit: order.unit,
      priority: order.priority,
      startDate: order.isoStart,
      dueDate: order.isoDue,
      status: order.status,
      progress: String(order.progress),
      line: order.line,
    });
    setValidationErrors({});
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  // Open dialog for view
  const handleViewClick = (order: OrderRow) => {
    setActiveRow(order);
    setFormValues({
      product: order.product,
      grade: order.grade,
      quantity: String(order.quantity),
      unit: order.unit,
      priority: order.priority,
      startDate: order.startDate,
      dueDate: order.dueDate,
      status: order.status,
      progress: String(order.progress),
      line: order.line,
    });
    setValidationErrors({});
    setDialogMode("view");
    setIsDialogOpen(true);
  };

  // Delete handler
  const handleDeleteClick = async (order: OrderRow) => {
    if (order.dbId === undefined || !window.confirm(`Delete order ${order.id}?`)) return;
    await apiSend("DELETE", `/manufacturing/production-orders/${order.dbId}`);
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

  // Submit form
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dialogMode === "view") {
      setIsDialogOpen(false);
      return;
    }

    // Validation
    const errors: Record<string, string> = {};
    if (!formValues.product) errors.product = "Product name is required.";
    if (!formValues.quantity || isNaN(Number(formValues.quantity)) || Number(formValues.quantity) <= 0) {
      errors.quantity = "Valid positive quantity count is required.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const payload: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(formValues)) {
      if (v === "") continue;
      payload[k] = ORDER_NUM_KEYS.includes(k) ? Number(v) : v;
    }

    if (dialogMode === "edit" && activeRow?.dbId !== undefined) {
      await apiSend("PATCH", `/manufacturing/production-orders/${activeRow.dbId}`, payload);
    } else {
      await apiSend("POST", "/manufacturing/production-orders", payload);
    }

    setVersion((v) => v + 1);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Production Orders"
        description="Manage, schedule, and track manufacturing production orders across all lines."
        breadcrumbs={[{ label: "Manufacturing", href: "/manufacturing/dashboard" }, { label: "Production Orders" }]}
      />

      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {kpis.map((kpi, i) => <KpiCard key={kpi.id} data={kpi} index={i} />)}
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
        <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)} placeholder="Search orders…"
            className="w-full pl-9 pr-4 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white placeholder:text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all" />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all"><Filter className="w-3.5 h-3.5" />Filter</button>
          <button onClick={() => exportCsv("production-orders", filtered, [["id","Order ID"],["product","Product"],["grade","Grade"],["quantity","Qty"],["unit","Unit"],["priority","Priority"],["line","Line"],["startDate","Start"],["dueDate","Due"],["progress","Progress %"],["status","Status"]])} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all"><Download className="w-3.5 h-3.5" />Export</button>
          <button 
            onClick={handleAddClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
          >
            <Plus className="w-3.5 h-3.5" />
            New Order
          </button>
        </div>
      </div>

      {/* Table Section */}
      {orders.length === 0 ? (
        <EmptyTableState
          title="No production orders found"
          description="Get started by placing a new manufacturing production order."
          actionLabel="New Order"
          onAction={handleAddClick}
        />
      ) : filtered.length === 0 ? (
        <EmptyTableState
          title="No search results found"
          description={`Your query "${search}" did not match any active production orders.`}
          actionLabel="Clear Filter"
          onAction={() => setSearch("")}
        />
      ) : (
        <div className="glass-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/20 bg-navy-900/10">
                  {["Order ID", "Product", "Qty", "Priority", "Line", "Start", "Due", "Progress", "Status", "Actions"].map(h => (
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
                {filtered.map(order => (
                  <tr key={order.id} className="border-t border-border/10 hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5 text-xs font-medium text-primary">{order.id}</td>
                    <td className="px-5 py-3.5">
                      <p className="text-xs font-medium text-white">{order.product}</p>
                      <p className="text-[10px] text-muted">{order.grade}</p>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-white">{order.quantity.toLocaleString()} {order.unit}</td>
                    <td className="px-5 py-3.5">
                      <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize", priorityColors[order.priority])}>{order.priority}</span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-muted">{order.line}</td>
                    <td className="px-5 py-3.5 text-xs text-muted">{order.startDate}</td>
                    <td className="px-5 py-3.5 text-xs text-muted">{order.dueDate}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-navy-300/30 rounded-full overflow-hidden w-16">
                          <div className={cn("h-full rounded-full", order.progress === 100 ? "bg-success" : order.progress >= 50 ? "bg-primary" : "bg-warning")} style={{ width: `${order.progress}%` }} />
                        </div>
                        <span className="text-[10px] text-muted w-8">{order.progress}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={statusVariant(order.status)} dot>{order.status.replace("-", " ")}</Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleViewClick(order)}
                          className="p-1.5 text-muted hover:text-white rounded-lg hover:bg-white/5 transition-all"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEditClick(order)}
                          className="p-1.5 text-muted hover:text-primary rounded-lg hover:bg-white/5 transition-all"
                          title="Edit Order"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(order)}
                          disabled={order.dbId === undefined}
                          className="p-1.5 text-muted hover:text-danger rounded-lg hover:bg-white/5 transition-all disabled:opacity-30"
                          title="Delete Order"
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
              ? "New Production Order"
              : dialogMode === "edit"
              ? `Edit Production Order`
              : `Order Details`
          }
          description={
            dialogMode === "create"
              ? "Create a new production schedule and allocate line priorities."
              : dialogMode === "edit"
              ? "Update constituent quantity, scheduling dates, progress tracker, and status."
              : "Review allocated line targets, start/due dates, priority rank, and status."
          }
          icon={<Factory className="w-6 h-6" />}
          onClose={() => setIsDialogOpen(false)}
        />

        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <FormSection title="Production Specification">
            <FormGrid cols={2}>
              <FormField
                label="Product Line"
                fieldName="product"
                required
                error={validationErrors.product}
                success={formValues.product && !validationErrors.product && dialogMode !== "view"}
                helpText="Example: OPC Cement, PPC Cement."
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
                helpText="Quality standard reference recipe."
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
                label="Batch Quantity"
                fieldName="qty"
                required
                error={validationErrors.quantity}
                success={formValues.quantity && !validationErrors.quantity && dialogMode !== "view"}
                helpText="Volume target to produce."
              >
                <input
                  type="number"
                  value={formValues.quantity || ""}
                  onChange={(e) => handleInputChange("quantity", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="e.g. 5000"
                />
              </FormField>

              <FormField
                label="Volume Unit"
                fieldName="unit"
                required
                helpText="Unit scale index."
              >
                <input
                  type="text"
                  value={formValues.unit || ""}
                  onChange={(e) => handleInputChange("unit", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="e.g. bags"
                />
              </FormField>

              <FormField
                label="Order Priority"
                fieldName="status"
                helpText="Priority rank for execution scheduling."
              >
                {dialogMode === "view" ? (
                  <input type="text" value={formValues.priority || ""} disabled readOnly />
                ) : (
                  <select
                    value={formValues.priority || ""}
                    onChange={(e) => handleInputChange("priority", e.target.value)}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                )}
              </FormField>
            </FormGrid>
          </FormSection>

          <FormSection title="Scheduling & Status Telemetry">
            <FormGrid cols={2}>
              <FormField
                label="Active Assembly Line"
                fieldName="line"
                required
                helpText="Assigned operational plant sector."
              >
                {dialogMode === "view" ? (
                  <input type="text" value={formValues.line || ""} disabled readOnly />
                ) : (
                  <select
                    value={formValues.line || ""}
                    onChange={(e) => handleInputChange("line", e.target.value)}
                  >
                    <option value="Line A">Line A</option>
                    <option value="Line B">Line B</option>
                    <option value="Line C">Line C</option>
                    <option value="Line D">Line D</option>
                  </select>
                )}
              </FormField>

              <FormField
                label="Progress %"
                fieldName="progress"
                helpText="Active order completion percentage (0 - 100)."
              >
                <input
                  type="number"
                  value={formValues.progress || "0"}
                  onChange={(e) => handleInputChange("progress", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="e.g. 50"
                  min="0"
                  max="100"
                />
              </FormField>

              <FormField
                label="Start Date"
                fieldName="date"
                helpText="Planned start schedule."
              >
                <input
                  type="text"
                  value={formValues.startDate || ""}
                  onChange={(e) => handleInputChange("startDate", e.target.value)}
                  disabled={dialogMode === "view"}
                />
              </FormField>

              <FormField
                label="Due Date"
                fieldName="date"
                helpText="Delivery deadline date."
              >
                <input
                  type="text"
                  value={formValues.dueDate || ""}
                  onChange={(e) => handleInputChange("dueDate", e.target.value)}
                  disabled={dialogMode === "view"}
                />
              </FormField>

              <FormField
                label="Execution Status"
                fieldName="status"
                helpText="Current execution state."
              >
                {dialogMode === "view" ? (
                  <input type="text" value={formValues.status || ""} disabled readOnly />
                ) : (
                  <select
                    value={formValues.status || ""}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                  >
                    <option value="pending">Pending</option>
                    <option value="in-progress">In Progress</option>
                    <option value="on-hold">On Hold</option>
                    <option value="completed">Completed</option>
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
                ? "Create Order"
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
