import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class CampaignService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.campaign.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }

  async create(data: {
    name: string;
    type: string;
    segment: any;
    message: string;
  }) {
    return this.prisma.campaign.create({
      data: {
        name: data.name,
        type: data.type,
        segment: data.segment,
        message: data.message,
        status: 'DRAFT',
      },
    });
  }

  async send(id: string) {
    const campaign = await this.prisma.campaign.findUnique({ where: { id } });
    if (!campaign) throw new NotFoundException('Campanha não encontrada');

    // Lógica de segmentação e envio
    const segment = campaign.segment as any;
    const where: any = { role: 'STUDENT' };

    // Exemplo: alunos que faltaram X dias (precisa de lógica de schedule enrollment)
    // Por enquanto, vamos apenas marcar como enviada

    await this.prisma.campaign.update({
      where: { id },
      data: {
        status: 'SENT',
        sentAt: new Date(),
      },
    });

    // TODO: Implementar lógica real de envio via WhatsApp/Email
    // Pode usar serviços como Twilio para WhatsApp, SendGrid para Email

    return { success: true, message: 'Campanha enviada (simulado - implementar integração real)' };
  }
}
