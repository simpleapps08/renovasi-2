-- Add full_name column to user_profiles table
-- This is needed for the admin user management functionality

ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS full_name VARCHAR(255);

-- Create index for full_name for better search performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_full_name ON public.user_profiles(full_name);

-- Update existing records to use full_name from auth.users metadata if available
-- This is optional and can be run manually if needed
/*
UPDATE public.user_profiles 
SET full_name = COALESCE(
  (auth_users.raw_user_meta_data->>'full_name')::text,
  (auth_users.raw_user_meta_data->>'name')::text,
  split_part(auth_users.email, '@', 1)
)
FROM auth.users auth_users
WHERE user_profiles.user_id = auth_users.id
AND user_profiles.full_name IS NULL;
*/