/**
 * Storage Service for Room Enhancer using Supabase Storage
 * Handles image upload, storage, and retrieval for AI processing
 */

import { supabase } from '@/integrations/supabase/client';
import { CleanupService } from './cleanupService';

interface UploadImageResponse {
  success: boolean;
  imageUrl?: string;
  imagePath?: string;
  error?: string;
}

interface StorageConfig {
  bucketName: string;
  maxFileSize: number; // in bytes
  allowedTypes: string[];
}

class StorageService {
  private config: StorageConfig = {
    bucketName: 'room-enhancer-images',
    maxFileSize: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
  };

  constructor() {
    this.initializeBucket();
  }

  /**
   * Initialize storage bucket if it doesn't exist
   */
  private async initializeBucket(): Promise<void> {
    try {
      // Check if bucket exists
      const { data: buckets, error } = await supabase.storage.listBuckets();
      
      if (error) {
        console.error('Error listing buckets:', error);
        console.warn('⚠️ Bucket check failed. Please ensure the bucket exists in Supabase Dashboard.');
        console.warn('📋 Run the SQL script: setup_storage_bucket.sql in Supabase SQL Editor');
        return;
      }

      const bucketExists = buckets?.some(bucket => bucket.name === this.config.bucketName);
      
      if (!bucketExists) {
        console.warn(`❌ Bucket '${this.config.bucketName}' not found!`);
        console.warn('📋 Please create the bucket manually using one of these methods:');
        console.warn('1. Run setup_storage_bucket.sql in Supabase SQL Editor');
        console.warn('2. Create bucket in Supabase Dashboard > Storage');
        console.warn('3. Bucket settings: Public=true, File size limit=10MB');
        
        // Try to create bucket programmatically
        const { error: createError } = await supabase.storage.createBucket(
          this.config.bucketName,
          {
            public: true,
            allowedMimeTypes: this.config.allowedTypes,
            fileSizeLimit: this.config.maxFileSize
          }
        );
        
        if (createError) {
          console.error('❌ Failed to create bucket automatically:', createError);
          console.error('🔧 Manual setup required - see console warnings above');
        } else {
          console.log(`✅ Storage bucket '${this.config.bucketName}' created successfully`);
        }
      } else {
        console.log(`✅ Storage bucket '${this.config.bucketName}' found and ready`);
      }
    } catch (error) {
      console.error('❌ Error initializing storage bucket:', error);
      console.warn('🔧 Please check Supabase connection and bucket configuration');
    }
  }

  /**
   * Validate file before upload
   */
  private validateFile(file: File): { valid: boolean; error?: string } {
    // Check file size
    if (file.size > this.config.maxFileSize) {
      return {
        valid: false,
        error: `File terlalu besar. Maksimal ${this.config.maxFileSize / (1024 * 1024)}MB`
      };
    }

    // Check file type
    if (!this.config.allowedTypes.includes(file.type)) {
      return {
        valid: false,
        error: `Tipe file tidak didukung. Gunakan: ${this.config.allowedTypes.join(', ')}`
      };
    }

    return { valid: true };
  }

  /**
   * Generate unique filename with timestamp and random string
   */
  private generateFileName(originalName: string, prefix: string = ''): string {
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 8);
    const extension = originalName.split('.').pop();
    const baseName = originalName.split('.').slice(0, -1).join('.');
    
    return `${prefix}${prefix ? '_' : ''}${baseName}_${timestamp}_${randomString}.${extension}`;
  }

  /**
   * Upload original image before AI processing
   */
  async uploadOriginalImage(file: File, userId?: string): Promise<UploadImageResponse> {
    try {
      // Validate file
      const validation = this.validateFile(file);
      if (!validation.valid) {
        return {
          success: false,
          error: validation.error
        };
      }

      // Generate unique filename
      const fileName = this.generateFileName(file.name, 'original');
      const filePath = userId ? `${userId}/${fileName}` : `public/${fileName}`;

      // Upload file to Supabase Storage with temporary metadata
      const { data, error } = await supabase.storage
        .from(this.config.bucketName)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: false,
          metadata: {
            'temporary': 'true',
            'type': 'original',
            'uploaded_at': new Date().toISOString(),
            'user_id': userId || 'anonymous'
          }
        });

      if (error) {
        console.error('Upload error:', error);
        
        // Handle specific bucket not found error
        if (error.message?.includes('Bucket not found') || error.message?.includes('bucket does not exist')) {
          return {
            success: false,
            error: `❌ Storage bucket tidak ditemukan!\n\n🔧 Solusi:\n1. Buka Supabase Dashboard > Storage\n2. Buat bucket baru: '${this.config.bucketName}'\n3. Set sebagai Public bucket\n4. Atau jalankan file: setup_storage_bucket.sql`
          };
        }
        
        return {
          success: false,
          error: `Gagal upload gambar: ${error.message}`
        };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.config.bucketName)
        .getPublicUrl(filePath);

      return {
        success: true,
        imageUrl: urlData.publicUrl,
        imagePath: filePath
      };

    } catch (error) {
      console.error('Storage service error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown storage error'
      };
    }
  }

  /**
   * Upload enhanced/generated image result
   */
  async uploadEnhancedImage(imageBlob: Blob, originalFileName: string, userId?: string): Promise<UploadImageResponse> {
    try {
      // Generate unique filename for enhanced image
      const fileName = this.generateFileName(originalFileName, 'enhanced');
      const filePath = userId ? `${userId}/${fileName}` : `public/${fileName}`;

      // Upload blob to Supabase Storage with temporary metadata
      const { data, error } = await supabase.storage
        .from(this.config.bucketName)
        .upload(filePath, imageBlob, {
          cacheControl: '3600',
          upsert: false,
          contentType: 'image/png',
          metadata: {
            'temporary': 'true',
            'type': 'enhanced',
            'uploaded_at': new Date().toISOString(),
            'user_id': userId || 'anonymous',
            'original_file': originalFileName
          }
        });

      if (error) {
        console.error('Enhanced image upload error:', error);
        
        // Handle specific bucket not found error
        if (error.message?.includes('Bucket not found') || error.message?.includes('bucket does not exist')) {
          return {
            success: false,
            error: `❌ Storage bucket tidak ditemukan!\n\n🔧 Solusi:\n1. Buka Supabase Dashboard > Storage\n2. Buat bucket baru: '${this.config.bucketName}'\n3. Set sebagai Public bucket\n4. Atau jalankan file: setup_storage_bucket.sql`
          };
        }
        
        return {
          success: false,
          error: `Gagal upload gambar hasil: ${error.message}`
        };
      }

      // Get public URL
      const { data: urlData } = supabase.storage
        .from(this.config.bucketName)
        .getPublicUrl(filePath);

      return {
        success: true,
        imageUrl: urlData.publicUrl,
        imagePath: filePath
      };

    } catch (error) {
      console.error('Enhanced image storage error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown storage error'
      };
    }
  }

  /**
   * Convert data URL to Blob for upload
   */
  dataURLToBlob(dataURL: string): Blob {
    const arr = dataURL.split(',');
    const mime = arr[0].match(/:(.*?);/)![1];
    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }
    
    return new Blob([u8arr], { type: mime });
  }

  /**
   * Delete image from storage
   */
  async deleteImage(imagePath: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { error } = await supabase.storage
        .from(this.config.bucketName)
        .remove([imagePath]);

      if (error) {
        return {
          success: false,
          error: `Gagal hapus gambar: ${error.message}`
        };
      }

      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown delete error'
      };
    }
  }

  /**
   * Get storage usage statistics
   */
  async getStorageStats(): Promise<{ totalSize: number; fileCount: number }> {
    try {
      const { data: files, error } = await supabase.storage
        .from(this.config.bucketName)
        .list('', {
          limit: 1000,
          sortBy: { column: 'created_at', order: 'desc' }
        });

      if (error || !files) {
        return { totalSize: 0, fileCount: 0 };
      }

      const totalSize = files.reduce((sum, file) => sum + (file.metadata?.size || 0), 0);
      return {
        totalSize,
        fileCount: files.length
      };
    } catch (error) {
      console.error('Error getting storage stats:', error);
      return { totalSize: 0, fileCount: 0 };
    }
  }

  /**
   * Cleanup old temporary images
   */
  async cleanupOldImages(hoursOld: number = 24): Promise<{ success: boolean; deletedCount: number; error?: string }> {
    return await CleanupService.cleanupOldImages(hoursOld);
  }

  /**
   * Get detailed storage statistics including cleanup info
   */
  async getDetailedStorageStats(): Promise<{
    success: boolean;
    totalFiles: number;
    totalSize: number;
    oldFiles: number;
    formattedSize: string;
    error?: string;
  }> {
    const stats = await CleanupService.getStorageStats();
    return {
      ...stats,
      formattedSize: CleanupService.formatFileSize(stats.totalSize)
    };
  }

  /**
   * Auto cleanup that runs periodically
   */
  async performAutoCleanup(): Promise<void> {
    await CleanupService.autoCleanup();
  }
}

// Export singleton instance
export const storageService = new StorageService();
export type { UploadImageResponse, StorageConfig };