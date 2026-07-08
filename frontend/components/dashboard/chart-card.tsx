import { cn } from "@/lib/utils";

interface ChartCardProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, subtitle, action, children, className }: ChartCardProps) {
  return (
    <div className={cn("glass-card overflow-hidden animate-fade-in", className)}>
      <div className="flex items-center justify-between px-5 pt-5 pb-3">
        <div>
          <h3 className="text-sm font-semibold text-white">{title}</h3>
          {subtitle && (
            <p className="text-xs text-muted mt-0.5">{subtitle}</p>
          )}
        </div>
        {action && <div>{action}</div>}
      </div>
      <div className="px-5 pb-5">{children}</div>
    </div>
  );
}
