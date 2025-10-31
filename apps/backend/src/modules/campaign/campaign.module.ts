import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CampaignController } from './campaign.controller';
import { CampaignService } from './campaign.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtCookieGuard } from '../auth/jwt.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [CampaignController],
  providers: [CampaignService, PrismaService, JwtCookieGuard],
})
export class CampaignModule {}
