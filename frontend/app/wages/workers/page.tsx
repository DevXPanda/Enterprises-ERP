"use client";

import { useState } from "react";
import {
  Search,
  Filter,
  Download,
  Plus,
  Users,
  UserCheck,
  UserMinus,
  Shield,
  FileText,
  AlertTriangle,
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
import { workersKpis, workersList, type WagesKpi, type Worker } from "@/data/wages-data";
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
  Users: <Users className="w-4 h-4" />,
  UserCheck: <UserCheck className="w-4 h-4" />,
  UserMinus: <UserMinus className="w-4 h-4" />,
  Shield: <Shield className="w-4 h-4" />,
  FileText: <FileText className="w-4 h-4" />,
  AlertTriangle: <AlertTriangle className="w-4 h-4" />,
};

function KpiCard({ data, index }: { data: WagesKpi; index: number }) {
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
        {iconMap[data.icon] ?? <Users className="w-4 h-4" />}
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

type WorkerRow = Worker & { dbId?: number };

export default function WorkersPage() {
  const [search, setSearch] = useState("");
  const [version, setVersion] = useState(0);

  // Live API hook
  const live = useApi<{ kpis: WagesKpi[]; data: Record<string, unknown>[] }>("/wages/workers", version);

  // Dialog states
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit" | "view">("create");
  const [activeRow, setActiveRow] = useState<WorkerRow | null>(null);
  const [formValues, setFormValues] = useState<Record<string, any>>({});
  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({});

  const kpis = live?.kpis ?? workersKpis;
  const workers: WorkerRow[] = live
    ? live.data.map((r) => ({
        dbId: Number(r.id),
        id: String(r.id ?? "—"),
        name: String(r.name ?? "—"),
        department: String(r.department ?? "—"),
        type: (r.type ?? "permanent") as Worker["type"],
        dailyRate: Number(r.dailyRate ?? 0),
        bankAccount: String(r.bankAccount ?? "******0000"),
        attendancePct: Number(r.attendancePct ?? 0),
        status: (r.status ?? "active") as Worker["status"],
      }))
    : workersList;

  const filtered = workers.filter(
    (worker) =>
      worker.name.toLowerCase().includes(search.toLowerCase()) ||
      worker.id.toLowerCase().includes(search.toLowerCase()) ||
      worker.department.toLowerCase().includes(search.toLowerCase())
  );

  const statusVariant = (s: string) => {
    if (s === "active") return "success";
    if (s === "leave") return "warning";
    return "danger";
  };

  // Open dialog for adding
  const handleAddClick = () => {
    const initialValues = {
      name: "",
      department: "Production",
      type: "permanent",
      dailyRate: "500",
      bankAccount: "",
      attendancePct: "100",
      status: "active",
      shift: "Morning",
    };
    setFormValues(initialValues);
    setValidationErrors({});
    setDialogMode("create");
    setIsDialogOpen(true);
  };

  // Open dialog for editing
  const handleEditClick = (worker: WorkerRow) => {
    setActiveRow(worker);
    setFormValues({
      name: worker.name,
      department: worker.department,
      type: worker.type,
      dailyRate: String(worker.dailyRate),
      bankAccount: worker.bankAccount,
      attendancePct: String(worker.attendancePct),
      status: worker.status,
      shift: "Morning",
    });
    setValidationErrors({});
    setDialogMode("edit");
    setIsDialogOpen(true);
  };

  // Open dialog for viewing
  const handleViewClick = (worker: WorkerRow) => {
    setActiveRow(worker);
    setFormValues({
      name: worker.name,
      department: worker.department,
      type: worker.type,
      dailyRate: String(worker.dailyRate),
      bankAccount: worker.bankAccount,
      attendancePct: String(worker.attendancePct),
      status: worker.status,
      shift: "Morning",
    });
    setValidationErrors({});
    setDialogMode("view");
    setIsDialogOpen(true);
  };

  // Delete worker
  const handleDeleteClick = async (worker: WorkerRow) => {
    if (worker.dbId === undefined || !window.confirm(`Delete worker ${worker.name}?`)) return;
    await apiSend("DELETE", `/wages/workers/${worker.dbId}`);
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

  // Form submission
  const handleFormSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (dialogMode === "view") {
      setIsDialogOpen(false);
      return;
    }

    // Validation checks
    const errors: Record<string, string> = {};
    if (!formValues.name) errors.name = "Worker Full Name is required.";
    if (!formValues.bankAccount || !/^\d{9,18}$/.test(formValues.bankAccount)) {
      errors.bankAccount = "Bank account number must be between 9 and 18 digits.";
    }
    if (!formValues.dailyRate || isNaN(Number(formValues.dailyRate)) || Number(formValues.dailyRate) <= 0) {
      errors.dailyRate = "Valid positive daily rate rate is required.";
    }

    if (Object.keys(errors).length > 0) {
      setValidationErrors(errors);
      return;
    }

    const payload = {
      name: formValues.name,
      department: formValues.department,
      type: formValues.type,
      dailyRate: Number(formValues.dailyRate),
      bankAccount: formValues.bankAccount,
      status: formValues.status,
      shift: formValues.shift || "Morning",
    };

    if (dialogMode === "edit" && activeRow?.dbId !== undefined) {
      await apiSend("PATCH", `/wages/workers/${activeRow.dbId}`, payload);
    } else {
      await apiSend("POST", "/wages/workers", payload);
    }

    setVersion((v) => v + 1);
    setIsDialogOpen(false);
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="Workers Directory"
        description="Register and manage plant operators, track their wages parameters, departments, and bank credentials."
        breadcrumbs={[
          { label: "Wages", href: "/wages/dashboard" },
          { label: "Workers" },
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
            placeholder="Search workers…"
            className="w-full pl-9 pr-4 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white placeholder:text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all">
            <Filter className="w-3.5 h-3.5" />
            Filter
          </button>
          <button onClick={() => exportCsv("workers-directory", filtered, [["id","Worker ID"],["name","Name"],["department","Department"],["type","Type"],["dailyRate","Daily Rate"],["bankAccount","Bank Account"],["attendancePct","Attendance %"],["status","Status"]])} className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-muted border border-border/40 bg-card/40 hover:bg-white/5 hover:text-white transition-all">
            <Download className="w-3.5 h-3.5" />
            Export Directory
          </button>
          <button 
            onClick={handleAddClick}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary/95 transition-all shadow-md shadow-primary/10"
          >
            <Plus className="w-3.5 h-3.5" />
            Add Worker
          </button>
        </div>
      </div>

      {/* Workers Table */}
      {workers.length === 0 ? (
        <EmptyTableState
          title="No worker files created"
          description="Get started by registering a new plant operator to standard shift lists."
          actionLabel="Add Worker"
          onAction={handleAddClick}
        />
      ) : filtered.length === 0 ? (
        <EmptyTableState
          title="No search results found"
          description={`Your query "${search}" did not match any operator directory fields.`}
          actionLabel="Clear Filter"
          onAction={() => setSearch("")}
        />
      ) : (
        <div className="glass-card overflow-hidden animate-fade-in">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border/20 bg-navy-900/10">
                  {["Worker ID", "Name", "Department", "Type", "Daily Rate", "Bank Account", "Attendance (Avg)", "Status", "Actions"].map((h) => (
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
                {filtered.map((worker) => (
                  <tr
                    key={worker.id}
                    className="border-t border-border/10 hover:bg-white/[0.02] transition-colors"
                  >
                    <td className="px-5 py-3.5 text-xs font-medium text-primary">{worker.id}</td>
                    <td className="px-5 py-3.5 text-xs font-semibold text-white">{worker.name}</td>
                    <td className="px-5 py-3.5 text-xs text-white">{worker.department}</td>
                    <td className="px-5 py-3.5 text-xs text-muted">
                      <Badge variant="default" className="bg-navy-300/30 text-white border-none text-[10px]">
                        {worker.type}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-xs font-bold text-white">₹{worker.dailyRate}/day</td>
                    <td className="px-5 py-3.5 text-xs text-muted font-mono">{worker.bankAccount}</td>
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-1.5 bg-navy-300/30 rounded-full overflow-hidden w-16">
                          <div
                            className={cn(
                              "h-full rounded-full",
                              worker.attendancePct >= 95 ? "bg-success" : worker.attendancePct >= 90 ? "bg-primary" : "bg-warning"
                            )}
                            style={{ width: `${worker.attendancePct}%` }}
                          />
                        </div>
                        <span className="text-[10px] text-muted">{worker.attendancePct}%</span>
                      </div>
                    </td>
                    <td className="px-5 py-3.5">
                      <Badge variant={statusVariant(worker.status)} dot>
                        {worker.status}
                      </Badge>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleViewClick(worker)}
                          className="p-1.5 text-muted hover:text-white rounded-lg hover:bg-white/5 transition-all"
                          title="View Details"
                        >
                          <Eye className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleEditClick(worker)}
                          className="p-1.5 text-muted hover:text-primary rounded-lg hover:bg-white/5 transition-all"
                          title="Edit Worker Profile"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(worker)}
                          disabled={worker.dbId === undefined}
                          className="p-1.5 text-muted hover:text-danger rounded-lg hover:bg-white/5 transition-all disabled:opacity-30"
                          title="Delete Worker"
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
              ? "Register Plant Operator"
              : dialogMode === "edit"
              ? `Edit Profile`
              : `Operator Record`
          }
          description={
            dialogMode === "create"
              ? "Create a new profile record for standard shifts and wages bookkeeping."
              : dialogMode === "edit"
              ? "Modify wage parameters, department lines, and bank credentials."
              : "Review wage history average, contract type details, and active status logs."
          }
          icon={<Users className="w-6 h-6" />}
          onClose={() => setIsDialogOpen(false)}
        />

        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <FormSection title="Personal Profile Details">
            <FormGrid cols={2}>
              <FormField
                label="Full Name"
                fieldName="name"
                required
                error={validationErrors.name}
                success={formValues.name && !validationErrors.name && dialogMode !== "view"}
                helpText="First name and surname."
              >
                <input
                  type="text"
                  value={formValues.name || ""}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="Enter employee full name"
                />
              </FormField>

              <FormField
                label="Plant Department"
                fieldName="department"
                required
                helpText="Assigned operational plant sector."
              >
                {dialogMode === "view" ? (
                  <input type="text" value={formValues.department || ""} disabled readOnly />
                ) : (
                  <select
                    value={formValues.department || ""}
                    onChange={(e) => handleInputChange("department", e.target.value)}
                  >
                    <option value="Production">Production</option>
                    <option value="Packing">Packing</option>
                    <option value="Quality Control">Quality Control</option>
                    <option value="Maintenance">Maintenance</option>
                    <option value="Store">Store</option>
                    <option value="Dispatch">Dispatch</option>
                  </select>
                )}
              </FormField>

              <FormField
                label="Employment Contract"
                fieldName="type"
                required
                helpText="Worker contract specification."
              >
                {dialogMode === "view" ? (
                  <input type="text" value={formValues.type || ""} disabled readOnly />
                ) : (
                  <select
                    value={formValues.type || ""}
                    onChange={(e) => handleInputChange("type", e.target.value)}
                  >
                    <option value="permanent">Permanent</option>
                    <option value="contractual">Contractual</option>
                  </select>
                )}
              </FormField>

              <FormField
                label="Shift"
                fieldName="shift"
                required
                helpText="Active duty work shift."
              >
                {dialogMode === "view" ? (
                  <input type="text" value={formValues.shift || "Morning"} disabled readOnly />
                ) : (
                  <select
                    value={formValues.shift || "Morning"}
                    onChange={(e) => handleInputChange("shift", e.target.value)}
                  >
                    <option value="Morning">Morning</option>
                    <option value="Evening">Evening</option>
                    <option value="Night">Night</option>
                  </select>
                )}
              </FormField>
            </FormGrid>
          </FormSection>

          <FormSection title="Financial & Performance Parameters">
            <FormGrid cols={2}>
              <FormField
                label="Daily Wage Rate (INR)"
                fieldName="dailyRate"
                required
                error={validationErrors.dailyRate}
                success={formValues.dailyRate && !validationErrors.dailyRate && dialogMode !== "view"}
                helpText="Base daily rate paid per active shift."
              >
                <input
                  type="number"
                  value={formValues.dailyRate || ""}
                  onChange={(e) => handleInputChange("dailyRate", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="e.g. 500"
                />
              </FormField>

              <FormField
                label="Bank Account Number"
                fieldName="bankAccount"
                required
                error={validationErrors.bankAccount}
                success={formValues.bankAccount && !validationErrors.bankAccount && dialogMode !== "view"}
                helpText="Unique salary payout bank account (9-18 digits)."
              >
                <input
                  type="text"
                  value={formValues.bankAccount || ""}
                  onChange={(e) => handleInputChange("bankAccount", e.target.value)}
                  disabled={dialogMode === "view"}
                  placeholder="e.g. 987654321"
                />
              </FormField>

              <FormField
                label="Availability Status"
                fieldName="status"
                helpText="Availability configuration."
              >
                {dialogMode === "view" ? (
                  <input type="text" value={formValues.status || ""} disabled readOnly />
                ) : (
                  <select
                    value={formValues.status || ""}
                    onChange={(e) => handleInputChange("status", e.target.value)}
                  >
                    <option value="active">Active</option>
                    <option value="leave">On Leave</option>
                    <option value="suspended">Suspended</option>
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
                ? "Register Worker"
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
