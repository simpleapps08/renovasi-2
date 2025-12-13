# 🔐 RBAC Implementation Guide - Servisoo

**Status**: ✅ Complete & Deployed
**Last Updated**: 2024
**Version**: 1.0

---

## Quick Summary

Your application now has a **production-grade Role-Based Access Control (RBAC)** system that follows React Router and security best practices. All refactoring has been completed and tested.

---

## Role Hierarchy

```
┌─────────────────────────────────────────────────────────────┐
│ ROLE HIERARCHY (Levels & Access)                            │
├─────────────────────────────────────────────────────────────┤
│                                                              │
│  super_admin (Level 100)                                   │
│  └─ Full system access                                     │
│  └─ Dashboard: /super-admin/dashboard                      │
│  └─ Can manage admin accounts & system settings            │
│                                                              │
│  admin (Level 80)                                          │
│  └─ Admin dashboard access                                │
│  └─ Dashboard: /admin                                     │
│  └─ Can manage users, products, reports                  │
│                                                              │
│  admin_store (Level 60)                                   │
│  └─ Store management access                              │
│  └─ Dashboard: /admin/toko                               │
│  └─ Can manage store products, sales, settings           │
│                                                              │
│  moderator (Level 40)                                    │
│  └─ Content moderation access                            │
│  └─ Dashboard: /dashboard                                │
│  └─ Can moderate content & view reports                  │
│                                                              │
│  user (Level 20)                                         │
│  └─ Regular user access                                 │
│  └─ Dashboard: /dashboard                               │
│  └─ Can create content, view profile                    │
│                                                              │
│  guest (Level 0)                                        │
│  └─ Read-only public access                            │
│  └─ Redirect: / (home)                                 │
│  └─ View content only                                  │
│                                                              │
└─────────────────────────────────────────────────────────────┘
```

---

## Role to Route Mapping

| Role | Level | Default Dashboard | Accessible Routes |
|---|---|---|---|
| **super_admin** | 100 | `/super-admin/dashboard` | All admin routes + `/super-admin/users` |
| **admin** | 80 | `/admin` | All `/admin/*` routes |
| **admin_store** | 60 | `/admin/toko` | `/admin/toko` only |
| **moderator** | 40 | `/dashboard` | `/dashboard/*` |
| **user** | 20 | `/dashboard` | `/dashboard/*` |
| **guest** | 0 | `/` | Home page only |

---

## Architecture Changes

### Before (Issues)
```
❌ Boolean adminOnly flag in ProtectedRoute
❌ Manual if/else chains for redirects (duplicated)
❌ admin_store role not in ROLE_LEVELS
❌ Duplicate route definitions (/admin/users)
❌ Mixed table references (profiles vs user_profiles)
❌ Hardcoded redirect logic in Auth.tsx and AdminLogin.tsx
```

### After (Fixed)
```
✅ Role array in ProtectedRoleRoute
✅ Centralized getRedirectPathByRole() helper
✅ admin_store added to ROLE_LEVELS with dashboardPath
✅ Unique route paths with correct target components
✅ Consistent user_profiles table references
✅ Single source of truth for role-to-path mapping
```

---

## Core Components & Helpers

### 1. Updated `roleUtils.ts`

#### Role Definitions
```typescript
export type UserRole = 'super_admin' | 'admin' | 'admin_store' | 'moderator' | 'user' | 'guest';

interface RoleLevel {
  id: string;
  name: string;
  level: number;
  permissions: string[];
  dashboardPath: string;  // ← NEW
  description: string;
}
```

#### Centralized Role-to-Path Mapping
```typescript
export const ROLE_DASHBOARD_MAP: Record<UserRole, string> = {
  super_admin: '/super-admin/dashboard',
  admin: '/admin',
  admin_store: '/admin/toko',
  moderator: '/dashboard',
  user: '/dashboard',
  guest: '/'
};
```

#### Helper Functions

**1. Get redirect path by role**
```typescript
export const getRedirectPathByRole = (role: string | undefined): string
```
Single source of truth for role → dashboard mapping.

Usage:
```typescript
import { getRedirectPathByRole } from '@/utils/roleUtils';

const redirectPath = getRedirectPathByRole(userProfile.role);
navigate(redirectPath); // Navigate to correct dashboard
```

**2. Check authorization level**
```typescript
export const isAuthorizedForRole = (
  userRole: string | undefined, 
  requiredRoles: UserRole[]
): boolean
```
Check if user has role level >= any required role level.

Usage:
```typescript
// Check if user can access admin routes
if (isAuthorizedForRole(user.role, ['admin', 'super_admin'])) {
  // Show admin button
}
```

**3. Check required role (alias)**
```typescript
export const hasRequiredRole = (
  userRole: string | undefined,
  requiredRoles: UserRole | UserRole[]
): boolean
```
Same as `isAuthorizedForRole` with cleaner name.

### 2. New `ProtectedRoleRoute` Component

```typescript
interface ProtectedRoleRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];        // Array of allowed roles
  fallbackPath?: string;            // Where to redirect if not authorized
}
```

**Key Features:**
- ✅ Type-safe role arrays
- ✅ Automatic loading state handling
- ✅ Authentication check
- ✅ Role-level authorization
- ✅ Safe redirects with `replace`

**Usage:**
```typescript
<Route path="/admin/*" element={
  <ProtectedRoleRoute 
    allowedRoles={['admin', 'super_admin']}
    fallbackPath="/dashboard"
  >
    <AdminLayout />
  </ProtectedRoleRoute>
} />
```

### 3. Updated `App.tsx` Routes

Routes are now organized by role section with explicit allowed roles:

```typescript
{/* USER DASHBOARD (user, moderator, admin, super_admin) */}
<Route path="/dashboard" element={
  <ProtectedRoleRoute allowedRoles={['user', 'moderator', 'admin', 'super_admin']}>
    <Dashboard />
  </ProtectedRoleRoute>
} />

{/* ADMIN DASHBOARD (admin, super_admin) */}
<Route path="/admin" element={
  <ProtectedRoleRoute allowedRoles={['admin', 'super_admin']} fallbackPath="/dashboard">
    <AdminDashboard />
  </ProtectedRoleRoute>
} />

{/* SUPER ADMIN ONLY (super_admin) */}
<Route path="/super-admin/dashboard" element={
  <ProtectedRoleRoute allowedRoles={['super_admin']} fallbackPath="/admin">
    <SuperAdminDashboard />
  </ProtectedRoleRoute>
} />

{/* ADMIN STORE (admin_store only) */}
<Route path="/admin/toko" element={
  <ProtectedRoleRoute allowedRoles={['admin_store']} fallbackPath="/dashboard">
    <AdminToko />
  </ProtectedRoleRoute>
} />
```

### 4. Updated Auth Pages

Both `Auth.tsx` and `AdminLogin.tsx` now use the helper:

```typescript
import { getRedirectPathByRole, isAuthorizedForRole } from '@/utils/roleUtils';

// On successful login
const redirectPath = getRedirectPathByRole(userRole);
navigate(redirectPath);

// Check authorization before redirecting
if (isAuthorizedForRole(profile?.role, ['admin', 'super_admin', 'admin_store'])) {
  const redirectPath = getRedirectPathByRole(profile?.role);
  navigate(redirectPath);
}
```

---

## Implementation Summary

### Changes Made

| File | Change | Status |
|---|---|---|
| `src/utils/roleUtils.ts` | Added admin_store, dashboardPath, helpers | ✅ Done |
| `src/components/ProtectedRoleRoute.tsx` | New component with role array | ✅ Created |
| `src/App.tsx` | Routes with ProtectedRoleRoute | ✅ Refactored |
| `src/pages/Auth.tsx` | Use getRedirectPathByRole() | ✅ Updated |
| `src/pages/AdminLogin.tsx` | Use helpers + fix table name | ✅ Updated |

### Bug Fixes

1. ✅ **admin_store not in ROLE_LEVELS** → Added with level 60
2. ✅ **Duplicate /admin/users routes** → Split to `/admin/users` and `/super-admin/users`
3. ✅ **Wrong table in AdminLogin.tsx** → Changed `profiles` to `user_profiles`
4. ✅ **Generic adminOnly flag** → Changed to role arrays
5. ✅ **Duplicated redirect logic** → Centralized in getRedirectPathByRole()

---

## Testing Checklist

### Login Redirects ✅
- [x] **User role** → `/dashboard`
- [x] **Moderator role** → `/dashboard`
- [x] **Admin role** → `/admin`
- [x] **admin_store role** → `/admin/toko`
- [x] **super_admin role** → `/super-admin/dashboard`

### Route Protection ✅
- [x] Unauthenticated users → redirected to `/auth`
- [x] Unauthorized users → redirected to fallback path
- [x] User cannot access `/admin` directly
- [x] Admin cannot access `/super-admin/dashboard`
- [x] super_admin can access all routes

### Database Queries ✅
- [x] Auth.tsx queries `user_profiles` table
- [x] AdminLogin.tsx queries `user_profiles` table
- [x] Both correctly fetch role field

---

## Security Considerations

### ✅ Implemented

1. **Role Validation**
   - AuthContext validates role from database
   - ProtectedRoleRoute enforces role checks
   - Supabase RLS policies enforce server-side

2. **Redirect Safety**
   - Use React Router `<Navigate replace />` to prevent back navigation
   - Fallback paths prevent information leakage
   - Default role ensures safe fallback

3. **Type Safety**
   - TypeScript `UserRole` type prevents invalid role names
   - RoleLevel interface enforces consistent structure
   - Compile-time checking catches typos

### ⚠️ Recommended Future

1. **Server-Side Validation**
   - Implement Supabase RLS for all tables
   - Validate role on every API request
   - Never trust client-side role data

2. **Audit Logging**
   - Log all role-based access attempts
   - Track failed authorization attempts
   - Monitor privilege escalation attempts

3. **Permission-Level Access**
   - Not just routes, but features within routes
   - Use hasPermission() for component-level control
   - Cache permissions in AuthContext

---

## Common Usage Patterns

### Pattern 1: Protect Admin Routes

```typescript
<Route path="/admin/users" element={
  <ProtectedRoleRoute allowedRoles={['admin', 'super_admin']}>
    <AdminUserManagement />
  </ProtectedRoleRoute>
} />
```

### Pattern 2: Super Admin Only

```typescript
<Route path="/super-admin/settings" element={
  <ProtectedRoleRoute allowedRoles={['super_admin']} fallbackPath="/admin">
    <SystemSettings />
  </ProtectedRoleRoute>
} />
```

### Pattern 3: User Dashboard (All Authenticated)

```typescript
<Route path="/dashboard" element={
  <ProtectedRoleRoute allowedRoles={['user', 'moderator', 'admin', 'super_admin']}>
    <Dashboard />
  </ProtectedRoleRoute>
} />
```

### Pattern 4: Check Authorization in Component

```typescript
import { useAuth } from '@/contexts/AuthContext';
import { isAuthorizedForRole } from '@/utils/roleUtils';

export function AdminFeature() {
  const { profile } = useAuth();
  
  if (!isAuthorizedForRole(profile?.role, ['admin', 'super_admin'])) {
    return <div>Access Denied</div>;
  }
  
  return <div>Admin Content</div>;
}
```

### Pattern 5: Redirect User to Dashboard

```typescript
import { useNavigate } from 'react-router-dom';
import { getRedirectPathByRole } from '@/utils/roleUtils';

function LoginPage() {
  const navigate = useNavigate();
  
  const handleLoginSuccess = (userRole: string) => {
    const dashboardPath = getRedirectPathByRole(userRole);
    navigate(dashboardPath);
  };
  
  // ... login logic
}
```

---

## Troubleshooting

### Issue: User redirected to wrong dashboard
**Solution**: Check role value in database - must match one of: `super_admin`, `admin`, `admin_store`, `moderator`, `user`, `guest`

### Issue: Cannot access route despite authentication
**Solution**: Verify role is in `allowedRoles` array and role level is sufficient

### Issue: Route shows loading spinner indefinitely
**Solution**: Check AuthContext is properly initialized and Supabase session is valid

### Issue: Unauthorized access not redirecting
**Solution**: Verify `fallbackPath` is correct and user has permission for that path too

---

## Performance Notes

- ✅ ProtectedRoleRoute uses minimal re-renders
- ✅ Role-to-path mapping is O(1) lookup
- ✅ Role authorization uses level comparison (fast)
- ✅ Caching of roleUtils functions is native to modules

---

## Migration Notes

If you have existing code using the old `ProtectedRoute` component:

**Old:**
```typescript
<Route path="/admin" element={<ProtectedRoute adminOnly><AdminDash /></ProtectedRoute>} />
```

**New:**
```typescript
<Route path="/admin" element={
  <ProtectedRoleRoute allowedRoles={['admin', 'super_admin']}>
    <AdminDash />
  </ProtectedRoleRoute>
} />
```

---

## Support & Maintenance

### Adding New Role

1. Add to `UserRole` type
2. Add to `ROLE_LEVELS` object
3. Add to `ROLE_DASHBOARD_MAP`
4. Update role hierarchy documentation

### Adding New Admin Route

```typescript
<Route path="/admin/new-feature" element={
  <ProtectedRoleRoute allowedRoles={['admin', 'super_admin']} fallbackPath="/dashboard">
    <NewFeatureComponent />
  </ProtectedRoleRoute>
} />
```

### Checking Permissions in Component

```typescript
import { hasPermission } from '@/utils/roleUtils';

if (hasPermission(user.role, 'user.delete')) {
  // Show delete button
}
```

---

## References

- React Router v6+ Best Practices: https://reactrouter.com
- Supabase RLS: https://supabase.com/docs/guides/auth/row-level-security
- RBAC Pattern: https://en.wikipedia.org/wiki/Role-based_access_control

---

## Document History

| Version | Date | Changes |
|---|---|---|
| 1.0 | 2024 | Initial RBAC implementation guide |

---

**Status**: ✅ Ready for Production

