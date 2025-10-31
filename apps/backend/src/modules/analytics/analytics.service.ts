import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AnalyticsService {
  constructor(private prisma: PrismaService) {}

  async trackEvent(data: {
    type: string;
    page?: string;
    data?: any;
    userId?: string;
    timestamp?: string;
  }) {
    try {
      return await this.prisma.analyticsEvent.create({
        data: {
          type: data.type,
          page: data.page || null,
          data: data.data || null,
          userId: data.userId || null,
        },
      });
    } catch (err) {
      // Log erro mas não interrompe o fluxo
      console.error('Erro ao salvar evento de analytics:', err);
      return null;
    }
  }

  async getEvents(filters?: { type?: string; page?: string; userId?: string; startDate?: Date; endDate?: Date }) {
    const where: any = {};
    if (filters?.type) where.type = filters.type;
    if (filters?.page) where.page = filters.page;
    if (filters?.userId) where.userId = filters.userId;
    if (filters?.startDate || filters?.endDate) {
      where.createdAt = {};
      if (filters.startDate) where.createdAt.gte = filters.startDate;
      if (filters.endDate) where.createdAt.lte = filters.endDate;
    }

    return this.prisma.analyticsEvent.findMany({
      where,
      orderBy: { createdAt: 'desc' },
      take: 1000,
    });
  }
}
