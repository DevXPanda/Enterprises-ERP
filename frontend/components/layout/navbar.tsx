"use client";

import { useState, useEffect } from "react";
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
} from "lucide-react";

interface NavbarProps {
  onMenuClick?: () => void;
  onLogout?: () => void;
}

export function Navbar({ onMenuClick, onLogout }: NavbarProps) {
  const [searchOpen, setSearchOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [theme, setTheme] = useState<"dark" | "light">("dark");

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") as "dark" | "light";
    if (savedTheme) {
      setTheme(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    } else {
      const systemTheme = window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
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
          <button
            onClick={onMenuClick}
            className="p-1.5 rounded-lg text-muted hover:text-white hover:bg-white/5 transition-all md:hidden"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <h1 className="text-base font-semibold text-white hidden sm:block">
            NKTech Enterprises
          </h1>
          <span className="hidden lg:flex items-center gap-1.5 text-xs text-muted bg-card/50 px-2.5 py-1 rounded-lg border border-border/30">
            <Calendar className="w-3.5 h-3.5" />
            {today}
          </span>
        </div>

        {/* Middle-Left: Permanent Premium Search Bar (md and up) */}
        <div className="hidden md:flex flex-1 max-w-sm lg:max-w-md mx-6">
          <div className="relative w-full">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/60" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search modules, orders, workers..."
              className="w-full pl-10 pr-12 py-2 bg-white/[0.03] hover:bg-white/[0.06] focus:bg-white/[0.08] border border-border/20 focus:border-primary/50 focus:ring-1 focus:ring-primary/20 rounded-xl text-xs text-white placeholder:text-muted/40 outline-none transition-all"
            />
            <kbd className="absolute right-3 top-1/2 -translate-y-1/2 text-[9px] text-muted/50 bg-card/60 px-1.5 py-0.5 rounded border border-border/20 font-mono">
              ⌘K
            </kbd>
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
          <button className="relative p-2 rounded-xl text-muted hover:text-white hover:bg-white/5 transition-all">
            <Bell className="w-[18px] h-[18px]" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-danger" />
          </button>

          {/* Profile */}
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all ml-1 text-left"
              title="View Admin Profile"
            >
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center">
                <User className="w-4 h-4 text-white" />
              </div>
              <div className="hidden md:block">
                <p className="text-xs font-medium text-white leading-tight">Admin</p>
                <p className="text-[10px] text-muted leading-tight">Super Admin</p>
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
                    <p className="text-xs font-semibold text-white">Kushal Sharma</p>
                    <p className="text-[10px] text-muted">admin@nktech.in</p>
                    <span className="inline-block mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-bold uppercase tracking-wide bg-primary/15 text-primary-light">
                      Super Admin
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
