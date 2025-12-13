# 🎯 Admin Password Reset - Quick Guide

## 📍 Akses Menu

```
Sidebar Kiri:
├─ Dashboard
├─ User Management  ← KLIK DI SINI
├─ Admin Management
├─ System Monitor
└─ ...

Direct URL:
http://localhost:8081/admin/users
https://renovasi-servisoo.vercel.app/admin/users
```

---

## ⚡ 3 Langkah Reset Password User

### Langkah 1: Cari User
```
Search box → Ketik email atau nama
Tekan Enter atau tunggu auto-filter
```

### Langkah 2: Pilih Metode
```
User table → Klik [Reset]

Dialog muncul dengan pilihan:
├─ 📧 Kirim ke Email (recommended)
└─ 📋 Copy Link (manual)
```

### Langkah 3: Konfirmasi
```
Jika "Kirim ke Email":
  → Klik [Send Email]
  → Check notification "Email sent successfully"

Jika "Copy Link":
  → Klik [Generate]
  → Klik [Copy]
  → Link otomatis di-copy
  → Paste ke user via email/chat
```

---

## 📧 Email Method (Recommended)

**Untuk:** Admin yang ingin langsung kirim email reset

```
Flow:
Admin: Klik [Reset] → Pilih "Kirim ke Email" → Klik [Send Email]
  ↓
Supabase: Kirim email dengan reset link
  ↓
User: Terima email → Klik link → Reset password
```

---

## 📋 Copy Link Method

**Untuk:** Admin yang ingin custom sending via chat/SMS/dll

```
Flow:
Admin: Klik [Reset] → Pilih "Copy Link" → Klik [Generate]
  ↓
Dialog: Tampil link baru
  ↓
Admin: Klik [Copy] → Link di-copy ke clipboard
  ↓
Admin: Paste di chat/email/SMS ke user
  ↓
User: Klik link → Reset password
```

**Contoh Link:**
```
https://renovasi-servisoo.vercel.app/reset-password?access_token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...&type=recovery
```

---

## ⏰ Token Validity

```
Valid for: 1 HOUR (60 minutes)

Timeline:
├─ 00:00 - Link sent
├─ 30:00 - User click → ✅ WORKS
├─ 59:00 - User click → ✅ WORKS
├─ 60:00 - User click → ❌ EXPIRED
└─ Any time after → ❌ EXPIRED
```

**Jika link expired:**
- Admin harus generate link baru
- User harus minta admin untuk reset ulang

---

## 🎯 Features

| Feature | Details |
|---------|---------|
| **Search** | Filter by email/name |
| **Refresh** | Real-time update user list |
| **Email Method** | Direct send to user |
| **Link Method** | Copy & manual send |
| **Link Validity** | 1 hour (3600 seconds) |
| **User Info** | Email, name, role, created, last login |
| **Error Handling** | Clear error messages |
| **Success Notify** | Toast notifications |

---

## 📊 UI Overview

```
┌─────────────────────────────────────────────────┐
│ User Management                                 │
├─────────────────────────────────────────────────┤
│ [🔍 Search email/name...] [Refresh]            │
│                                                 │
│ ┌───────────────────────────────────────────┐  │
│ │ Email        │ Name   │ Role  │ Created   │  │
│ ├───────────────────────────────────────────┤  │
│ │ user1@em.com │ John   │ user  │ Dec 10   │  │
│ │ user2@em.com │ Jane   │ user  │ Dec 08   │  │
│ │ admin@em.com │ Admin  │ admin │ Dec 05   │  │
│ └──────────────────────────────────────────→  │ 
│                                          Reset  │ Klik Reset
│ Total users: 3                                  │
└─────────────────────────────────────────────────┘

Klik [Reset] → Dialog punya 2 opsi:
┌──────────────────────────────┐
│ Reset Password               │
│ Send to: user@example.com    │
├──────────────────────────────┤
│ ○ 📧 Kirim ke Email         │
│ ○ 📋 Copy Link              │
├──────────────────────────────┤
│ [Cancel]  [Send Email/Copy]  │
└──────────────────────────────┘
```

---

## ❌ Common Issues & Solutions

### Issue: Button tidak respond

**Fix:**
1. Tunggu loading selesai
2. Check console (F12) untuk error
3. Refresh page
4. Try again

### Issue: Email tidak masuk

**Fix:**
1. Check user's spam folder
2. Verify email address benar
3. Try "Copy Link" method
4. Check Supabase email provider

### Issue: Can't access menu

**Fix:**
1. Login sebagai super_admin (bukan admin biasa)
2. Refresh page
3. Check sidebar untuk "User Management"

### Issue: Link already used/expired

**Normal behavior!**
- Link hanya bisa digunakan SEKALI
- Atau link sudah lebih dari 1 jam
- Admin perlu generate/send link baru

---

## ✅ Best Practices

### ✅ DO:

```
✅ Use "Kirim ke Email" untuk efisiensi
✅ Use "Copy Link" untuk custom delivery
✅ Check user email correct sebelum reset
✅ Inform user sebelum reset password
✅ Verify password reset success dengan user
```

### ❌ DON'T:

```
❌ Reset password user tanpa permission
❌ Share reset link via insecure channel
❌ Keep reset link exposed di chat history
❌ Reset admin password via normal method
   (gunakan special procedure untuk admin)
```

---

## 🔐 Security Notes

- ✅ Only super_admin can access menu
- ✅ Links are one-time use
- ✅ Links expire after 1 hour
- ✅ Session cleared after reset
- ✅ Audit trail maintained
- ✅ No sensitive data in URLs

---

## 📞 Support

**If you need to:**

1. **Reset your own password:** Use /reset-password page (user flow)
2. **Reset other user password:** Use /admin/users (admin flow)
3. **Reset admin password:** Contact super_admin (secure method)
4. **Check reset history:** Check audit logs (future feature)

---

**Ready to reset user passwords? Go to /admin/users now!** 🚀
