import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PlanService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.plan.findMany({
      orderBy: { price: 'asc' },
      include: { _count: { select: { payments: true } } },
    });
  }

  async findOne(id: string) {
    const plan = await this.prisma.plan.findUnique({
      where: { id },
      include: { payments: true },
    });
    if (!plan) throw new NotFoundException('Plano não encontrado');
    return plan;
  }

  async create(data: { name: string; price: number; durationInDays: number }) {
    return this.prisma.plan.create({ data });
  }

  async update(id: string, data: { name?: string; price?: number; durationInDays?: number }) {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Plano não encontrado');
    return this.prisma.plan.update({ where: { id }, data });
  }

  async remove(id: string) {
    const plan = await this.prisma.plan.findUnique({ where: { id } });
    if (!plan) throw new NotFoundException('Plano não encontrado');
    return this.prisma.plan.delete({ where: { id } });
  }
}
