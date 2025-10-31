import { Controller, Post, Body, Get, Res, UseGuards } from '@nestjs/common';
import { CalendarService } from './calendar.service';
import { JwtCookieGuard } from '../auth/jwt.guard';
import { Response } from 'express';

@Controller('calendar')
export class CalendarController {
  constructor(private calendarService: CalendarService) {}

  @Post('sync-to-google')
  @UseGuards(JwtCookieGuard)
  async syncToGoogle(@Body() data: {
    title: string;
    startTime: string;
    endTime: string;
    description?: string;
    location?: string;
  }) {
    return this.calendarService.syncScheduleToGoogleCalendar({
      ...data,
      startTime: new Date(data.startTime),
      endTime: new Date(data.endTime),
    });
  }

  @Get('export-ics')
  @UseGuards(JwtCookieGuard)
  async exportICS(@Res() res: Response) {
    // Em produção, buscar schedules do usuário
    const schedules = [
      {
        title: 'Musculação',
        startTime: new Date(),
        endTime: new Date(Date.now() + 60 * 60 * 1000),
        description: 'Treino de musculação',
        location: 'GymFlow Academia',
      },
    ];

    const ics = this.calendarService.exportScheduleAsICS(schedules);

    res.setHeader('Content-Type', 'text/calendar');
    res.setHeader('Content-Disposition', 'attachment; filename="gymflow-schedule.ics"');
    res.send(ics);
  }
}
