import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ScheduleService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.schedule.findMany({
      orderBy: [{ dayOfWeek: 'asc' }, { startTime: 'asc' }],
      include: { modality: true },
    });
  }

  async findOne(id: string) {
    const schedule = await this.prisma.schedule.findUnique({
      where: { id },
      include: { modality: true },
    });
    if (!schedule) throw new NotFoundException('Horário não encontrado');
    return schedule;
  }

  async create(data: { 
    modalityId: string; 
    dayOfWeek: number; 
    startTime: string; 
    endTime: string; 
    instructor: string; 
    maxCapacity: number 
  }) {
    return this.prisma.schedule.create({ 
      data,
      include: { modality: true },
    });
  }

  async update(id: string, data: { 
    modalityId?: string; 
    dayOfWeek?: number; 
    startTime?: string; 
    endTime?: string; 
    instructor?: string; 
    maxCapacity?: number;
    active?: boolean 
  }) {
    const schedule = await this.prisma.schedule.findUnique({ where: { id } });
    if (!schedule) throw new NotFoundException('Horário não encontrado');
    return this.prisma.schedule.update({ 
      where: { id }, 
      data,
      include: { modality: true },
    });
  }

  async remove(id: string) {
    const schedule = await this.prisma.schedule.findUnique({ where: { id } });
    if (!schedule) throw new NotFoundException('Horário não encontrado');
    return this.prisma.schedule.delete({ where: { id } });
  }
}
