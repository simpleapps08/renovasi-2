-- Enable the storage extension if not already enabled
create extension if not exists "storage" schema "extensions";

-- Create the bucket 'room-enhancer-images' if it doesn't exist
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values (
  'room-enhancer-images',
  'room-enhancer-images',
  true,
  10485760, -- 10MB
  '{image/png,image/jpeg,image/jpg,image/webp}'
)
on conflict (id) do update set
  public = true,
  file_size_limit = 10485760,
  allowed_mime_types = '{image/png,image/jpeg,image/jpg,image/webp}';

-- Set up RLS policies for the bucket
-- Allow public read access
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'room-enhancer-images' );

-- Allow authenticated and anon users to upload (for demo purposes)
create policy "Allow Uploads"
  on storage.objects for insert
  with check ( bucket_id = 'room-enhancer-images' );

-- Create the cleanup function
create or replace function public.manual_cleanup_room_enhancer_images()
returns void
language plpgsql
security definer
as $$
begin
  -- Delete objects older than 24 hours
  delete from storage.objects
  where bucket_id = 'room-enhancer-images'
  and created_at < now() - interval '24 hours';
end;
$$;
