-- SQL script for auto-cleanup of temporary images in Room Enhancer
-- Run this in Supabase SQL Editor after setting up the bucket

-- Create function to delete old images (older than 24 hours)
CREATE OR REPLACE FUNCTION cleanup_old_room_enhancer_images()
RETURNS void
LANGUAGE plpgsql
AS $$
BEGIN
  -- Delete images older than 24 hours from room-enhancer-images bucket
  DELETE FROM storage.objects 
  WHERE bucket_id = 'room-enhancer-images' 
    AND created_at < NOW() - INTERVAL '24 hours';
  
  -- Log cleanup activity
  RAISE NOTICE 'Cleaned up old room enhancer images older than 24 hours';
END;
$$;

-- Create a scheduled job to run cleanup every 6 hours
-- Note: This requires pg_cron extension to be enabled
-- Enable pg_cron in Supabase Dashboard > Database > Extensions

-- Schedule cleanup job (uncomment after enabling pg_cron)
-- SELECT cron.schedule(
--   'cleanup-room-enhancer-images',
--   '0 */6 * * *', -- Every 6 hours
--   'SELECT cleanup_old_room_enhancer_images();'
-- );

-- Alternative: Create a trigger-based cleanup for immediate cleanup of very old files
CREATE OR REPLACE FUNCTION trigger_cleanup_old_images()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  -- Clean up files older than 48 hours when new files are uploaded
  DELETE FROM storage.objects 
  WHERE bucket_id = 'room-enhancer-images' 
    AND created_at < NOW() - INTERVAL '48 hours'
    AND id != NEW.id; -- Don't delete the newly inserted file
  
  RETURN NEW;
END;
$$;

-- Create trigger that runs cleanup on new uploads
DROP TRIGGER IF EXISTS trigger_cleanup_on_upload ON storage.objects;
CREATE TRIGGER trigger_cleanup_on_upload
  AFTER INSERT ON storage.objects
  FOR EACH ROW
  WHEN (NEW.bucket_id = 'room-enhancer-images')
  EXECUTE FUNCTION trigger_cleanup_old_images();

-- Manual cleanup function (can be called anytime)
CREATE OR REPLACE FUNCTION manual_cleanup_room_enhancer_images(hours_old INTEGER DEFAULT 24)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
DECLARE
  deleted_count INTEGER;
BEGIN
  -- Delete images older than specified hours
  DELETE FROM storage.objects 
  WHERE bucket_id = 'room-enhancer-images' 
    AND created_at < NOW() - (hours_old || ' hours')::INTERVAL;
  
  GET DIAGNOSTICS deleted_count = ROW_COUNT;
  
  RAISE NOTICE 'Deleted % old room enhancer images', deleted_count;
  RETURN deleted_count;
END;
$$;

-- Usage examples:
-- SELECT manual_cleanup_room_enhancer_images(); -- Clean files older than 24 hours
-- SELECT manual_cleanup_room_enhancer_images(1); -- Clean files older than 1 hour
-- SELECT manual_cleanup_room_enhancer_images(168); -- Clean files older than 1 week