import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { ModalityController } from './modality.controller';
import { ModalityService } from './modality.service';
import { PrismaService } from '../../prisma/prisma.service';

@Module({
  imports: [
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'dev',
      signOptions: { expiresIn: process.env.JWT_EXPIRES_IN || '7d' },
    }),
  ],
  controllers: [ModalityController],
  providers: [ModalityService, PrismaService],
})
export class ModalityModule {}
