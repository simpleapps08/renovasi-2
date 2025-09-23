# Production Chat Troubleshooting Guide

## Masalah: Chat Tidak Terhubung ke N8N di Environment Produksi

### Gejala
- Chat berfungsi normal di development (localhost)
- Chat tidak merespons atau menampilkan error di production
- Console browser menunjukkan error CORS atau network error

### Penyebab Umum

#### 1. CORS Policy
**Masalah**: N8N server tidak mengizinkan request dari domain produksi
**Solusi**: 
- Konfigurasi CORS di N8N instance
- Tambahkan domain produksi ke allowed origins

#### 2. HTTPS vs HTTP
**Masalah**: Mixed content error (HTTPS site calling HTTP webhook)
**Solusi**: 
- Pastikan N8N webhook menggunakan HTTPS
- Update URL webhook dari HTTP ke HTTPS

#### 3. Network/Firewall
**Masalah**: Firewall atau network policy memblokir request
**Solusi**: 
- Whitelist domain N8N di firewall
- Check network policies

### Implementasi Solusi

#### 1. Enhanced Error Logging
```typescript
// Sudah diimplementasikan di FloatingChatLeft.tsx
console.log('Sending request to N8N:', {
  url: N8N_CHAT_URL,
  body: requestBody
})

// Detailed error logging
console.error('Error details:', {
  name: error.name,
  message: error.message,
  stack: error.stack
})
```

#### 2. CORS Headers (Client-side)
```typescript
// Headers yang ditambahkan
headers: {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Accept'
},
mode: 'cors'
```

#### 3. Specific Error Messages
```typescript
if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
  errorText = 'Koneksi ke server chat terputus. Pastikan Anda terhubung ke internet dan coba lagi.'
} else if (error.message.includes('CORS')) {
  errorText = 'Terjadi masalah konfigurasi server. Tim teknis sedang memperbaiki.'
}
```

### Debugging Steps

#### 1. Browser Developer Tools
1. Buka Developer Tools (F12)
2. Go to Console tab
3. Look for error messages:
   - `Failed to fetch` = Network/CORS issue
   - `Mixed Content` = HTTPS/HTTP issue
   - `Access-Control-Allow-Origin` = CORS issue

#### 2. Network Tab Analysis
1. Open Network tab
2. Try sending a chat message
3. Look for the N8N request:
   - **Status 0**: Network blocked/CORS
   - **Status 404**: Wrong webhook URL
   - **Status 500**: N8N server error
   - **Status 200**: Success (check response)

#### 3. Test N8N Webhook Directly
```bash
# Test dengan cURL
curl -X POST https://n8n-djgsdd49u07h.siomay.sumopod.my.id/webhook/c684fd84-12fe-4349-b82f-f2087a78d314/chat \
  -H "Content-Type: application/json" \
  -d '{
    "action": "sendMessage",
    "chatInput": "test message",
    "sessionId": "test-session",
    "metadata": {
      "source": "test",
      "timestamp": "2024-01-01T00:00:00.000Z"
    }
  }'
```

### N8N Server Configuration

#### 1. Environment Variables
```env
# N8N CORS Configuration
N8N_CORS_ORIGIN=*
# atau specific domain:
N8N_CORS_ORIGIN=https://yourdomain.com,https://www.yourdomain.com

# Security
N8N_SECURE_COOKIE=false
WEBHOOK_URL=https://n8n-djgsdd49u07h.siomay.sumopod.my.id
```

#### 2. Webhook Node Configuration
```json
{
  "httpMethod": "POST",
  "path": "c684fd84-12fe-4349-b82f-f2087a78d314/chat",
  "responseMode": "responseNode",
  "options": {
    "allowedOrigins": "*"
  }
}
```

### Alternative Solutions

#### 1. Proxy Server
Jika CORS tidak bisa diatasi, buat proxy server:
```javascript
// proxy-server.js
app.use('/api/chat', (req, res) => {
  // Forward request to N8N
  fetch('https://n8n-djgsdd49u07h.siomay.sumopod.my.id/webhook/...', {
    method: 'POST',
    headers: req.headers,
    body: JSON.stringify(req.body)
  })
  .then(response => response.json())
  .then(data => res.json(data))
})
```

#### 2. Server-Side Integration
Integrasikan chat di backend aplikasi:
```typescript
// api/chat.ts
export async function POST(request: Request) {
  const body = await request.json()
  
  const response = await fetch(N8N_WEBHOOK_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body)
  })
  
  return Response.json(await response.json())
}
```

### Monitoring & Alerts

#### 1. Error Tracking
```typescript
// Add to FloatingChatLeft.tsx
if (error) {
  // Send error to monitoring service
  fetch('/api/log-error', {
    method: 'POST',
    body: JSON.stringify({
      error: error.message,
      url: N8N_CHAT_URL,
      timestamp: new Date().toISOString()
    })
  })
}
```

#### 2. Health Check
```typescript
// Periodic health check
setInterval(async () => {
  try {
    const response = await fetch(N8N_CHAT_URL, { method: 'OPTIONS' })
    console.log('N8N Health:', response.ok ? 'OK' : 'ERROR')
  } catch (error) {
    console.error('N8N Health Check Failed:', error)
  }
}, 60000) // Check every minute
```

### Production Checklist

- [ ] N8N webhook URL menggunakan HTTPS
- [ ] CORS dikonfigurasi dengan benar di N8N
- [ ] Domain produksi ditambahkan ke allowed origins
- [ ] Firewall/network policy mengizinkan request
- [ ] Error logging diaktifkan
- [ ] Fallback response berfungsi
- [ ] Health check monitoring aktif
- [ ] Alternative contact method tersedia (WhatsApp)

### Contact Information

Jika masalah persisten:
- **WhatsApp**: 085808675233
- **Email**: support@servisoo.com
- **Backup Chat**: Implementasi chat alternatif

---

**Note**: File ini dibuat untuk membantu debugging masalah chat di production environment. Update sesuai dengan konfigurasi server dan requirement spesifik.