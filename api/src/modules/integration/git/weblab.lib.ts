export class WebhooksGitLab {
  private secret: string;

  constructor({ secret }: { secret: string }) {
    this.secret = secret;
  }

  // async handleWebhook(data: GitLabWebhookData) {
  //   const { body, headers } = data;
  // }
}
