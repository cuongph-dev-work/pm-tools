import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { AsyncLocalStorage } from 'async_hooks';
import { Observable, tap } from 'rxjs';
import { SystemLoggerService, WinstonLogger } from '../logger/logger.service';

@Injectable()
export class PerformanceInterceptor implements NestInterceptor {
  private logger: WinstonLogger;

  constructor(
    private readonly configService: ConfigService,
    private readonly als: AsyncLocalStorage<Request>,
    private readonly loggerService: SystemLoggerService,
  ) {
    if (this.isDevelopment) {
      this.loggerService.initInstance('performance', 'performances');
      this.logger = this.loggerService.getInstance();
    }
  }

  get isDevelopment(): boolean {
    return this.configService.get('NODE_ENV') === 'development';
  }

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return next.handle().pipe(
      tap(() => {
        const req = this.als.getStore() as Request;

        if (!req || !this.isDevelopment) return;

        const start = req['_startTime'];
        const memStart = req['_memoryStart'];
        const memEnd = process.memoryUsage().heapUsed;

        const memoryUsed = ((memEnd - memStart) / 1024 / 1024).toFixed(2);
        const duration = Date.now() - start;
        const queryStats = req['_queryStats'] || [];

        const totalSQL = queryStats.reduce((s, q) => s + q.time, 0);

        this.logger.info(`--- [Performance] ${req.method} ${req.url} ---`);
        this.logger.info(`⏱  Duration: ${duration}ms`);
        this.logger.info(`🧠 Memory Used: ${memoryUsed} MB`);
        if (queryStats.length) {
          const msg = `🐢 Slow SQLs (${queryStats.length}): Total ${totalSQL}ms`;
          this.logger.warn(msg);
          for (const q of queryStats) {
            const msgQ = ` - ${q.time}ms: ${q.query.slice(0, 100)}...`;
            this.logger.warn(msgQ);
          }
        }
        this.logger.info('--------------------------');
      }),
    );
  }
}
