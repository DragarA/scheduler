import {
    Controller,
    Post,
    Req,
    Res,
    HttpCode,
    HttpStatus,
  } from '@nestjs/common';
  import type { Request, Response } from 'express';
  import { ClerkWebhookService } from './clerk-webhook.service';
  
  @Controller('webhooks')
  export class ClerkWebhookController {
    constructor(private readonly clerkWebhookService: ClerkWebhookService) {}
  
    @Post('clerk')
    @HttpCode(HttpStatus.OK)
    async handleClerkWebhook(@Req() req: Request, @Res() res: Response) {
      const rawBody = (req as any).rawBody as string;
      const headers = req.headers as Record<string, string>;
  
      const event = this.clerkWebhookService.verifyAndParse(rawBody, headers);
      await this.clerkWebhookService.handleEvent(event);
  
      return res.json({ received: true });
    }
  }
  