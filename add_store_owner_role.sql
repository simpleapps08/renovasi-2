-- Add store_owner role to profiles table constraint

-- Drop existing constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_role_check;
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS user_profiles_role_check;

-- Add new constraint with store_owner included
ALTER TABLE profiles ADD CONSTRAINT profiles_role_check 
  CHECK (role IN ('user', 'admin', 'super_admin', 'store_owner', 'admin_toko'));

-- Verify constraint
SELECT conname, consrc 
FROM pg_constraint 
WHERE conrelid = 'profiles'::regclass 
AND contype = 'c';