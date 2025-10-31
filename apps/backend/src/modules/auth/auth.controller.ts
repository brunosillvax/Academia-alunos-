import { Body, Controller, Get, Post, Req, Res } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';

@Controller('auth')
export class AuthController {
  constructor(private readonly auth: AuthService) {}

  @Post('register')
  async register(
    @Body() body: { name: string; email: string; password: string; birthDate: string; initialWeight: number; height: number },
  ) {
    const user = await this.auth.registerStudent(body);
    return { id: user.id, email: user.email };
  }

  @Post('login')
  async login(
    @Body() body: { email: string; password: string },
    @Res({ passthrough: true }) res: Response,
  ) {
    console.log('🔐 Login attempt:', body.email);
    const user = await this.auth.validateUser(body.email, body.password);
    console.log('✅ User validated:', user.id, user.role);
    const token = this.auth.signToken({ id: user.id, role: user.role, email: user.email });
    const cookieName = process.env.COOKIE_NAME || 'gf_token';
    const isDev = process.env.NODE_ENV !== 'production';

    res.cookie(cookieName, token, {
      httpOnly: true,
      secure: !isDev,            // false em dev, true em prod
      sameSite: isDev ? 'lax' : 'none',  // 'lax' em dev, 'none' em prod
      maxAge: 7 * 24 * 60 * 60 * 1000,
      path: '/',
    });

    console.log('🍪 Cookie set:', cookieName, 'isDev:', isDev);

    return { ok: true };
  }

  @Get('me')
  async me(@Req() req: Request) {
    const cookieName = process.env.COOKIE_NAME || 'gf_token';
    const token = (req as any).cookies?.[cookieName];
    if (!token) return { user: null };

    // naive decode; a validação real acontece no guard
    const parts = token.split('.');
    if (parts.length !== 3) return { user: null };

    try {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
      const user = await this.auth.me(payload.id);
      return { user };
    } catch {
      return { user: null };
    }
  }
}
