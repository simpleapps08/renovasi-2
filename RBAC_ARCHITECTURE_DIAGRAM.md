# 🔐 RBAC Architecture Diagram

## System Architecture Overview

```
┌────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                           │
│                                                                │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐         │
│  │   Auth Page  │  │  Admin Login │  │   Dashboard  │ ...     │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘         │
│         │                 │                 │                  │
│         └─────────────────┼─────────────────┘                  │
│                           │                                     │
│                    ┌──────▼──────┐                             │
│                    │  AuthContext │  (Fetches user + profile)  │
│                    └──────┬───────┘                            │
│                           │                                     │
│                    Gets role from DB                           │
│                           │                                     │
├─────────────────────────────▼─────────────────────────────────┤
│              ProtectedRoleRoute Component                       │
│  ┌────────────────────────────────────────────────────────┐   │
│  │ Input: allowedRoles=['admin', 'super_admin']           │   │
│  │                                                        │   │
│  │ ┌──────────────────────────────────────────────┐      │   │
│  │ │ 1. Check if authenticated?                  │      │   │
│  │ │    └─► No → Redirect to /auth              │      │   │
│  │ │                                              │      │   │
│  │ │ 2. Check role authorization                │      │   │
│  │ │    └─► Use isAuthorizedForRole()           │      │   │
│  │ │    └─► Compare role level                  │      │   │
│  │ │    └─► If not authorized → Redirect        │      │   │
│  │ │                                              │      │   │
│  │ │ 3. All checks passed                        │      │   │
│  │ │    └─► Render children component           │      │   │
│  │ └──────────────────────────────────────────────┘      │   │
│  └────────────────────────────────────────────────────────┘   │
│                                                                 │
├─────────────────────────────────────────────────────────────────┤
│              ROLE UTILITIES LAYER (src/utils/roleUtils.ts)      │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │                   ROLE_LEVELS Object                    │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │ super_admin → level: 100                         │  │  │
│  │  │ admin        → level: 80                         │  │  │
│  │  │ admin_store  → level: 60                         │  │  │
│  │  │ moderator    → level: 40                         │  │  │
│  │  │ user         → level: 20                         │  │  │
│  │  │ guest        → level: 0                          │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │             ROLE_DASHBOARD_MAP (Single Source)         │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │ super_admin → /super-admin/dashboard             │  │  │
│  │  │ admin        → /admin                            │  │  │
│  │  │ admin_store  → /admin/toko                       │  │  │
│  │  │ moderator    → /dashboard                        │  │  │
│  │  │ user         → /dashboard                        │  │  │
│  │  │ guest        → /                                 │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
│  ┌─────────────────────────────────────────────────────────┐  │
│  │           Helper Functions (Ready to Use)              │  │
│  │  ┌──────────────────────────────────────────────────┐  │  │
│  │  │ getRedirectPathByRole(role) → path              │  │  │
│  │  │ isAuthorizedForRole(role, required) → boolean   │  │  │
│  │  │ hasRequiredRole(role, required) → boolean       │  │  │
│  │  │ hasPermission(role, permission) → boolean       │  │  │
│  │  │ hasPermissionForAction(role, action) → boolean  │  │  │
│  │  └──────────────────────────────────────────────────┘  │  │
│  └─────────────────────────────────────────────────────────┘  │
│                                                                 │
└────────────────────────────────────────────────────────────────┘
│                                                                  │
│                      DATABASE LAYER                             │
│                  (Supabase - user_profiles)                     │
│                                                                  │
│  ┌──────────────────────────────────────────────────────┐      │
│  │ user_profiles Table                                  │      │
│  │ ┌────────────────────────────────────────────────┐  │      │
│  │ │ user_id | role | full_name | ... | created_at │  │      │
│  │ ├────────────────────────────────────────────────┤  │      │
│  │ │ uuid-1  | user | John Doe  | ... | 2024-01-01 │  │      │
│  │ │ uuid-2  | admin | Jane Smith| ... | 2024-01-02 │  │      │
│  │ │ uuid-3  | admin_store | Bob | ... | 2024-01-03 │  │      │
│  │ └────────────────────────────────────────────────┘  │      │
│  └──────────────────────────────────────────────────────┘      │
│                                                                  │
└──────────────────────────────────────────────────────────────────┘
```

---

## Login Flow with RBAC

```
User Submits Login
        │
        ▼
Authenticate with Supabase
        │
    ┌───┴───┐
    │       │
   ✗      ✓ (authenticated)
Invalid    │
  Cred.    ▼
    │   Fetch user_profiles
    │      │
    │      ▼
    │   Get role (e.g., 'admin')
    │      │
    │      ▼
    │   Call getRedirectPathByRole('admin')
    │      │
    │      ▼ (Returns '/admin')
    │   Navigate to correct dashboard
    │      │
    ▼      ▼
Show Error  ✓ Login Complete
           Dashboard Rendered
```

---

## Route Protection Flow

```
User Navigates to /admin/users
        │
        ▼
<Route> Renders <ProtectedRoleRoute>
        │
        ▼
✓ Authenticated?  NO  → Redirect to /auth
    │
   YES
    │
    ▼
allowedRoles = ['admin', 'super_admin']
userRole = 'user'
    │
    ▼
Call isAuthorizedForRole('user', ['admin', 'super_admin'])
    │
    ▼
Compare levels: user(20) >= admin(80)?
    │
   NO  → Redirect to fallbackPath (/dashboard)
    │
   YES → Render <AdminUsers /> Component
```

---

## Role Level Hierarchy

```
            100 ▲
              │  ╔════════════════╗
              │  ║  super_admin   ║  Full system access
              │  ╚════════════════╝
            80 │  ╔════════════════╗
              │  ║     admin      ║  Admin dashboard access
              │  ╚════════════════╝
            60 │  ╔════════════════╗
              │  ║  admin_store   ║  Store management
              │  ╚════════════════╝
            40 │  ╔════════════════╗
              │  ║   moderator    ║  Content moderation
              │  ╚════════════════╝
            20 │  ╔════════════════╗
              │  ║      user      ║  Regular user access
              │  ╚════════════════╝
             0 │  ╔════════════════╗
              │  ║     guest      ║  Read-only public
              │  ╚════════════════╝
              └──────────────────►  Higher level → More access
```

---

## File Dependencies

```
src/
├── pages/
│   ├── Auth.tsx ──────────┐
│   └── AdminLogin.tsx ────┤
│                          │
│                          ├─→ getRedirectPathByRole()
│                          │   isAuthorizedForRole()
│                          │
├── components/
│   └── ProtectedRoleRoute.tsx ──┐
│                                ├─→ isAuthorizedForRole()
│                                │   useAuth()
│
├── App.tsx ──────────────────┐
│                            ├─→ <ProtectedRoleRoute>
│                            │   getRedirectPathByRole()
│
└── utils/
    └── roleUtils.ts ◄──────┘
        ├── ROLE_LEVELS
        ├── ROLE_DASHBOARD_MAP
        ├── getRedirectPathByRole()
        ├── isAuthorizedForRole()
        ├── hasRequiredRole()
        ├── hasPermission()
        └── hasPermissionForAction()
```

---

## Decision Tree - Which Component Can User Access?

```
                          User Requests Route
                                  │
                          ┌───────┴────────┐
                          │                │
                      Authenticated?   YES/NO
                          │                │
                         YES              NO
                          │                │
                          ▼                ▼
                    Check Role         Redirect
                    In Profile         to /auth
                          │
                    ┌─────┴─────┐
                    │           │
              In allowedRoles?
                    │
                 YES/NO
                    │
            ┌───────┴────────┐
            │                │
           YES               NO
            │                │
            ▼                ▼
      Render     Redirect to
      Component  fallbackPath
```

---

## Common Route Patterns

### Pattern 1: Admin Only
```
<Route path="/admin/users" element={
  <ProtectedRoleRoute 
    allowedRoles={['admin', 'super_admin']}
    fallbackPath="/dashboard"
  >
    <AdminUsers />
  </ProtectedRoleRoute>
} />

Accessible by: admin (80), super_admin (100)
Not accessible by: admin_store (60), user (20), guest (0)
```

### Pattern 2: Super Admin Only
```
<Route path="/super-admin/settings" element={
  <ProtectedRoleRoute 
    allowedRoles={['super_admin']}
    fallbackPath="/admin"
  >
    <SystemSettings />
  </ProtectedRoleRoute>
} />

Accessible by: super_admin (100)
Not accessible by: anyone else
```

### Pattern 3: All Users
```
<Route path="/dashboard" element={
  <ProtectedRoleRoute 
    allowedRoles={['user', 'moderator', 'admin', 'super_admin']}
    fallbackPath="/auth"
  >
    <Dashboard />
  </ProtectedRoleRoute>
} />

Accessible by: all authenticated users
Not accessible by: unauthenticated, guest
```

---

## Helper Function Return Values

```
getRedirectPathByRole()
    'super_admin'  → '/super-admin/dashboard'
    'admin'        → '/admin'
    'admin_store'  → '/admin/toko'
    'moderator'    → '/dashboard'
    'user'         → '/dashboard'
    'guest'        → '/'
    undefined/null → '/dashboard' (default)

isAuthorizedForRole()
    ('admin', ['admin']) 
        → admin(80) >= admin(80) → true ✓
    
    ('user', ['admin'])
        → user(20) >= admin(80) → false ✗
    
    ('super_admin', ['admin', 'moderator'])
        → super_admin(100) >= admin(80) → true ✓
```

---

## Implementation Timeline

```
BEFORE REFACTORING
├─ Issue 1: Missing admin_store role
├─ Issue 2: Generic adminOnly flag
├─ Issue 3: Duplicate routes
├─ Issue 4: Scattered redirect logic
├─ Issue 5: Mixed table references
└─ Issue 6: No centralized helpers

         ↓↓↓ REFACTORING ↓↓↓

AFTER REFACTORING ✅
├─ ✓ admin_store added to ROLE_LEVELS
├─ ✓ ProtectedRoleRoute with role array
├─ ✓ Unique route paths
├─ ✓ Centralized ROLE_DASHBOARD_MAP
├─ ✓ Consistent user_profiles queries
├─ ✓ Helper functions created
└─ ✓ Full documentation
```

---

**Architecture Status**: ✅ PRODUCTION READY

