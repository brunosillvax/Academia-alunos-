import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtCookieGuard } from '../auth/jwt.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PrismaService, JwtCookieGuard],
})
export class PaymentModule {}
