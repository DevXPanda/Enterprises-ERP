// Builds TypeORM EntitySchemas from the resource registry.
import { EntitySchema, EntitySchemaColumnOptions } from 'typeorm';
import { ColumnType, ResourceDef } from './resource.types';
import { registry } from './registry';

const numericTransformer = {
  to: (v: unknown) => v,
  from: (v: string | null) => (v === null || v === undefined ? null : Number(v)),
};

function columnOptions(type: ColumnType): EntitySchemaColumnOptions {
  switch (type) {
    case 'int':
      return { type: 'int', nullable: true };
    case 'num':
      return {
        type: 'numeric',
        precision: 14,
        scale: 2,
        nullable: true,
        transformer: numericTransformer,
      };
    case 'date':
      return { type: 'date', nullable: true };
    case 'ts':
      return { type: 'timestamptz', nullable: true };
    case 'bool':
      return { type: 'boolean', nullable: true };
    case 'uuid':
      return { type: 'uuid', nullable: true };
    case 'time':
      return { type: 'time', nullable: true };
    case 'json':
      return { type: 'jsonb', nullable: true };
    default:
      return { type: 'varchar', length: 300, nullable: true };
  }
}

export function buildEntitySchema(def: ResourceDef): EntitySchema {
  const columns: Record<string, EntitySchemaColumnOptions> = {
    id:
      def.pk === 'uuid'
        ? { type: 'uuid', primary: true, generated: 'uuid' }
        : { type: 'int', primary: true, generated: 'increment' },
  };
  for (const col of def.columns) {
    columns[col.key] = columnOptions(col.type);
  }
  if (!def.external) {

    columns['createdAt'] = { type: 'timestamptz', createDate: true };
    columns['updatedAt'] = { type: 'timestamptz', updateDate: true };
  }

  return new EntitySchema({
    name: def.path,
    schema: def.schema,
    tableName: def.table,
    columns,
    synchronize: def.external ? false : undefined,
  });
}

export const entitySchemas: EntitySchema[] = registry.map(buildEntitySchema);
