# Solusi Deployment GitHub ke Hosting Tradisional

## 🚨 **Masalah Umum: Website Tidak Tampil Meski File Terupload**

### **Root Cause Analysis:**

#### 1. **Source Code vs Production Build** ❌
- **Masalah**: GitHub repo berisi source code React, bukan production build
- **Dampak**: Hosting tidak bisa menjalankan file `.tsx`, `.ts`, atau `src/` folder
- **Solusi**: Upload hasil build (`dist/` folder) bukan source code

#### 2. **Missing Build Process** ❌
- **Masalah**: Hosting tradisional tidak menjalankan `npm run build`
- **Dampak**: File React tidak ter-compile menjadi HTML/JS/CSS
- **Solusi**: Build lokal atau gunakan CI/CD

#### 3. **SPA Routing Issues** ❌
- **Masalah**: Server tidak tahu cara handle React Router
- **Dampak**: Direct URL access menghasilkan 404
- **Solusi**: Konfigurasi `.htaccess` untuk Apache

## 🔧 **Solusi Lengkap**

### **Metode 1: Manual Build & Upload (Recommended)**

#### Step 1: Build Production
```bash
# Di local development
npm run build
```

#### Step 2: Upload Hasil Build
```
# Upload HANYA isi folder dist/ ke public_html/
dist/
├── index.html          → public_html/index.html
├── assets/
│   ├── index-xxx.js    → public_html/assets/index-xxx.js
│   ├── index-xxx.css   → public_html/assets/index-xxx.css
│   └── hero-xxx.jpg    → public_html/assets/hero-xxx.jpg
├── favicon.ico         → public_html/favicon.ico
└── robots.txt          → public_html/robots.txt
```

#### Step 3: Upload Konfigurasi
```apache
# Upload .htaccess ke public_html/
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]
```

#### Step 4: Environment Variables
```bash
# Upload .env ke root directory (BUKAN public_html)
# Pastikan berisi:
VITE_SUPABASE_URL=https://tkqvozgorpapofejphyn.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### **Metode 2: GitHub Actions CI/CD**

#### Step 1: Buat Workflow File
```yaml
# .github/workflows/deploy.yml
name: Deploy to Hosting

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v3
    
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      
    - name: Deploy via FTP
      uses: SamKirkland/FTP-Deploy-Action@4.3.3
      with:
        server: ${{ secrets.FTP_SERVER }}
        username: ${{ secrets.FTP_USERNAME }}
        password: ${{ secrets.FTP_PASSWORD }}
        local-dir: ./dist/
        server-dir: /public_html/
```

#### Step 2: Setup Secrets
```
# Di GitHub repo > Settings > Secrets
FTP_SERVER=ftp.yourdomain.com
FTP_USERNAME=your_username
FTP_PASSWORD=your_password
```

### **Metode 3: Hosting dengan Git Integration**

#### Hostinger dengan Git
```bash
# 1. Enable Git di hosting panel
# 2. Clone repo ke hosting
git clone https://github.com/username/repo.git

# 3. Install dependencies (jika hosting support Node.js)
npm install

# 4. Build production
npm run build

# 5. Symlink atau copy dist ke public_html
ln -s /path/to/repo/dist/* /public_html/
```

## 🔍 **Troubleshooting**

### **Problem: Halaman Kosong**

#### Diagnosis:
```javascript
// Buka Developer Tools (F12)
// Check Console tab untuk errors:

// Error umum:
// 1. "Failed to load module" → Missing build
// 2. "CORS error" → Environment variables salah
// 3. "404 on assets" → Path salah
// 4. "Unexpected token '<'" → Server serve HTML untuk JS request
```

#### Solutions:
```bash
# 1. Pastikan upload hasil build, bukan source
ls public_html/
# Harus ada: index.html, assets/, favicon.ico
# TIDAK boleh ada: src/, node_modules/, package.json

# 2. Check file permissions
chmod 644 index.html
chmod 644 .htaccess
chmod -R 644 assets/

# 3. Test .htaccess
# Akses: yourdomain.com/admin (harus redirect ke index.html)
```

### **Problem: 404 pada Routes**

#### Diagnosis:
```bash
# Test direct URL access:
# ✅ yourdomain.com/ → Works
# ❌ yourdomain.com/admin → 404
# ❌ yourdomain.com/dashboard → 404
```

#### Solutions:
```apache
# Pastikan .htaccess benar:
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Untuk Nginx:
location / {
    try_files $uri $uri/ /index.html;
}
```

### **Problem: Environment Variables**

#### Diagnosis:
```javascript
// Test di browser console:
console.log('ENV:', import.meta.env.VITE_SUPABASE_URL);
// Jika undefined → env variables tidak terbaca
```

#### Solutions:
```bash
# 1. Pastikan .env di root directory
# 2. Pastikan prefix VITE_
# 3. Rebuild setelah update .env
npm run build

# 4. Atau hardcode untuk production (tidak recommended)
# di src/integrations/supabase/client.ts
const SUPABASE_URL = "https://your-project.supabase.co";
```

## 📋 **Checklist Deployment**

### **Pre-Deployment:**
- [ ] `npm run build` berhasil tanpa error
- [ ] File `dist/index.html` ada dan berisi content
- [ ] Environment variables sudah benar
- [ ] `.htaccess` sudah dibuat

### **Upload Process:**
- [ ] Upload HANYA isi folder `dist/` ke `public_html/`
- [ ] Upload `.htaccess` ke `public_html/`
- [ ] Upload `.env` ke root directory
- [ ] Set file permissions yang benar

### **Post-Deployment Testing:**
- [ ] Homepage loading: `yourdomain.com/`
- [ ] Direct route access: `yourdomain.com/admin`
- [ ] Console browser tidak ada error
- [ ] Network tab tidak ada failed requests
- [ ] Authentication berfungsi
- [ ] Database connection berfungsi

## 🚀 **Quick Fix untuk Servisoo.com**

### **Immediate Solution:**
```bash
# 1. Download servisoo-fixed-deploy.zip
# 2. Extract ke local
# 3. Upload via cPanel File Manager:
#    - Hapus semua file di public_html/
#    - Upload semua file dari folder dist/
#    - Upload .htaccess ke public_html/
#    - Upload .env ke root directory
# 4. Test website
```

### **Long-term Solution:**
```bash
# Setup GitHub Actions untuk auto-deploy
# Setiap push ke main branch akan:
# 1. Build production
# 2. Upload ke hosting via FTP
# 3. Update .htaccess dan .env
```

## 📊 **Comparison: Deployment Methods**

| Method | Pros | Cons | Best For |
|--------|------|------|----------|
| Manual Build+Upload | Simple, Full control | Manual process | Small projects |
| GitHub Actions | Automated, Consistent | Setup complexity | Production sites |
| Git Integration | Version control | Hosting limitations | Advanced hosting |
| Static Site Hosts | Easy, Fast | Limited backend | Frontend-only |

---

**Key Takeaway**: Hosting tradisional tidak bisa menjalankan React source code. Selalu upload hasil build (`dist/` folder) dengan konfigurasi server yang tepat (`.htaccess` untuk Apache).

**File Ready**: `servisoo-fixed-deploy.zip` sudah berisi semua file yang diperlukan untuk deployment yang benar.