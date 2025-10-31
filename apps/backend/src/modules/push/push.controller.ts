import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { PushService } from './push.service';
import { JwtCookieGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../auth/user.decorator';

@Controller('push')
export class PushController {
  constructor(private pushService: PushService) {}

  @Post('subscribe')
  @UseGuards(JwtCookieGuard)
  async subscribe(
    @CurrentUser() user: any,
    @Body() body: { subscription: any }
  ) {
    return this.pushService.saveSubscription(user.id, body.subscription);
  }

  @Post('send')
  async sendNotification(@Body() body: { userId: string; title: string; message: string; url?: string }) {
    return this.pushService.sendNotification(body.userId, body.title, body.message, body.url);
  }
}
