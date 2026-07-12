// Resource registry types and the defineResource() helper.
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

  label: string;

  table: string;

  schema?: string;

  pk?: 'serial' | 'uuid';

  external?: boolean;

  tenantScoped?: boolean;

  softDelete?: boolean;
  columns: ColumnDef[];

  search: string[];

  code?: { field: string; prefix: string };

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
