import { Clock, CheckCircle2, LucideIcon } from "lucide-react";
import { Badge } from "./badge";

interface EmptyStateProps {
  title: string;
  description: string;
  moduleName: string;
  icon: LucideIcon;
  features: string[];
}

export function EmptyState({
  title,
  description,
  moduleName,
  icon: Icon,
  features,
}: EmptyStateProps) {
  return (
    <div className="glass-card p-6 md:p-8 max-w-4xl mx-auto mt-6 animate-fade-in">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-6 border-b border-border/20">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center border border-primary/20 text-primary shrink-0">
            <Icon className="w-7 h-7" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                {moduleName}
              </span>
              <Badge variant="warning" dot>
                Roadmap Phase 1
              </Badge>
            </div>
            <h2 className="text-xl font-bold text-white mt-1">{title}</h2>
          </div>
        </div>

        <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-warning/10 border border-warning/20 text-warning text-xs font-medium">
          <Clock className="w-3.5 h-3.5 animate-pulse-soft" />
          Scheduled for Q3 Release
        </div>
      </div>

      <div className="py-6 space-y-4">
        <p className="text-sm text-muted leading-relaxed">
          {description}
        </p>

        <div className="space-y-3 pt-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-muted/80">
            Planned Module Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {features.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-navy-50/50 border border-border/10 hover:border-border/30 transition-all duration-300"
              >
                <CheckCircle2 className="w-4 h-4 text-success mt-0.5 shrink-0" />
                <span className="text-xs text-white/90 font-medium">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-end gap-3 pt-6 border-t border-border/20 text-xs text-muted/60">
        <span>NKTech Enterprise Suite</span>
        <span>•</span>
        <span>Ver 1.0.0</span>
      </div>
    </div>
  );
}
