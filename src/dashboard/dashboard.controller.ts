import { Controller, Get, ParseIntPipe, Query } from '@nestjs/common';
import { DashboardService } from './dashboard.service';
import { Public } from 'src/decorators/decorators';

@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dashboardService: DashboardService) {}

  @Public()
  @Get()
  getStats(@Query('year', ParseIntPipe) year?: number) {
    return this.dashboardService.getStats(year)
  }
}
