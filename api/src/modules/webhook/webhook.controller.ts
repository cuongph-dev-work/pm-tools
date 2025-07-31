import { Public } from '@decorators/auth.decorator';
import { GitService, WebhookGitHubHeaders, WebhookGitLabHeaders } from '@modules/integration/git/git.service';
import { Body, Controller, Headers, HttpCode, HttpStatus, Post, RawBody, VERSION_NEUTRAL } from '@nestjs/common';
import { SystemLoggerService } from '@shared/modules/logger/logger.service';

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
  async githubWebhook(@Body() body: any, @RawBody() rawBody: Buffer, @Headers() _headers: WebhookGitHubHeaders) {
    const data = {
      body,
      headers: _headers,
      rawBody,
    };
    this.loggerService.initInstance('github', 'webhooks');
    const logger = this.loggerService.getInstance();
    await this.gitService.webhookGithub(data, logger);
  }

  @HttpCode(HttpStatus.OK)
  @Post('gitlab')
  async gitlabWebhook(@Body() body: any, @RawBody() rawBody: Buffer, @Headers() _headers: WebhookGitLabHeaders) {
    const data = {
      body,
      headers: _headers,
      rawBody,
    };

    this.loggerService.initInstance('gitlab', 'webhooks');
    const logger = this.loggerService.getInstance();
    await this.gitService.webhookGitlab(data, logger);
  }
}
