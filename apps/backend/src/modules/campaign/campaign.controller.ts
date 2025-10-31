import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { CampaignService } from './campaign.service';
import { JwtCookieGuard } from '../auth/jwt.guard';

@Controller('campaigns')
@UseGuards(JwtCookieGuard)
export class CampaignController {
  constructor(private campaignService: CampaignService) {}

  @Get()
  async findAll() {
    return this.campaignService.findAll();
  }

  @Post()
  async create(@Body() data: {
    name: string;
    type: string;
    segment: any;
    message: string;
  }) {
    return this.campaignService.create(data);
  }

  @Post(':id/send')
  async send(@Param('id') id: string) {
    return this.campaignService.send(id);
  }
}
