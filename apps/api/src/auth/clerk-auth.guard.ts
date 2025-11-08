// auth/clerk-auth.guard.ts
import { CanActivate, ExecutionContext, Injectable, UnauthorizedException } from '@nestjs/common';

@Injectable()
export class ClerkAuthGuard implements CanActivate {
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest();
    // Clerk middleware attaches req.auth
    const userId = req?.auth?.userId;
    if (userId) return true;
    throw new UnauthorizedException('Missing or invalid Clerk auth');
  }
}
