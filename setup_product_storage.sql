-- Setup storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
    'product-images',
    'product-images',
    true,
    5242880, -- 5MB limit
    ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Create storage policies for product images
-- Allow authenticated users to upload images
CREATE POLICY "Authenticated users can upload product images" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'product-images' AND
        auth.role() = 'authenticated'
    );

-- Allow public to view product images
CREATE POLICY "Public can view product images" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

-- Allow store owners to update their product images
CREATE POLICY "Store owners can update their product images" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'product-images' AND
        auth.role() = 'authenticated'
    );

-- Allow store owners to delete their product images
CREATE POLICY "Store owners can delete their product images" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'product-images' AND
        auth.role() = 'authenticated'
    );

-- Create function to generate unique filename
CREATE OR REPLACE FUNCTION generate_product_image_path(file_extension TEXT)
RETURNS TEXT AS $$
BEGIN
    RETURN 'products/' || auth.uid()::TEXT || '/' || gen_random_uuid()::TEXT || file_extension;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;