import { cn, getStatusBgColor } from "@/lib/utils";

interface BadgeProps {
  variant?: "success" | "warning" | "danger" | "info" | "default";
  status?: string;
  children: React.ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ variant, status, children, className, dot }: BadgeProps) {
  const variantClasses: Record<string, string> = {
    success: "bg-success/15 text-success-light",
    warning: "bg-warning/15 text-warning-light",
    danger: "bg-danger/15 text-danger-light",
    info: "bg-primary/15 text-primary-light",
    default: "bg-muted/15 text-muted",
  };

  const classes = status
    ? getStatusBgColor(status)
    : variantClasses[variant || "default"];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize",
        classes,
        className
      )}
    >
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current" />
      )}
      {children}
    </span>
  );
}
