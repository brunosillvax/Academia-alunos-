import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private prisma: PrismaService) {}

  async dashboard() {
    const [totalAlunos, faturamentoMes, inadimplentes, aniversariantes] = await Promise.all([
      this.prisma.user.count({ where: { role: 'STUDENT' } }),
      this.prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: 'PAID',
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1),
          },
        },
      }),
      this.prisma.payment.count({
        where: { status: 'PENDING', expiresAt: { lt: new Date() } },
      }),
      this.prisma.user.findMany({
        where: {
          role: 'STUDENT',
          profile: {
            birthDate: {
              gte: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()),
              lt: new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate() + 1),
            },
          },
        },
        select: { id: true, name: true },
      }),
    ]);

    return {
      totalAlunos,
      faturamentoMes: faturamentoMes._sum.amount || 0,
      inadimplentes,
      aniversariantes,
    };
  }

  async listStudents(page = 1, pageSize = 20) {
    const skip = (page - 1) * pageSize;
    const [students, total] = await Promise.all([
      this.prisma.user.findMany({
        where: { role: 'STUDENT' },
        skip,
        take: pageSize,
        include: { profile: true },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count({ where: { role: 'STUDENT' } }),
    ]);

    return {
      students,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    };
  }

  createStudent(data: { name: string; email: string; passwordHash: string; birthDate: string; initialWeight: number; height: number; }) {
    return this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.passwordHash,
        role: 'STUDENT',
        profile: {
          create: {
            birthDate: new Date(data.birthDate),
            initialWeight: data.initialWeight,
            currentWeight: data.initialWeight,
            height: data.height,
          },
        },
      },
      include: { profile: true },
    });
  }

  getStudent(id: string) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profile: { include: { progressEntries: true } },
        payments: true,
      },
    });
  }

  async getFunnelMetrics(startDate?: Date, endDate?: Date) {
    const dateFilter = startDate || endDate ? {
      ...(startDate && { gte: startDate }),
      ...(endDate && { lte: endDate }),
    } : undefined;

    // Leads: eventos de analytics do tipo FORM_START ou FORM_COMPLETE no pre-register
    const leads = await this.prisma.analyticsEvent.count({
      where: {
        type: { in: ['FORM_START', 'FORM_COMPLETE'] },
        page: 'pre-register',
        ...(dateFilter && { createdAt: dateFilter }),
      },
    });

    // Avaliações: usuários com profile criado (assumindo que criação de profile = avaliação física)
    const avaliacoes = await this.prisma.userProfile.count({
      where: dateFilter ? {
        user: {
          ...(dateFilter && { createdAt: dateFilter }),
        },
      } : undefined,
    });

    // Matrículas: usuários STUDENT ativos
    const matriculas = await this.prisma.user.count({
      where: {
        role: 'STUDENT',
        ...(dateFilter && { createdAt: dateFilter }),
      },
    });

    // Taxa de conversão
    const conversionRate = leads > 0 ? ((matriculas / leads) * 100).toFixed(2) : '0.00';

    return {
      leads,
      avaliacoes,
      matriculas,
      conversionRate: parseFloat(conversionRate),
    };
  }

  async getLTVChurnMRR() {
    // MRR (Monthly Recurring Revenue): soma de todos os pagamentos mensais ativos
    const currentMonth = new Date();
    currentMonth.setDate(1);
    currentMonth.setHours(0, 0, 0, 0);

    const mrrPayments = await this.prisma.payment.findMany({
      where: {
        status: 'PAID',
        expiresAt: { gte: new Date() },
        createdAt: { gte: currentMonth },
      },
    });

    const MRR = mrrPayments.reduce((sum, p) => sum + (p.amount / 100), 0);

    // LTV (Lifetime Value): valor médio por aluno ao longo do tempo
    const studentsWithPayments = await this.prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        payments: {
          where: { status: 'PAID' },
        },
      },
    });

    const totalRevenue = studentsWithPayments.reduce(
      (sum, s) => sum + s.payments.reduce((pSum, p) => pSum + (p.amount / 100), 0),
      0
    );

    const avgLTV = studentsWithPayments.length > 0
      ? totalRevenue / studentsWithPayments.length
      : 0;

    // Churn: alunos que não têm pagamento recente (mais de 60 dias sem pagar)
    const sixtyDaysAgo = new Date();
    sixtyDaysAgo.setDate(sixtyDaysAgo.getDate() - 60);

    const studentsWithRecentPayment = await this.prisma.user.count({
      where: {
        role: 'STUDENT',
        payments: {
          some: {
            status: 'PAID',
            createdAt: { gte: sixtyDaysAgo },
          },
        },
      },
    });

    const totalStudents = studentsWithPayments.length;
    const churnedStudents = totalStudents - studentsWithRecentPayment;
    const churnRate = totalStudents > 0
      ? ((churnedStudents / totalStudents) * 100).toFixed(2)
      : '0.00';

    return {
      MRR: Math.round(MRR * 100) / 100,
      LTV: Math.round(avgLTV * 100) / 100,
      churnRate: parseFloat(churnRate),
      totalStudents,
      churnedStudents,
    };
  }

  async generateReport(type: 'csv' | 'pdf'): Promise<string> {
    const students = await this.prisma.user.findMany({
      where: { role: 'STUDENT' },
      include: {
        profile: true,
        payments: { orderBy: { createdAt: 'desc' }, take: 5 },
      },
    });

    if (type === 'csv') {
      // CSV simples
      const headers = ['Nome', 'Email', 'Peso Inicial', 'Peso Atual', 'Altura', 'Total Pagamentos', 'Status'];
      const rows = students.map(s => [
        s.name,
        s.email,
        s.profile?.initialWeight || 'N/A',
        s.profile?.currentWeight || 'N/A',
        s.profile?.height || 'N/A',
        s.payments.filter(p => p.status === 'PAID').length.toString(),
        s.payments.some(p => p.status === 'PENDING' && p.expiresAt < new Date()) ? 'Inadimplente' : 'Ativo',
      ]);

      const csv = [
        headers.join(','),
        ...rows.map(r => r.map(cell => `"${cell}"`).join(','))
      ].join('\n');

      return csv;
    } else {
      // PDF simplificado (retorna base64 de um HTML convertido)
      // Em produção, usar biblioteca como pdfkit ou puppeteer
      const html = `
        <html>
          <head><title>Relatório GymFlow</title></head>
          <body>
            <h1>Relatório de Alunos</h1>
            <table border="1">
              <tr><th>Nome</th><th>Email</th><th>Status</th></tr>
              ${students.map(s => `
                <tr>
                  <td>${s.name}</td>
                  <td>${s.email}</td>
                  <td>${s.payments.some(p => p.status === 'PENDING' && p.expiresAt < new Date()) ? 'Inadimplente' : 'Ativo'}</td>
                </tr>
              `).join('')}
            </table>
          </body>
        </html>
      `;
      // Para produção real, usar biblioteca de conversão HTML->PDF
      return Buffer.from(html).toString('base64');
    }
  }
}
