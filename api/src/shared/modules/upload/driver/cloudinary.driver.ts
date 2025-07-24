import { GetFileDto } from '@modules/file-storage/dtos/get-file.dto';
import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { v2 as cloudinary } from 'cloudinary';

/**
 * CloudinaryDriver - Handles file operations with Cloudinary service
 * Provides functionality for uploading, deleting, and retrieving files from Cloudinary
 */
@Injectable()
export class CloudinaryDriver {
  private logger = new Logger(CloudinaryDriver.name);

  /**
   * Initialize Cloudinary configuration with credentials from config service
   */
  constructor(private readonly configService: ConfigService) {
    cloudinary.config({
      cloud_name: this.configService.get('storage.cloudinary.cloudName'),
      api_key: this.configService.get('storage.cloudinary.apiKey'),
      api_secret: this.configService.get('storage.cloudinary.apiSecret'),
    });
  }

  /**
   * Upload a file to Cloudinary
   * @param file - File path or URL to upload
   * @param public_id - Public ID for the uploaded file
   * @returns Cloudinary upload result or null if upload fails
   */
  async put(file: string, public_id: string) {
    try {
      const result = await cloudinary.uploader.upload(file, {
        public_id,
      });
      return result;
    } catch (error) {
      this.logger.error('Error uploading file to cloudinary', error);
      return null;
    }
  }

  /**
   * Delete a file from Cloudinary by its ID
   * @param id - Public ID of the file to delete
   * @returns Cloudinary deletion result or null if deletion fails
   */
  async delete(id: string) {
    try {
      const result = await cloudinary.uploader.destroy(id);
      return result;
    } catch (error) {
      this.logger.error('Error deleting file from cloudinary', error);
      return null;
    }
  }

  /**
   * Get a file from Cloudinary with transformation options
   * @param id - Public ID of the file to retrieve
   * @param query - Transformation parameters for the image
   * @returns Object containing the optimized URL
   */
  get(id: string, query: GetFileDto) {
    const { quality, fetch_format, crop, gravity, width, height, aspect_ratio } = query;

    const optimizeUrl = cloudinary.url(id, {
      fetch_format,
      quality,
      crop,
      gravity,
      width,
      height,
      aspect_ratio,
    });

    return {
      url: optimizeUrl,
    };
  }
}
