import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AlsModule } from '../async-local-storage/als.module';
import { PerformanceLoggerService } from './performance-logger.service';
import { PerformanceInterceptor } from './performance.interceptor';
import { PerformanceMiddleware } from './performance.middleware';

@Module({
  imports: [AlsModule],
  providers: [
    PerformanceInterceptor,
    PerformanceMiddleware,
    PerformanceLoggerService,
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
  ],
  exports: [PerformanceInterceptor, PerformanceMiddleware, PerformanceLoggerService],
})
export class PerformanceModule {}
