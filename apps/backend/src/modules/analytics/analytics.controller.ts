import { Controller, Post, Body, Get, Query } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { CurrentUser } from '../auth/user.decorator';
import { JwtCookieGuard } from '../auth/jwt.guard';
import { UseGuards } from '@nestjs/common';

@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @Post('event')
  async trackEvent(@Body() body: { type: string; page?: string; data?: any; userId?: string; timestamp?: string }) {
    // Permite eventos anônimos (sem auth obrigatória)
    return this.analyticsService.trackEvent(body);
  }

  @Get('events')
  @UseGuards(JwtCookieGuard)
  async getEvents(
    @CurrentUser() user: any,
    @Query('type') type?: string,
    @Query('page') page?: string,
    @Query('startDate') startDate?: string,
    @Query('endDate') endDate?: string,
  ) {
    // Apenas admin pode ver analytics
    if (user?.role !== 'ADMIN') {
      return { error: 'Unauthorized' };
    }

    return this.analyticsService.getEvents({
      type,
      page,
      userId: user.id,
      startDate: startDate ? new Date(startDate) : undefined,
      endDate: endDate ? new Date(endDate) : undefined,
    });
  }
}
