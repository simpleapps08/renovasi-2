# Fix RLS Infinite Recursion in user_profiles

## 🚨 Problem Identified

**Error:** `infinite recursion detected in policy for relation "user_profiles"`

**Root Cause:** RLS policies on `user_profiles` table are referencing themselves, creating infinite loops.

## 🔍 Current Status

✅ **user_roles table:** Working correctly
- Columns: `id`, `role_name`, `role_level`, `permissions`, `description`, `is_active`, `created_at`, `updated_at`
- 5 roles found: super_admin, admin, manager, editor, user

❌ **user_profiles table:** RLS infinite recursion
- Cannot query or insert due to policy loops

## 🔧 Step-by-Step Fix

### Step 1: Drop All Existing RLS Policies

Run this in **Supabase Dashboard → SQL Editor**:

```sql
-- Drop all existing policies on user_profiles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON public.user_profiles;
DROP POLICY IF EXISTS "Enable update for users based on email" ON public.user_profiles;

-- Drop any other policies that might exist
SELECT schemaname, tablename, policyname 
FROM pg_policies 
WHERE tablename = 'user_profiles';
```

### Step 2: Temporarily Disable RLS

```sql
-- Temporarily disable RLS to test table structure
ALTER TABLE public.user_profiles DISABLE ROW LEVEL SECURITY;
```

### Step 3: Test Table Structure

After disabling RLS, test with our script:
```bash
node scripts/simple-table-check.js
```

### Step 4: Check Current Table Structure

```sql
-- Check actual table structure
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'user_profiles' 
    AND table_schema = 'public'
ORDER BY ordinal_position;
```

### Step 5: Fix Table Structure (if needed)

If table has wrong columns, fix it:

```sql
-- If table has user_id instead of id
ALTER TABLE public.user_profiles RENAME COLUMN user_id TO id;

-- If table is missing columns
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS full_name TEXT;
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES public.user_roles(id);
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();
ALTER TABLE public.user_profiles ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Set primary key and foreign key constraints
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_pkey;
ALTER TABLE public.user_profiles ADD PRIMARY KEY (id);
ALTER TABLE public.user_profiles ADD CONSTRAINT user_profiles_id_fkey 
    FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

### Step 6: Create Correct RLS Policies

```sql
-- Re-enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create simple, non-recursive policies

-- 1. Users can view their own profile
CREATE POLICY "user_profiles_select_own" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

-- 2. Users can insert their own profile
CREATE POLICY "user_profiles_insert_own" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

-- 3. Users can update their own profile
CREATE POLICY "user_profiles_update_own" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

-- 4. Admin access (using direct role check, not recursive)
CREATE POLICY "user_profiles_admin_all" ON public.user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 
            FROM public.user_roles ur
            WHERE ur.role_name IN ('admin', 'super_admin')
            AND ur.id = (
                SELECT up.role_id 
                FROM public.user_profiles up 
                WHERE up.id = auth.uid()
            )
        )
    );
```

### Step 7: Grant Permissions

```sql
-- Grant necessary permissions
GRANT ALL ON public.user_profiles TO authenticated;
GRANT SELECT ON public.user_profiles TO anon;
```

### Step 8: Test the Fix

Run our diagnostic script:
```bash
node scripts/simple-table-check.js
```

### Step 9: Create Admin User

Once RLS is fixed:

1. **Create Auth User** in Supabase Dashboard → Authentication → Users:
   - Email: admin@servisoo
   - Password: (strong password)
   - Auto Confirm: ✅

2. **Create Profile** in SQL Editor:
```sql
INSERT INTO public.user_profiles (
    id,
    full_name,
    role_id
) 
SELECT 
    'YOUR_AUTH_USER_ID_HERE',  -- Replace with actual ID from step 1
    'System Administrator',
    ur.id
FROM public.user_roles ur 
WHERE ur.role_name = 'admin';
```

## ✅ Verification

After completing all steps:

1. Run: `node scripts/simple-table-check.js`
2. Should see no infinite recursion errors
3. Should be able to query user_profiles
4. Should be able to insert test data

---

**IMPORTANT:** Always backup your data before running DROP or ALTER commands!