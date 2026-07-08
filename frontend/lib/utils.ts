import { clsx, type ClassValue } from "clsx";

export function cn(...inputs: ClassValue[]): string {
  return clsx(inputs);
}

export function formatCurrency(value: number): string {
  if (value >= 10000000) {
    return `₹${(value / 10000000).toFixed(1)}Cr`;
  }
  if (value >= 100000) {
    return `₹${(value / 100000).toFixed(1)}L`;
  }
  if (value >= 1000) {
    return `₹${(value / 1000).toFixed(1)}K`;
  }
  return `₹${value.toLocaleString("en-IN")}`;
}

export function formatNumber(value: number): string {
  return value.toLocaleString("en-IN");
}

export function getStatusColor(status: string): string {
  const colors: Record<string, string> = {
    running: "text-success",
    idle: "text-warning",
    maintenance: "text-orange-400",
    offline: "text-danger",
    critical: "text-danger",
    warning: "text-warning",
    info: "text-primary",
    success: "text-success",
    pending: "text-warning",
    processing: "text-primary",
    dispatched: "text-purple",
    delivered: "text-success",
    overdue: "text-danger",
    "due-today": "text-warning",
    upcoming: "text-muted",
    approval: "text-warning",
    ordered: "text-primary",
    "in-transit": "text-purple",
  };
  return colors[status] || "text-muted";
}

export function getStatusBgColor(status: string): string {
  const colors: Record<string, string> = {
    running: "bg-success/10 text-success",
    idle: "bg-warning/10 text-warning",
    maintenance: "bg-orange-400/10 text-orange-400",
    offline: "bg-danger/10 text-danger",
    critical: "bg-danger/10 text-danger",
    warning: "bg-warning/10 text-warning",
    info: "bg-primary/10 text-primary",
    success: "bg-success/10 text-success",
    pending: "bg-warning/10 text-warning",
    processing: "bg-primary/10 text-primary",
    dispatched: "bg-purple/10 text-purple",
    delivered: "bg-success/10 text-success",
    overdue: "bg-danger/10 text-danger",
    "due-today": "bg-warning/10 text-warning",
    upcoming: "bg-muted/10 text-muted",
    approval: "bg-warning/10 text-warning",
    ordered: "bg-primary/10 text-primary",
    "in-transit": "bg-purple/10 text-purple",
  };
  return colors[status] || "bg-muted/10 text-muted";
}
