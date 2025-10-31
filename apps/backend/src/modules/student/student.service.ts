import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StudentService {
  constructor(private prisma: PrismaService) {}

  async getDashboard(userId: string) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      include: { 
        profile: { include: { progressEntries: { orderBy: { date: 'desc' }, take: 10 } } }, 
        payments: { orderBy: { createdAt: 'desc' }, take: 5 } 
      },
    });

    if (!user) return null;

    const totalPayments = await this.prisma.payment.count({ where: { userId } });
    const paidPayments = await this.prisma.payment.count({ where: { userId, status: 'PAID' } });
    const pendingPayments = await this.prisma.payment.count({ where: { userId, status: 'PENDING' } });

    return {
      user,
      stats: {
        totalPayments,
        paidPayments,
        pendingPayments,
        progressEntries: user.profile?.progressEntries?.length || 0,
      },
    };
  }

  getProfile(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: { include: { progressEntries: true } }, payments: true },
    });
  }

  async getEvolution(userId: string) {
    const profile = await this.prisma.userProfile.findUnique({
      where: { userId },
      include: { progressEntries: { orderBy: { date: 'desc' } } },
    });

    if (!profile) return null;

    const entries = profile.progressEntries || [];
    const stats = {
      initialWeight: profile.initialWeight,
      currentWeight: profile.currentWeight,
      totalEntries: entries.length,
      weightChange: profile.initialWeight && profile.currentWeight 
        ? profile.currentWeight - profile.initialWeight 
        : 0,
    };

    return { profile, entries, stats };
  }

  addProgress(userId: string, data: { date?: string; weight: number; bodyFat?: number; measurements?: any }) {
    return this.prisma.userProfile.update({
      where: { userId },
      data: {
        currentWeight: data.weight,
        progressEntries: {
          create: {
            date: data.date ? new Date(data.date) : new Date(),
            weight: data.weight,
            bodyFat: data.bodyFat,
            measurements: data.measurements as any,
          },
        },
      },
      include: { progressEntries: true },
    });
  }

  listPayments(userId: string) {
    return this.prisma.payment.findMany({ where: { userId }, orderBy: { createdAt: 'desc' } });
  }
}









