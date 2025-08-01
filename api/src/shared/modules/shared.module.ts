import { Module } from '@nestjs/common';
import { CacheModule } from './cache/cache.module';
import { SystemLoggerModule } from './logger/logger.module';
import { MailModule } from './mail/mail.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [MailModule, UploadModule, SystemLoggerModule, CacheModule],
  exports: [MailModule, UploadModule, SystemLoggerModule, CacheModule],
})
export class SharedModule {}
