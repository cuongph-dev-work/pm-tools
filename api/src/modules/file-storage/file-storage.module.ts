import { FileStorage } from '@entities/file-storage.entity';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { Module } from '@nestjs/common';
import { MulterModule } from '@nestjs/platform-express';
import { UploadModule } from '@shared/modules/upload/upload.module';
import { getTempUploadPath } from '@utils/file';
import * as fs from 'fs';
import { diskStorage } from 'multer';
import { extname } from 'path';
import { v7 as uuidv7 } from 'uuid';
import { FileStorageController } from './file-storage.controller';
import { FileStorageRepository } from './file-storage.repository';
import { FileStorageService } from './file-storage.service';

@Module({
  imports: [
    MikroOrmModule.forFeature([FileStorage]),
    MulterModule.register({
      storage: diskStorage({
        destination: (req, file, cb) => {
          // Ensure temporary upload directory exists
          const tempDir = getTempUploadPath();
          if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
          }
          cb(null, tempDir);
        },
        filename: (req, file, cb) => {
          const uniqueSuffix = uuidv7();
          cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
        },
      }),
      limits: {
        fileSize: 5 * 1024 * 1024, // 5MB
      },
      // dest: './tmp/uploads/',
    }),
    UploadModule,
  ],
  controllers: [FileStorageController],
  providers: [FileStorageService, FileStorageRepository],
  exports: [MulterModule, FileStorageService],
})
export class FileStorageModule {}
