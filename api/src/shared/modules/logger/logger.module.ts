import { Module } from '@nestjs/common';
import { SystemLoggerService } from './logger.service';

@Module({
  providers: [SystemLoggerService],
  exports: [SystemLoggerService],
})
export class SystemLoggerModule {}
