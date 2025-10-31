import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ScheduleController } from './schedule.controller';
import { ScheduleService } from './schedule.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    }),
  ],
  controllers: [ScheduleController],
  providers: [ScheduleService, PrismaService],
})
export class ScheduleModule {}
