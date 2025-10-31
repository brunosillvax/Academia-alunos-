import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class ModalityService {
  constructor(private prisma: PrismaService) {}

  async findAll() {
    return this.prisma.modality.findMany({
      orderBy: { name: 'asc' },
      include: { _count: { select: { schedules: true } } },
    });
  }

  async findOne(id: string) {
    const modality = await this.prisma.modality.findUnique({
      where: { id },
      include: { schedules: true },
    });
    if (!modality) throw new NotFoundException('Modalidade não encontrada');
    return modality;
  }

  async create(data: { name: string; description: string; icon: string; color: string }) {
    return this.prisma.modality.create({ data });
  }

  async update(id: string, data: { name?: string; description?: string; icon?: string; color?: string; active?: boolean }) {
    const modality = await this.prisma.modality.findUnique({ where: { id } });
    if (!modality) throw new NotFoundException('Modalidade não encontrada');
    return this.prisma.modality.update({ where: { id }, data });
  }

  async remove(id: string) {
    const modality = await this.prisma.modality.findUnique({ where: { id } });
    if (!modality) throw new NotFoundException('Modalidade não encontrada');
    return this.prisma.modality.delete({ where: { id } });
  }
}
