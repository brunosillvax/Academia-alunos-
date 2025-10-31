import { CanActivate, ExecutionContext, Injectable, UnauthorizedException, ForbiddenException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class JwtCookieGuard implements CanActivate {
  constructor(private jwt: JwtService) {}

  canActivate(context: ExecutionContext): boolean | Promise<boolean> {
    const req = context.switchToHttp().getRequest();
    const cookieName = process.env.COOKIE_NAME || 'gf_token';
    const token = req.cookies?.[cookieName];
    console.log('🔒 Guard check - cookieName:', cookieName, 'token exists:', !!token);
    if (!token) throw new UnauthorizedException('Token ausente');
    try {
      const payload = this.jwt.verify(token, { secret: process.env.JWT_SECRET || 'dev' });
      req.user = payload;
      console.log('✅ Token valid for user:', payload.email, payload.role);
      return true;
    } catch (err) {
      console.log('❌ Token invalid:', err instanceof Error ? err.message : 'Unknown error');
      throw new UnauthorizedException('Token invalido');
    }
  }
}

export function requireRole(role: 'ADMIN' | 'STUDENT') {
  return (context: ExecutionContext) => {
    const req = context.switchToHttp().getRequest();
    if (!req.user) throw new UnauthorizedException();
    if (req.user.role !== role) throw new ForbiddenException('Permissao negada');
    return true;
  };
}









