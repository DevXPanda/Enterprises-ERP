// Manufacturing analytics routes — one payload per redesigned frontend page.
import { Controller, Get } from '@nestjs/common';
import { ManufacturingService } from './manufacturing.service';

@Controller('manufacturing')
export class ManufacturingController {
  constructor(private readonly service: ManufacturingService) {}

  @Get('dashboard')
  dashboard() {
    return this.service.dashboard();
  }

  @Get('production-orders/analytics')
  productionOrders() {
    return this.service.productionOrdersAnalytics();
  }

  @Get('bom/analytics')
  bom() {
    return this.service.bomAnalytics();
  }

  @Get('job-cards/analytics')
  jobCards() {
    return this.service.jobCardsAnalytics();
  }

  @Get('machines/analytics')
  machines() {
    return this.service.machinesAnalytics();
  }

  @Get('reports/analytics')
  reports() {
    return this.service.reportsAnalytics();
  }
}
