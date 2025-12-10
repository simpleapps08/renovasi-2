-- Setup Supabase Storage bucket untuk gambar galeri
-- Jalankan script ini di Supabase SQL Editor

-- 1. Buat storage bucket untuk gambar galeri
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'gallery-images',
  'gallery-images', 
  true,
  5242880, -- 5MB limit
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
)
ON CONFLICT (id) DO NOTHING;

-- 2. Update tabel gallery untuk mendukung field tambahan
ALTER TABLE gallery 
ADD COLUMN IF NOT EXISTS title VARCHAR(255),
ADD COLUMN IF NOT EXISTS description TEXT,
ADD COLUMN IF NOT EXISTS category VARCHAR(100),
ADD COLUMN IF NOT EXISTS tags TEXT[],
ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'active',
ADD COLUMN IF NOT EXISTS views INTEGER DEFAULT 0;

-- 3. Set up RLS (Row Level Security) policies untuk bucket
CREATE POLICY "Allow public read access on gallery images" ON storage.objects
FOR SELECT USING (bucket_id = 'gallery-images');

CREATE POLICY "Allow authenticated users to upload gallery images" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'gallery-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to update their gallery images" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'gallery-images' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated users to delete gallery images" ON storage.objects
FOR DELETE USING (
  bucket_id = 'gallery-images' 
  AND auth.role() = 'authenticated'
);

-- 4. Enable RLS pada bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 5. Buat index untuk performa yang lebih baik
CREATE INDEX IF NOT EXISTS idx_gallery_category ON gallery(category);
CREATE INDEX IF NOT EXISTS idx_gallery_status ON gallery(status);
CREATE INDEX IF NOT EXISTS idx_gallery_created_at ON gallery(created_at);

-- 6. Buat function untuk generate URL gambar
CREATE OR REPLACE FUNCTION get_gallery_image_url(image_path TEXT)
RETURNS TEXT AS $$
BEGIN
  RETURN 'https://tkqvozgorpapofejphyn.supabase.co/storage/v1/object/public/gallery-images/' || image_path;
END;
$$ LANGUAGE plpgsql;

-- 7. Update existing records jika ada
UPDATE gallery 
SET 
  title = COALESCE(caption, 'Untitled'),
  description = caption,
  category = 'general',
  status = 'active',
  views = 0
WHERE title IS NULL;

COMMIT;