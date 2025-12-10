-- EMERGENCY FIX: Complete RLS reset for profiles table
-- This will completely remove all policies and start fresh

-- Step 1: Disable RLS completely
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL policies (brute force approach)
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;
DROP POLICY IF EXISTS "Enable read access for all users" ON profiles;
DROP POLICY IF EXISTS "Enable insert for authenticated users only" ON profiles;
DROP POLICY IF EXISTS "Enable update for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "Enable delete for users based on user_id" ON profiles;
DROP POLICY IF EXISTS "profiles_select_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_insert_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_update_policy" ON profiles;
DROP POLICY IF EXISTS "profiles_delete_policy" ON profiles;
DROP POLICY IF EXISTS "allow_own_profile_select" ON profiles;
DROP POLICY IF EXISTS "allow_own_profile_insert" ON profiles;
DROP POLICY IF EXISTS "allow_own_profile_update" ON profiles;
DROP POLICY IF EXISTS "allow_own_profile_delete" ON profiles;

-- Step 3: Grant basic permissions first (before enabling RLS)
GRANT ALL ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;

-- Step 4: Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Create ONE simple policy for each operation
CREATE POLICY "profiles_select" ON profiles
    FOR SELECT 
    TO authenticated
    USING (user_id = auth.uid());

CREATE POLICY "profiles_insert" ON profiles
    FOR INSERT 
    TO authenticated
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "profiles_update" ON profiles
    FOR UPDATE 
    TO authenticated
    USING (user_id = auth.uid())
    WITH CHECK (user_id = auth.uid());

CREATE POLICY "profiles_delete" ON profiles
    FOR DELETE 
    TO authenticated
    USING (user_id = auth.uid());

-- Step 6: Create handle_new_user function (simple version)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
LANGUAGE plpgsql 
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO public.profiles (
    user_id, 
    nama, 
    email, 
    lokasi, 
    role, 
    saldo_deposit,
    created_at,
    updated_at
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'nama', NEW.raw_user_meta_data->>'full_name', ''),
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'lokasi', ''),
    'user',
    0,
    NOW(),
    NOW()
  );
  RETURN NEW;
END;
$$;

-- Step 7: Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Step 8: Create updated_at function and trigger
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger 
LANGUAGE plpgsql
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();