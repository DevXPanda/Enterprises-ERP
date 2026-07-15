// Frontend-compatible wages routes backed by the MWMS schema.
import { Body, Controller, Get, Post } from '@nestjs/common';
import { WagesService } from './wages.service';

@Controller('wages')
export class WagesController {
  constructor(private readonly service: WagesService) {}

  @Get('workers')
  workers() {
    return this.service.workers();
  }

  @Post('workers')
  createWorker(
    @Body()
    body: {
      name?: string;
      department?: string;
      type?: string;
      dailyRate?: number;
      bankAccount?: string;
      shift?: string;
    },
  ) {
    return this.service.createWorker(body);
  }

  @Get('attendance')
  attendance() {
    return this.service.attendance();
  }

  @Post('attendance')
  markAttendance(
    @Body()
    body: { empId?: string; date?: string; status?: string; checkIn?: string; checkOut?: string },
  ) {
    return this.service.markAttendance(body);
  }

  @Post('payroll/generate')
  generatePayroll(@Body() body: { month?: string }) {
    return this.service.generatePayroll(body);
  }

  @Get('payroll')
  payroll() {
    return this.service.payroll();
  }

  @Get('summary')
  summary() {
    return this.service.summary();
  }

  @Get('dashboard')
  dashboard() {
    return this.service.dashboard();
  }

  @Get('reports/analytics')
  reportsAnalytics() {
    return this.service.reportsAnalytics();
  }
}
