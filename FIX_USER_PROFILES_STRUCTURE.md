# Fix User Profiles Table Structure

## 🚨 Problem Analysis

Berdasarkan error yang terjadi:
```
ERROR: 23502: null value in column "user_id" of relation "user_profiles" violates not-null constraint
```

Masalah:
1. Tabel `user_profiles` memiliki kolom `user_id` dengan constraint NOT NULL
2. Kita mencoba insert dengan kolom `id`, bukan `user_id`
3. Ada kemungkinan tabel memiliki struktur yang salah

## 🔍 Step 1: Check Table Structure

Jalankan SQL berikut di **Supabase Dashboard → SQL Editor** untuk melihat struktur tabel:

```sql
-- Check table structure
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

## 🔧 Step 2: Fix Table Structure

### Option A: If table has wrong structure, recreate it

```sql
-- Drop existing table (CAREFUL: This will delete all data)
DROP TABLE IF EXISTS public.user_profiles CASCADE;

-- Create correct table structure
CREATE TABLE public.user_profiles (
    id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
    full_name TEXT,
    role_id UUID REFERENCES public.user_roles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            JOIN public.user_roles ur ON up.role_id = ur.id
            WHERE up.id = auth.uid() AND ur.role_name IN ('admin', 'super_admin')
        )
    );

CREATE POLICY "Admins can manage all profiles" ON public.user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            JOIN public.user_roles ur ON up.role_id = ur.id
            WHERE up.id = auth.uid() AND ur.role_name IN ('admin', 'super_admin')
        )
    );

-- Grant permissions
GRANT ALL ON public.user_profiles TO authenticated;
GRANT SELECT ON public.user_profiles TO anon;
```

### Option B: If table has user_id column, rename it to id

```sql
-- Rename user_id column to id (if user_id exists)
ALTER TABLE public.user_profiles RENAME COLUMN user_id TO id;

-- Update primary key constraint
ALTER TABLE public.user_profiles DROP CONSTRAINT IF EXISTS user_profiles_pkey;
ALTER TABLE public.user_profiles ADD PRIMARY KEY (id);

-- Add foreign key constraint to auth.users
ALTER TABLE public.user_profiles 
ADD CONSTRAINT user_profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
```

### Option C: If both id and user_id exist, remove user_id

```sql
-- Drop user_id column if it exists alongside id
ALTER TABLE public.user_profiles DROP COLUMN IF EXISTS user_id;
```

## 🧪 Step 3: Test the Fix

Setelah memperbaiki struktur tabel, test dengan:

```sql
-- Test insert (replace with actual auth user ID)
INSERT INTO public.user_profiles (
    id,
    full_name,
    role_id
) 
SELECT 
    'YOUR_AUTH_USER_ID_HERE',  -- Replace with actual user ID
    'Test User',
    ur.id
FROM public.user_roles ur 
WHERE ur.role_name = 'user'
LIMIT 1;
```

## 📋 Step 4: Create Admin User (After Fix)

1. **Create Auth User** (Supabase Dashboard → Authentication → Users):
   - Email: admin@servisoo
   - Password: (strong password)
   - Auto Confirm: ✅

2. **Create Admin Profile** (SQL Editor):
```sql
INSERT INTO public.user_profiles (
    id,
    full_name,
    role_id
) 
SELECT 
    'AUTH_USER_ID_FROM_STEP_1',  -- Replace with actual ID
    'System Administrator',
    ur.id
FROM public.user_roles ur 
WHERE ur.role_name = 'admin';
```

## ✅ Step 5: Verify

Run verification scripts:
```bash
node scripts/check-actual-table-structure.js
node scripts/create-admin-user-correct.js
```

---

**IMPORTANT:** Backup your data before running any DROP or ALTER commands!