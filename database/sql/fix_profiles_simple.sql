-- Simple fix for infinite recursion in profiles table
-- This script completely resets RLS policies to avoid any recursion issues

-- Step 1: Disable RLS temporarily
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop ALL existing policies (this removes any problematic ones)
DO $$ 
DECLARE 
    policy_record RECORD;
BEGIN
    FOR policy_record IN 
        SELECT policyname FROM pg_policies WHERE tablename = 'profiles' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_record.policyname || '" ON profiles';
    END LOOP;
END $$;

-- Step 3: Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 4: Create very simple, non-recursive policies
-- Allow users to see their own profile
CREATE POLICY "allow_own_profile_select" ON profiles
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Allow users to insert their own profile
CREATE POLICY "allow_own_profile_insert" ON profiles
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Allow users to update their own profile
CREATE POLICY "allow_own_profile_update" ON profiles
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow users to delete their own profile
CREATE POLICY "allow_own_profile_delete" ON profiles
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Step 5: Grant necessary permissions
GRANT ALL ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;

-- Step 6: Ensure handle_new_user function exists and works
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nama, email, lokasi, role, saldo_deposit)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nama', new.raw_user_meta_data->>'full_name', ''),
    new.email,
    COALESCE(new.raw_user_meta_data->>'lokasi', ''),
    'user',
    0
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 7: Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 8: Create updated_at function and trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();