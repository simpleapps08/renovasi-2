/**
 * Image Compression Utility
 * Compresses images to reduce file size while maintaining quality
 */

interface CompressionOptions {
  maxSizeMB?: number;
  maxWidthOrHeight?: number;
  useWebWorker?: boolean;
  quality?: number;
  fileType?: string;
}

interface CompressionResult {
  success: boolean;
  compressedFile?: File;
  originalSize: number;
  compressedSize: number;
  compressionRatio: number;
  error?: string;
}

export class ImageCompression {
  /**
   * Compress image file to reduce size
   */
  static async compressImage(
    file: File, 
    options: CompressionOptions = {}
  ): Promise<CompressionResult> {
    const {
      maxSizeMB = 2,
      maxWidthOrHeight = 1920,
      quality = 0.8,
      fileType = 'image/jpeg'
    } = options;

    const originalSize = file.size;

    try {
      // If file is already small enough, return as is
      if (originalSize <= maxSizeMB * 1024 * 1024) {
        return {
          success: true,
          compressedFile: file,
          originalSize,
          compressedSize: originalSize,
          compressionRatio: 1
        };
      }

      // Create canvas for compression
      const compressedFile = await this.compressWithCanvas(
        file, 
        maxWidthOrHeight, 
        quality, 
        fileType,
        maxSizeMB
      );

      const compressedSize = compressedFile.size;
      const compressionRatio = originalSize / compressedSize;

      return {
        success: true,
        compressedFile,
        originalSize,
        compressedSize,
        compressionRatio
      };

    } catch (error) {
      console.error('Image compression error:', error);
      return {
        success: false,
        originalSize,
        compressedSize: 0,
        compressionRatio: 0,
        error: error instanceof Error ? error.message : 'Unknown compression error'
      };
    }
  }

  /**
   * Compress image using canvas
   */
  private static async compressWithCanvas(
    file: File,
    maxWidthOrHeight: number,
    quality: number,
    outputType: string,
    maxSizeMB: number
  ): Promise<File> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      img.onload = () => {
        try {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          
          if (!ctx) {
            reject(new Error('Cannot get canvas context'));
            return;
          }

          // Calculate new dimensions
          const { width, height } = this.calculateDimensions(
            img.width, 
            img.height, 
            maxWidthOrHeight
          );

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);
          
          // Try different quality levels if file is still too large
          this.compressWithQualityAdjustment(
            canvas, 
            outputType, 
            quality, 
            maxSizeMB,
            file.name
          ).then(resolve).catch(reject);

        } catch (error) {
          reject(error);
        }
      };

      img.onerror = () => reject(new Error('Failed to load image'));
      img.src = URL.createObjectURL(file);
    });
  }

  /**
   * Compress with quality adjustment to meet size requirements
   */
  private static async compressWithQualityAdjustment(
    canvas: HTMLCanvasElement,
    outputType: string,
    initialQuality: number,
    maxSizeMB: number,
    fileName: string
  ): Promise<File> {
    const maxSizeBytes = maxSizeMB * 1024 * 1024;
    let quality = initialQuality;
    let attempts = 0;
    const maxAttempts = 5;

    while (attempts < maxAttempts) {
      const blob = await this.canvasToBlob(canvas, outputType, quality);
      
      if (blob.size <= maxSizeBytes || quality <= 0.1) {
        // Create file with proper name and type
        const fileExtension = this.getFileExtension(outputType);
        const baseName = fileName.replace(/\.[^/.]+$/, '');
        const compressedFileName = `${baseName}_compressed.${fileExtension}`;
        
        return new File([blob], compressedFileName, { 
          type: outputType,
          lastModified: Date.now()
        });
      }

      // Reduce quality for next attempt
      quality = Math.max(0.1, quality - 0.15);
      attempts++;
    }

    // If still too large, create the file anyway
    const blob = await this.canvasToBlob(canvas, outputType, 0.1);
    const fileExtension = this.getFileExtension(outputType);
    const baseName = fileName.replace(/\.[^/.]+$/, '');
    const compressedFileName = `${baseName}_compressed.${fileExtension}`;
    
    return new File([blob], compressedFileName, { 
      type: outputType,
      lastModified: Date.now()
    });
  }

  /**
   * Convert canvas to blob
   */
  private static canvasToBlob(
    canvas: HTMLCanvasElement, 
    type: string, 
    quality: number
  ): Promise<Blob> {
    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to create blob from canvas'));
          }
        },
        type,
        quality
      );
    });
  }

  /**
   * Calculate new dimensions while maintaining aspect ratio
   */
  private static calculateDimensions(
    originalWidth: number,
    originalHeight: number,
    maxWidthOrHeight: number
  ): { width: number; height: number } {
    if (originalWidth <= maxWidthOrHeight && originalHeight <= maxWidthOrHeight) {
      return { width: originalWidth, height: originalHeight };
    }

    const aspectRatio = originalWidth / originalHeight;

    if (originalWidth > originalHeight) {
      return {
        width: maxWidthOrHeight,
        height: Math.round(maxWidthOrHeight / aspectRatio)
      };
    } else {
      return {
        width: Math.round(maxWidthOrHeight * aspectRatio),
        height: maxWidthOrHeight
      };
    }
  }

  /**
   * Get file extension from MIME type
   */
  private static getFileExtension(mimeType: string): string {
    const extensions: { [key: string]: string } = {
      'image/jpeg': 'jpg',
      'image/jpg': 'jpg',
      'image/png': 'png',
      'image/webp': 'webp'
    };
    return extensions[mimeType] || 'jpg';
  }

  /**
   * Format file size for display
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  /**
   * Check if file needs compression
   */
  static needsCompression(file: File, maxSizeMB: number = 2): boolean {
    return file.size > maxSizeMB * 1024 * 1024;
  }
}

export default ImageCompression;