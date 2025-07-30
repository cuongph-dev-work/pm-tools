import { Body, Controller, Post } from '@nestjs/common';
import { SystemLoggerService } from '@shared/modules/logger/logger.service';

@Controller('webhook')
export class WebhookController {
  constructor(private readonly loggerService: SystemLoggerService) {}

  @Post('github')
  async githubWebhook(@Body() body: any) {
    this.loggerService.initInstance('webhook', 'webhooks');
    const logger = this.loggerService.getInstance();
    logger.info('Github webhook received', { body });
    return { message: 'Webhook received' };
  }
}
