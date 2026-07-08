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
  Factory: <Factory className="w-6 h-6" />,
  Truck: <Truck className="w-6 h-6" />,
  ClipboardList: <ClipboardList className="w-6 h-6" />,
  Cog: <Cog className="w-6 h-6" />,
  ShieldAlert: <ShieldAlert className="w-6 h-6" />,
  Gauge: <Gauge className="w-6 h-6" />,
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
        "glass-card-hover p-5 flex flex-col gap-4",
        "animate-fade-in"
      )}
      style={{ animationDelay: `${index * 80}ms` }}
    >
      <div className="flex items-start justify-between">
        <div className={cn("p-2.5 rounded-xl", colors.icon)}>
          {iconComponents[data.icon] || <Factory className="w-6 h-6" />}
        </div>
        {data.change !== undefined && (
          <div
            className={cn(
              "flex items-center gap-0.5 text-xs font-semibold px-2 py-1 rounded-lg",
              isPositive && "text-success bg-success/10",
              isNegative && "text-danger bg-danger/10",
              !isPositive && !isNegative && "text-muted bg-muted/10"
            )}
          >
            {isPositive ? (
              <TrendingUp className="w-3 h-3" />
            ) : isNegative ? (
              <TrendingDown className="w-3 h-3" />
            ) : (
              <Minus className="w-3 h-3" />
            )}
            {Math.abs(data.change)}%
          </div>
        )}
      </div>

      <div>
        <p className="text-2xl font-bold text-white tracking-tight">
          {data.value}
        </p>
        <p className="text-xs text-muted mt-1">{data.label}</p>
        {data.changeLabel && (
          <p className="text-[10px] text-muted/60 mt-0.5">{data.changeLabel}</p>
        )}
      </div>
    </div>
  );
}
