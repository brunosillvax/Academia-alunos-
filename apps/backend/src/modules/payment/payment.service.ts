import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PaymentService {
  constructor(private prisma: PrismaService) {}

  async createPayment(userId: string, planId: string, gateway: 'pagseguro' | 'mercadopago' | 'asaas') {
    const plan = await this.prisma.plan.findUnique({ where: { id: planId } });
    if (!plan) throw new Error('Plano não encontrado');

    // Criar payment pendente
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + plan.durationInDays);

    const payment = await this.prisma.payment.create({
      data: {
        userId,
        planId,
        amount: plan.price,
        status: 'PENDING',
        expiresAt,
      },
    });

    // Integração com gateway (estrutura básica - em produção conectar APIs reais)
    let gatewayResponse: any;

    switch (gateway) {
      case 'pagseguro':
        // TODO: Integrar PagSeguro SDK
        // gatewayResponse = await pagseguro.createPayment({ ... });
        gatewayResponse = {
          id: `PS_${Date.now()}`,
          checkoutUrl: `https://pagseguro.uol.com.br/checkout/payment.html?code=DEMO_${payment.id}`,
        };
        break;
      case 'mercadopago':
        // TODO: Integrar MercadoPago SDK
        // gatewayResponse = await mercadopago.payment.create({ ... });
        gatewayResponse = {
          id: `MP_${Date.now()}`,
          checkoutUrl: `https://www.mercadopago.com.br/checkout/v1/redirect?pref_id=DEMO_${payment.id}`,
        };
        break;
      case 'asaas':
        // TODO: Integrar Asaas SDK
        // gatewayResponse = await asaas.createPayment({ ... });
        gatewayResponse = {
          id: `ASAAS_${Date.now()}`,
          boletoUrl: `https://www.asaas.com/cobranca/${payment.id}`,
          barcode: 'DEMO_BARCODE',
        };
        break;
    }

    // Atualizar payment com gateway ID
    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { paymentGatewayID: gatewayResponse.id },
    });

    return {
      paymentId: payment.id,
      gateway,
      checkoutUrl: gatewayResponse.checkoutUrl || gatewayResponse.boletoUrl,
      barcode: gatewayResponse.barcode,
    };
  }

  async handleWebhook(gateway: string, body: any) {
    // Processar webhook do gateway e atualizar status do pagamento
    // Em produção, validar assinatura do webhook

    const gatewayId = body.id || body.payment_id || body.transaction?.code;
    if (!gatewayId) return { received: true };

    const payment = await this.prisma.payment.findFirst({
      where: { paymentGatewayID: gatewayId },
    });

    if (!payment) return { received: true };

    let status: 'PAID' | 'FAILED' | 'PENDING' = 'PENDING';

    if (gateway === 'pagseguro') {
      status = body.status === '3' ? 'PAID' : body.status === '7' ? 'FAILED' : 'PENDING';
    } else if (gateway === 'mercadopago') {
      status = body.status === 'approved' ? 'PAID' : body.status === 'rejected' ? 'FAILED' : 'PENDING';
    } else if (gateway === 'asaas') {
      status = body.status === 'CONFIRMED' ? 'PAID' : body.status === 'OVERDUE' ? 'PENDING' : 'FAILED';
    }

    await this.prisma.payment.update({
      where: { id: payment.id },
      data: { status },
    });

    return { received: true, updated: payment.id };
  }

  async createCollectionRule(data: { daysAfterDue: number; message: string }) {
    // Sistema de régua de cobrança automática
    // Em produção, usar job/cron para processar
    return {
      id: `rule_${Date.now()}`,
      daysAfterDue: data.daysAfterDue,
      message: data.message,
      active: true,
    };
  }

  async processCollectionRules() {
    // Buscar pagamentos vencidos e aplicar régua de cobrança
    const overduePayments = await this.prisma.payment.findMany({
      where: {
        status: 'PENDING',
        expiresAt: { lt: new Date() },
      },
      include: { user: true },
    });

    // TODO: Enviar mensagens via WhatsApp/Email conforme dias de atraso
    // Exemplo: 7 dias -> lembrete, 15 dias -> cobrança, 30 dias -> suspensão

    return { processed: overduePayments.length };
  }
}
