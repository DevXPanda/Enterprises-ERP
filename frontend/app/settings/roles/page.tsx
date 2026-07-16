"use client";

import { useState } from "react";
import { PageHeader } from "@/components/ui/page-header";
import { Shield, ShieldAlert, Check, X, ShieldCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface RolePermission {
  role: string;
  factory: { read: boolean; write: boolean; delete: boolean };
  wages: { read: boolean; write: boolean; delete: boolean };
  manufacturing: { read: boolean; write: boolean; delete: boolean };
}

export default function RolesPermissionsPage() {
  const [roles, setRoles] = useState<RolePermission[]>([
    {
      role: "Super Admin",
      factory: { read: true, write: true, delete: true },
      wages: { read: true, write: true, delete: true },
      manufacturing: { read: true, write: true, delete: true },
    },
    {
      role: "Wages Admin",
      factory: { read: true, write: false, delete: false },
      wages: { read: true, write: true, delete: true },
      manufacturing: { read: false, write: false, delete: false },
    },
    {
      role: "Mfg Operator",
      factory: { read: false, write: false, delete: false },
      wages: { read: false, write: false, delete: false },
      manufacturing: { read: true, write: true, delete: false },
    },
    {
      role: "QC Supervisor",
      factory: { read: true, write: true, delete: false },
      wages: { read: false, write: false, delete: false },
      manufacturing: { read: true, write: true, delete: false },
    },
  ]);

  const [activeRole, setActiveRole] = useState("Super Admin");

  const selected = roles.find((r) => r.role === activeRole) || roles[0];

  const togglePermission = (module: "factory" | "wages" | "manufacturing", action: "read" | "write" | "delete") => {
    if (activeRole === "Super Admin") return; // Super Admin cannot be modified
    setRoles((prev) =>
      prev.map((r) => {
        if (r.role === activeRole) {
          return {
            ...r,
            [module]: {
              ...r[module],
              [action]: !r[module][action],
            },
          };
        }
        return r;
      })
    );
  };

  const CheckboxCell = ({
    module,
    action,
    val,
  }: {
    module: "factory" | "wages" | "manufacturing";
    action: "read" | "write" | "delete";
    val: boolean;
  }) => {
    const isSuperAdmin = activeRole === "Super Admin";
    return (
      <div className="flex items-center justify-center">
        <button
          type="button"
          disabled={isSuperAdmin}
          onClick={() => togglePermission(module, action)}
          className={
            "w-7 h-7 rounded-lg flex items-center justify-center border transition-all " +
            (val
              ? "bg-success/20 border-success/40 text-success"
              : "bg-navy-300/10 border-border/20 text-muted/40") +
            (isSuperAdmin ? " cursor-not-allowed opacity-80" : " hover:bg-white/5")
          }
        >
          {val ? <Check className="w-4 h-4" /> : <X className="w-3.5 h-3.5" />}
        </button>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Roles & Permissions"
        description="Verify system access roles, define feature read/write/delete scope matrixes, and lock security authorizations."
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Roles & Permissions" }
        ]}
      />

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Side: Roles List */}
        <div className="lg:col-span-1 glass-card p-5 space-y-4 animate-fade-in">
          <div className="flex items-center gap-3 pb-2 border-b border-border/10">
            <Shield className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-white">Access Roles</h3>
          </div>
          
          <div className="space-y-2 pt-1">
            {roles.map((r) => (
              <button
                key={r.role}
                onClick={() => setActiveRole(r.role)}
                className={
                  "w-full text-left px-3.5 py-3 rounded-xl text-xs font-semibold flex items-center justify-between transition-all " +
                  (activeRole === r.role
                    ? "bg-primary text-white shadow-md shadow-primary/10"
                    : "bg-navy-300/10 text-muted hover:bg-white/5 hover:text-white border border-border/10")
                }
              >
                <span>{r.role}</span>
                {r.role === "Super Admin" && (
                  <Badge variant="success" className="bg-success-dark text-[9px] font-bold py-0.5 border-none">
                    LOCKED
                  </Badge>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Right Side: Permissions Matrix */}
        <div className="lg:col-span-3 glass-card p-5 space-y-5 animate-fade-in" style={{ animationDelay: "100ms" }}>
          <div className="flex items-center justify-between pb-2 border-b border-border/10">
            <div className="flex items-center gap-3">
              <ShieldCheck className="w-5 h-5 text-success" />
              <h3 className="text-sm font-semibold text-white">
                Permissions Matrix: <span className="text-primary">{selected.role}</span>
              </h3>
            </div>
            {activeRole === "Super Admin" && (
              <p className="text-[10px] text-muted flex items-center gap-1">
                <ShieldAlert className="w-3.5 h-3.5 text-warning" /> Super Admin overrides all security scopes.
              </p>
            )}
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-center text-xs text-white">
              <thead>
                <tr className="border-b border-border/20 bg-navy-900/10 text-muted/70 uppercase text-[10px] tracking-wider font-semibold">
                  <th className="px-5 py-3 text-left">Module Domain</th>
                  <th className="px-5 py-3">Read (View)</th>
                  <th className="px-5 py-3">Write (Edit)</th>
                  <th className="px-5 py-3">Delete</th>
                </tr>
              </thead>
              <tbody>
                {/* Factory Row */}
                <tr className="border-b border-border/5">
                  <td className="px-5 py-4 text-left font-medium">Factory Operations</td>
                  <td className="px-5 py-4">
                    <CheckboxCell module="factory" action="read" val={selected.factory.read} />
                  </td>
                  <td className="px-5 py-4">
                    <CheckboxCell module="factory" action="write" val={selected.factory.write} />
                  </td>
                  <td className="px-5 py-4">
                    <CheckboxCell module="factory" action="delete" val={selected.factory.delete} />
                  </td>
                </tr>

                {/* Wages Row */}
                <tr className="border-b border-border/5">
                  <td className="px-5 py-4 text-left font-medium">Wages & Payouts (MWMS)</td>
                  <td className="px-5 py-4">
                    <CheckboxCell module="wages" action="read" val={selected.wages.read} />
                  </td>
                  <td className="px-5 py-4">
                    <CheckboxCell module="wages" action="write" val={selected.wages.write} />
                  </td>
                  <td className="px-5 py-4">
                    <CheckboxCell module="wages" action="delete" val={selected.wages.delete} />
                  </td>
                </tr>

                {/* Manufacturing Row */}
                <tr className="border-b border-border/5">
                  <td className="px-5 py-4 text-left font-medium">Manufacturing & BOM</td>
                  <td className="px-5 py-4">
                    <CheckboxCell module="manufacturing" action="read" val={selected.manufacturing.read} />
                  </td>
                  <td className="px-5 py-4">
                    <CheckboxCell module="manufacturing" action="write" val={selected.manufacturing.write} />
                  </td>
                  <td className="px-5 py-4">
                    <CheckboxCell module="manufacturing" action="delete" val={selected.manufacturing.delete} />
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
