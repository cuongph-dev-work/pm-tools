import { Module } from '@nestjs/common';
import { SystemLoggerModule } from '@shared/modules/logger/logger.module';
import { WebhookController } from './webhook.controller';

@Module({
  imports: [SystemLoggerModule],
  controllers: [WebhookController],
  providers: [],
})
export class WebhookModule {}
