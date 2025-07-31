import { Injectable } from '@nestjs/common';
import chalk from 'chalk';
import { BaseLoggerService } from './base-logger.service';

@Injectable()
export class WebhookLoggerService extends BaseLoggerService {
  constructor() {
    super();
    this.initInstance({
      name: 'webhook',
      path: 'webhooks',
      color: chalk.magenta,
      label: 'WEBHOOK',
    });
  }
}
