import { Module } from '@nestjs/common';
import { MailModule } from './mail/mail.module';
import { UploadModule } from './upload/upload.module';

@Module({
  imports: [MailModule, UploadModule],
  exports: [MailModule, UploadModule],
})
export class SharedModule {}
