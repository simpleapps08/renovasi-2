-- Safe fix for user_roles table - handles existing data
-- This script checks existing data before making changes

-- Step 1: Check current state
SELECT 'Current user_roles data:' as info;
SELECT id, role_name, role_level, description FROM public.user_roles ORDER BY role_level;

-- Step 2: Only update empty/null role_name values
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

-- Step 3: Add missing roles if they don't exist
INSERT INTO public.user_roles (role_name, role_level, permissions, description, is_active, created_at, updated_at)
SELECT 'user', 1, '{}', 'Regular user with basic access', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role_level = 1);

INSERT INTO public.user_roles (role_name, role_level, permissions, description, is_active, created_at, updated_at)
SELECT 'premium', 2, '{}', 'Premium user with extended access', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role_level = 2);

INSERT INTO public.user_roles (role_name, role_level, permissions, description, is_active, created_at, updated_at)
SELECT 'moderator', 3, '{}', 'Moderator with content management access', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role_level = 3);

INSERT INTO public.user_roles (role_name, role_level, permissions, description, is_active, created_at, updated_at)
SELECT 'admin', 4, '{}', 'Administrator with full system access', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role_level = 4);

INSERT INTO public.user_roles (role_name, role_level, permissions, description, is_active, created_at, updated_at)
SELECT 'super_admin', 5, '{}', 'Super administrator with complete control', true, NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM public.user_roles WHERE role_level = 5);

-- Step 4: Verify final state
SELECT 'Final user_roles data:' as info;
SELECT id, role_name, role_level, description, is_active FROM public.user_roles ORDER BY role_level;