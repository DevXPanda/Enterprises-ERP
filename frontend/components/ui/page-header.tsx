import { Breadcrumb } from "./breadcrumb";

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description: string;
  breadcrumbs: BreadcrumbItem[];
}

export function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="mb-6 animate-fade-in">
      <Breadcrumb items={breadcrumbs} />
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">{title}</h1>
          <p className="text-sm text-muted mt-1 max-w-2xl">{description}</p>
        </div>
      </div>
    </div>
  );
}
