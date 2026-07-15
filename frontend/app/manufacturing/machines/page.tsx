"use client";

import { useState } from "react";
import {
  Cog,
  Activity,
  Wrench,
  PauseCircle,
  Gauge,
  Calendar,
  TrendingUp,
  TrendingDown,
  Minus,
  Search,
  Filter,
  Download,
  Plus,
  Thermometer,
  User,
  Clock,
  Eye,
  Edit,
  Trash2,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { machinesKpis, mfgMachines, type MfgKpi, type MfgMachine } from "@/data/manufacturing-data";
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

const fmtDay = (d?: unknown) =>
  d ? new Date(String(d)).toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) : "—";

const iconMap: Record<string, React.ReactNode> = {
  Cog: <Cog className="w-4 h-4" />,
  Activity: <Activity className="w-4 h-4" />,
  Wrench: <Wrench className="w-4 h-4" />,
  PauseCircle: <PauseCircle className="w-4 h-4" />,
  Gauge: <Gauge className="w-4 h-4" />,
  Calendar: <Calendar className="w-4 h-4" />,
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
        {iconMap[data.icon] ?? <Cog className="w-4 h-4" />}
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

type MachineRow = MfgMachine & { dbId?: number; isoLast?: string; isoNext?: string };
const MACHINE_NUM_KEYS = ["uptime", "hoursToday"];

export default function MachinesPage() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [version, setVersion] = useState(0);

  // Live API hooks
  const kpiLive = useApi<{ kpis: MfgKpi[] }>("/manufacturing/machines/analytics", version);
  const listLive = useApi<{ data: Record<string, unknown>[] }>("/manufacturing/machines?pageSize=50", version);

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create");
  const [activeRow, setActiveRow] = useState<MachineRow | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const kpis = kpiLive?.kpis ?? machinesKpis;
  const machines: MachineRow[] = listLive
    ? listLive.data.map((r) => ({
        dbId: Number(r.id),
        isoLast: r.lastMaintenance ? String(r.lastMaintenance) : "",
        isoNext: r.nextMaintenance ? String(r.nextMaintenance) : "",
        id: String(r.machineId ?? r.id),
        name: String(r.name ?? "—"),
        line: String(r.line ?? "—"),
        status: (r.status ?? "idle") as MfgMachine["status"],
        uptime: Number(r.uptime ?? 0),
        temperature: String(r.temperature ?? "—"),
        lastMaintenance: fmtDay(r.lastMaintenance),
        nextMaintenance: fmtDay(r.nextMaintenance),
        operator: String(r.operator ?? "—"),
        hoursToday: Number(r.hoursToday ?? 0),
      }))
    : mfgMachines;

  const filtered = machines.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.line.toLowerCase().includes(search.toLowerCase()) ||
      m.operator.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === "all" || m.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (status: "running" | "maintenance" | "idle") => {
    if (status === "running") return <Badge variant="success" dot>Running</Badge>;
    if (status === "maintenance") return <Badge variant="warning" dot>Maintenance</Badge>;
    return <Badge variant="default" dot>Idle</Badge>;
  };

  // Open Dialog for Registering Asset
  const handleAddClick = () => {
    const newIdNum = machines.length > 0 ? Math.max(...machines.map(d => parseInt(d.id.replace(/[^\d]/g, "") || "0"))) + 1 : 1;
    const initialValues = {
      id: `m${newIdNum}`,
      name: "",
      line: "Line A",
      status: "idle",
      uptime: "100.0",
      temperature: "35°C",
      lastMaintenance: "15 Jul",
      nextMaintenance: "15 Aug",
      operator: "",
      hoursToday: "0",
    };
    setFormValues(initialValues);
    setValidationErrors({});
    setDialogMode("create");
    setIsDialogOpen(true);
  };

  // Open Dialog for Editing
  const handleEditClick = (machine: MachineRow) => {
    setActiveRow(machine);
    setFormValues({
      name: machine.name,
      line: machine.line,
      status: machine.status,
      uptime: String(machine.uptime),
      temperature: machine.temperature,
      lastMaintenance: machine.lastMaintenance,
      nextMaintenance: machine.nextMaintenance,
      operator: machine.operator,
      hoursToday: String(machine.hoursToday),
    });
    setValidationErrors({});
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  // Open Dialog for Viewing
  const handleViewClick = (machine: MachineRow) => {
    setActiveRow(machine);
    setFormValues({
      name: machine.name,
      line: machine.line,
      status: machine.status,
      uptime: String(machine.uptime),
      temperature: machine.temperature,
      lastMaintenance: machine.lastMaintenance,
      nextMaintenance: machine.nextMaintenance,
      operator: machine.operator,
      hoursToday: String(machine.hoursToday),
    });
    setValidationErrors({});
    setDialogMode("view");
    setIsDialogOpen(true);
  };

  // Delete machine
  const handleDeleteClick = async (machine: MachineRow) => {
    if (machine.dbId === undefined || !window.confirm(`Delete ${machine.name}?`)) return;
    await apiSend("DELETE", `/manufacturing/machines/${machine.dbId}`);
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
    if (!formValues.name) errors.name = "Machine Asset Name is required.";
    if (!formValues.operator && formValues.status !== "maintenance") {
      errors.operator = "Operator name is required unless machine is in maintenance.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const payload: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(formValues)) {
      if (v === "") continue;
      payload[k] = MACHINE_NUM_KEYS.includes(k) ? Number(v) : v;
    }

    if (dialogMode === "edit" && activeRow?.dbId !== undefined) {
      await apiSend("PATCH", `/manufacturing/machines/${activeRow.dbId}`, payload);
    } else {
      await apiSend("POST", "/manufacturing/machines", payload);
    }

    setVersion((v) => v + 1);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Machines"
        description="Monitor runtime diagnostic telemetry, vibration alerts, temperature status, and maintenance planners."
        breadcrumbs={[
          { label: "Manufacturing", href: "/manufacturing/dashboard" },
          { label: "Machines" },
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
        <div className="flex items-center gap-3 w-full sm:w-auto sm:flex-1 sm:max-w-md">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search machinery…"
              className="w-full pl-9 pr-4 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white placeholder:text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 bg-card/60 border border-border/40 rounded-xl text-xs text-white outline-none focus:border-primary/50 transition-all cursor-pointer bg-navy-200"
          >
            <option value="all">All Status</option>
            <option value="running">Running</option>
            <option value="maintenance">Maintenance</option>
            <option value="idle">Idle</option>
          </select>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={() => exportCsv("machines", filtered, [["id","Machine ID"],["name","Name"],["line","Line"],["status","Status"],["uptime","Uptime %"],["temperature","Temperature"],["lastMaintenance","Last Maintenance"],["nextMaintenance","Next Maintenance"],["operator","Operator"],["hoursToday","Hours Today"]])} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all">
            <Download className="w-3.5 h-3.5" />
            Export Logs
          </button>
          <button 
            onClick={handleAddClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
          >
            <Plus className="w-3.5 h-3.5" />
            Register Asset
          </button>
        </div>
      </div>

      {/* Grid of Machine Cards */}
      {machines.length === 0 ? (
        <EmptyTableState
          title="No machinery assets registered"
          description="Get started by registering a new plant machinery asset to track runtime diagnostics."
          actionLabel="Register Asset"
          onAction={handleAddClick}
        />
      ) : filtered.length === 0 ? (
        <EmptyTableState
          title="No machines matching filter"
          description={`Your query did not match any registered machine attributes.`}
          actionLabel="Clear Filter"
          onAction={() => { setSearch(""); setStatusFilter("all"); }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 animate-fade-in">
          {filtered.map((machine, i) => (
            <div
              key={machine.id}
              className="bg-card/85 backdrop-blur-sm border border-border/40 rounded-2xl p-5 space-y-4 hover:border-border/60 transition-all duration-300 flex flex-col justify-between"
              style={{ animationDelay: `${i * 50}ms` }}
            >
              {/* Header: Name + Badge + Action Icons */}
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="text-sm font-semibold text-white">{machine.name}</h3>
                  <p className="text-[11px] text-muted mt-0.5">{machine.line}</p>
                </div>
                <div className="flex items-center gap-1">
                  {getStatusBadge(machine.status)}
                  <div className="flex items-center ml-2 border-l border-border/20 pl-2 gap-1 text-muted">
                    <button 
                      onClick={() => handleViewClick(machine)}
                      className="p-1 hover:text-white rounded hover:bg-white/5 transition-all"
                      title="View Telemetry"
                    >
                      <Eye className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleEditClick(machine)}
                      className="p-1 hover:text-primary rounded hover:bg-white/5 transition-all"
                      title="Edit Diagnostics"
                    >
                      <Edit className="w-3 h-3" />
                    </button>
                    <button 
                      onClick={() => handleDeleteClick(machine)}
                      disabled={machine.dbId === undefined}
                      className="p-1 hover:text-danger rounded hover:bg-white/5 transition-all disabled:opacity-30"
                      title="Delete Asset"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Diagnostics Stats */}
              <div className="grid grid-cols-2 gap-3 py-1.5 border-y border-border/10">
                <div className="flex items-center gap-2">
                  <Gauge className="w-4 h-4 text-primary shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">
                      {machine.status === "maintenance" ? "—" : `${machine.uptime}%`}
                    </p>
                    <p className="text-[10px] text-muted">Uptime Rate</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Thermometer className="w-4 h-4 text-warning shrink-0" />
                  <div>
                    <p className="text-xs font-bold text-white">{machine.temperature}</p>
                    <p className="text-[10px] text-muted">Temperature</p>
                  </div>
                </div>
              </div>

              {/* Extra details */}
              <div className="space-y-2 text-[11px] text-muted">
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <User className="w-3 h-3 text-muted/65" />
                    Operator
                  </span>
                  <span className="text-white font-medium">{machine.operator}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3 h-3 text-muted/65" />
                    Hours Logged Today
                  </span>
                  <span className="text-white font-medium">{machine.hoursToday} hrs</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Wrench className="w-3 h-3 text-muted/65" />
                    Last Serviced
                  </span>
                  <span>{machine.lastMaintenance}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3 h-3 text-muted/65" />
                    Next Service Due
                  </span>
                  <span className={cn(machine.status === "maintenance" ? "text-warning" : "")}>
                    {machine.nextMaintenance}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Reusable Enterprise Dialog */}
      <FormDialog isOpen={isDialogOpen} onClose={() => setIsDialogOpen(false)} size="2xl">
        <FormHeader
          title={
            dialogMode === "create"
              ? "Register Machinery Asset"
              : dialogMode === "edit"
              ? `Edit Diagnostics`
              : `Asset Diagnostics`
          }
          description={
            dialogMode === "create"
              ? "Register a new machinery asset in the production line telemetry tracking system."
              : dialogMode === "edit"
              ? "Update machine status, operator assignments, and temperature statistics."
              : "Review live diagnostic data, scheduled maintenance events, and operation metrics."
          }
          icon={<Cog className="w-6 h-6" />}
          onClose={() => setIsDialogOpen(false)}
        />

        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <FormSection title="Asset Specification">
            <FormGrid cols={2}>
              <FormField
                label="Asset Name"
                fieldName="name"
                required
                error={validationErrors.name}
                success={formValues.name && !validationErrors.name && dialogMode !== "view"}
                helpText="Name of machine (e.g. Packer #3, Kiln #3)."
              >
                <input
                  type="text"
                  value={formValues.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="Enter machinery name"
                />
              </FormField>

              <FormField
                label="Production Line"
                fieldName="line"
                required
                helpText="Assigned plant sector line."
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
                label="Operational Status"
                fieldName="status"
                helpText="Active runtime status."
              >
                {dialogMode === "view" ? (
                  <input type="text" value={formValues.status || ""} disabled readOnly />
                ) : (
                  <select
                    value={formValues.status || ""}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                  >
                    <option value="idle">Idle</option>
                    <option value="running">Running</option>
                    <option value="maintenance">Maintenance</option>
                  </select>
                )}
              </FormField>
            </FormGrid>
          </FormSection>

          <FormSection title="Diagnostic Metrics & Maintenance">
            <FormGrid cols={2}>
              <FormField
                label="Vibration Uptime %"
                fieldName="uptime"
                required
                helpText="Assigned historical diagnostic uptime rate."
              >
                <input
                  type="number"
                  value={formValues.uptime || ""}
                  onChange={(e) => handleInputChange("uptime", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="e.g. 98.2"
                />
              </FormField>

              <FormField
                label="Temperature Diagnostic"
                fieldName="temperature"
                required
                helpText="Diagnostic sensor telemetry reading (e.g. 65°C)."
              >
                <input
                  type="text"
                  value={formValues.temperature || ""}
                  onChange={(e) => handleInputChange("temperature", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="e.g. 68°C"
                />
              </FormField>

              <FormField
                label="Assigned Operator"
                fieldName="operator"
                error={validationErrors.operator}
                success={formValues.operator && !validationErrors.operator && dialogMode !== "view"}
                helpText="Plant employee responsible on shift."
              >
                <input
                  type="text"
                  value={formValues.operator || ""}
                  onChange={(e) => handleInputChange("operator", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="Operator name"
                />
              </FormField>

              <FormField
                label="Shift Hours Today"
                fieldName="hours"
                helpText="Active duty hours recorded in current block."
              >
                <input
                  type="number"
                  value={formValues.hoursToday || ""}
                  onChange={(e) => handleInputChange("hoursToday", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="e.g. 8.0"
                />
              </FormField>

              <FormField
                label="Last Service Date"
                fieldName="date"
                helpText="Last mechanical audit check."
              >
                <input
                  type="text"
                  value={formValues.lastMaintenance || ""}
                  onChange={(e) => handleInputChange("lastMaintenance", e.target.value)}
                  disabled={dialogMode === "view"}
                />
              </FormField>

              <FormField
                label="Next Service Schedule"
                fieldName="date"
                helpText="Next planned mechanical inspection."
              >
                <input
                  type="text"
                  value={formValues.nextMaintenance || ""}
                  onChange={(e) => handleInputChange("nextMaintenance", e.target.value)}
                  disabled={dialogMode === "view"}
                />
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
                ? "Register Asset"
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
