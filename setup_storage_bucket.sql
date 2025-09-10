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

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read access for room enhancer images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload for room enhancer images" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated delete for room enhancer images" ON storage.objects;
DROP POLICY IF EXISTS "Public upload for room enhancer images" ON storage.objects;
DROP POLICY IF EXISTS "Public delete for room enhancer images" ON storage.objects;

-- Create RLS policy for public read access (anyone can read)
CREATE POLICY "Public read access for room enhancer images" ON storage.objects
FOR SELECT USING (bucket_id = 'room-enhancer-images');

-- Create RLS policy for public upload (anyone can upload)
CREATE POLICY "Public upload for room enhancer images" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'room-enhancer-images');

-- Create RLS policy for public delete (anyone can delete)
CREATE POLICY "Public delete for room enhancer images" ON storage.objects
FOR DELETE USING (bucket_id = 'room-enhancer-images');

-- Create RLS policy for public update (anyone can update)
CREATE POLICY "Public update for room enhancer images" ON storage.objects
FOR UPDATE USING (bucket_id = 'room-enhancer-images');

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;