import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ScheduleService } from './schedule.service';
import { JwtCookieGuard } from '../auth/jwt.guard';

@Controller('schedules')
export class ScheduleController {
  constructor(private scheduleService: ScheduleService) {}

  @Get()
  findAll() {
    return this.scheduleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.scheduleService.findOne(id);
  }

  @Post()
  @UseGuards(JwtCookieGuard)
  create(@Body() data: { 
    modalityId: string; 
    dayOfWeek: number; 
    startTime: string; 
    endTime: string; 
    instructor: string; 
    maxCapacity: number 
  }) {
    return this.scheduleService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtCookieGuard)
  update(@Param('id') id: string, @Body() data: { 
    modalityId?: string; 
    dayOfWeek?: number; 
    startTime?: string; 
    endTime?: string; 
    instructor?: string; 
    maxCapacity?: number;
    active?: boolean 
  }) {
    return this.scheduleService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtCookieGuard)
  remove(@Param('id') id: string) {
    return this.scheduleService.remove(id);
  }
}
