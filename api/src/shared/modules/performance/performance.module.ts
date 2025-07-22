import { Module } from '@nestjs/common';
import { APP_INTERCEPTOR } from '@nestjs/core';
import { AlsModule } from '../async-local-storage/als.module';
import { SystemLoggerModule } from '../logger/logger.module';
import { PerformanceInterceptor } from './performance.interceptor';

@Module({
  imports: [AlsModule, SystemLoggerModule],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: PerformanceInterceptor,
    },
  ],
  exports: [],
})
export class PerformanceModule {}
