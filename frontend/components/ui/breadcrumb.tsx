import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface BreadcrumbProps {
  items: BreadcrumbItem[];
}

export function Breadcrumb({ items }: BreadcrumbProps) {
  return (
    <nav
      className="flex items-center gap-1.5 text-xs text-muted/70 mb-4 tracking-wide font-medium"
      aria-label="Breadcrumb"
    >
      <Link
        href="/"
        className="flex items-center gap-1 hover:text-white transition-colors py-0.5 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
        aria-label="Home"
      >
        <Home className="w-3.5 h-3.5" />
        <span className="sr-only">Home</span>
      </Link>

      {items.map((item, index) => (
        <span key={index} className="flex items-center gap-1.5">
          <ChevronRight className="w-3 h-3 text-muted/40 shrink-0" />
          {item.href ? (
            <Link
              href={item.href}
              className="hover:text-white transition-colors py-0.5 rounded-md focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
            >
              {item.label}
            </Link>
          ) : (
            <span className="text-white font-semibold" aria-current="page">
              {item.label}
            </span>
          )}
        </span>
      ))}
    </nav>
  );
}
