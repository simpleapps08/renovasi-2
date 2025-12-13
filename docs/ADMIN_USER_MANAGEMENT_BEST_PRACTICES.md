# Admin User Management Best Practices & Implementation Guide

## Supabase Service Role Credentials Management

### Environment Setup

**File**: `.env`

```env
# Supabase URLs and Keys
VITE_SUPABASE_URL=https://tkqvozgorpapofejphyn.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
VITE_SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Email Configuration
VITE_EMAIL_TOKEN_VALIDITY_SECONDS=3600
```

### Security Best Practices

#### ✅ DO:
1. **Store service role key server-side only**
   ```typescript
   // SAFE: Server-side usage
   const supabase = createClient(url, serviceRoleKey, {
     auth: {
       autoRefreshToken: false,
       persistSession: false,
     }
   })
   ```

2. **Use anon key for client operations**
   ```typescript
   // SAFE: Client-side usage
   const { error } = await supabase.auth.resetPasswordForEmail(email)
   ```

3. **Implement role-based access control**
   ```typescript
   // Only admin/super_admin can reset passwords
   if (!['admin', 'super_admin'].includes(userRole)) {
     return { error: true, message: 'Unauthorized' }
   }
   ```

4. **Validate all inputs**
   ```typescript
   if (!email || !email.includes('@')) {
     return { error: true, message: 'Invalid email' }
   }
   ```

5. **Log sensitive operations**
   ```typescript
   console.log(`[ADMIN] Password reset initiated for: ${email} by ${adminId}`)
   ```

#### ❌ DON'T:
1. ❌ Expose service role key in frontend code
2. ❌ Log user passwords or sensitive data
3. ❌ Skip input validation
4. ❌ Allow unauthenticated users to reset passwords
5. ❌ Skip error handling

## CRUD Operations - Best Practices

### CREATE (User Registration)
```typescript
// Recommended: Use Supabase Auth signup, not admin API
const { data, error } = await supabase.auth.signUp({
  email: 'user@example.com',
  password: 'securePassword123'
})
```

**Why disabled in UI:**
- Security: Prevent accidental privilege escalation
- Audit: All new users should register through proper flow
- Consistency: Maintains audit trail

### READ (Fetch Users)
```typescript
// CORRECT table reference
const { data } = await supabase
  .from('profiles')  // ✅ Correct
  .select('id, user_id, email, nama, role, lokasi, saldo_deposit')
  .order('created_at', { ascending: false })

// WRONG - Don't use this
// .from('user_profiles')  // ❌ Wrong table
```

### UPDATE (Modify User Data)
```typescript
// Update profile information
const { error } = await supabase
  .from('profiles')
  .update({
    nama: 'New Name',
    role: 'admin',
    lokasi: 'Jakarta',
    saldo_deposit: 500000,
    updated_at: new Date().toISOString()
  })
  .eq('user_id', userId)

// NEVER update auth metadata from client
// Use admin API or backend for auth changes
```

### DELETE (Remove User)
```typescript
// Delete profile from database
const { error: profileError } = await supabase
  .from('profiles')
  .delete()
  .eq('user_id', userId)

// Note: Auth user record should be deleted via admin API
// This deletion only removes the profile record
```

## Error Handling Patterns

### Type-Safe Error Handling
```typescript
interface ApiResult<T> {
  success?: boolean
  data?: T
  message?: string
  error?: true
  code?: string
}

// Usage
const result = await sendAdminPasswordResetEmail(email)
if ('error' in result && result.error) {
  // Handle error
  toast({ title: 'Error', description: result.message })
} else {
  // Handle success
  toast({ title: 'Success', description: result.message })
}
```

### Toast Notifications
```typescript
// Success
toast({
  title: "Berhasil",
  description: "Password reset email sent",
})

// Error
toast({
  title: "Error",
  description: error.message,
  variant: "destructive",
})

// Info
toast({
  title: "Info",
  description: "Feature disabled",
  variant: "default",
})
```

## Password Reset Flow - Technical Details

### Step 1: User Initiates Reset
```
Admin clicks [Reset] button → Dialog opens → Shows user info
```

### Step 2: Choose Method

**Method A: Send Email**
```
Admin clicks "Kirim Email Reset" → 
Supabase sends email with reset link → 
User receives email → 
User clicks link → 
User sees password reset form → 
User enters new password → 
Password updated
```

**Method B: Generate Link**
```
Admin clicks "Generate Link" → 
Supabase creates recovery link → 
Admin copies link → 
Admin shares via WhatsApp/SMS/etc → 
User clicks link → 
User sees password reset form → 
User enters new password → 
Password updated
```

### Step 3: Password Reset Page
- Location: `/auth/reset-password`
- Receives: Recovery token in URL (via Supabase redirect)
- Action: User enters new password
- Validation: Min 8 chars, mixed case, numbers recommended

## Testing Checklist

### Unit Tests
```typescript
// Test password reset email sending
test('sendAdminPasswordResetEmail sends to valid email', async () => {
  const result = await sendAdminPasswordResetEmail('valid@example.com')
  expect(result.success).toBe(true)
  expect(result.email).toBe('valid@example.com')
})

// Test error handling
test('sendAdminPasswordResetEmail rejects invalid email', async () => {
  const result = await sendAdminPasswordResetEmail('invalid-email')
  expect('error' in result).toBe(true)
  expect(result.code).toBe('INVALID_EMAIL')
})
```

### Integration Tests
1. **Test as Super Admin**
   - Login with super_admin credentials
   - Reset password for different users
   - Verify email received
   - Verify link works

2. **Test as Admin**
   - Same as super_admin
   - Verify can't reset other admins

3. **Test as Regular User**
   - Can't access /admin/users
   - Can't see reset button
   - Redirected to dashboard

### Manual QA
- [ ] Reset email sends correctly
- [ ] Reset link works and allows password change
- [ ] Copy link button works
- [ ] Error messages display properly
- [ ] Loading states appear during requests
- [ ] Dialog closes after successful reset
- [ ] Permissions properly enforced
- [ ] Mobile responsive

## Database Schema

### profiles table
```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT,
  nama TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'user',
  lokasi TEXT,
  saldo_deposit BIGINT DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

-- Index for faster queries
CREATE INDEX idx_profiles_user_id ON profiles(user_id);
CREATE INDEX idx_profiles_role ON profiles(role);
```

## Monitoring & Logging

### What to Log
```typescript
// Password reset initiated
console.log(`[PASSWORD_RESET] Email: ${email}, Admin: ${adminId}`)

// Password reset email sent
console.log(`[PASSWORD_RESET_SENT] Email: ${email}`)

// User reset password completed
console.log(`[PASSWORD_RESET_COMPLETED] User: ${userId}`)

// Errors
console.error(`[PASSWORD_RESET_ERROR] Email: ${email}, Error: ${error.message}`)
```

### Metrics to Track
- Reset requests per day
- Email delivery success rate
- Time from reset to password change
- Admin who initiated reset (audit)
- Failed reset attempts

## Rate Limiting Recommendations

```typescript
// Prevent abuse: Max 5 resets per user per day
const resetAttempts = await getResetAttempts(userId, 'day')
if (resetAttempts >= 5) {
  return { error: true, message: 'Too many reset attempts' }
}

// Max 10 reset emails per hour from single admin
const adminResets = await getAdminResets(adminId, 'hour')
if (adminResets >= 10) {
  return { error: true, message: 'Rate limit exceeded' }
}
```

## Audit Trail

### What to Store
```sql
CREATE TABLE audit_log (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  action TEXT NOT NULL, -- 'PASSWORD_RESET_INITIATED'
  admin_id UUID REFERENCES auth.users(id),
  target_user_id UUID REFERENCES auth.users(id),
  method TEXT, -- 'email' or 'link'
  status TEXT, -- 'success' or 'failed'
  error_message TEXT,
  ip_address TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

## Troubleshooting

### Issue: "User not found"
- Check email spelling
- Verify user exists in profiles table
- Check user_id matches auth.users

### Issue: Email not received
- Check email configuration in Supabase
- Verify email whitelist (if enabled)
- Check spam folder
- Wait 5-10 minutes for delivery

### Issue: Reset link expired
- Default: 24 hours validity
- User can request new reset
- Check VITE_EMAIL_TOKEN_VALIDITY_SECONDS

### Issue: "Permission denied"
- Verify user has admin/super_admin role
- Check role in profiles table
- Clear browser cache and re-login

## Performance Optimization

### Caching
```typescript
// Cache user list for 5 minutes
const cachedUsers = cache.get('users')
if (!cachedUsers || cache.isExpired('users', 5 * 60)) {
  const users = await fetchUsers()
  cache.set('users', users)
}
```

### Pagination
- Current: 10 items per page ✅
- Recommended: 10-25 for optimal performance
- Use lazy loading for very large lists

### Query Optimization
```typescript
// Good: Specific columns only
.select('id, user_id, email, nama, role')

// Bad: All columns with joins
.select('*')
```

## Compliance & Security

### GDPR Considerations
- ✅ User can request password reset
- ✅ Admin has audit trail
- ✅ Data retention: Define policy
- ✅ Right to be forgotten: Delete profile

### HIPAA/PCI-DSS
- ✅ Password never logged
- ✅ HTTPS only
- ✅ Service role key never in logs
- ✅ Encryption at rest (Supabase)

### SOC 2 Compliance
- ✅ Access control (role-based)
- ✅ Audit logging
- ✅ Error handling
- ✅ Secure communication

---

**Version**: 1.0
**Last Updated**: December 13, 2025
**Status**: Production Ready ✅
**Review Frequency**: Quarterly
