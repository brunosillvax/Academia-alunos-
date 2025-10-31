import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PlanController } from './plan.controller';
import { PlanService } from './plan.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    }),
  ],
  controllers: [PlanController],
  providers: [PlanService, PrismaService],
})
export class PlanModule {}
