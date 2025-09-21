-- Migration: Create admin user
-- Created: 2025-01-21
-- Description: Creates admin user with email admin@servisoo and assigns admin role

-- First, we need to create the admin user in auth.users
-- Note: This requires special handling as we can't directly insert into auth.users
-- We'll create a function to handle this

CREATE OR REPLACE FUNCTION create_admin_user()
RETURNS void AS $$
DECLARE
    admin_user_id UUID;
    admin_role_id UUID;
BEGIN
    -- Get admin role ID
    SELECT id INTO admin_role_id 
    FROM public.user_roles 
    WHERE role_name = 'admin' 
    LIMIT 1;
    
    IF admin_role_id IS NULL THEN
        RAISE EXCEPTION 'Admin role not found. Please run user_roles migration first.';
    END IF;
    
    -- Generate a UUID for the admin user
    admin_user_id := gen_random_uuid();
    
    -- Insert into user_profiles (this will be the main way to create the admin)
    INSERT INTO public.user_profiles (
        id,
        email,
        full_name,
        role_id,
        created_at,
        updated_at
    ) VALUES (
        admin_user_id,
        'admin@servisoo',
        'System Administrator',
        admin_role_id,
        NOW(),
        NOW()
    )
    ON CONFLICT (email) DO UPDATE SET
        role_id = admin_role_id,
        full_name = 'System Administrator',
        updated_at = NOW();
    
    RAISE NOTICE 'Admin user created/updated successfully with ID: %', admin_user_id;
END;
$$ LANGUAGE plpgsql;

-- Execute the function to create admin user
SELECT create_admin_user();

-- Create a function to check if user has admin privileges
CREATE OR REPLACE FUNCTION is_admin(user_id UUID DEFAULT auth.uid())
RETURNS boolean AS $$
BEGIN
    RETURN EXISTS (
        SELECT 1 
        FROM public.user_profiles up
        JOIN public.user_roles ur ON up.role_id = ur.id
        WHERE up.id = user_id AND ur.role_level <= 2
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create a function to get user role info
CREATE OR REPLACE FUNCTION get_user_role(user_id UUID DEFAULT auth.uid())
RETURNS TABLE(
    role_name VARCHAR(50),
    role_level INTEGER,
    permissions JSONB
) AS $$
BEGIN
    RETURN QUERY
    SELECT ur.role_name, ur.role_level, ur.permissions
    FROM public.user_profiles up
    JOIN public.user_roles ur ON up.role_id = ur.id
    WHERE up.id = user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Grant execute permissions on functions
GRANT EXECUTE ON FUNCTION is_admin(UUID) TO authenticated;
GRANT EXECUTE ON FUNCTION get_user_role(UUID) TO authenticated;

-- Create a function to promote user to admin (only for super_admin)
CREATE OR REPLACE FUNCTION promote_to_admin(target_email TEXT)
RETURNS void AS $$
DECLARE
    admin_role_id UUID;
    current_user_level INTEGER;
BEGIN
    -- Check if current user is super_admin
    SELECT ur.role_level INTO current_user_level
    FROM public.user_profiles up
    JOIN public.user_roles ur ON up.role_id = ur.id
    WHERE up.id = auth.uid();
    
    IF current_user_level IS NULL OR current_user_level > 1 THEN
        RAISE EXCEPTION 'Only super_admin can promote users to admin';
    END IF;
    
    -- Get admin role ID
    SELECT id INTO admin_role_id 
    FROM public.user_roles 
    WHERE role_name = 'admin';
    
    -- Update user role
    UPDATE public.user_profiles 
    SET role_id = admin_role_id, updated_at = NOW()
    WHERE email = target_email;
    
    IF NOT FOUND THEN
        RAISE EXCEPTION 'User with email % not found', target_email;
    END IF;
    
    RAISE NOTICE 'User % promoted to admin successfully', target_email;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

GRANT EXECUTE ON FUNCTION promote_to_admin(TEXT) TO authenticated;

COMMIT;