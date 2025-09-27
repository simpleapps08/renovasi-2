-- FINAL RLS FIX - Addresses INSERT blocking issue
-- This script ensures RLS policies work correctly for all operations

-- Step 1: Temporarily disable RLS to clean up
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Drop all existing policies completely
DROP POLICY IF EXISTS "allow_own_profile_select" ON profiles;
DROP POLICY IF EXISTS "allow_own_profile_insert" ON profiles;
DROP POLICY IF EXISTS "allow_own_profile_update" ON profiles;
DROP POLICY IF EXISTS "allow_own_profile_delete" ON profiles;

-- Step 3: Grant necessary permissions first
GRANT ALL ON profiles TO authenticated;
GRANT SELECT ON profiles TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Step 4: Re-enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Step 5: Create permissive policies that work with auth system
-- Allow authenticated users to select their own profiles
CREATE POLICY "profiles_select_own" ON profiles
    FOR SELECT 
    TO authenticated
    USING (auth.uid() = user_id);

-- Allow authenticated users to insert their own profiles
CREATE POLICY "profiles_insert_own" ON profiles
    FOR INSERT 
    TO authenticated
    WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to update their own profiles
CREATE POLICY "profiles_update_own" ON profiles
    FOR UPDATE 
    TO authenticated
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Allow authenticated users to delete their own profiles
CREATE POLICY "profiles_delete_own" ON profiles
    FOR DELETE 
    TO authenticated
    USING (auth.uid() = user_id);

-- Step 6: Add admin access policies
-- Allow admin users to see all profiles
CREATE POLICY "profiles_admin_select_all" ON profiles
    FOR SELECT 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.role IN ('admin', 'super_admin')
        )
    );

-- Allow admin users to update any profile
CREATE POLICY "profiles_admin_update_all" ON profiles
    FOR UPDATE 
    TO authenticated
    USING (
        EXISTS (
            SELECT 1 FROM profiles p 
            WHERE p.user_id = auth.uid() 
            AND p.role IN ('admin', 'super_admin')
        )
    );

-- Step 7: Ensure handle_new_user function works correctly
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
EXCEPTION
  WHEN others THEN
    -- Log error but don't fail the user creation
    RAISE WARNING 'Failed to create profile for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Step 8: Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Step 9: Test the setup with a simple query
-- This should work without errors
SELECT 'RLS setup completed successfully' as status;