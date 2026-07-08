import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface Column<T> {
  key: string;
  label: string;
  render?: (row: T) => React.ReactNode;
  align?: "left" | "center" | "right";
}

interface StatTableProps<T> {
  title: string;
  subtitle?: string;
  columns: Column<T>[];
  data: T[];
  className?: string;
  maxRows?: number;
}

export function StatTable<T extends Record<string, unknown>>({
  title,
  subtitle,
  columns,
  data,
  className,
  maxRows,
}: StatTableProps<T>) {
  const rows = maxRows ? data.slice(0, maxRows) : data;

  return (
    <div className={cn("glass-card animate-fade-in", className)}>
      <div className="px-5 pt-5 pb-3">
        <h3 className="text-sm font-semibold text-white">{title}</h3>
        {subtitle && (
          <p className="text-xs text-muted mt-0.5">{subtitle}</p>
        )}
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-t border-border/20">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={cn(
                    "px-5 py-2.5 text-[11px] font-semibold uppercase tracking-wider text-muted/70 whitespace-nowrap",
                    col.align === "right" && "text-right",
                    col.align === "center" && "text-center"
                  )}
                >
                  {col.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, i) => (
              <tr
                key={i}
                className="border-t border-border/10 hover:bg-white/[0.02] transition-colors"
              >
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={cn(
                      "px-5 py-3 text-xs text-muted whitespace-nowrap",
                      col.align === "right" && "text-right",
                      col.align === "center" && "text-center"
                    )}
                  >
                    {col.render
                      ? col.render(row)
                      : String(row[col.key] ?? "")}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
