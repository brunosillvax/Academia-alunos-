import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { StudentService } from './student.service';
import { JwtCookieGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../auth/user.decorator';

@UseGuards(JwtCookieGuard)
@Controller('student')
export class StudentController {
  constructor(private readonly students: StudentService) {}

  @Get('dashboard')
  async dashboard(@CurrentUser() user: any) {
    return this.students.getDashboard(user.id);
  }

  @Get('profile')
  async profile(@CurrentUser() user: any) {
    return this.students.getProfile(user.id);
  }

  @Get('evolution')
  async evolution(@CurrentUser() user: any) {
    return this.students.getEvolution(user.id);
  }

  @Post('progress')
  async addProgress(@CurrentUser() user: any, @Body() body: { date?: string; weight: number; bodyFat?: number; measurements?: any }) {
    return this.students.addProgress(user.id, body);
  }

  @Get('payments')
  async payments(@CurrentUser() user: any) {
    return this.students.listPayments(user.id);
  }
}









