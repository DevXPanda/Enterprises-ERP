import {
  Factory,
  Truck,
  ClipboardList,
  Cog,
  ShieldAlert,
  Gauge,
  TrendingUp,
  TrendingDown,
  Minus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { KpiData } from "@/types/dashboard";

const iconComponents: Record<string, React.ReactNode> = {
  Factory: <Factory className="w-4 h-4" />,
  Truck: <Truck className="w-4 h-4" />,
  ClipboardList: <ClipboardList className="w-4 h-4" />,
  Cog: <Cog className="w-4 h-4" />,
  ShieldAlert: <ShieldAlert className="w-4 h-4" />,
  Gauge: <Gauge className="w-4 h-4" />,
};

const colorClasses: Record<string, { icon: string; glow: string }> = {
  blue: { icon: "bg-primary/10 text-primary", glow: "shadow-glow" },
  green: { icon: "bg-success/10 text-success", glow: "shadow-glow-green" },
  orange: { icon: "bg-warning/10 text-warning", glow: "shadow-glow-warning" },
  purple: { icon: "bg-purple/10 text-purple", glow: "" },
  red: { icon: "bg-danger/10 text-danger", glow: "shadow-glow-danger" },
};

interface KpiCardProps {
  data: KpiData;
  index?: number;
}

export function KpiCard({ data, index = 0 }: KpiCardProps) {
  const colors = colorClasses[data.color] || colorClasses.blue;
  const isPositive = data.change && data.change > 0;
  const isNegative = data.change && data.change < 0;

  return (
    <div
      className={cn(
        "bg-card/60 border border-border/30 rounded-xl px-4 py-3 flex items-center gap-3",
        "animate-fade-in"
      )}
      style={{ animationDelay: `${index * 60}ms` }}
    >
      {/* Icon */}
      <div className={cn("p-2 rounded-lg shrink-0", colors.icon)}>
        {iconComponents[data.icon] || <Factory className="w-4 h-4" />}
      </div>

      {/* Value + Label */}
      <div className="flex-1 min-w-0">
        <p className="text-lg font-bold text-white tracking-tight leading-tight">
          {data.value}
        </p>
        <p className="text-[11px] text-muted truncate">{data.label}</p>
      </div>

      {/* Change badge */}
      {data.change !== undefined && (
        <div
          className={cn(
            "flex items-center gap-0.5 text-[10px] font-semibold px-1.5 py-0.5 rounded-md shrink-0",
            isPositive && "text-success bg-success/10",
            isNegative && "text-danger bg-danger/10",
            !isPositive && !isNegative && "text-muted bg-muted/10"
          )}
        >
          {isPositive ? (
            <TrendingUp className="w-2.5 h-2.5" />
          ) : isNegative ? (
            <TrendingDown className="w-2.5 h-2.5" />
          ) : (
            <Minus className="w-2.5 h-2.5" />
          )}
          {Math.abs(data.change)}%
        </div>
      )}
    </div>
  );
}
