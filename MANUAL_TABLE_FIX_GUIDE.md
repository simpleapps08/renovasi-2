# Manual Table Structure Fix Guide

## Diagnosis Results

Based on the table structure check:

✅ **user_profiles table**: Uses `id` column (correct)
✅ **user_roles table**: Working properly with 5 roles
❌ **Foreign key constraint**: `user_profiles_id_fkey` exists but causes violations
❌ **Role names**: Missing in user_roles (showing as undefined)

## Issues Found

1. **Foreign Key Constraint Issue**: The `user_profiles_id_fkey` constraint requires the `id` to exist in `auth.users` table
2. **Missing Role Names**: user_roles table has `role_level` but missing `name` column or data
3. **Table Structure**: user_profiles already has correct `id` column structure

## Manual Fix Steps

### Step 1: Fix user_roles table (Safe approach for existing data)

Go to **Supabase Dashboard > SQL Editor** and run the contents of `scripts/fix-user-roles-safe.sql`:

```sql
-- Safe fix - only updates empty role_name values to avoid duplicates
UPDATE public.user_roles 
SET role_name = 'user' 
WHERE role_level = 1 AND (role_name IS NULL OR role_name = '');

UPDATE public.user_roles 
SET role_name = 'premium' 
WHERE role_level = 2 AND (role_name IS NULL OR role_name = '');

UPDATE public.user_roles 
SET role_name = 'moderator' 
WHERE role_level = 3 AND (role_name IS NULL OR role_name = '');

UPDATE public.user_roles 
SET role_name = 'admin' 
WHERE role_level = 4 AND (role_name IS NULL OR role_name = '');

UPDATE public.user_roles 
SET role_name = 'super_admin' 
WHERE role_level = 5 AND (role_name IS NULL OR role_name = '');

-- Verify the results
SELECT id, role_name, role_level, description FROM public.user_roles ORDER BY role_level;
```

**Note**: If you get "duplicate key" errors, it means the role names already exist. Skip the UPDATE commands and proceed to Step 2.

### Step 2: Fix user_profiles table structure

```sql
-- Add missing columns if they don't exist
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES public.user_roles(id);
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Verify the structure
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'user_profiles' AND table_schema = 'public'
ORDER BY ordinal_position;
```

### Step 3: Create admin user properly

```sql
-- First, create an auth user in Supabase Dashboard > Authentication > Users
-- Then run this SQL with the actual user ID:

-- Get admin role ID
SELECT id FROM public.user_roles WHERE role_level = 4; -- This will be your admin role_id

-- Insert admin profile (replace USER_ID_HERE with actual auth user ID)
INSERT INTO public.user_profiles (id, full_name, role_id, created_at, updated_at)
VALUES (
  'USER_ID_HERE', -- Replace with actual auth.users ID
  'Admin User',
  (SELECT id FROM public.user_roles WHERE role_level = 4),
  NOW(),
  NOW()
);
```

### Step 4: Test the fix

Run this verification script:

```bash
node scripts/check-table-structure.js
```

## Alternative: Create Auth User First

If you need to create the admin user:

1. **Go to Supabase Dashboard > Authentication > Users**
2. **Click "Add User"**
3. **Enter**: 
   - Email: `admin@servisoo.com`
   - Password: `Admin123!`
   - Email Confirm: `true`
4. **Copy the User ID** from the created user
5. **Run Step 3 SQL** with the actual User ID

## Expected Results

After completing these steps:
- ✅ user_roles will have proper role names
- ✅ user_profiles will have all required columns
- ✅ Admin user will be created with proper role assignment
- ✅ Foreign key constraints will work properly

## Troubleshooting

If you still get foreign key errors:
1. Verify the auth user exists in Supabase Dashboard
2. Check that the User ID matches exactly
3. Ensure RLS policies allow the operation

## Next Steps

After manual fix:
1. Run `node scripts/simple-table-check.js` to verify
2. Test admin login functionality
3. Verify user management features work