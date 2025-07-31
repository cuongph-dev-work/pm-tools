import { Module } from '@nestjs/common';
import { BaseLoggerService } from './base-logger.service';
import { LoggerFactory } from './logger.factory';
import { SystemLoggerService } from './logger.service';
import { WebhookLoggerService } from './webhook-logger.service';

@Module({
  providers: [BaseLoggerService, LoggerFactory, SystemLoggerService, WebhookLoggerService],
  exports: [BaseLoggerService, LoggerFactory, SystemLoggerService, WebhookLoggerService],
})
export class SystemLoggerModule {}
