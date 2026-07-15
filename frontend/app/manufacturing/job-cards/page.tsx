"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  CreditCard,
  CheckCircle2,
  Users,
  Timer,
  AlertCircle,
  Factory,
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
import { jobCardsKpis, jobCards, type MfgKpi, type JobCard } from "@/data/manufacturing-data";
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

const iconMap: Record<string, React.ReactNode> = {
  CreditCard: <CreditCard className="w-4 h-4" />,
  CheckCircle2: <CheckCircle2 className="w-4 h-4" />,
  Users: <Users className="w-4 h-4" />,
  Timer: <Timer className="w-4 h-4" />,
  AlertCircle: <AlertCircle className="w-4 h-4" />,
  Factory: <Factory className="w-4 h-4" />,
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
        {iconMap[data.icon] ?? <CreditCard className="w-4 h-4" />}
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

type CardRow = JobCard & { dbId?: number };
const CARD_NUM_KEYS = ["output", "target"];

export default function JobCardsPage() {
  const [search, setSearch] = useState("");
  const [version, setVersion] = useState(0);

  // Live API hooks
  const kpiLive = useApi<{ kpis: MfgKpi[] }>("/manufacturing/job-cards/analytics", version);
  const listLive = useApi<{ data: Record<string, unknown>[] }>("/manufacturing/job-cards?pageSize=50", version);

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create");
  const [activeRow, setActiveRow] = useState<CardRow | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const kpis = kpiLive?.kpis ?? jobCardsKpis;
  const cards: CardRow[] = listLive
    ? listLive.data.map((r) => ({
        dbId: Number(r.id),
        id: String(r.jobNo ?? r.id),
        task: String(r.task ?? "—"),
        machine: String(r.machine ?? "—"),
        operator: String(r.operator ?? "—"),
        shift: String(r.shift ?? "—"),
        startTime: String(r.startTime ?? "—"),
        endTime: String(r.endTime ?? "—"),
        status: (r.status ?? "pending") as JobCard["status"],
        output: Number(r.output ?? 0),
        target: Number(r.target ?? 0),
      }))
    : jobCards;

  const filtered = cards.filter(
    (card) =>
      card.id.toLowerCase().includes(search.toLowerCase()) ||
      card.task.toLowerCase().includes(search.toLowerCase()) ||
      card.machine.toLowerCase().includes(search.toLowerCase()) ||
      card.operator.toLowerCase().includes(search.toLowerCase())
  );

  const statusVariant = (s: string) => {
    if (s === "completed") return "success";
    if (s === "in-progress") return "warning";
    if (s === "overdue") return "danger";
    return "default";
  };

  // Open dialog for new job card
  const handleAddClick = () => {
    const newIdNum = cards.length > 0 ? Math.max(...cards.map(d => parseInt(d.id.split("-")[1] || "0"))) + 1 : 1;
    const initialValues = {
      id: `JC-${String(newIdNum).padStart(3, "0")}`,
      task: "",
      machine: "Crusher #1",
      operator: "",
      shift: "Shift A",
      startTime: "06:00",
      endTime: "14:00",
      output: "",
      target: "",
      status: "in-progress",
    };
    setFormValues(initialValues);
    setValidationErrors({});
    setDialogMode("create");
    setIsDialogOpen(true);
  };

  // Open dialog for edit
  const handleEditClick = (card: CardRow) => {
    setActiveRow(card);
    setFormValues({
      task: card.task,
      machine: card.machine,
      operator: card.operator,
      shift: card.shift,
      startTime: card.startTime,
      endTime: card.endTime,
      output: String(card.output),
      target: String(card.target),
      status: card.status,
    });
    setValidationErrors({});
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  // Open dialog for view
  const handleViewClick = (card: CardRow) => {
    setActiveRow(card);
    setFormValues({
      task: card.task,
      machine: card.machine,
      operator: card.operator,
      shift: card.shift,
      startTime: card.startTime,
      endTime: card.endTime,
      output: String(card.output),
      target: String(card.target),
      status: card.status,
    });
    setValidationErrors({});
    setDialogMode("view");
    setIsDialogOpen(true);
  };

  // Delete card
  const handleDeleteClick = async (card: CardRow) => {
    if (card.dbId === undefined || !window.confirm(`Delete job card ${card.id}?`)) return;
    await apiSend("DELETE", `/manufacturing/job-cards/${card.dbId}`);
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
    if (!formValues.task) errors.task = "Operation task description is required.";
    if (!formValues.operator) errors.operator = "Operator name is required.";
    if (!formValues.target || isNaN(Number(formValues.target)) || Number(formValues.target) <= 0) {
      errors.target = "Valid target output is required.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const payload: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(formValues)) {
      if (v === "") continue;
      payload[k] = CARD_NUM_KEYS.includes(k) ? Number(v) : v;
    }

    if (dialogMode === "edit" && activeRow?.dbId !== undefined) {
      await apiSend("PATCH", `/manufacturing/job-cards/${activeRow.dbId}`, payload);
    } else {
      await apiSend("POST", "/manufacturing/job-cards", payload);
    }

    setVersion((v) => v + 1);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Job Cards"
        description="Generate, schedule, and assign work orders and checklists to plant operators and machines."
        breadcrumbs={[
          { label: "Manufacturing", href: "/manufacturing/dashboard" },
          { label: "Job Cards" },
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
            placeholder="Search job cards…"
            className="w-full pl-9 pr-4 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white placeholder:text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
          <button onClick={() => exportCsv("job-cards", filtered, [["id","Card ID"],["task","Task"],["machine","Machine"],["operator","Operator"],["shift","Shift"],["startTime","Start"],["endTime","End"],["output","Output"],["target","Target"],["status","Status"]])} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all">
            <Download className="w-3.5 h-3.5" />
            Export
          </button>
          <button 
            onClick={handleAddClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
          >
            <Plus className="w-3.5 h-3.5" />
            New Job Card
          </button>
        </div>
      </div>

      {/* Job Cards Table Section */}
      {cards.length === 0 ? (
        <EmptyTableState
          title="No Job Cards found"
          description="Get started by creating a new plant Job Card schedule."
          actionLabel="New Job Card"
          onAction={handleAddClick}
        />
      ) : filtered.length === 0 ? (
        <EmptyTableState
          title="No search results found"
          description={`Your query "${search}" did not match any fields in the active Job Cards.`}
          actionLabel="Clear Filter"
          onAction={() => setSearch("")}
        />
      ) : (
        <div className="glass-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/20 bg-navy-900/10">
                  {["Card ID", "Operation Task", "Machine Asset", "Operator", "Shift", "Timeline", "Target Progress", "Status", "Actions"].map((h) => (
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
                {filtered.map((card) => {
                  const targetPct = card.target > 0 ? Math.round((card.output / card.target) * 100) : 0;
                  return (
                    <tr
                      key={card.id}
                      className="border-t border-border/10 hover:bg-white/[0.02] transition-colors"
                    >
                      <td className="px-5 py-3.5 text-xs font-medium text-primary">{card.id}</td>
                      <td className="px-5 py-3.5 text-xs font-semibold text-white">{card.task}</td>
                      <td className="px-5 py-3.5 text-xs text-white">{card.machine}</td>
                      <td className="px-5 py-3.5 text-xs text-muted">{card.operator}</td>
                      <td className="px-5 py-3.5 text-xs">
                        <Badge variant="default" className="bg-navy-300/30 text-white border-none text-[10px]">
                          {card.shift}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-xs text-muted">
                        {card.startTime} – {card.endTime}
                      </td>
                      <td className="px-5 py-3.5">
                        {card.target > 0 ? (
                          <div className="space-y-1 w-28">
                            <div className="flex items-center justify-between text-[10px] text-muted">
                              <span>{card.output} produced</span>
                              <span>{targetPct}%</span>
                            </div>
                            <div className="h-1 bg-navy-300/30 rounded-full overflow-hidden">
                              <div
                                className={cn(
                                  "h-full rounded-full transition-all",
                                  targetPct >= 90 ? "bg-success" : targetPct >= 70 ? "bg-primary" : "bg-warning"
                                )}
                                style={{ width: `${Math.min(targetPct, 100)}%` }}
                              />
                            </div>
                          </div>
                        ) : (
                          <span className="text-xs text-muted">No Target</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <Badge variant={statusVariant(card.status)} dot>
                          {card.status.replace("-", " ")}
                        </Badge>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => handleViewClick(card)}
                            className="p-1.5 text-muted hover:text-white rounded-lg hover:bg-white/5 transition-all"
                            title="View Details"
                          >
                            <Eye className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleEditClick(card)}
                            className="p-1.5 text-muted hover:text-primary rounded-lg hover:bg-white/5 transition-all"
                            title="Edit Card"
                          >
                            <Edit className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteClick(card)}
                            disabled={card.dbId === undefined}
                            className="p-1.5 text-muted hover:text-danger rounded-lg hover:bg-white/5 transition-all disabled:opacity-30"
                            title="Delete Card"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
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
              ? "New Job Card Assignment"
              : dialogMode === "edit"
              ? `Edit Job Card`
              : `Job Card Details`
          }
          description={
            dialogMode === "create"
              ? "Generate a new shift task instruction card for machinery and operators."
              : dialogMode === "edit"
              ? "Update active operator allocation, output statistics, and checklist targets."
              : "Review task description, assigned machinery asset, output count, and progress rate."
          }
          icon={<CreditCard className="w-6 h-6" />}
          onClose={() => setIsDialogOpen(false)}
        />

        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <FormSection title="Operation Specifications">
            <FormGrid cols={2}>
              <FormField
                label="Operation Task"
                fieldName="task"
                required
                error={validationErrors.task}
                success={formValues.task && !validationErrors.task && dialogMode !== "view"}
                helpText="Task description (e.g. Crusher Feed, Bag Packing)."
              >
                <input
                  type="text"
                  value={formValues.task || ""}
                  onChange={(e) => handleInputChange("task", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="Enter operation task"
                />
              </FormField>

              <FormField
                label="Machine Asset"
                fieldName="machine"
                required
                helpText="Assigned machinery item for task."
              >
                {dialogMode === "view" ? (
                  <input type="text" value={formValues.machine || ""} disabled readOnly />
                ) : (
                  <select
                    value={formValues.machine || ""}
                    onChange={(e) => handleInputChange("machine", e.target.value)}
                  >
                    <option value="Crusher #1">Crusher #1</option>
                    <option value="Crusher #2">Crusher #2</option>
                    <option value="Raw Mill">Raw Mill</option>
                    <option value="Kiln #1">Kiln #1</option>
                    <option value="Cement Mill #1">Cement Mill #1</option>
                    <option value="Packer #1">Packer #1</option>
                    <option value="Packer #2">Packer #2</option>
                  </select>
                )}
              </FormField>

              <FormField
                label="Assigned Operator"
                fieldName="operator"
                required
                error={validationErrors.operator}
                success={formValues.operator && !validationErrors.operator && dialogMode !== "view"}
                helpText="Employee on duty."
              >
                <input
                  type="text"
                  value={formValues.operator || ""}
                  onChange={(e) => handleInputChange("operator", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="Operator full name"
                />
              </FormField>

              <FormField
                label="Operational Shift"
                fieldName="shift"
                required
                helpText="Assigned employee scheduling shift."
              >
                {dialogMode === "view" ? (
                  <input type="text" value={formValues.shift || ""} disabled readOnly />
                ) : (
                  <select
                    value={formValues.shift || ""}
                    onChange={(e) => handleInputChange("shift", e.target.value)}
                  >
                    <option value="Shift A">Shift A</option>
                    <option value="Shift B">Shift B</option>
                    <option value="Shift C">Shift C</option>
                  </select>
                )}
              </FormField>
            </FormGrid>
          </FormSection>

          <FormSection title="Timelines & Output Tracking">
            <FormGrid cols={2}>
              <FormField
                label="Start Time"
                fieldName="time"
                required
                helpText="Shift work block start."
              >
                <input
                  type="text"
                  value={formValues.startTime || ""}
                  onChange={(e) => handleInputChange("startTime", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="e.g. 06:00"
                />
              </FormField>

              <FormField
                label="End Time"
                fieldName="time"
                required
                helpText="Shift work block end."
              >
                <input
                  type="text"
                  value={formValues.endTime || ""}
                  onChange={(e) => handleInputChange("endTime", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="e.g. 14:00"
                />
              </FormField>

              <FormField
                label="Target Quantity"
                fieldName="qty"
                required
                error={validationErrors.target}
                success={formValues.target && !validationErrors.target && dialogMode !== "view"}
                helpText="Planned constituent volume target."
              >
                <input
                  type="number"
                  value={formValues.target || ""}
                  onChange={(e) => handleInputChange("target", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="e.g. 5000"
                />
              </FormField>

              <FormField
                label="Produced Output"
                fieldName="qty"
                helpText="Recorded constituent output."
              >
                <input
                  type="number"
                  value={formValues.output || ""}
                  onChange={(e) => handleInputChange("output", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="e.g. 4800"
                />
              </FormField>

              <FormField
                label="Card Status"
                fieldName="status"
                helpText="Current assignment status."
              >
                {dialogMode === "view" ? (
                  <input type="text" value={formValues.status || ""} disabled readOnly />
                ) : (
                  <select
                    value={formValues.status || ""}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                  >
                    <option value="in-progress">In Progress</option>
                    <option value="overdue">Overdue</option>
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
                ? "Assign Task"
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
