# 🔐 RBAC Quick Reference

## Role Levels (Hierarchy)
```
super_admin (100) > admin (80) > admin_store (60) > moderator (40) > user (20) > guest (0)
```

## Role-to-Dashboard Mapping
```typescript
super_admin  → /super-admin/dashboard
admin        → /admin
admin_store  → /admin/toko
moderator    → /dashboard
user         → /dashboard
guest        → /
```

## Protected Routes Pattern
```typescript
<ProtectedRoleRoute allowedRoles={['admin', 'super_admin']} fallbackPath="/dashboard">
  <Component />
</ProtectedRoleRoute>
```

## Helper Functions

| Function | Purpose | Example |
|---|---|---|
| `getRedirectPathByRole(role)` | Get dashboard path for role | `navigate(getRedirectPathByRole('admin'))` |
| `isAuthorizedForRole(userRole, requiredRoles)` | Check if user has access | `isAuthorizedForRole(role, ['admin'])` |
| `hasRequiredRole(userRole, roles)` | Alias for above | `hasRequiredRole(role, ['admin', 'super_admin'])` |
| `hasPermission(role, permission)` | Check specific permission | `hasPermission(role, 'user.delete')` |

## Import Statements
```typescript
// Route protection
import ProtectedRoleRoute from '@/components/ProtectedRoleRoute';

// Helpers
import { 
  getRedirectPathByRole, 
  isAuthorizedForRole, 
  hasRequiredRole,
  hasPermission 
} from '@/utils/roleUtils';

// Type
import { UserRole } from '@/utils/roleUtils';
```

## Common Scenarios

### Redirect User to Dashboard After Login
```typescript
const redirectPath = getRedirectPathByRole(userRole);
navigate(redirectPath);
```

### Check if User is Admin
```typescript
if (isAuthorizedForRole(profile?.role, ['admin', 'super_admin'])) {
  // Show admin UI
}
```

### Protect Admin Route
```typescript
<Route path="/admin/users" element={
  <ProtectedRoleRoute allowedRoles={['admin', 'super_admin']}>
    <AdminUsers />
  </ProtectedRoleRoute>
} />
```

### Super Admin Only Route
```typescript
<Route path="/super-admin/settings" element={
  <ProtectedRoleRoute allowedRoles={['super_admin']} fallbackPath="/admin">
    <Settings />
  </ProtectedRoleRoute>
} />
```

## Role Matrix

| Role | Level | Dashboard | Permissions |
|---|---|---|---|
| super_admin | 100 | /super-admin/dashboard | All |
| admin | 80 | /admin | User mgmt, Reports |
| admin_store | 60 | /admin/toko | Store mgmt |
| moderator | 40 | /dashboard | Content moderate |
| user | 20 | /dashboard | Basic access |
| guest | 0 | / | Read-only |

## Files Modified
- ✅ `src/utils/roleUtils.ts` - Added helpers & admin_store
- ✅ `src/components/ProtectedRoleRoute.tsx` - New component
- ✅ `src/App.tsx` - Refactored routes
- ✅ `src/pages/Auth.tsx` - Use helpers
- ✅ `src/pages/AdminLogin.tsx` - Use helpers

## Documentation
- 📖 [RBAC Audit Report](./RBAC_AUDIT_REPORT.md) - Issues & architecture
- 📖 [RBAC Implementation Guide](./RBAC_IMPLEMENTATION_GUIDE.md) - Full guide
- 📖 [This file](./RBAC_QUICK_REFERENCE.md) - Quick lookup

