# Admin User Creation - Step by Step Guide

## Current Status ✅❌

✅ **Admin Role Ready**: Admin role exists with ID `a7d2adac-7c23-4086-9ec5-81e99ab6f871`
❌ **RLS Issue**: user_profiles table still has infinite recursion in RLS policy

## Required Steps (In Order)

### Step 1: Fix RLS Infinite Recursion ⚠️ **CRITICAL**

The user_profiles table cannot be accessed due to RLS infinite recursion. You MUST fix this first:

1. **Go to Supabase Dashboard** → SQL Editor
2. **Run the RLS fix SQL** from `FIX_RLS_INFINITE_RECURSION.md`:

```sql
-- Drop existing RLS policies that cause recursion
DROP POLICY IF EXISTS "Users can view own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON public.user_profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON public.user_profiles;

-- Create new, safe RLS policies
CREATE POLICY "Enable read access for users based on user_id" ON public.user_profiles
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Enable insert for authenticated users only" ON public.user_profiles
    FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY "Enable update for users based on user_id" ON public.user_profiles
    FOR UPDATE USING (auth.uid() = id);
```

### Step 2: Verify Table Access

After fixing RLS, run this script to verify:
```bash
node scripts/simple-table-check.js
```

### Step 3: Create Auth User in Supabase Dashboard

1. **Go to**: Supabase Dashboard → Authentication → Users
2. **Click**: "Add User"
3. **Fill in**:
   - Email: `admin@servisoo.com`
   - Password: `[Choose a secure password]`
   - Email Confirm: ✅ (checked)
4. **Click**: "Create User"
5. **Copy the User ID** from the created user (you'll need this)

### Step 4: Create Admin Profile via SQL

1. **Go to**: Supabase Dashboard → SQL Editor
2. **Paste and run** this SQL (replace `USER_ID_HERE` with actual ID):

```sql
-- Verify admin role exists
SELECT id, role_name, role_level FROM public.user_roles WHERE role_level = 4;

-- Insert admin profile (replace USER_ID_HERE with actual auth.users ID)
INSERT INTO public.user_profiles (id, full_name, role_id, created_at, updated_at)
VALUES (
  'USER_ID_HERE', -- Replace with actual auth.users ID from Step 3
  'Admin User',
  'a7d2adac-7c23-4086-9ec5-81e99ab6f871', -- Admin role ID
  NOW(),
  NOW()
);

-- Verify the creation
SELECT 
  up.id,
  up.full_name,
  ur.role_name,
  ur.role_level
FROM public.user_profiles up
JOIN public.user_roles ur ON up.role_id = ur.id
WHERE up.id = 'USER_ID_HERE'; -- Replace with actual ID
```

### Step 5: Test Admin Login

1. **Go to**: Your application login page
2. **Login with**:
   - Email: `admin@servisoo.com`
   - Password: `[Password from Step 3]`
3. **Verify**: Admin dashboard access and permissions

### Step 6: Final Verification

Run the verification script:
```bash
node scripts/create-admin-user-guide.js
```

## Troubleshooting

### If RLS Fix Doesn't Work:
- Check `MANUAL_TABLE_FIX_GUIDE.md` for alternative approaches
- Ensure you're running SQL in the correct Supabase project
- Verify table structure is correct

### If Admin User Creation Fails:
- Ensure the auth user was created successfully
- Check that the User ID is copied correctly (no extra spaces)
- Verify the admin role ID matches the one shown in the script output

### If Login Fails:
- Check email confirmation status in Supabase Dashboard
- Verify password was set correctly
- Check browser console for authentication errors

---

**Next Steps After Completion:**
- Continue with todo item #8: Check user management sync
- Test role-based permissions
- Verify admin dashboard functionality