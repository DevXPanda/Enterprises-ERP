// Static dashboard and health routes.
import { Controller, Get } from '@nestjs/common';
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
}
