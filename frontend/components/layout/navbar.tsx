"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  Bell,
  Search,
  User,
  Calendar,
  ChevronDown,
  X,
  Sun,
  Moon,
  Menu,
  LogOut,
  Settings,
  AlertTriangle,
  Info,
  CheckCircle2,
  FileText,
  ArrowUpRight,
} from "lucide-react";
import { apiGet } from "@/lib/api";

interface NavbarProps {
  onMenuClick?: () => void;
  onLogout?: () => void;
}

interface NavProfile {
  name: string;
  email: string;
  role: string;
  avatarUrl: string | null;
}

interface SearchRecord {
  module: string;
  title: string;
  subtitle: string;
  href: string;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: "critical" | "warning" | "info" | "success";
  href: string;
  time: string;
}

/* Page index for instant navigation search. */
const PAGE_INDEX: { label: string; href: string }[] = [
  { label: "Executive Dashboard", href: "/" },
  { label: "Manufacturing Dashboard", href: "/manufacturing/dashboard" },
  { label: "Production Orders (Manufacturing)", href: "/manufacturing/production-orders" },
  { label: "BOM — Bill of Materials", href: "/manufacturing/bom" },
  { label: "Job Cards", href: "/manufacturing/job-cards" },
  { label: "Machines (Manufacturing)", href: "/manufacturing/machines" },
  { label: "Manufacturing Reports", href: "/manufacturing/reports" },
  { label: "Wages Dashboard", href: "/wages/dashboard" },
  { label: "Workers Directory", href: "/wages/workers" },
  { label: "Attendance (Wages)", href: "/wages/attendance" },
  { label: "Payroll", href: "/wages/payroll" },
  { label: "Wage Reports", href: "/wages/reports" },
  { label: "Factory Dashboard", href: "/factory" },
  { label: "Employee Entry (Smart Access)", href: "/factory/smart-access/employee-entry" },
  { label: "Visitor Entry (Smart Access)", href: "/factory/smart-access/visitor-entry" },
  { label: "Gate Pass (Smart Access)", href: "/factory/smart-access/gate-pass" },
  { label: "Employees (Factory)", href: "/factory/employee-management/employees" },
  { label: "Departments", href: "/factory/employee-management/departments" },
  { label: "Attendance Dashboard (Factory)", href: "/factory/attendance/dashboard" },
  { label: "Visitors", href: "/factory/visitor-management/visitors" },
  { label: "Material In (Gate)", href: "/factory/material-gate/material-in" },
  { label: "Production Orders (Factory)", href: "/factory/production/production-orders" },
  { label: "Machines (Factory)", href: "/factory/production/machines" },
  { label: "Incoming QC", href: "/factory/quality-control/incoming-qc" },
  { label: "Current Stock", href: "/factory/store/current-stock" },
  { label: "Stock Ledger", href: "/factory/store/stock-ledger" },
  { label: "Dispatch Orders", href: "/factory/dispatch/dispatch-orders" },
  { label: "Invoice Reference", href: "/factory/dispatch/invoice-reference" },
  { label: "Audit Logs", href: "/factory/reports/audit-logs" },
  { label: "Tally Sync Queue", href: "/factory/tally-connector/sync-queue" },
  { label: "Settings", href: "/settings" },
];

const relTime = (iso: string) => {
  const mins = Math.max(0, Math.round((Date.now() - new Date(iso).getTime()) / 60000));
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins} min ago`;
  const hrs = Math.round(mins / 60);
  if (hrs < 24) return `${hrs} hr ago`;
  return `${Math.round(hrs / 24)} d ago`;
};

export function Navbar({ onMenuClick, onLogout }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("light");
  const [profile, setProfile] = useState<NavProfile | null>(null);
  const [records, setRecords] = useState<SearchRecord[]>([]);
  const [searching, setSearching] = useState(false);
  const [notifOpen, setNotifOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const router = useRouter();
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const pageMatches =
    searchQuery.trim().length >= 2
      ? PAGE_INDEX.filter((p) => p.label.toLowerCase().includes(searchQuery.trim().toLowerCase())).slice(0, 5)
      : [];
  const showResults = searchQuery.trim().length >= 2;

  // Debounced record search against the API.
  useEffect(() => {
    const q = searchQuery.trim();
    if (q.length < 2) {
      setRecords([]);
      return;
    }
    setSearching(true);
    const t = setTimeout(() => {
      apiGet<{ results: SearchRecord[] }>(`/search?q=${encodeURIComponent(q)}`)
        .then((d) => setRecords(d.results))
        .catch(() => setRecords([]))
        .finally(() => setSearching(false));
    }, 300);
    return () => clearTimeout(t);
  }, [searchQuery]);

  // Live notifications: load on mount and refresh every 60s.
  useEffect(() => {
    const load = () =>
      apiGet<{ notifications: Notification[] }>("/notifications")
        .then((d) => setNotifications(d.notifications))
        .catch(() => {});
    load();
    const interval = setInterval(load, 60_000);
    return () => clearInterval(interval);
  }, []);

  // Cmd/Ctrl+K focuses the search box.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const goTo = (href: string) => {
    setSearchQuery("");
    setRecords([]);
    setSearchOpen(false);
    setNotifOpen(false);
    router.push(href);
  };

  // Load the admin profile (name + avatar); refresh when Settings saves it.
  useEffect(() => {
    const load = () =>
      apiGet<NavProfile>("/settings/profile").then(setProfile).catch(() => {});
    load();
    window.addEventListener("profile-updated", load);
    return () => window.removeEventListener("profile-updated", load);
  }, []);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
      setTheme(systemTheme);
      document.documentElement.setAttribute("data-theme", systemTheme);
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === "dark" ? "light" : "dark";
    setTheme(newTheme);
    localStorage.setItem("theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const today = new Date().toLocaleDateString("en-IN", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <header className="sticky top-0 z-30 h-16 bg-navy/80 backdrop-blur-xl border-b border-border/30">
      <div className="flex items-center justify-between h-full px-6">
        {/* Left: Company Name */}
        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/"
            className="text-sm sm:text-base font-semibold text-white hover:text-white/90 active:scale-[0.98] transition-all select-none"
            aria-label="NKTech Enterprises Home"
          >
            NKTech Enterprises
          </Link>
          <span className="hidden lg:flex items-center gap-1.5 text-xs text-muted bg-card/50 px-2.5 py-1 rounded-lg border border-border/30">
            <Calendar className="w-3.5 h-3.5" />
            {today}
          </span>
        </div>

        {/* Middle-Left: Global Search (md and up) */}
        <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/60" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Escape") setSearchQuery("");
                if (e.key === "Enter") {
                  const first = pageMatches[0]?.href ?? records[0]?.href;
                  if (first) goTo(first);
                }
              }}
              placeholder="Search modules, orders, workers..."
              className="w-full pl-10 pr-12 py-2 bg-white/[0.03] hover:bg-white/[0.06] focus:bg-white/[0.08] border border-border/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl text-xs text-white placeholder:text-muted/40 outline-none transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-muted/50 bg-card/60 px-1.5 py-0.5 rounded border border-border/20 font-mono">
              ⌘K
            </kbd>

            {/* Results dropdown */}
            {showResults && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setSearchQuery("")} />
                <div className="absolute left-0 right-0 top-full mt-2 bg-card/95 border border-border/50 rounded-2xl shadow-xl p-2 z-50 animate-slide-in backdrop-blur-xl max-h-[70vh] overflow-y-auto">
                  {pageMatches.length > 0 && (
                    <>
                      <p className="px-3 pt-1.5 pb-1 text-[9px] font-bold uppercase tracking-wider text-muted/60">Pages</p>
                      {pageMatches.map((p) => (
                        <button
                          key={p.href}
                          onClick={() => goTo(p.href)}
                          className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-white hover:bg-white/5 transition-all text-left"
                        >
                          <ArrowUpRight className="w-3.5 h-3.5 text-primary-light shrink-0" />
                          {p.label}
                        </button>
                      ))}
                    </>
                  )}
                  <p className="px-3 pt-2 pb-1 text-[9px] font-bold uppercase tracking-wider text-muted/60">Records</p>
                  {searching && <p className="px-3 py-2 text-[11px] text-muted">Searching…</p>}
                  {!searching && records.length === 0 && (
                    <p className="px-3 py-2 text-[11px] text-muted">No matching records.</p>
                  )}
                  {records.map((r, i) => (
                    <button
                      key={`${r.href}-${r.title}-${i}`}
                      onClick={() => goTo(r.href)}
                      className="w-full flex items-start gap-2 px-3 py-2 rounded-xl hover:bg-white/5 transition-all text-left"
                    >
                      <FileText className="w-3.5 h-3.5 text-muted mt-0.5 shrink-0" />
                      <span className="min-w-0">
                        <span className="block text-xs text-white truncate">
                          {r.title}
                          {r.subtitle ? <span className="text-muted"> · {r.subtitle}</span> : null}
                        </span>
                        <span className="block text-[10px] text-muted/70">{r.module}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Mobile Search (below md only) */}
          <div className="md:hidden relative">
            {searchOpen ? (
              <div className="flex items-center gap-2 bg-card border border-border/50 rounded-xl px-2.5 py-1.5 animate-slide-in">
                <Search className="w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search..."
                  className="bg-transparent text-xs text-white placeholder:text-muted/60 outline-none w-24 xs:w-32"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="text-muted hover:text-white transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="p-2 rounded-xl text-muted hover:text-white hover:bg-white/5 transition-all"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>
            )}
          </div>

          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-muted hover:text-white hover:bg-white/5 transition-all"
            title={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          >
            {theme === "dark" ? (
              <Sun className="w-[18px] h-[18px]" />
            ) : (
              <Moon className="w-[18px] h-[18px]" />
            )}
          </button>

          {/* Notifications */}
          <div className="relative">
            <button
              onClick={() => setNotifOpen(!notifOpen)}
              className="relative p-2 rounded-xl text-muted hover:text-white hover:bg-white/5 transition-all"
              title="Notifications"
            >
              <Bell className="w-[18px] h-[18px]" />
              {notifications.length > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger" />
              )}
            </button>

            {notifOpen && (
              <>
                <div className="fixed inset-0 z-40" onClick={() => setNotifOpen(false)} />
                <div className="absolute right-0 mt-2 w-80 bg-card/95 border border-border/50 rounded-2xl shadow-xl p-2 z-50 animate-slide-in backdrop-blur-xl max-h-[70vh] overflow-y-auto">
                  <div className="px-3 py-2 flex items-center justify-between">
                    <p className="text-xs font-semibold text-white">Notifications</p>
                    <span className="text-[10px] text-muted">{notifications.length} active</span>
                  </div>
                  <div className="h-px bg-border/20 mb-1" />
                  {notifications.length === 0 && (
                    <p className="px-3 py-6 text-center text-[11px] text-muted">
                      All clear — no alerts right now.
                    </p>
                  )}
                  {notifications.map((n) => (
                    <button
                      key={n.id}
                      onClick={() => goTo(n.href)}
                      className="w-full flex items-start gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/5 transition-all text-left"
                    >
                      <span
                        className={
                          n.type === "critical"
                            ? "mt-0.5 text-danger"
                            : n.type === "warning"
                            ? "mt-0.5 text-warning"
                            : n.type === "success"
                            ? "mt-0.5 text-success"
                            : "mt-0.5 text-primary-light"
                        }
                      >
                        {n.type === "critical" || n.type === "warning" ? (
                          <AlertTriangle className="w-4 h-4" />
                        ) : n.type === "success" ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <Info className="w-4 h-4" />
                        )}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block text-xs font-medium text-white">{n.title}</span>
                        <span className="block text-[11px] text-muted leading-snug mt-0.5">{n.message}</span>
                        <span className="block text-[10px] text-muted/50 mt-1">{relTime(n.time)}</span>
                      </span>
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all ml-1 text-left"
              title="View Admin Profile"
            >
              <div className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-primary to-purple flex items-center justify-center">
                {profile?.avatarUrl ? (
                  <img src={profile.avatarUrl} alt="Profile" className="w-full h-full object-cover" />
                ) : (
                  <User className="w-4 h-4 text-white" />
                )}
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-medium text-white leading-tight">
                  {profile?.name?.split(" ")[0] ?? "Admin"}
                </p>
                <p className="text-[10px] text-muted leading-tight">{profile?.role ?? "Super Admin"}</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-muted hidden md:block" />
            </button>

            {profileOpen && (
              <>
                {/* Click outside backdrop overlay */}
                <div className="fixed inset-0 z-40" onClick={() => setProfileOpen(false)} />
                
                {/* Dropdown Popover */}
                <div className="absolute right-0 mt-2 w-56 bg-card/95 border border-border/50 rounded-2xl shadow-xl p-2 z-50 animate-slide-in backdrop-blur-xl">
                  <div className="px-3 py-2">
                    <p className="text-xs font-semibold text-white">{profile?.name ?? "Admin"}</p>
                    <p className="text-[10px] text-muted">{profile?.email ?? ""}</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-primary/15 text-primary-light">
                      {profile?.role ?? "Super Admin"}
                    </span>
                  </div>
                  <div className="h-px bg-border/20 my-2" />
                  <a
                    href="/settings"
                    onClick={() => setProfileOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-muted hover:text-white hover:bg-white/5 transition-all"
                  >
                    <Settings className="w-4 h-4 text-primary-light" />
                    Account Settings
                  </a>
                  <button
                    onClick={() => {
                      setProfileOpen(false);
                      onLogout?.();
                    }}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl text-xs text-danger hover:bg-danger/10 hover:text-danger-light transition-all text-left"
                  >
                    <LogOut className="w-4 h-4" />
                    Sign Out
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
