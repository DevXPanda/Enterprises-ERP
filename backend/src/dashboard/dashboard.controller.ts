// Static dashboard and health routes.
import { Controller, Get, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';

@Controller()
export class DashboardController {
  constructor(private readonly service: DashboardService) {}

  @Get('health')
  health() {
    return this.service.health();
  }

  @Get('dashboard')
  executive() {
    return this.service.executive();
  }

  @Get('factory/dashboard')
  factory() {
    return this.service.factory();
  }

  @Get('search')
  search(@Query('q') q?: string) {
    return this.service.search(q ?? '');
  }

  @Get('notifications')
  notifications() {
    return this.service.notifications();
  }
}
