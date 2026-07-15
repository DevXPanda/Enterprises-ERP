"use client";

import { useState, useEffect, useCallback } from "react";
import { Sidebar } from "./sidebar";
import { Navbar } from "./navbar";
import { cn } from "@/lib/utils";
import { apiSend } from "@/lib/api";
import {
  Lock,
  Mail,
  Eye,
  EyeOff,
  AlertCircle,
  ArrowRight,
  Factory,
  Cog,
} from "lucide-react";

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  // Auth State
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Layout State
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [expandedMenus, setExpandedMenus] = useState<string[]>(["manufacturing"]);

  useEffect(() => {
    const status = localStorage.getItem("admin_logged_in");
    if (status === "true") {
      setIsLoggedIn(true);
    }
    setCheckingAuth(false);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await apiSend<{
        success: boolean;
        token: string;
        admin: { email: string; name: string; role: string };
      }>("POST", "/auth/login", { email, password });
      localStorage.setItem("admin_logged_in", "true");
      localStorage.setItem("admin_token", res.token);
      localStorage.setItem("admin_email", res.admin.email);
      localStorage.setItem("admin_name", res.admin.name);
      setIsLoggedIn(true);
    } catch (err) {
      setError(
        err instanceof Error && err.message !== "Failed to fetch"
          ? err.message
          : "Cannot reach the server. Is the backend running on port 4000?",
      );
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = useCallback(() => {
    localStorage.removeItem("admin_logged_in");
    localStorage.removeItem("admin_token");
    localStorage.removeItem("admin_email");
    localStorage.removeItem("admin_name");
    setIsLoggedIn(false);
  }, []);

  const toggleSidebar = useCallback(() => {
    setIsCollapsed((prev) => !prev);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    setIsMobileOpen((prev) => !prev);
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileOpen(false);
  }, []);

  const toggleMenu = useCallback((menu: string) => {
    setExpandedMenus((prev) =>
      prev.includes(menu) ? prev.filter((m) => m !== menu) : [...prev, menu]
    );
  }, []);

  // Loading Screen while verifying localStorage
  if (checkingAuth) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <Cog className="w-10 h-10 text-primary animate-spin" />
          <p className="text-xs text-muted font-medium tracking-wider">Verifying Session...</p>
        </div>
      </div>
    );
  }

  // Login Screen if unauthorized
  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-navy flex items-center justify-center p-4 relative overflow-hidden select-none">
        
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/10 blur-[100px] pointer-events-none" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-purple/10 blur-[100px] pointer-events-none" />

        <div className="w-full max-w-md bg-card/45 border border-border/30 backdrop-blur-xl p-8 rounded-3xl space-y-6 animate-fade-in relative z-10">
          
          {/* Logo & Header */}
          <div className="text-center space-y-2">
            <div className="mx-auto w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-purple flex items-center justify-center border border-border/30">
              <Factory className="w-6 h-6 text-white" />
            </div>
            <h2 className="text-lg font-bold text-white tracking-tight pt-1">
              NKTech Enterprises
            </h2>
            <p className="text-xs text-muted">
              Sign in to manage ERP manufacturing modules
            </p>
          </div>

          {error && (
            <div className="flex items-start gap-2 p-3 bg-danger/15 border border-danger/20 text-danger-light rounded-xl text-xs leading-normal animate-slide-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            
            {/* Email Address */}
            <div className="space-y-1.5">
              <label className="block text-[11px] text-muted font-medium">Admin Email</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/60" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-navy/60 border border-border/40 rounded-xl text-xs text-white placeholder:text-muted/30 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="Enter admin email"
                  required
                />
              </div>
            </div>

            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-[11px] text-muted font-medium">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted/60" />
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-10 py-2.5 bg-navy/60 border border-border/40 rounded-xl text-xs text-white placeholder:text-muted/30 outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/20 transition-all"
                  placeholder="Enter password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-muted hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* Remember Me Toggle (Mock) */}
            <div className="flex items-center justify-between text-[11px] pt-1">
              <label className="flex items-center gap-1.5 text-muted cursor-pointer">
                <input
                  type="checkbox"
                  defaultChecked
                  className="accent-primary rounded bg-navy border-border/40 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                Remember me
              </label>
              <a href="#" className="text-primary hover:underline">
                Forgot password?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={cn(
                "w-full py-2.5 bg-primary hover:bg-primary-dark text-xs font-semibold text-white rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-lg shadow-primary/10",
                loading && "opacity-70 cursor-not-allowed"
              )}
            >
              {loading ? (
                <>
                  <Cog className="w-4 h-4 text-white animate-spin" />
                  Verifying Credentials...
                </>
              ) : (
                <>
                  Sign In to Dashboard
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

        </div>
      </div>
    );
  }

  // Dashboard Application Layout
  return (
    <div className="min-h-screen bg-navy">
      {/* Dark backdrop for mobile sidebar */}
      {isMobileOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-35 md:hidden animate-fade-in"
          onClick={closeMobileMenu}
        />
      )}

      <Sidebar
        isCollapsed={isCollapsed}
        toggleSidebar={toggleSidebar}
        isMobileOpen={isMobileOpen}
        closeMobileMenu={closeMobileMenu}
        expandedMenus={expandedMenus}
        toggleMenu={toggleMenu}
        onLogout={handleLogout}
      />

      <div
        className={cn(
          "transition-all duration-300 ease-in-out min-h-screen flex flex-col",
          "ml-0 md:ml-[260px]",
          isCollapsed && "md:ml-[68px]"
        )}
      >
        <Navbar onMenuClick={toggleMobileMenu} onLogout={handleLogout} />
        <main className="p-4 sm:p-6 flex-1 overflow-x-hidden">{children}</main>
      </div>
    </div>
  );
}
