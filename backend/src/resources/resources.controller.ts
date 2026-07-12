// Generic CRUD routes for all registered resources.
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ListQuery, ResourcesService } from './resources.service';
import { registry } from './registry';

@Controller()
export class ResourcesController {
  constructor(private readonly service: ResourcesService) {}

  @Get('resources')
  catalog() {
    return registry.map((def) => ({
      path: `/api/${def.path}`,
      label: def.label,
      columns: def.columns,
      searchableFields: def.search,
    }));
  }

  private segments(params: Record<string, string>): string[] {
    return ['a', 'b', 'c', 'd']
      .map((k) => params[k])
      .filter((s): s is string => Boolean(s));
  }

  private async handleGet(params: Record<string, string>, query: ListQuery) {
    const { def, id } = this.service.resolve(this.segments(params));
    return id === undefined
      ? this.service.list(def, query)
      : this.service.get(def, id);
  }

  private async handleCreate(
    params: Record<string, string>,
    body: Record<string, unknown>,
  ) {
    const { def, id } = this.service.resolve(this.segments(params));
    if (id !== undefined) {
      throw new NotFoundException('POST is only allowed on collections');
    }
    return this.service.create(def, body);
  }

  private async handleUpdate(
    params: Record<string, string>,
    body: Record<string, unknown>,
  ) {
    const { def, id } = this.service.resolve(this.segments(params));
    if (id === undefined) {
      throw new NotFoundException('PATCH requires a row id');
    }
    return this.service.update(def, id, body);
  }

  private async handleDelete(params: Record<string, string>) {
    const { def, id } = this.service.resolve(this.segments(params));
    if (id === undefined) {
      throw new NotFoundException('DELETE requires a row id');
    }
    return this.service.remove(def, id);
  }

  @Get(':a/:b')
  get2(@Param() p: Record<string, string>, @Query() q: ListQuery) {
    return this.handleGet(p, q);
  }
  @Get(':a/:b/:c')
  get3(@Param() p: Record<string, string>, @Query() q: ListQuery) {
    return this.handleGet(p, q);
  }
  @Get(':a/:b/:c/:d')
  get4(@Param() p: Record<string, string>, @Query() q: ListQuery) {
    return this.handleGet(p, q);
  }

  @Post(':a/:b')
  post2(@Param() p: Record<string, string>, @Body() body: Record<string, unknown>) {
    return this.handleCreate(p, body);
  }
  @Post(':a/:b/:c')
  post3(@Param() p: Record<string, string>, @Body() body: Record<string, unknown>) {
    return this.handleCreate(p, body);
  }

  @Patch(':a/:b/:c')
  patch3(@Param() p: Record<string, string>, @Body() body: Record<string, unknown>) {
    return this.handleUpdate(p, body);
  }
  @Patch(':a/:b/:c/:d')
  patch4(@Param() p: Record<string, string>, @Body() body: Record<string, unknown>) {
    return this.handleUpdate(p, body);
  }

  @Delete(':a/:b/:c')
  delete3(@Param() p: Record<string, string>) {
    return this.handleDelete(p);
  }
  @Delete(':a/:b/:c/:d')
  delete4(@Param() p: Record<string, string>) {
    return this.handleDelete(p);
  }
}
