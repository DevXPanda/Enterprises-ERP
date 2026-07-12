// Frontend-compatible wages routes backed by the MWMS schema.
import { Controller, Get } from '@nestjs/common';
import { WagesService } from './wages.service';

@Controller('wages')
export class WagesController {
  constructor(private readonly service: WagesService) {}

  @Get('workers')
  workers() {
    return this.service.workers();
  }

  @Get('attendance')
  attendance() {
    return this.service.attendance();
  }

  @Get('payroll')
  payroll() {
    return this.service.payroll();
  }

  @Get('summary')
  summary() {
    return this.service.summary();
  }
}
