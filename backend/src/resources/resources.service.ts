// Generic CRUD service for all registered resources.
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { DataSource, ILike, Repository, ObjectLiteral } from 'typeorm';
import { ResourceDef } from './resource.types';
import { registryByPath } from './registry';

export interface ListQuery {
  search?: string;
  page?: string;
  pageSize?: string;
  sort?: string;
  order?: string;
  [key: string]: string | undefined;
}

export interface Resolved {
  def: ResourceDef;
  id?: number | string;
}

const RESERVED_QUERY_KEYS = new Set(['search', 'page', 'pageSize', 'sort', 'order']);
const UUID_RE =
  /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

export const DEFAULT_TENANT_ID = process.env.TENANT_ID as string;

@Injectable()
export class ResourcesService {
  constructor(private readonly dataSource: DataSource) {}

  resolve(segments: string[]): Resolved {
    const path = segments.join('/');
    const collection = registryByPath.get(path);
    if (collection) return { def: collection };

    const parentPath = segments.slice(0, -1).join('/');
    const parent = registryByPath.get(parentPath);
    const last = segments[segments.length - 1];
    if (parent) {
      if (parent.pk === 'uuid' && UUID_RE.test(last)) {
        return { def: parent, id: last };
      }
      if (parent.pk !== 'uuid' && /^\d+$/.test(last)) {
        return { def: parent, id: Number(last) };
      }
    }
    throw new NotFoundException(`Unknown resource: /api/${path}`);
  }

  private repo(def: ResourceDef): Repository<ObjectLiteral> {
    return this.dataSource.getRepository(def.path);
  }

  private sanitize(def: ResourceDef, body: Record<string, unknown>) {
    const out: Record<string, unknown> = {};
    for (const col of def.columns) {
      if (body[col.key] !== undefined) out[col.key] = body[col.key];
    }
    return out;
  }

  async list(def: ResourceDef, query: ListQuery) {
    const page = Math.max(1, Number(query.page) || 1);
    const pageSize = Math.min(100, Math.max(1, Number(query.pageSize) || 20));

    const qb = this.repo(def).createQueryBuilder('r');

    if (def.softDelete) {
      qb.andWhere('r."deleted_at" IS NULL');
    }

    if (query.search && def.search.length > 0) {
      const clauses = def.search.map((key, i) => `r."${key}" ILIKE :s${i}`);
      const params = Object.fromEntries(
        def.search.map((_, i) => [`s${i}`, `%${query.search}%`]),
      );
      qb.andWhere(`(${clauses.join(' OR ')})`, params);
    }

    for (const [key, value] of Object.entries(query)) {
      if (RESERVED_QUERY_KEYS.has(key) || value === undefined) continue;
      if (def.columns.some((c) => c.key === key)) {
        qb.andWhere(`r."${key}" = :f_${key}`, { [`f_${key}`]: value });
      }
    }

    const defaultSort = def.external
      ? def.columns.some((c) => c.key === 'created_at')
        ? 'created_at'
        : 'id'
      : 'id';
    const sortKey =
      query.sort && def.columns.some((c) => c.key === query.sort)
        ? query.sort
        : defaultSort;
    const order = query.order?.toUpperCase() === 'ASC' ? 'ASC' : 'DESC';
    qb.orderBy(`r."${sortKey}"`, order);

    qb.skip((page - 1) * pageSize).take(pageSize);
    const [data, total] = await qb.getManyAndCount();

    return {
      resource: def.path,
      label: def.label,
      columns: def.columns,
      page,
      pageSize,
      total,
      totalPages: Math.ceil(total / pageSize),
      data,
    };
  }

  async get(def: ResourceDef, id: number | string) {
    const row = await this.repo(def).findOneBy({ id });
    if (!row || (def.softDelete && row.deleted_at)) {
      throw new NotFoundException(`${def.label} #${id} not found`);
    }
    return row;
  }

  async create(def: ResourceDef, body: Record<string, unknown>) {
    const payload = this.sanitize(def, body);
    if (Object.keys(payload).length === 0) {
      throw new BadRequestException(
        `Empty payload. Valid fields: ${def.columns.map((c) => c.key).join(', ')}`,
      );
    }
    if (def.tenantScoped && !payload.tenant_id) {
      payload.tenant_id = DEFAULT_TENANT_ID;
    }
    const repo = this.repo(def);
    const saved = await repo.save(repo.create(payload));

    if (def.code && !saved[def.code.field]) {
      saved[def.code.field] = `${def.code.prefix}-${1000 + Number(saved.id)}`;
      await repo.save(saved);
    }
    return saved;
  }

  async update(def: ResourceDef, id: number | string, body: Record<string, unknown>) {
    const row = await this.get(def, id);
    Object.assign(row, this.sanitize(def, body));
    return this.repo(def).save(row);
  }

  async remove(def: ResourceDef, id: number | string) {
    const row = await this.get(def, id);
    if (def.softDelete) {
      row.deleted_at = new Date();
      await this.repo(def).save(row);
      return { deleted: true, soft: true, id, resource: def.path };
    }
    await this.repo(def).remove(row);
    return { deleted: true, id, resource: def.path };
  }
}
