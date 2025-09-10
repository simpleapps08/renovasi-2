import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Trash2, HardDrive, Clock, RefreshCw } from 'lucide-react';
import { storageService } from '@/services/storageService';
import { toast } from 'sonner';

interface StorageStats {
  success: boolean;
  totalFiles: number;
  totalSize: number;
  oldFiles: number;
  formattedSize: string;
  error?: string;
}

const StorageManager: React.FC = () => {
  const [stats, setStats] = useState<StorageStats | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [lastCleanup, setLastCleanup] = useState<Date | null>(null);

  const loadStats = async () => {
    setIsLoading(true);
    try {
      const result = await storageService.getDetailedStorageStats();
      setStats(result);
      
      if (!result.success && result.error) {
        toast.error(`Error loading storage stats: ${result.error}`);
      }
    } catch (error) {
      toast.error('Failed to load storage statistics');
      console.error('Storage stats error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCleanup = async (hoursOld: number = 24) => {
    setIsCleaningUp(true);
    try {
      const result = await storageService.cleanupOldImages(hoursOld);
      
      if (result.success) {
        toast.success(`Cleanup completed! Deleted ${result.deletedCount} old images`);
        setLastCleanup(new Date());
        // Reload stats after cleanup
        await loadStats();
      } else {
        toast.error(`Cleanup failed: ${result.error}`);
      }
    } catch (error) {
      toast.error('Cleanup operation failed');
      console.error('Cleanup error:', error);
    } finally {
      setIsCleaningUp(false);
    }
  };

  const handleAutoCleanup = async () => {
    setIsCleaningUp(true);
    try {
      await storageService.performAutoCleanup();
      toast.success('Auto cleanup completed');
      setLastCleanup(new Date());
      await loadStats();
    } catch (error) {
      toast.error('Auto cleanup failed');
      console.error('Auto cleanup error:', error);
    } finally {
      setIsCleaningUp(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const getStorageUsagePercentage = () => {
    if (!stats || !stats.success) return 0;
    // Assume 100MB as reasonable limit for demo
    const limitBytes = 100 * 1024 * 1024; // 100MB
    return Math.min((stats.totalSize / limitBytes) * 100, 100);
  };

  const getUsageColor = (percentage: number) => {
    if (percentage < 50) return 'bg-green-500';
    if (percentage < 80) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <Card className="mt-8">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <HardDrive className="h-5 w-5" />
          Storage Management
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Storage Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Total Files</span>
              <Badge variant="secondary">
                {isLoading ? '...' : stats?.totalFiles || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Storage Used</span>
              <Badge variant="secondary">
                {isLoading ? '...' : stats?.formattedSize || '0 Bytes'}
              </Badge>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Old Files (24h+)</span>
              <Badge variant={stats?.oldFiles && stats.oldFiles > 0 ? 'destructive' : 'secondary'}>
                {isLoading ? '...' : stats?.oldFiles || 0}
              </Badge>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Last Cleanup</span>
              <span className="text-xs text-muted-foreground">
                {lastCleanup ? lastCleanup.toLocaleTimeString() : 'Never'}
              </span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Usage</span>
              <span className="text-xs text-muted-foreground">
                {getStorageUsagePercentage().toFixed(1)}%
              </span>
            </div>
            <Progress 
              value={getStorageUsagePercentage()} 
              className="h-2"
            />
          </div>
        </div>

        {/* Cleanup Controls */}
        <div className="flex flex-wrap gap-2 pt-4 border-t">
          <Button
            onClick={() => handleCleanup(1)}
            disabled={isCleaningUp || isLoading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Trash2 className="h-4 w-4" />
            Clean 1h+ old
          </Button>
          
          <Button
            onClick={() => handleCleanup(24)}
            disabled={isCleaningUp || isLoading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Clock className="h-4 w-4" />
            Clean 24h+ old
          </Button>
          
          <Button
            onClick={handleAutoCleanup}
            disabled={isCleaningUp || isLoading}
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isCleaningUp ? 'animate-spin' : ''}`} />
            Auto Cleanup
          </Button>
          
          <Button
            onClick={loadStats}
            disabled={isLoading}
            variant="ghost"
            size="sm"
            className="flex items-center gap-2"
          >
            <RefreshCw className={`h-4 w-4 ${isLoading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

        {/* Warning for high usage */}
        {stats && stats.success && getStorageUsagePercentage() > 80 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
            <div className="flex items-center gap-2 text-yellow-800">
              <HardDrive className="h-4 w-4" />
              <span className="text-sm font-medium">Storage Warning</span>
            </div>
            <p className="text-sm text-yellow-700 mt-1">
              Storage usage is high. Consider running cleanup to free up space.
            </p>
          </div>
        )}

        {/* Info about auto cleanup */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
          <div className="flex items-center gap-2 text-blue-800">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-medium">Auto Cleanup Info</span>
          </div>
          <p className="text-sm text-blue-700 mt-1">
            Images are automatically marked as temporary and cleaned up after 24-48 hours to prevent storage bloat.
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default StorageManager;