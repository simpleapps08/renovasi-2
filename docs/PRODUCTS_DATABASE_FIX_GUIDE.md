# 🔧 Products Database Fix Guide

## 🚨 Masalah yang Ditemukan

1. **Foreign Key Error**: Tabel `products` mereferensi tabel `profiles(id)` yang tidak konsisten dengan sistem autentikasi
2. **RLS Policy Error**: Policy menggunakan referensi ke tabel `profiles` yang struktur kolomnya tidak sesuai
3. **Store ID Mismatch**: `store_id` harus mereferensi `auth.users(id)` bukan `profiles(id)`

## 💡 Solusi yang Diterapkan

### 1. Perbaikan Struktur Tabel Products

**File**: `fix_products_table_structure.sql`

- ✅ Mengubah `store_id` dari `REFERENCES profiles(id)` ke `REFERENCES auth.users(id)`
- ✅ Menyederhanakan RLS policy untuk menghindari kompleksitas referensi tabel
- ✅ Menambahkan proper indexes dan permissions

### 2. Update File SQL Utama

**File**: `create_products_table.sql`

- ✅ Diperbaiki foreign key constraint
- ✅ Disederhanakan RLS policy
- ✅ Diperbaiki sample data insertion

## 🛠️ Langkah Manual di Supabase Dashboard

### Langkah 1: Jalankan Fix Script

1. **Buka Supabase Dashboard**: https://supabase.com/dashboard
2. **Pilih Project**: Pilih project Anda
3. **Masuk ke SQL Editor**
4. **Copy dan Paste** isi file `fix_products_table_structure.sql`
5. **Klik Run** untuk menjalankan script

### Langkah 2: Verifikasi Struktur Tabel

Jalankan query berikut untuk memverifikasi:

```sql
-- Cek struktur tabel products
SELECT 
    column_name, 
    data_type, 
    is_nullable,
    column_default
FROM information_schema.columns 
WHERE table_name = 'products' 
AND table_schema = 'public'
ORDER BY ordinal_position;

-- Cek foreign key constraints
SELECT
    tc.constraint_name,
    tc.table_name,
    kcu.column_name,
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name
FROM information_schema.table_constraints AS tc
JOIN information_schema.key_column_usage AS kcu
    ON tc.constraint_name = kcu.constraint_name
    AND tc.table_schema = kcu.table_schema
JOIN information_schema.constraint_column_usage AS ccu
    ON ccu.constraint_name = tc.constraint_name
    AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY'
AND tc.table_name = 'products';
```

### Langkah 3: Test Insert Product

```sql
-- Test insert produk baru
INSERT INTO products (name, description, price, category, stock, store_id)
VALUES (
    'Test Product',
    'Produk untuk testing',
    50000,
    'material',
    10,
    auth.uid()  -- Menggunakan user ID yang sedang login
);
```

## 🔍 Verifikasi Perbaikan

### 1. Cek RLS Policies

```sql
-- Lihat semua policies untuk tabel products
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE tablename = 'products';
```

### 2. Test CRUD Operations

1. **CREATE**: Coba tambah produk baru melalui dashboard admin
2. **READ**: Pastikan produk muncul di daftar
3. **UPDATE**: Coba edit produk yang sudah ada
4. **DELETE**: Coba hapus produk

## 🚀 Setelah Perbaikan

1. **Restart Development Server** (jika diperlukan)
2. **Test di Browser**: Buka `/admin/toko` dan coba tambah produk
3. **Cek Console**: Pastikan tidak ada error di browser console
4. **Verifikasi Database**: Cek di Supabase Dashboard apakah data tersimpan

## 📝 Catatan Penting

- ⚠️ **Backup Data**: Jika ada data produk existing, backup dulu sebelum menjalankan DROP TABLE
- ✅ **Authentication**: Pastikan user sudah login sebelum mencoba CRUD operations
- 🔐 **RLS**: Row Level Security memastikan user hanya bisa manage produk mereka sendiri
- 📊 **Storage**: Pastikan bucket `product-images` sudah dikonfigurasi dengan benar

## 🔧 Troubleshooting

### Error: "relation 'profiles' does not exist"
- Jalankan script `fix_products_table_structure.sql`
- Pastikan menggunakan `auth.users(id)` sebagai foreign key

### Error: "permission denied for table products"
- Cek RLS policies
- Pastikan user sudah authenticated
- Verifikasi permissions di script fix

### Error: "insert or update on table 'products' violates foreign key constraint"
- Pastikan `store_id` menggunakan valid user ID dari `auth.users`
- Cek apakah user sudah login dengan benar