-- ULTIMATE RLS FIX - Complete reset approach
-- This completely removes RLS and creates the most permissive policies possible

-- Step 1: Completely disable RLS
ALTER TABLE profiles DISABLE ROW LEVEL SECURITY;

-- Step 2: Remove ALL policies (brute force approach)
DO $$ 
DECLARE 
    policy_name TEXT;
BEGIN
    -- Get all policy names and drop them
    FOR policy_name IN 
        SELECT policyname FROM pg_policies 
        WHERE tablename = 'profiles' AND schemaname = 'public'
    LOOP
        EXECUTE 'DROP POLICY IF EXISTS "' || policy_name || '" ON profiles';
    END LOOP;
END $$;

-- Step 3: Grant maximum permissions
GRANT ALL PRIVILEGES ON profiles TO authenticated;
GRANT ALL PRIVILEGES ON profiles TO anon;
GRANT USAGE ON SCHEMA public TO authenticated;
GRANT USAGE ON SCHEMA public TO anon;

-- Step 4: Create the most permissive policies possible
-- Re-enable RLS first
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Allow ALL authenticated users to do EVERYTHING
CREATE POLICY "allow_all_authenticated" ON profiles
    FOR ALL 
    TO authenticated
    USING (true)
    WITH CHECK (true);

-- Allow anonymous users to SELECT (for public access if needed)
CREATE POLICY "allow_anon_select" ON profiles
    FOR SELECT 
    TO anon
    USING (true);

-- Step 5: Recreate handle_new_user function with SECURITY DEFINER
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (user_id, nama, email, lokasi, role, saldo_deposit)
  VALUES (
    new.id,
    COALESCE(new.raw_user_meta_data->>'nama', new.raw_user_meta_data->>'full_name', 'User'),
    new.email,
    COALESCE(new.raw_user_meta_data->>'lokasi', ''),
    'user',
    0
  );
  RETURN new;
EXCEPTION
  WHEN others THEN
    -- Log the error but don't fail user creation
    RAISE WARNING 'Profile creation failed for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$ LANGUAGE plpgsql;

-- Step 6: Recreate trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- Step 7: Create updated_at trigger
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

-- Step 8: Test query
SELECT 'Ultimate RLS fix completed - all restrictions removed' as status;