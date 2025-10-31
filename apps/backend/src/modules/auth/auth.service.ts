import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';

interface JwtPayload { id: string; role: string; email: string; }

@Injectable()
export class AuthService {
  constructor(private prisma: PrismaService, private jwt: JwtService) {}

  async registerStudent(data: { name: string; email: string; password: string; birthDate: string; initialWeight: number; height: number; }) {
    const exists = await this.prisma.user.findUnique({ where: { email: data.email } });
    if (exists) throw new BadRequestException('Email ja cadastrado');

    const saltRounds = parseInt(process.env.BCRYPT_SALT_ROUNDS || '10', 10);
    const passwordHash = await bcrypt.hash(data.password, saltRounds);

    const user = await this.prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: passwordHash,
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

    return user;
  }

  async validateUser(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Credenciais invalidas');
    const ok = await bcrypt.compare(password, user.password);
    if (!ok) throw new UnauthorizedException('Credenciais invalidas');
    return user;
  }

  signToken(user: { id: string; role: string; email: string }) {
    const payload: JwtPayload = { id: user.id, role: user.role, email: user.email };
    return this.jwt.sign(payload);
  }

  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      include: { profile: true },
    });
  }
}









