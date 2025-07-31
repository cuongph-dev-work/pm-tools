import { Injectable } from '@nestjs/common';
import chalk from 'chalk';
import { BaseLoggerService } from '../logger/base-logger.service';

@Injectable()
export class PerformanceLoggerService extends BaseLoggerService {
  constructor() {
    super();
    this.initInstance({
      name: 'performance',
      path: 'performances',
      color: chalk.blue,
      label: 'PERF',
    });
  }
}
