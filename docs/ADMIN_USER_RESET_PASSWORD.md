# 🛡️ Admin User Management - Password Reset Feature

## 📋 Overview

Super admin dapat sekarang **manage password reset untuk semua users** melalui dashboard admin. Ada 2 cara pengiriman yang bisa dipilih.

---

## ✨ Fitur Utama

### 1. **List Semua Users**
- ✅ Tampilkan semua users dengan detail lengkap
- ✅ Search/filter by email atau nama
- ✅ Informasi: Email, Name, Role, Created Date, Last Login
- ✅ Refresh real-time

### 2. **Reset Password User**
- ✅ **Method 1: Kirim Email** - User akan terima email dengan link reset
- ✅ **Method 2: Copy Link** - Admin copy link dan kirim manual ke user
- ✅ Link valid **1 jam** (menggunakan Free Plan workaround)
- ✅ Audit logging untuk setiap reset request

### 3. **Error Handling**
- ✅ User-friendly error messages
- ✅ Retry functionality
- ✅ Loading states
- ✅ Success notifications

---

## 🚀 Cara Menggunakan

### Step 1: Login sebagai Super Admin
```
1. Buka: https://renovasi-servisoo.vercel.app/auth
   atau http://localhost:8081/auth
2. Login dengan akun super_admin
3. Masuk ke dashboard
```

### Step 2: Akses User Management
```
1. Dari sidebar, klik: "User Management"
   atau akses langsung: /admin/users
2. Lihat daftar semua users
```

### Step 3: Reset Password User
```
1. Cari user yang ingin di-reset passwordnya
   (gunakan search box untuk filter)
2. Klik tombol "Reset" pada baris user
3. Dialog akan muncul dengan 2 pilihan:
   ├─ "Kirim ke Email" - Direct send
   └─ "Copy Link" - Manual send
4. Pilih method yang diinginkan
5. Klik "Send Email" atau "Copy Link"
```

### Step 4 (Jika Pilih Copy Link):
```
1. Link akan di-generate otomatis
2. Klik "Copy" untuk copy ke clipboard
3. Kirim link ke user via:
   ├─ Email manual
   ├─ Chat/Messenger
   ├─ SMS
   └─ Cara lain apapun
```

### Step 5 (User Click Link):
```
1. User menerima link
2. Klik link dalam 1 jam
3. Form reset password muncul
4. User set password baru
5. Redirect ke login
```

---

## 📍 Lokasi Di Code

### Files Dibuat
- **`src/lib/adminUserRecovery.ts`** - Core helper functions
- **`src/pages/admin/SuperAdminUserManagement.tsx`** - UI component

### Files Diupdate
- **`src/App.tsx`** - Route configuration

### Route
```
/admin/users - User management page (Admin only)
```

---

## 🔧 API Functions

### `generateAdminRecoveryLink(email, redirectUrl)`
Generate recovery link tanpa kirim email (untuk method Copy Link)

```typescript
const result = await generateAdminRecoveryLink(
  'user@example.com',
  'http://localhost:8081/reset-password'
)

if (result.error) {
  // Handle error
} else {
  const link = result.data.link
  // Copy ke clipboard
}
```

### `sendAdminInitiatedResetEmail(email, name, redirectUrl)`
Kirim reset password email langsung ke user

```typescript
const result = await sendAdminInitiatedResetEmail(
  'user@example.com',
  'John Doe',
  'http://localhost:8081/reset-password'
)

if (result.error) {
  // Handle error
} else {
  // Email sent successfully
}
```

### `getAllUsers()`
Fetch semua users dengan profile details

```typescript
const result = await getAllUsers()

if (result.error) {
  // Handle error
} else {
  const users = result.data // Array of users with profiles
}
```

---

## 🎯 UI Components

### User List Table
```
Email           | Name      | Role     | Created      | Last Login   | Action
user@email.com  | John Doe  | user     | Dec 10, 2025 | Dec 12, 2025 | [Reset]
admin@email.com | Admin     | admin    | Dec 05, 2025 | Dec 13, 2025 | [Reset]
```

### Reset Password Dialog
```
┌─────────────────────────────────┐
│ Reset Password                  │
│ Send to: user@example.com       │
├─────────────────────────────────┤
│                                 │
│ ○ Kirim ke Email               │
│   User akan terima email link   │
│                                 │
│ ○ Copy Link                     │
│   Generate link & copy manual   │
│                                 │
├─────────────────────────────────┤
│ [Cancel]          [Send Email]  │
└─────────────────────────────────┘
```

---

## 📊 Token Validity

```
Recovery Link Validity: 1 HOUR (3600 seconds)

Timeline:
├─ 00:00 - Link generated
├─ 00:30 - User click link → ✅ Works
├─ 00:59 - User click link → ✅ Works  
├─ 01:00 - User click link → ❌ "Link Tidak Valid"
└─ 01:05 - User click link → ❌ "Link Tidak Valid"
```

---

## 🔒 Security

### Access Control
- ✅ Only super_admin can access `/admin/users`
- ✅ Protected by `ProtectedRoute` with adminOnly flag
- ✅ Automatic redirect if not admin

### Audit Trail
- ✅ Every password reset request is logged
- ✅ Stored in `password_reset_logs` table (if exists)
- ✅ Tracks: user email, initiated by, timestamp

### Data Privacy
- ✅ Links are one-time use only
- ✅ Link expires after 1 hour
- ✅ Session data cleared after reset
- ✅ No sensitive info in URLs

---

## 🧪 Testing

### Test 1: List Users
```
1. Go to: /admin/users
2. Should see all users in table
3. Search for specific user works
4. Refresh button works
```

### Test 2: Reset via Email
```
1. Click "Reset" on any user
2. Select "Kirim ke Email"
3. Click "Send Email"
4. Check user's email for reset link
5. Click link → ✅ Reset form appears
```

### Test 3: Reset via Copy Link
```
1. Click "Reset" on any user
2. Select "Copy Link"
3. System generates link
4. Click "Copy" → ✅ Link in clipboard
5. Paste link in browser
6. Click link → ✅ Reset form appears
```

### Test 4: Link Expiry
```
1. Generate recovery link
2. Wait 1+ hours
3. Click link
4. ❌ Should show "Link Tidak Valid"
5. Admin must send new link
```

---

## 📋 Workflow Example

### Scenario: Admin Reset User Password

```
Admin Action          Supabase              User Experience
    │
    ├─→ Go to /admin/users
    │
    ├─→ Find user "john@example.com"
    │
    ├─→ Click "Reset"
    │         │
    │         └─→ Dialog appears
    │
    ├─→ Select "Kirim ke Email"
    │         │
    │         ├─→ Call sendAdminInitiatedResetEmail()
    │         │
    │         ├─→ supabase.auth.resetPasswordForEmail()
    │         │
    │         └─→ Supabase sends email
    │                  │
    │                  └─→ User receives email ←─ User Opens Email
    │                                             │
    │                                             ├─→ Click link
    │                                             │
    │                                             ├─→ Redirect to /reset-password
    │                                             │   with token in URL
    │                                             │
    │                                             ├─→ Form validates token
    │                                             │
    │                                             └─→ Form resets password
    │
    └─→ Admin sees: "Reset password email sent to john@example.com"
```

---

## 🚀 Deployment

### Local Testing
```bash
npm run dev
# Go to http://localhost:8081/admin/users
```

### Production (Vercel)
```bash
# Already pushed to GitHub
git log --oneline -1
# ca6c7b7 feat(admin): add user management and admin-initiated password reset

# Vercel will auto-deploy
# Access at: https://renovasi-servisoo.vercel.app/admin/users
```

---

## 📞 Troubleshooting

### Problem: Can't see "User Management" in sidebar

**Solution:**
1. Make sure you're logged in as super_admin
2. Refresh page
3. Check browser console for errors (F12)

### Problem: Email not sent

**Solution:**
1. Check browser console for error message
2. Verify Supabase email provider is enabled
3. Check user's spam folder
4. Try "Copy Link" method instead

### Problem: Link doesn't work after 1 hour

**Expected behavior!**
- Link is valid for 1 hour only
- User must click link within 1 hour
- If expired, ask admin to send new link

---

## ✅ Checklist

- [x] User list with search functionality
- [x] Two methods to reset password (email & copy link)
- [x] Dialog UI for password reset
- [x] Error handling and validations
- [x] Success notifications
- [x] Loading states
- [x] Admin API integration
- [x] Audit logging
- [x] Production ready

---

## 🎉 Summary

Super admin sekarang punya full control untuk reset password user:

✅ List semua users  
✅ Search/filter users  
✅ Reset password via email  
✅ Reset password via copy link  
✅ Track reset requests  
✅ Security & access control  
✅ 1-hour token validity  
✅ Production ready

---

**Ready to use! Go to /admin/users to get started.** 🚀
