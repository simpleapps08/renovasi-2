-- SQL script to create storage bucket for Room Enhancer
-- Run this in Supabase SQL Editor

-- Create storage bucket for room enhancer images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'room-enhancer-images',
  'room-enhancer-images', 
  true,
  10485760, -- 10MB in bytes
  ARRAY['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Create RLS policy for public read access
CREATE POLICY "Public read access for room enhancer images" ON storage.objects
FOR SELECT USING (bucket_id = 'room-enhancer-images');

-- Create RLS policy for authenticated upload
CREATE POLICY "Authenticated upload for room enhancer images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'room-enhancer-images');

-- Create RLS policy for authenticated delete
CREATE POLICY "Authenticated delete for room enhancer images" ON storage.objects
FOR DELETE USING (bucket_id = 'room-enhancer-images');

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;