import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtModule } from '@nestjs/jwt';
import { JwtCookieGuard } from '../auth/jwt.guard';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev',
      signOptions: { expiresIn: '7d' },
    }),
  ],
  controllers: [StudentController],
  providers: [StudentService, PrismaService, JwtCookieGuard],
})
export class StudentModule {}









