"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { Plus, Search, Filter, Trash2, Edit, UserPlus } from "lucide-react";
import { 
  FormDialog, FormHeader, FormSection, FormGrid, FormField, FormFooter, ActionButtons 
} from "@/components/ui/enterprise-form";

interface UserRecord {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "suspended";
  addedAt: string;
}

export default function UserManagementPage() {
  const [users, setUsers] = useState<UserRecord[]>([
    { id: "USR-001", name: "Kushal Sharma", email: "admin@nktech.in", role: "Super Admin", status: "active", addedAt: "10 Apr 2026" },
    { id: "USR-002", name: "Sachin Dev", email: "sachin@nktech.in", role: "Wages Admin", status: "active", addedAt: "12 Apr 2026" },
    { id: "USR-003", name: "Dinesh Patel", email: "patel@nktech.in", role: "Mfg Operator", status: "active", addedAt: "05 May 2026" },
    { id: "USR-004", name: "Meera Nair", email: "meera@nktech.in", role: "QC Supervisor", status: "suspended", addedAt: "18 Jun 2026" },
  ]);

  const [search, setSearch] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [formValues, setFormValues] = useState({
    name: "",
    email: "",
    role: "Mfg Operator",
    status: "active",
  });

  const filtered = users.filter(
    (u) =>
      u.name.toLowerCase().includes(search.toLowerCase()) ||
      u.email.toLowerCase().includes(search.toLowerCase()) ||
      u.role.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddClick = () => {
    setFormValues({ name: "", email: "", role: "Mfg Operator", status: "active" });
    setDialogOpen(true);
  };

  const handleFormSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formValues.name || !formValues.email) return;

    const newId = `USR-${String(users.length + 1).padStart(3, "0")}`;
    const newRecord: UserRecord = {
      id: newId,
      name: formValues.name,
      email: formValues.email,
      role: formValues.role,
      status: formValues.status as "active" | "suspended",
      addedAt: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    };

    setUsers((prev) => [...prev, newRecord]);
    setDialogOpen(false);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(`Remove user ${id}?`)) {
      setUsers((prev) => prev.filter((u) => u.id !== id));
    }
  };

  return (
    <div className="space-y-5">
      <PageHeader
        title="User Management"
        description="Monitor system user registries, add new operators or administrator accounts, configure status, and check access history."
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "User Management" }
        ]}
      />

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 animate-fade-in">
        <div className="relative w-full sm:w-auto sm:flex-1 sm:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search users…"
            className="w-full pl-9 pr-4 py-2 bg-card/60 border border-border/40 rounded-xl text-sm text-white placeholder:text-muted/50 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button onClick={handleAddClick} className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-semibold text-white bg-primary hover:bg-primary/95 transition-all shadow-md shadow-primary/10">
            <Plus className="w-3.5 h-3.5" />
            Add User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="glass-card overflow-hidden animate-fade-in">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-white">
            <thead>
              <tr className="border-b border-border/20 bg-navy-900/10 text-muted/70 uppercase text-[10px] tracking-wider font-semibold">
                <th className="px-5 py-3.5">User ID</th>
                <th className="px-5 py-3.5">Full Name</th>
                <th className="px-5 py-3.5">Email Address</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Status</th>
                <th className="px-5 py-3.5">Date Added</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((user) => (
                <tr key={user.id} className="border-b border-border/5 hover:bg-white/[0.01] transition-colors">
                  <td className="px-5 py-3.5 text-primary font-medium">{user.id}</td>
                  <td className="px-5 py-3.5 font-medium">{user.name}</td>
                  <td className="px-5 py-3.5 text-muted">{user.email}</td>
                  <td className="px-5 py-3.5 text-white">
                    <Badge variant="default" className="bg-navy-300/30 text-white border-none">
                      {user.role}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5">
                    <Badge variant={user.status === "active" ? "success" : "danger"} dot>
                      {user.status}
                    </Badge>
                  </td>
                  <td className="px-5 py-3.5 text-muted/70">{user.addedAt}</td>
                  <td className="px-5 py-3.5 text-right">
                    <button
                      onClick={() => handleDelete(user.id)}
                      disabled={user.role === "Super Admin"}
                      className="p-1.5 text-muted hover:text-danger hover:bg-white/5 rounded-lg disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                      title="Remove User"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* FormDialog */}
      <FormDialog isOpen={dialogOpen} onClose={() => setDialogOpen(false)} size="lg">
        <FormHeader
          title="Add System User"
          description="Register a new system operator or department administrator and assign permissions."
          icon={<UserPlus className="w-6 h-6" />}
          onClose={() => setDialogOpen(false)}
        />
        <form onSubmit={handleFormSubmit} className="flex-1 overflow-y-auto p-6 space-y-6">
          <FormSection title="Account Parameters">
            <FormGrid cols={2}>
              <FormField label="Full Name" required>
                <input
                  type="text"
                  value={formValues.name}
                  onChange={(e) => setFormValues((v) => ({ ...v, name: e.target.value }))}
                  placeholder="Enter user name"
                  required
                />
              </FormField>

              <FormField label="Email Address" required>
                <input
                  type="email"
                  value={formValues.email}
                  onChange={(e) => setFormValues((v) => ({ ...v, email: e.target.value }))}
                  placeholder="Enter email address"
                  required
                />
              </FormField>
            </FormGrid>

            <FormGrid cols={2}>
              <FormField label="System Role" required>
                <select
                  value={formValues.role}
                  onChange={(e) => setFormValues((v) => ({ ...v, role: e.target.value }))}
                >
                  <option value="Wages Admin">Wages Admin</option>
                  <option value="Mfg Operator">Mfg Operator</option>
                  <option value="QC Supervisor">QC Supervisor</option>
                  <option value="Store Manager">Store Manager</option>
                </select>
              </FormField>

              <FormField label="Availability Status" required>
                <select
                  value={formValues.status}
                  onChange={(e) => setFormValues((v) => ({ ...v, status: e.target.value }))}
                >
                  <option value="active">Active</option>
                  <option value="suspended">Suspended</option>
                </select>
              </FormField>
            </FormGrid>
          </FormSection>
        </form>
        <FormFooter>
          <ActionButtons
            onCancel={() => setDialogOpen(false)}
            submitLabel="Register User"
            onSubmit={handleFormSubmit}
          />
        </FormFooter>
      </FormDialog>
    </div>
  );
}
