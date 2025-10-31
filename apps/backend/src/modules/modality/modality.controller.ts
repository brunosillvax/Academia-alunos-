import { Controller, Get, Post, Put, Delete, Param, Body, UseGuards } from '@nestjs/common';
import { ModalityService } from './modality.service';
import { JwtCookieGuard } from '../auth/jwt.guard';

@Controller('modalities')
export class ModalityController {
  constructor(private modalityService: ModalityService) {}

  @Get()
  findAll() {
    return this.modalityService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.modalityService.findOne(id);
  }

  @Post()
  @UseGuards(JwtCookieGuard)
  create(@Body() data: { name: string; description: string; icon: string; color: string }) {
    return this.modalityService.create(data);
  }

  @Put(':id')
  @UseGuards(JwtCookieGuard)
  update(@Param('id') id: string, @Body() data: { name?: string; description?: string; icon?: string; color?: string; active?: boolean }) {
    return this.modalityService.update(id, data);
  }

  @Delete(':id')
  @UseGuards(JwtCookieGuard)
  remove(@Param('id') id: string) {
    return this.modalityService.remove(id);
  }
}
