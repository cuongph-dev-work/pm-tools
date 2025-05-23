import { Module } from '@nestjs/common';
import { CloudinaryDriver } from './driver/cloudinary.driver';
import { LocalDriver } from './driver/local.driver';
import { UploadService } from './upload.service';
@Module({
  imports: [],
  providers: [UploadService, CloudinaryDriver, LocalDriver],
  exports: [UploadService],
})
export class UploadModule {}
