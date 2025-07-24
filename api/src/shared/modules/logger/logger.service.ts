import { Injectable } from '@nestjs/common';
import { formatDate } from '@utils/date';
import chalk from 'chalk';
import { join } from 'path';
import * as winston from 'winston';
import 'winston-daily-rotate-file';
const logDir = join(process.cwd(), 'logs');

export type WinstonLogger = winston.Logger;

@Injectable()
export class SystemLoggerService {
  private instance: winston.Logger;
  constructor() {}

  initInstance(name: string, path?: string) {
    const dailyRotateTransport = new winston.transports.DailyRotateFile({
      dirname: path ? join(logDir, path) : logDir,
      filename: `${name}-%DATE%.log`,
      datePattern: 'YYYY-MM-DD',
      zippedArchive: false, // ✅ enable if you want to compress old files
      maxSize: '20m',
      maxFiles: '14d', // ✅ keep 14 days
      level: 'info',
    });

    const consoleTransport = new winston.transports.Console({
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ timestamp, level, message, context }: any) => {
          const levelColor =
            {
              info: chalk.green,
              warn: chalk.yellow,
              error: chalk.red,
              debug: chalk.cyan,
              verbose: chalk.gray,
            }[level] || chalk.white;

          const levelLabel = levelColor(level.toUpperCase().padEnd(7));

          const time = chalk.white(`[${formatDate(new Date(timestamp), 'yyyy-MM-dd HH:mm:ss')}]`);
          const ctx = context ? chalk.green(`[${context}]`) : '';

          return `${time} ${levelLabel} ${ctx} ${message}`;
        }),
      ),
    });

    this.instance = winston.createLogger({
      level: 'info',
      format: winston.format.combine(
        winston.format.timestamp(),
        winston.format.printf(({ level, message, timestamp }) => {
          return `${timestamp as string} [${level.toUpperCase()}] ${message as string}`;
        }),
      ),
      transports: [consoleTransport, dailyRotateTransport],
    });
  }

  getInstance() {
    return this.instance;
  }
}
