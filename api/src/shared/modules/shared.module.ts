import { Module } from '@nestjs/common';
import { CacheModule } from './cache/cache.module';
import { SystemLoggerModule } from './logger/logger.module';
import { MailModule } from './mail/mail.module';
import { PlaywrightModule } from './playwright/playwright.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [MailModule, UploadModule, SystemLoggerModule, CacheModule, PlaywrightModule],
  exports: [MailModule, UploadModule, SystemLoggerModule, CacheModule, PlaywrightModule],
})
export class SharedModule {}
