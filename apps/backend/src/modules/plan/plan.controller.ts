import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { PlanService } from './plan.service';
import { JwtCookieGuard } from '../auth/jwt.guard';

@Controller('plans')
export class PlanController {
  constructor(private planService: PlanService) {}

  @Get()
  findAll() {
    return this.planService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.planService.findOne(id);
  }

  @Post()
  @UseGuards(JwtCookieGuard)
  create(@Body() data: { name: string; price: number; durationInDays: number }) {
    return this.planService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtCookieGuard)
  update(@Param('id') id: string, @Body() data: { name?: string; price?: number; durationInDays?: number }) {
    return this.planService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtCookieGuard)
  remove(@Param('id') id: string) {
    return this.planService.remove(id);
  }
}
