import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PushController } from './push.controller';
import { PushService } from './push.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtCookieGuard } from '../auth/jwt.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [PushController],
  providers: [PushService, PrismaService, JwtCookieGuard],
})
export class PushModule {}
