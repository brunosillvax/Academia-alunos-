import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { CalendarController } from './calendar.controller';
import { CalendarService } from './calendar.service';
import { JwtCookieGuard } from '../auth/jwt.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [CalendarController],
  providers: [CalendarService, JwtCookieGuard],
})
export class CalendarModule {}
