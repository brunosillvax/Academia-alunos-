import { Controller, Get, Query, UseGuards, Body, Post, Param, Res } from '@nestjs/common';
import { AdminService } from './admin.service';
import { JwtCookieGuard } from '../auth/jwt.guard';
import { Response } from 'express';
import bcrypt from 'bcrypt';

@UseGuards(JwtCookieGuard)
@Controller('admin')
export class AdminController {
  constructor(private readonly admin: AdminService) {}

  @Get('dashboard')
  async dashboard() {
    return this.admin.dashboard();
  }

  @Get('funnel')
  async funnel(@Query('startDate') startDate?: string, @Query('endDate') endDate?: string) {
    return this.admin.getFunnelMetrics(
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined
    );
  }

  @Get('ltv-churn-mrr')
  async ltvChurnMrr() {
    return this.admin.getLTVChurnMRR();
  }

  @Get('export/report')
  async exportReport(@Query('type') type: 'csv' | 'pdf' = 'csv', @Res() res: Response) {
    const report = await this.admin.generateReport(type);

    if (type === 'csv') {
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', 'attachment; filename="relatorio-gymflow.csv"');
      res.send(report);
    } else {
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', 'attachment; filename="relatorio-gymflow.pdf"');
      res.send(Buffer.from(report, 'base64'));
    }
  }

  @Get('students')
  async list(@Query('page') page?: string, @Query('pageSize') pageSize?: string) {
    return this.admin.listStudents(parseInt(page || '1', 10), parseInt(pageSize || '20', 10));
  }

  @Post('students')
  async create(
    @Body() body: { name: string; email: string; password: string; birthDate: string; initialWeight: number; height: number },
  ) {
    const passwordHash = await bcrypt.hash(body.password, parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10));
    return this.admin.createStudent({ ...body, passwordHash });
  }

  @Get('students/:id')
  async get(@Param('id') id: string) {
    return this.admin.getStudent(id);
  }
}
