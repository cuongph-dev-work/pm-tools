import { GetFileDto } from '@modules/file-storage/dtos/get-file.dto';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { promises as fs } from 'fs';
import { extname, join } from 'path';

/**
 * Base path for storing uploaded files
 * Files will be stored in the 'storage/uploads' directory relative to the project root
 */
const storagePath = join(process.cwd(), 'storage', 'uploads');

/**
 * LocalDriver - Handles file operations for local storage
 * Provides functionality for uploading, deleting, and retrieving files from local storage
 */
@Injectable()
export class LocalDriver {
  constructor(private readonly configService: ConfigService) {}

  /**
   * Get the backend URL from configuration
   * @returns The configured backend URL
   * @throws Error if backend URL is not configured
   */
  private getBackendUrl(): string {
    const { backendUrl } = this.configService.get('app');
    if (!backendUrl) {
      throw new Error('Storage base URL is not configured');
    }
    return backendUrl;
  }

  /**
   * Extract filename from a file path
   * @param path - The file path to extract filename from
   * @returns The extracted filename
   * @throws Error if path is invalid or filename cannot be extracted
   */
  private getFilenameFromPath(path: string): string {
    const filename = path.split('/').pop();
    if (!filename) {
      throw new Error('Invalid file path');
    }
    return filename;
  }

  /**
   * Generate a public URL for accessing the file
   * @param filename - The name of the file
   * @returns Full HTTP URL to access the file
   */
  private getFileUrl(filename: string): string {
    return `${this.getBackendUrl()}/uploads/${filename}`;
  }

  /**
   * Upload a file to local storage
   * @param file - Path to the temporary file to upload
   * @param publicId - Public ID for the uploaded file
   * @returns Object containing the secure URL to access the uploaded file
   * @throws Error if file upload fails or storage is not configured properly
   */
  async put(file: string, publicId: string) {
    const uploadDir = join(storagePath);

    // Ensure upload directory exists
    await fs.mkdir(uploadDir, { recursive: true });

    // Get filename from temp path
    const filename = this.getFilenameFromPath(file);
    const extension = extname(filename);
    const newFilename = `${publicId}${extension}`;

    const destination = join(uploadDir, newFilename);

    // Move file from temp to upload directory
    await fs.rename(file, destination);

    // Return HTTP URL for storage
    return {
      secure_url: this.getFileUrl(newFilename),
    };
  }

  /**
   * Delete a file from local storage
   * @param path - Path or identifier of the file to delete
   * @returns Object indicating successful deletion
   * @throws Error if deletion fails for reasons other than file not found
   */
  async delete(id: string, extension: string) {
    const filePath = join(storagePath, `${id}${extension}`);
    try {
      await fs.unlink(filePath);
      return {
        result: 'ok',
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        // File not found, consider it as deleted
        return {
          result: 'ok',
        };
      }
      throw error;
    }
  }

  /**
   * Get access information for a file
   * @param path - Path or identifier of the file to access
   * @param _ - GetFileDto containing transformation options (not used in local storage)
   * @returns Object containing the URL to access the file
   * @throws Error if file does not exist or cannot be accessed
   */
  async get(path: string, _: GetFileDto) {
    const filename = this.getFilenameFromPath(path);
    const filePath = join(storagePath, filename);

    try {
      await fs.access(filePath);
      return {
        url: this.getFileUrl(filename),
      };
    } catch (error) {
      if (error.code === 'ENOENT') {
        throw new Error('File not found');
      }
      throw error;
    }
  }
}
