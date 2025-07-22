import { Module } from '@nestjs/common';
import { SystemLoggerModule } from './logger/logger.module';
import { MailModule } from './mail/mail.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [MailModule, UploadModule, SystemLoggerModule],
  exports: [MailModule, UploadModule, SystemLoggerModule],
})
export class SharedModule {}
