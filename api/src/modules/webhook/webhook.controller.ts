import { Public } from '@decorators/auth.decorator';
import { GitService } from '@modules/integration/git/git.service';
import {
  Body,
  Controller,
  Headers,
  HttpCode,
  HttpStatus,
  Post,
  VERSION_NEUTRAL,
} from '@nestjs/common';
import { SystemLoggerService } from '@shared/modules/logger/logger.service';

export interface WebhookHeaders {
  'X-GitHub-Event': string;
  'X-Hub-Signature-256': string;
}

@Controller({
  path: 'webhook',
  version: VERSION_NEUTRAL,
})
@Public()
export class WebhookController {
  constructor(
    private readonly loggerService: SystemLoggerService,
    private readonly gitService: GitService,
  ) {}

  @HttpCode(HttpStatus.OK)
  @Post('github')
  async githubWebhook(@Body() body: any, @Headers() _headers: WebhookHeaders) {
    const data = {
      body,
      headers: _headers,
    };
    this.loggerService.initInstance('github', 'webhooks');
    const logger = this.loggerService.getInstance();
    await this.gitService.webhook(data, logger);
  }
}
