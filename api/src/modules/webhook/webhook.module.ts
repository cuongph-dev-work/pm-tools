import { GitModule } from '@modules/integration/git/git.module';
import { Module } from '@nestjs/common';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [GitModule],
  controllers: [WebhookController],
  providers: [],
})
export class WebhookModule {}
