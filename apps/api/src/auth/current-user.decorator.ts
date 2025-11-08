// auth/current-user.decorator.ts
import { createParamDecorator, ExecutionContext } from '@nestjs/common';

export type ClerkAuth = {
  userId?: string;
  sessionId?: string | null;
  getToken?: (opts?: { template?: string }) => Promise<string | null>;
  claims?: Record<string, unknown>;
};

export const CurrentAuth = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): ClerkAuth => {
    const req = ctx.switchToHttp().getRequest();
    return req.auth() ?? {};
  },
);
