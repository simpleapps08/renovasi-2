-- Migration: Modify user_profiles table for role integration
-- Created: 2025-01-21
-- Description: Adds role_id column to user_profiles and creates necessary relationships

-- Add role_id column to user_profiles if it doesn't exist
ALTER TABLE public.user_profiles 
ADD COLUMN IF NOT EXISTS role_id UUID REFERENCES public.user_roles(id) ON DELETE SET NULL;

-- Add index for role_id for better performance
CREATE INDEX IF NOT EXISTS idx_user_profiles_role_id ON public.user_profiles(role_id);

-- Set default role for existing users (if any) to 'user' role
UPDATE public.user_profiles 
SET role_id = (
    SELECT id FROM public.user_roles WHERE role_name = 'user' LIMIT 1
)
WHERE role_id IS NULL;

-- Create or replace function to automatically assign default role to new users
CREATE OR REPLACE FUNCTION assign_default_role()
RETURNS TRIGGER AS $$
BEGIN
    -- If no role_id is specified, assign default 'user' role
    IF NEW.role_id IS NULL THEN
        NEW.role_id := (
            SELECT id FROM public.user_roles 
            WHERE role_name = 'user' 
            LIMIT 1
        );
    END IF;
    
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to assign default role
DROP TRIGGER IF EXISTS assign_default_role_trigger ON public.user_profiles;
CREATE TRIGGER assign_default_role_trigger
    BEFORE INSERT ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION assign_default_role();

-- Create view for user management with role information
-- Note: email is stored in auth.users, not user_profiles
CREATE OR REPLACE VIEW public.user_management_view AS
SELECT 
    up.id,
    up.full_name,
    up.created_at,
    up.updated_at,
    ur.id as role_id,
    ur.role_name,
    ur.role_level,
    ur.permissions,
    ur.description as role_description
FROM public.user_profiles up
LEFT JOIN public.user_roles ur ON up.role_id = ur.id;

-- Grant access to the view
GRANT SELECT ON public.user_management_view TO authenticated;

-- Update RLS policies for user_profiles to work with roles
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.user_profiles;
DROP POLICY IF EXISTS "Admins can manage all profiles" ON public.user_profiles;

-- Create new RLS policies
CREATE POLICY "Users can view own profile" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Admins can view all profiles" ON public.user_profiles
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            JOIN public.user_roles ur ON up.role_id = ur.id
            WHERE up.id = auth.uid() AND ur.role_level <= 2
        )
    );

CREATE POLICY "Admins can manage all profiles" ON public.user_profiles
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.user_profiles up
            JOIN public.user_roles ur ON up.role_id = ur.id
            WHERE up.id = auth.uid() AND ur.role_level <= 2
        )
    );

COMMIT;