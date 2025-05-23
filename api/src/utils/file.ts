import * as os from 'os';
import * as path from 'path';
import * as fs from 'fs';
import { FILE_KIND } from '@configs/enum/file';

/**
 * Get the temporary directory path for file uploads
 * @returns string Path to temporary directory
 */
export const getTempUploadPath = () => {
  return path.join(os.tmpdir(), 'uploads');
};

/**
 * Get temporary file path
 * @param filename Original filename
 * @returns string Full path to temporary file
 */
export const getTempFilePath = (filename: string) => {
  return path.join(getTempUploadPath(), filename);
};

/**
 * Delete a temporary file
 * @param filename Name of the file to delete
 */
export const deleteTempFile = async (filename: string): Promise<void> => {
  const filePath = getTempFilePath(filename);
  try {
    await fs.promises.unlink(filePath);
  } catch (error) {
    console.error(`Failed to delete temporary file ${filePath}:`, error);
  }
};

/**
 * Clean up temporary files older than the specified age
 * @param maxAgeMs Maximum age in milliseconds (default: 1 hour)
 */
export const cleanupTempFiles = async (
  maxAgeMs: number = 3600000,
): Promise<void> => {
  const tempDir = getTempUploadPath();

  try {
    // Ensure directory exists
    if (!fs.existsSync(tempDir)) {
      return;
    }

    const files = await fs.promises.readdir(tempDir);
    const now = Date.now();

    for (const file of files) {
      const filePath = path.join(tempDir, file);
      try {
        const stats = await fs.promises.stat(filePath);
        const fileAge = now - stats.mtimeMs;

        if (fileAge > maxAgeMs) {
          await fs.promises.unlink(filePath);
          console.log(`Deleted old temporary file: ${file}`);
        }
      } catch (error) {
        console.error(`Error processing file ${file}:`, error);
      }
    }
  } catch (error) {
    console.error('Error cleaning up temporary files:', error);
  }
};

/**
 * Get file kind from MIME type
 * @param mimeType MIME type of the file
 * @returns The kind of file (image, video, audio, document, etc.)
 */
export const getFileKindFromMimeType = (mimeType: string): FILE_KIND => {
  if (!mimeType) {
    return FILE_KIND.OTHER;
  }

  const type = mimeType.toLowerCase();

  if (type.startsWith('image/')) {
    return FILE_KIND.IMAGE;
  } else if (type.startsWith('video/')) {
    return FILE_KIND.VIDEO;
  } else if (type.startsWith('audio/')) {
    return FILE_KIND.AUDIO;
  } else if (
    type.startsWith('text/') ||
    type === 'application/pdf' ||
    type === 'application/msword' ||
    type.includes('document') ||
    type.includes('spreadsheet') ||
    type.includes('presentation')
  ) {
    return FILE_KIND.DOCUMENT;
  } else if (
    type.includes('compressed') ||
    type.includes('zip') ||
    type.includes('archive')
  ) {
    return FILE_KIND.ARCHIVE;
  } else {
    return FILE_KIND.OTHER;
  }
};
