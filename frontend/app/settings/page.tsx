"use client";

import { useState } from "react";
import {
  Settings,
  Save,
  Shield,
  Bell,
  Cpu,
  Globe,
  CheckCircle,
  Eye,
  Key,
} from "lucide-react";
import { PageHeader } from "@/components/ui/page-header";
import { cn } from "@/lib/utils";

export default function SettingsPage() {
  // General System State
  const [companyName, setCompanyName] = useState("NKTech Enterprises");
  const [timezone, setTimezone] = useState("IST (UTC+5:30)");
  const [currency, setCurrency] = useState("INR (₹)");

  // API Config State
  const [gatewayUrl, setGatewayUrl] = useState("http://localhost:8080");
  const [wagesUrl, setWagesUrl] = useState("http://localhost:4001");
  const [mfgUrl, setMfgUrl] = useState("http://localhost:4002");

  // Safety & Toggles
  const [mfaEnabled, setMfaEnabled] = useState(true);
  const [sessionTimeout, setSessionTimeout] = useState("30");
  const [emailAlerts, setEmailAlerts] = useState(true);
  const [telemetryAlerts, setTelemetryAlerts] = useState(false);
  const [auditAlerts, setAuditAlerts] = useState(true);

  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Settings"
        description="Configure system preferences, API gateway endpoints, security protocols, and dispatch rules."
        breadcrumbs={[{ label: "Settings" }]}
      />

      {saved && (
        <div className="flex items-center gap-2 p-3.5 bg-success/15 border border-success/30 text-success-light rounded-xl text-xs font-semibold animate-fade-in">
          <CheckCircle className="w-4 h-4 text-success" />
          Settings saved successfully! Gateway routing tables updated.
        </div>
      )}

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-6 animate-fade-in">
        
        {/* Module 1: General Preferences */}
        <div className="bg-card/60 border border-border/30 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 text-primary rounded-lg">
              <Globe className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">General System Settings</h3>
              <p className="text-[11px] text-muted">Timezones, language defaults, and currency rules</p>
            </div>
          </div>

          <div className="space-y-3.5 pt-2">
            <div>
              <label className="block text-[11px] text-muted mb-1.5 font-medium">Company Name</label>
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full px-3.5 py-2 bg-navy/60 border border-border/40 rounded-xl text-xs text-white placeholder:text-muted/40 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-muted mb-1.5 font-medium">Timezone Default</label>
                <select
                  value={timezone}
                  onChange={(e) => setTimezone(e.target.value)}
                  className="w-full px-3.5 py-2 bg-navy/60 border border-border/40 rounded-xl text-xs text-white outline-none focus:border-primary/50 cursor-pointer"
                >
                  <option value="IST (UTC+5:30)">IST (UTC+5:30)</option>
                  <option value="GMT (UTC+0:00)">GMT (UTC+0:00)</option>
                  <option value="EST (UTC-5:00)">EST (UTC-5:00)</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-muted mb-1.5 font-medium">System Currency</label>
                <select
                  value={currency}
                  onChange={(e) => setCurrency(e.target.value)}
                  className="w-full px-3.5 py-2 bg-navy/60 border border-border/40 rounded-xl text-xs text-white outline-none focus:border-primary/50 cursor-pointer"
                >
                  <option value="INR (₹)">INR (₹)</option>
                  <option value="USD ($)">USD ($)</option>
                  <option value="EUR (€)">EUR (€)</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Module 2: API Gateway & Service Endpoints */}
        <div className="bg-card/60 border border-border/30 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple/10 text-purple rounded-lg">
              <Cpu className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Microservice Endpoints</h3>
              <p className="text-[11px] text-muted">Connection parameters for regional API routing tables</p>
            </div>
          </div>

          <div className="space-y-3.5 pt-2">
            <div>
              <label className="block text-[11px] text-muted mb-1.5 font-medium">API Gateway Base URL</label>
              <input
                type="text"
                value={gatewayUrl}
                onChange={(e) => setGatewayUrl(e.target.value)}
                className="w-full px-3.5 py-2 bg-navy/60 border border-border/40 rounded-xl text-xs text-white placeholder:text-muted/40 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-mono"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-muted mb-1.5 font-medium">Wages Server (Laravel)</label>
                <input
                  type="text"
                  value={wagesUrl}
                  onChange={(e) => setWagesUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-navy/60 border border-border/40 rounded-xl text-xs text-white placeholder:text-muted/40 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-mono"
                />
              </div>
              <div>
                <label className="block text-[11px] text-muted mb-1.5 font-medium">Manufacturing (MERN)</label>
                <input
                  type="text"
                  value={mfgUrl}
                  onChange={(e) => setMfgUrl(e.target.value)}
                  className="w-full px-3.5 py-2 bg-navy/60 border border-border/40 rounded-xl text-xs text-white placeholder:text-muted/40 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Module 3: Security & Session Rules */}
        <div className="bg-card/60 border border-border/30 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-danger/10 text-danger rounded-lg">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">Security &amp; Permissions</h3>
              <p className="text-[11px] text-muted">Authentication gates, passwords rules, and timeouts</p>
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <div className="flex items-center justify-between p-2 rounded-xl bg-navy/40 border border-border/10">
              <div>
                <p className="text-xs font-semibold text-white">Require Multi-Factor Authentication</p>
                <p className="text-[10px] text-muted">Forces OTP codes on developer login attempts</p>
              </div>
              <button
                type="button"
                onClick={() => setMfaEnabled(!mfaEnabled)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  mfaEnabled ? "bg-primary" : "bg-navy-300"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out",
                    mfaEnabled ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] text-muted mb-1.5 font-medium">Session Timeout</label>
                <select
                  value={sessionTimeout}
                  onChange={(e) => setSessionTimeout(e.target.value)}
                  className="w-full px-3.5 py-2 bg-navy/60 border border-border/40 rounded-xl text-xs text-white outline-none focus:border-primary/50 cursor-pointer"
                >
                  <option value="15">15 Minutes</option>
                  <option value="30">30 Minutes</option>
                  <option value="60">1 Hour</option>
                </select>
              </div>
              <div>
                <label className="block text-[11px] text-muted mb-1.5 font-medium">User Audit Log Size</label>
                <select
                  className="w-full px-3.5 py-2 bg-navy/60 border border-border/40 rounded-xl text-xs text-white outline-none focus:border-primary/50 cursor-pointer"
                  defaultValue="1000"
                >
                  <option value="500">500 Rows</option>
                  <option value="1000">1000 Rows</option>
                  <option value="5000">5000 Rows</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* Module 4: Notification Rules */}
        <div className="bg-card/60 border border-border/30 rounded-2xl p-5 space-y-4">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 text-warning rounded-lg">
              <Bell className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white">System Notification Rules</h3>
              <p className="text-[11px] text-muted">Configures which system event logs trigger email alerts</p>
            </div>
          </div>

          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between p-2 rounded-xl bg-navy/40 border border-border/10">
              <div>
                <p className="text-xs font-semibold text-white">Critical Failure Emails</p>
                <p className="text-[10px] text-muted">Send immediate alerts on system server dropouts</p>
              </div>
              <button
                type="button"
                onClick={() => setEmailAlerts(!emailAlerts)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  emailAlerts ? "bg-primary" : "bg-navy-300"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out",
                    emailAlerts ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-navy/40 border border-border/10">
              <div>
                <p className="text-xs font-semibold text-white">Daily Telemetry Summary</p>
                <p className="text-[10px] text-muted">Email daily OEE &amp; machine diagnostics report</p>
              </div>
              <button
                type="button"
                onClick={() => setTelemetryAlerts(!telemetryAlerts)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  telemetryAlerts ? "bg-primary" : "bg-navy-300"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out",
                    telemetryAlerts ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-2 rounded-xl bg-navy/40 border border-border/10">
              <div>
                <p className="text-xs font-semibold text-white">Wages Timesheet Flags</p>
                <p className="text-[10px] text-muted">Trigger notifications on high overtime hours logs</p>
              </div>
              <button
                type="button"
                onClick={() => setAuditAlerts(!auditAlerts)}
                className={cn(
                  "relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none",
                  auditAlerts ? "bg-primary" : "bg-navy-300"
                )}
              >
                <span
                  className={cn(
                    "pointer-events-none inline-block h-4 w-4 transform rounded-full bg-white transition duration-200 ease-in-out",
                    auditAlerts ? "translate-x-4" : "translate-x-0"
                  )}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Form Actions Footer */}
        <div className="lg:col-span-2 flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            className="px-4 py-2 border border-border/40 bg-card/40 text-xs font-semibold text-muted rounded-xl hover:bg-white/5 hover:text-white transition-all"
          >
            Reset Defaults
          </button>
          <button
            type="submit"
            className="flex items-center gap-1.5 px-5 py-2 bg-primary hover:bg-primary-dark text-xs font-semibold text-white rounded-xl transition-all"
          >
            <Save className="w-3.5 h-3.5" />
            Save Changes
          </button>
        </div>
      </form>
    </div>
  );
}
