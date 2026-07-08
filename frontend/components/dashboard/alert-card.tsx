import {
  AlertTriangle,
  AlertCircle,
  Info,
  CheckCircle2,
  Clock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { AlertItem } from "@/types/dashboard";

const typeConfig: Record<
  string,
  { icon: React.ReactNode; color: string; bg: string }
> = {
  critical: {
    icon: <AlertTriangle className="w-4 h-4" />,
    color: "text-danger",
    bg: "bg-danger/10",
  },
  warning: {
    icon: <AlertCircle className="w-4 h-4" />,
    color: "text-warning",
    bg: "bg-warning/10",
  },
  info: {
    icon: <Info className="w-4 h-4" />,
    color: "text-primary",
    bg: "bg-primary/10",
  },
  success: {
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: "text-success",
    bg: "bg-success/10",
  },
};

interface AlertCardProps {
  title: string;
  alerts: AlertItem[];
  className?: string;
}

export function AlertCard({ title, alerts, className }: AlertCardProps) {
  return (
    <div className={cn("glass-card animate-fade-in", className)}>
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
      </div>
      <div className="px-5 pb-5 space-y-3 max-h-[320px] overflow-y-auto">
        {alerts.map((alert) => {
          const config = typeConfig[alert.type] || typeConfig.info;
          return (
            <div
              key={alert.id}
              className={cn(
                "flex items-start gap-3 p-3 rounded-xl border border-border/20 transition-all",
                "hover:border-border/40 hover:bg-white/[0.02]",
                !alert.read && "bg-white/[0.02]"
              )}
            >
              <div className={cn("p-1.5 rounded-lg shrink-0", config.bg, config.color)}>
                {config.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className="text-xs font-medium text-white truncate">
                    {alert.title}
                  </p>
                  {!alert.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                  )}
                </div>
                <p className="text-[11px] text-muted mt-0.5 line-clamp-1">
                  {alert.description}
                </p>
                <div className="flex items-center gap-1 mt-1.5 text-muted/60">
                  <Clock className="w-3 h-3" />
                  <span className="text-[10px]">{alert.time}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
