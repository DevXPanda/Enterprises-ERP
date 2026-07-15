export type ColumnType =
  | 'text'
  | 'int'
  | 'num'
  | 'date'
  | 'ts'
  | 'bool'
  | 'uuid'
  | 'time'
  | 'json';

export interface ColumnDef {
  key: string;
  type: ColumnType;
}

export interface ResourceDef {
  path: string;
  /** Human label, e.g. "Current Stock" */
  label: string;
  table: string;
  schema?: string;
  pk?: 'serial' | 'uuid';
  external?: boolean;
  /** Rows carry tenant_id; the service injects the default tenant on create */
  tenantScoped?: boolean;
  /** DELETE sets deleted_at instead of removing the row */
  softDelete?: boolean;
  columns: ColumnDef[];
  /** Keys used for ?search= (defaults to all text columns) */
  search: string[];
  /** Auto-generated business code, e.g. GRN-1005 on insert */
  code?: { field: string; prefix: string };
  /** Seed rows — arrays aligned with `columns` order */
  seed: unknown[][];
}

export interface DefineOptions {
  code?: { field: string; prefix: string };
  search?: string[];
  table?: string;
  schema?: string;
  pk?: 'serial' | 'uuid';
  external?: boolean;
  tenantScoped?: boolean;
  softDelete?: boolean;
}

/**
 * Compact resource declaration.
 * `cols` is space-separated keys with optional :type suffix
 * (default "text"), e.g. "grnNo vendor quantity:num receivedAt:ts".
 */
export function defineResource(
  path: string,
  label: string,
  cols: string,
  seed: unknown[][],
  opts: DefineOptions = {},
): ResourceDef {
  const columns: ColumnDef[] = cols
    .trim()
    .split(/\s+/)
    .map((spec) => {
      const [key, type] = spec.split(':');
      return { key, type: (type as ColumnType) || 'text' };
    });

  return {
    path,
    label,
    table: opts.table ?? path.replace(/[/-]/g, '_'),
    schema: opts.schema,
    pk: opts.pk ?? 'serial',
    external: opts.external,
    tenantScoped: opts.tenantScoped,
    softDelete: opts.softDelete,
    columns,
    search:
      opts.search ??
      columns.filter((c) => c.type === 'text').map((c) => c.key),
    code: opts.code,
    seed,
  };
}
