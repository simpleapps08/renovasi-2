import { supabase } from '../lib/supabase';

export interface CleanupResult {
  success: boolean;
  deletedCount: number;
  error?: string;
}

export class CleanupService {
  /**
   * Manually cleanup old images from room-enhancer-images bucket
   * @param hoursOld - Delete images older than this many hours (default: 24)
   */
  static async cleanupOldImages(hoursOld: number = 24): Promise<CleanupResult> {
    try {
      const { data, error } = await supabase.rpc('manual_cleanup_room_enhancer_images', {
        hours_old: hoursOld
      });

      if (error) {
        console.error('Cleanup error:', error);
        return {
          success: false,
          deletedCount: 0,
          error: error.message
        };
      }

      return {
        success: true,
        deletedCount: data || 0
      };
    } catch (error) {
      console.error('Cleanup service error:', error);
      return {
        success: false,
        deletedCount: 0,
        error: error instanceof Error ? error.message : 'Unknown cleanup error'
      };
    }
  }

  /**
   * Get storage usage statistics for room-enhancer-images bucket
   */
  static async getStorageStats(): Promise<{
    success: boolean;
    totalFiles: number;
    totalSize: number;
    oldFiles: number;
    error?: string;
  }> {
    try {
      const { data: files, error } = await supabase.storage
        .from('room-enhancer-images')
        .list();

      if (error) {
        return {
          success: false,
          totalFiles: 0,
          totalSize: 0,
          oldFiles: 0,
          error: error.message
        };
      }

      const now = new Date();
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      
      let totalSize = 0;
      let oldFiles = 0;

      files?.forEach(file => {
        totalSize += file.metadata?.size || 0;
        const fileDate = new Date(file.created_at || '');
        if (fileDate < oneDayAgo) {
          oldFiles++;
        }
      });

      return {
        success: true,
        totalFiles: files?.length || 0,
        totalSize,
        oldFiles
      };
    } catch (error) {
      return {
        success: false,
        totalFiles: 0,
        totalSize: 0,
        oldFiles: 0,
        error: error instanceof Error ? error.message : 'Unknown stats error'
      };
    }
  }

  /**
   * Auto cleanup that runs when the app starts
   * Cleans files older than 48 hours to prevent storage bloat
   */
  static async autoCleanup(): Promise<void> {
    try {
      // Only cleanup very old files (48+ hours) on app start
      const result = await this.cleanupOldImages(48);
      
      if (result.success && result.deletedCount > 0) {
        console.log(`Auto cleanup: Removed ${result.deletedCount} old images`);
      }
    } catch (error) {
      console.warn('Auto cleanup failed:', error);
      // Don't throw error - this is background cleanup
    }
  }

  /**
   * Format file size in human readable format
   */
  static formatFileSize(bytes: number): string {
    if (bytes === 0) return '0 Bytes';
    
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }
}

// Auto cleanup on service import (when app starts)
CleanupService.autoCleanup();