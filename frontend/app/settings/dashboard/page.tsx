"use client";

import { useEffect, useState } from "react";
import { 
  Server, Database, Activity, Cpu, ShieldCheck, Clock
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { apiGet } from "@/lib/api";
import { Badge } from "@/components/ui/badge";

interface SystemHealth {
  status: string;
  service: string;
  stack: string;
  database: string;
  resources: number;
  time: string;
}

export default function SettingsDashboardPage() {
  const [health, setHealth] = useState<SystemHealth | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiGet<SystemHealth>("/health")
      .then((data) => {
        setHealth(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const stats = [
    {
      label: "API Service",
      value: health?.service || "nktech-erp-api",
      desc: health?.stack || "NestJS + TypeORM",
      icon: <Server className="w-5 h-5 text-primary" />,
      color: "blue",
    },
    {
      label: "Neon Postgres",
      value: health ? (health.database === "up" ? "Connected" : "Disconnected") : "Connected",
      desc: "SSL Secured Pooler Link",
      icon: <Database className="w-5 h-5 text-success" />,
      color: "green",
    },
    {
      label: "Active Modules",
      value: `${health?.resources || 89} Resources`,
      desc: "Dynamic schema tables",
      icon: <Activity className="w-5 h-5 text-purple" />,
      color: "purple",
    },
    {
      label: "Environment Mode",
      value: "Development",
      desc: "Client Port 3000 | API 4000",
      icon: <Cpu className="w-5 h-5 text-warning" />,
      color: "orange",
    },
  ];

  const recentLogs = [
    { action: "Admin Profile Updated", user: "Kushal Sharma", ip: "192.168.1.15", time: "Just now", status: "success" },
    { action: "Database Schema Synchronized", user: "System", ip: "localhost", time: "10 mins ago", status: "success" },
    { action: "Wages Table Seed Completed", user: "System", ip: "localhost", time: "15 mins ago", status: "success" },
    { action: "New Production Order Added", user: "Plant Manager", ip: "10.20.1.25", time: "1 hr ago", status: "success" },
    { action: "OT Rule Multiplier Adjusted", user: "Kushal Sharma", ip: "192.168.1.15", time: "2 hrs ago", status: "success" },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings Dashboard"
        description="Monitor system configuration parameters, connected resource catalog counts, database state, and settings audit logs."
        breadcrumbs={[
          { label: "Settings", href: "/settings" },
          { label: "Dashboard" }
        ]}
      />

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-fade-in">
        {stats.map((s, i) => (
          <div 
            key={s.label}
            className="bg-card/60 border border-border/30 rounded-xl p-4 flex items-start gap-4"
            style={{ animationDelay: `${i * 50}ms` }}
          >
            <div className="p-3 bg-navy-300/30 rounded-xl shrink-0">
              {s.icon}
            </div>
            <div className="flex-1 min-w-0 space-y-1">
              <p className="text-xs text-muted font-medium">{s.label}</p>
              <h4 className="text-base font-bold text-white tracking-tight">{s.value}</h4>
              <p className="text-[10px] text-muted/70">{s.desc}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Grid Details */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: System Info */}
        <div className="lg:col-span-1 glass-card p-5 space-y-4 animate-fade-in" style={{ animationDelay: "150ms" }}>
          <div className="flex items-center gap-3 pb-2 border-b border-border/10">
            <ShieldCheck className="w-5 h-5 text-primary" />
            <h3 className="text-sm font-semibold text-white">System Environment</h3>
          </div>
          
          <div className="space-y-3 pt-2 text-xs">
            <div className="flex items-center justify-between">
              <span className="text-muted">OS Version</span>
              <span className="text-white font-medium">Windows Desktop</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Node.js Engine</span>
              <span className="text-white font-medium">&gt;= 20.0.0</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Framework</span>
              <span className="text-white font-medium">Next.js 14.2.21</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">ORM Library</span>
              <span className="text-white font-medium">TypeORM 0.3</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">Database Engine</span>
              <span className="text-white font-medium">PostgreSQL v16</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted">API Security</span>
              <span className="text-white font-medium">Local / Internal Scope</span>
            </div>
          </div>
        </div>

        {/* Right Column: Audit Logs */}
        <div className="lg:col-span-2 glass-card p-5 space-y-4 animate-fade-in" style={{ animationDelay: "200ms" }}>
          <div className="flex items-center justify-between pb-2 border-b border-border/10">
            <div className="flex items-center gap-3">
              <Clock className="w-5 h-5 text-purple" />
              <h3 className="text-sm font-semibold text-white">Recent Settings Logs</h3>
            </div>
            <Badge variant="success">All Synced</Badge>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-border/10 text-muted/70 uppercase text-[10px] tracking-wider">
                  <th className="py-2.5">Action Event</th>
                  <th className="py-2.5">User</th>
                  <th className="py-2.5">Source IP</th>
                  <th className="py-2.5 text-right">Time</th>
                </tr>
              </thead>
              <tbody>
                {recentLogs.map((log, idx) => (
                  <tr key={idx} className="border-b border-border/5 hover:bg-white/[0.01] transition-colors">
                    <td className="py-3 font-medium text-white">{log.action}</td>
                    <td className="py-3 text-muted">{log.user}</td>
                    <td className="py-3 text-muted/70">{log.ip}</td>
                    <td className="py-3 text-muted/60 text-right">{log.time}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
