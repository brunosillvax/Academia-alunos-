import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

interface PushSubscription {
  endpoint: string;
  keys: {
    p256dh: string;
    auth: string;
  };
}

@Injectable()
export class PushService {
  constructor(private prisma: PrismaService) {}

  async saveSubscription(userId: string, subscription: PushSubscription) {
    // Em produção, salvar no banco (criar tabela PushSubscription)
    // Por enquanto, apenas logar
    console.log('Subscription saved for user:', userId);
    return { saved: true };
  }

  async sendNotification(userId: string, title: string, message: string, url?: string) {
    // Em produção, usar biblioteca web-push para enviar notificações reais
    // const payload = JSON.stringify({ title, body: message, url });
    // await webpush.sendNotification(subscription, payload);

    console.log(`Push notification to ${userId}: ${title} - ${message}`);
    return { sent: true, message: 'Notificação enviada (simulado)' };
  }

  async sendDailyWorkoutReminder(userId: string) {
    return this.sendNotification(
      userId,
      '💪 Treino do Dia',
      'Seu treino de hoje está pronto! Acesse para ver os exercícios.',
      '/student/workouts'
    );
  }

  async sendClassReminder(userId: string, className: string, time: string) {
    return this.sendNotification(
      userId,
      '📅 Lembrete de Aula',
      `Sua aula de ${className} está começando em breve às ${time}`,
      '/student/schedule'
    );
  }

  async sendPaymentReminder(userId: string, amount: number) {
    return this.sendNotification(
      userId,
      '💰 Lembrete de Pagamento',
      `Sua mensalidade de R$ ${(amount / 100).toFixed(2)} vence em breve.`,
      '/student/payments'
    );
  }
}
