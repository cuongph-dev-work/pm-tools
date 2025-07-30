import { GitModule } from '@modules/integration/git/git.module';
import { Module } from '@nestjs/common';
import { SystemLoggerModule } from '@shared/modules/logger/logger.module';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [SystemLoggerModule, GitModule],
  controllers: [WebhookController],
  providers: [],
})
export class WebhookModule {}
