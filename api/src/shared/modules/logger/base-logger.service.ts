import { Injectable } from '@nestjs/common';
import { formatDate } from '@utils/date';
import chalk from 'chalk';
import { join } from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';

const logDir = join(process.cwd(), 'logs');

export interface LoggerConfig {
  name: string;
  path?: string;
  color: any;
  label: string;
}

@Injectable()
export class BaseLoggerService {
  protected instance: winston.Logger;

  public initInstance(config: LoggerConfig) {
    const dailyRotateTransport = new winston.transports.DailyRotateFile({
      dirname: config.path ? join(logDir, config.path) : logDir,
      filename: `${config.name}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false,
      maxSize: '20m',
      maxFiles: '14d',
      level: 'info',
    });

    const consoleTransport = new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, _level, message, moreInfo }: any) => {
          const levelColor = config.color;
          const levelLabel = levelColor(config.label.padEnd(7));
          const time = chalk.white(`[${formatDate(new Date(timestamp), 'yyyy-MM-dd HH:mm:ss')}]`);

          return `${time} ${levelLabel} ${message} ${moreInfo ? JSON.stringify(moreInfo).slice(0, 100) + '...' : ''}`;
        }),
      ),
    });

    this.instance = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp, moreInfo }: any) => {
          return `${timestamp as string} [${level.toUpperCase()}] ${message as string} ${moreInfo ? JSON.stringify(moreInfo) : ''}`;
        }),
      ),
      transports: [consoleTransport, dailyRotateTransport],
    });
  }

  info(message: string, context?: any) {
    this.instance.info(message, context);
  }

  warn(message: string, context?: any) {
    this.instance.warn(message, context);
  }

  error(message: string, context?: any) {
    this.instance.error(message, context);
  }

  debug(message: string, context?: any) {
    this.instance.debug(message, context);
  }

  verbose(message: string, context?: any) {
    this.instance.verbose(message, context);
  }

  silly(message: string, context?: any) {
    this.instance.silly(message, context);
  }
}
