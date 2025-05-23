import {
  BadRequestException,
  forwardRef,
  Inject,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { transformToValidationError } from '@utils/helper';

import { STORAGE_DELETE_MODE, STORAGE_DRIVER } from '@configs/enum/file';
import { FileStorage } from '@entities/file-storage.entity';
import { EntityManager } from '@mikro-orm/postgresql';
import { ConfigService } from '@nestjs/config';
import { UploadService } from '@shared/modules/upload/upload.service';
import { getFileKindFromMimeType } from '@utils/file';
import { I18nService } from 'nestjs-i18n';
import { extname } from 'path';
import { RequestWithUser } from 'src/types/request.type';
import { GetFileDto } from './dtos/get-file.dto';
import { FileStorageRepository } from './file-storage.repository';

@Injectable()
export class FileStorageService {
  private readonly logger = new Logger(FileStorageService.name);
  private readonly storageDriver: STORAGE_DRIVER = STORAGE_DRIVER.LOCAL;
  private readonly storageDeleteMode: STORAGE_DELETE_MODE =
    STORAGE_DELETE_MODE.SOFT;
  constructor(
    @Inject(forwardRef(() => FileStorageRepository))
    private readonly fileStorageRepository: FileStorageRepository,
    private readonly i18n: I18nService,
    private readonly em: EntityManager,
    private readonly uploadService: UploadService,
    private readonly configService: ConfigService,
  ) {
    this.storageDriver = this.configService.get(
      'storage.driver',
    ) as STORAGE_DRIVER;
  }

  /**
   * Upload a file to the file storage
   * @param file - The file to upload
   * @param user - The user who is uploading the file
   * @returns The file storage entity
   */
  async uploadFile(file: Express.Multer.File, user: RequestWithUser['user']) {
    if (!file) {
      throw transformToValidationError(
        [{ property: 'file', key: 'IsMustSelect', params: {} }],
        this.i18n,
      );
    }

    return this.em.transactional(async (em) => {
      // save file to database
      const fileStorage = new FileStorage();
      fileStorage.original_name = file.originalname;
      fileStorage.url = '';
      fileStorage.size = file.size;
      fileStorage.mime_type = file.mimetype;
      fileStorage.created_by = user.id ?? 'system';
      fileStorage.kind = getFileKindFromMimeType(file.mimetype);
      await em.persistAndFlush(fileStorage);

      // put file to cloudinary
      const result = await this.uploadService.putFile(
        file.path,
        this.storageDriver,
        fileStorage.id,
      );

      if (!result) {
        throw new BadRequestException('Failed to upload file');
      }

      // update file url
      fileStorage.url = result.secure_url;
      await em.persistAndFlush(fileStorage);

      this.logger.log(`File uploaded: ${fileStorage.id}`);
      return fileStorage;
    });
  }

  /**
   * Delete a file from the file storage
   * @param id - The id of the file to delete
   * @param user - The user who is deleting the file
   * @returns The file storage entity
   */
  async deleteFile(id: string, user: RequestWithUser['user']) {
    const fileStorage = await this.fileStorageRepository.findOneById(id);

    if (!fileStorage) {
      throw new NotFoundException(this.i18n.t('message.file_not_found'));
    }

    return this.em.transactional(async (em) => {
      if (this.storageDeleteMode === STORAGE_DELETE_MODE.SOFT) {
        // soft delete file
        fileStorage.updated_by = user?.id ?? 'system';
        fileStorage.deleted_at = new Date();
        await em.persistAndFlush(fileStorage);
      } else {
        // hard delete file
        await em.removeAndFlush(fileStorage);
      }

      // get extension from url
      const extension = extname(fileStorage.url);
      // delete file from cloudinary
      await this.uploadService.deleteFile(fileStorage.id, this.storageDriver, {
        extension,
      });

      this.logger.log(`File deleted: ${fileStorage.id}`);
      return fileStorage;
    });
  }

  /**
   * Get a file from the file storage
   * @param id - The id of the file to get
   * @param query - The query to get the file
   * @returns The file storage entity
   */
  async getFile(id: string, query: GetFileDto) {
    const fileStorage = await this.fileStorageRepository.findOneById(id);

    if (!fileStorage) {
      throw new NotFoundException(this.i18n.t('message.file_not_found'));
    }

    return this.uploadService.getFile(
      fileStorage.url,
      query,
      this.storageDriver,
    );
  }
}
