import { Injectable } from '@nestjs/common';
import chalk from 'chalk';
import { BaseLoggerService, LoggerConfig } from './base-logger.service';

@Injectable()
export class LoggerFactory {
  private loggers = new Map<string, BaseLoggerService>();

  createLogger(config: LoggerConfig): BaseLoggerService {
    const key = `${config.name}-${config.path || 'default'}`;

    if (this.loggers.has(key)) {
      return this.loggers.get(key)!;
    }

    const logger = new BaseLoggerService();
    logger.initInstance(config);
    this.loggers.set(key, logger);

    return logger;
  }

  // Predefined logger configurations
  createSystemLogger(): BaseLoggerService {
    return this.createLogger({
      name: 'system',
      color: chalk.green,
      label: 'SYSTEM',
    });
  }

  createWebhookLogger(): BaseLoggerService {
    return this.createLogger({
      name: 'webhook',
      path: 'webhooks',
      color: chalk.magenta,
      label: 'WEBHOOK',
    });
  }

  createPerformanceLogger(): BaseLoggerService {
    return this.createLogger({
      name: 'performance',
      path: 'performances',
      color: chalk.blue,
      label: 'PERF',
    });
  }

  createDatabaseLogger(): BaseLoggerService {
    return this.createLogger({
      name: 'database',
      path: 'database',
      color: chalk.cyan,
      label: 'DB',
    });
  }

  createSecurityLogger(): BaseLoggerService {
    return this.createLogger({
      name: 'security',
      path: 'security',
      color: chalk.red,
      label: 'SECURITY',
    });
  }
}
