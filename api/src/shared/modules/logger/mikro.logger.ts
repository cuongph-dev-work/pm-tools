import { DefaultLogger, LogContext, LoggerOptions } from '@mikro-orm/core';
import { AsyncLocalStorage } from 'async_hooks';

export interface MikroLoggerOptions {
  enableSlowQueryLog: boolean;
  thresholdMs: number;
}

export class MikroLogger extends DefaultLogger {
  private readonly mikroLoggerOptions: MikroLoggerOptions;
  private readonly als: AsyncLocalStorage<Request>;
  constructor(options: LoggerOptions, mikroLoggerOptions: MikroLoggerOptions, als: AsyncLocalStorage<Request>) {
    super(options);
    this.mikroLoggerOptions = mikroLoggerOptions;
    this.als = als;
  }

  logQuery(context: { query: string } & LogContext): void {
    if (context.query.includes('pg_database')) return;
    if (this.mikroLoggerOptions.enableSlowQueryLog) {
      this.logSlowQuery(context.query, context.params || [], context.took || 0);
    }
    super.logQuery(context);
  }

  private logSlowQuery(query: string, params: any[], took: number): void {
    if (took > this.mikroLoggerOptions.thresholdMs) {
      this.als?.getStore()?.['_queryStats']?.push({
        query,
        time: took,
        params,
      });
    }
  }
}
