import { Controller, Get, Post, Param, Body, UseGuards } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { JwtCookieGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../auth/user.decorator';

@Controller('payments')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @Post('create')
  @UseGuards(JwtCookieGuard)
  async create(
    @CurrentUser() user: any,
    @Body() data: { planId: string; gateway: 'pagseguro' | 'mercadopago' | 'asaas' }
  ) {
    return this.paymentService.createPayment(user.id, data.planId, data.gateway);
  }

  @Post('webhook/:gateway')
  async webhook(
    @Param('gateway') gateway: string,
    @Body() body: any
  ) {
    return this.paymentService.handleWebhook(gateway, body);
  }

  @Post('collection-rules')
  @UseGuards(JwtCookieGuard)
  async createCollectionRule(@Body() data: { daysAfterDue: number; message: string }) {
    return this.paymentService.createCollectionRule(data);
  }
}
