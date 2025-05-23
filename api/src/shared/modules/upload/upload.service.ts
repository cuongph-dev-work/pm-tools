import { STORAGE_DRIVER } from '@configs/enum/file';
import { GetFileDto } from '@modules/file-storage/dtos/get-file.dto';
import { BadRequestException, Injectable } from '@nestjs/common';
import { CloudinaryDriver } from './driver/cloudinary.driver';
import { LocalDriver } from './driver/local.driver';

@Injectable()
export class UploadService {
  constructor(
    private readonly cloudinaryService: CloudinaryDriver,
    private readonly localService: LocalDriver,
  ) {}

  /**
   * Upload a file to the file storage
   * @param url - The url of the file to upload
   * @param driver - The driver to upload the file
   * @param publicId - The public id of the file
   * @returns The file storage entity
   */
  putFile(url: string, driver: STORAGE_DRIVER, publicId: string) {
    try {
      switch (driver) {
        case STORAGE_DRIVER.CLOUDINARY:
          return this.cloudinaryService.put(url, publicId);
        case STORAGE_DRIVER.LOCAL:
          return this.localService.put(url, publicId);
        default:
          throw new BadRequestException('Invalid driver');
      }
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  /**
   * Delete a file from the file storage
   * @param id - The id of the file to delete
   * @param driver - The driver to delete the file
   * @param options - The options to delete the file
   * @returns The file storage entity
   */
  deleteFile(
    id: string,
    driver: STORAGE_DRIVER,
    options?: { extension?: string },
  ) {
    switch (driver) {
      case STORAGE_DRIVER.CLOUDINARY:
        return this.cloudinaryService.delete(id);
      case STORAGE_DRIVER.LOCAL:
        return this.localService.delete(id, options?.extension ?? '');
      default:
        throw new BadRequestException('Invalid driver');
    }
  }

  /**
   * Get a file from the file storage
   * @param id - The id of the file to get
   * @param query - The query to get the file
   * @param driver - The driver to get the file
   * @returns The file storage entity
   */
  getFile(id: string, query: GetFileDto, driver: STORAGE_DRIVER) {
    switch (driver) {
      case STORAGE_DRIVER.CLOUDINARY:
        return this.cloudinaryService.get(id, query);
      case STORAGE_DRIVER.LOCAL:
        return this.localService.get(id, query);
      default:
        throw new BadRequestException('Invalid driver');
    }
  }
}
