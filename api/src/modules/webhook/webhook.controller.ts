import { Public } from '@decorators/auth.decorator';
import { GitService, WebhookGitHubHeaders } from '@modules/integration/git/git.service';
import { Body, Controller, Headers, HttpCode, HttpStatus, Post, RawBody, VERSION_NEUTRAL } from '@nestjs/common';
import { WebhookGitLabHeaders } from '@utils/lib/gitlab-webhook/type';

@Controller({
  path: 'webhook',
  version: VERSION_NEUTRAL,
})
@Public()
export class WebhookController {
  constructor(private readonly gitService: GitService) {}

  @HttpCode(HttpStatus.OK)
  @Post('github')
  async githubWebhook(@Body() body: any, @RawBody() rawBody: Buffer, @Headers() _headers: WebhookGitHubHeaders) {
    const data = {
      body,
      headers: _headers,
      rawBody,
    };

    await this.gitService.webhookGithub(data);
  }

  @HttpCode(HttpStatus.OK)
  @Post('gitlab')
  async gitlabWebhook(@Body() body: any, @RawBody() rawBody: Buffer, @Headers() _headers: WebhookGitLabHeaders) {
    const data = {
      body,
      headers: _headers,
      rawBody,
    };

    await this.gitService.webhookGitlab(data);
  }
}
