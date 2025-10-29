export const IMAGES_FORMAT = [
  "jpg",
  "jpeg",
  "png",
  "gif",
  "bmp",
  "tiff",
  "webp",
  "svg",
  "heic",
  "heif",
];

export const VIDEOS_FORMAT = [
  "mp4",
  "mkv",
  "mov",
  "avi",
  "wmv",
  "flv",
  "webp",
  "webm",
  "m4v",
];

export const AUDIO_FORMAT = ["mp3", "wav", "ogg", "m4a", "wma", "flac", "aac"];

export const DOCUMENTS_FORMAT = [
  "doc",
  "docx",
  "xls",
  "xlsx",
  "ppt",
  "pptx",
  "pdf",
];

/**
 * Checks if a file extension is a valid video format
 */
export function isVideoFormat(extension: string, mimeType?: string): boolean {
  if (mimeType) {
    return VIDEOS_FORMAT.includes(extension) && mimeType.startsWith("video/");
  }
  return VIDEOS_FORMAT.includes(extension);
}
/**
 * Checks if a file extension is a valid audio format
 */
export function isAudioFormat(extension: string, mimeType?: string): boolean {
  if (mimeType) {
    return AUDIO_FORMAT.includes(extension) && mimeType.startsWith("audio/");
  }
  return AUDIO_FORMAT.includes(extension);
}

/**
 * Checks if a file extension is a valid image format
 */
export function isImageFormat(extension: string, mimeType?: string): boolean {
  if (mimeType) {
    return IMAGES_FORMAT.includes(extension) && mimeType.startsWith("image/");
  }
  return IMAGES_FORMAT.includes(extension);
}

/**
 * Checks if a file extension is a valid document format
 */
export function isDocumentFormat(
  extension: string,
  mimeType?: string
): boolean {
  if (mimeType) {
    return (
      DOCUMENTS_FORMAT.includes(extension) &&
      mimeType.startsWith("application/")
    );
  }
  return DOCUMENTS_FORMAT.includes(extension);
}

/**
 * Checks if a file is a zip file
 */
export const isZip = (file: File) => {
  const zipMimeTypes = [
    "application/zip",
    "application/x-zip-compressed",
    "multipart/x-zip",
  ];
  return zipMimeTypes.includes(file.type);
};

/**
 * Returns the file extension of the given filename.
 */
export function getFileExtension(filename: string) {
  try {
    return filename.slice(((filename.lastIndexOf(".") - 1) >>> 0) + 2);
  } catch {
    return "";
  }
}

/**
 * Converts a URL to a Blob
 */
export async function urlToBlob(url: string): Promise<Blob> {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to fetch image: ${response.statusText}`);
  }
  const blob = await response.blob();
  return blob;
}
