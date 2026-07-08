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
} from "lucide-react";

export function Navbar() {
  const [searchOpen, setSearchOpen] = useState(false);
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
        <div className="flex items-center gap-3">
          <h1 className="text-base font-semibold text-white hidden sm:block">
            NKTech Enterprises
          </h1>
          <span className="hidden lg:flex items-center gap-1.5 text-xs text-muted bg-card/50 px-2.5 py-1 rounded-lg border border-border/30">
            <Calendar className="w-3.5 h-3.5" />
            {today}
          </span>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <div className="relative">
            {searchOpen ? (
              <div className="flex items-center gap-2 bg-card border border-border/50 rounded-xl px-3 py-1.5 animate-slide-in">
                <Search className="w-4 h-4 text-muted" />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search modules, orders, workers..."
                  className="bg-transparent text-sm text-white placeholder:text-muted/60 outline-none w-48 lg:w-64"
                  autoFocus
                />
                <button
                  onClick={() => {
                    setSearchOpen(false);
                    setSearchQuery("");
                  }}
                  className="text-muted hover:text-white transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <button
                onClick={() => setSearchOpen(true)}
                className="flex items-center gap-2 px-3 py-2 rounded-xl text-muted hover:text-white hover:bg-white/5 transition-all"
              >
                <Search className="w-4.5 h-4.5" />
                <span className="hidden md:inline text-xs">Search</span>
                <kbd className="hidden lg:inline text-[10px] text-muted/50 bg-card px-1.5 py-0.5 rounded border border-border/30 font-mono">
                  ⌘K
                </kbd>
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
          <button className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all ml-1">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-purple flex items-center justify-center">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-xs font-medium text-white leading-tight">Admin</p>
              <p className="text-[10px] text-muted leading-tight">Super Admin</p>
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-muted hidden md:block" />
          </button>
        </div>
      </div>
    </header>
  );
}
