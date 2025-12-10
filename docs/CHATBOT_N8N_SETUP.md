# Setup Chatbot n8n untuk SERVISOO

## Deskripsi
Komponen FloatingChat telah ditambahkan ke landing page SERVISOO yang akan terhubung dengan chatbot n8n melalui webhook.

## Konfigurasi n8n

### 1. Buat Workflow n8n
1. Login ke instance n8n Anda
2. Buat workflow baru
3. Tambahkan node "Webhook" sebagai trigger

### 2. Konfigurasi Webhook Node
```json
{
  "httpMethod": "POST",
  "path": "chat",
  "responseMode": "responseNode",
  "options": {
    "allowedOrigins": "*"
  }
}
```

### 3. Struktur Data yang Diterima
Webhook akan menerima data dengan format:
```json
{
  "message": "Pesan dari user",
  "timestamp": "2024-01-01T10:00:00.000Z",
  "sessionId": "web-chat-1234567890"
}
```

### 4. Struktur Response yang Diharapkan
Chatbot harus mengembalikan response dengan format:
```json
{
  "response": "Balasan dari chatbot",
  "timestamp": "2024-01-01T10:00:01.000Z",
  "sessionId": "web-chat-1234567890"
}
```

### 5. Update URL Webhook
Setelah webhook n8n siap, update URL di file `FloatingChat.tsx`:
```typescript
const N8N_WEBHOOK_URL = 'https://your-n8n-instance.com/webhook/chat'
```

## Contoh Workflow n8n

### Node 1: Webhook (Trigger)
- Method: POST
- Path: chat
- Response Mode: Response Node

### Node 2: Function (Processing)
```javascript
const userMessage = $json.message;
const sessionId = $json.sessionId;

// Logika chatbot sederhana
let response = "Maaf, saya tidak mengerti pertanyaan Anda.";

if (userMessage.toLowerCase().includes('harga')) {
  response = "Untuk informasi harga renovasi, Anda bisa menggunakan simulasi RAB gratis kami. Apakah Anda ingin saya arahkan ke halaman simulasi?";
} else if (userMessage.toLowerCase().includes('kontak')) {
  response = "Anda bisa menghubungi kami melalui:\n- WhatsApp: +62 811-2345-6789\n- Email: info@servisoo.com\n- Atau langsung chat dengan tim kami di sini!";
} else if (userMessage.toLowerCase().includes('layanan')) {
  response = "SERVISOO menyediakan layanan:\n1. Renovasi Rumah\n2. Pembangunan Gedung\n3. Desain & Perencanaan\n4. Konsultasi RAB\n\nLayanan mana yang Anda butuhkan?";
} else if (userMessage.toLowerCase().includes('simulasi')) {
  response = "Simulasi RAB kami dapat membantu Anda menghitung estimasi biaya renovasi secara akurat. Silakan klik tombol 'Mulai Simulasi' di website untuk memulai.";
}

return {
  response: response,
  timestamp: new Date().toISOString(),
  sessionId: sessionId
};
```

### Node 3: Respond to Webhook
- Response Body: `{{ $json }}`
- Response Code: 200

## Fitur Chat

### Fitur yang Tersedia:
- ✅ Chat mengambang di kanan bawah
- ✅ Interface chat yang responsif
- ✅ Indikator typing
- ✅ Timestamp pada setiap pesan
- ✅ Fallback response jika n8n tidak tersedia
- ✅ Validasi input
- ✅ Auto-scroll ke pesan terbaru

### Customization:
1. **Warna dan Styling**: Edit CSS classes di `FloatingChat.tsx`
2. **Pesan Default**: Ubah pesan pembuka di state `messages`
3. **Fallback Response**: Sesuaikan pesan error di catch block
4. **Session Management**: Implementasi session yang lebih kompleks jika diperlukan

## Testing

### Test Tanpa n8n:
1. Buka landing page
2. Klik tombol chat di kanan bawah
3. Kirim pesan - akan muncul fallback response

### Test Dengan n8n:
1. Setup workflow n8n sesuai panduan
2. Update URL webhook di `FloatingChat.tsx`
3. Test chat dengan berbagai pesan

## Troubleshooting

### Chat Button Tidak Muncul:
- Periksa console browser untuk error
- Pastikan import FloatingChat sudah benar
- Periksa z-index CSS

### Webhook Error:
- Periksa URL webhook n8n
- Pastikan CORS sudah dikonfigurasi
- Cek network tab di browser developer tools

### Styling Issues:
- Periksa Tailwind CSS classes
- Pastikan semua dependencies UI sudah terinstall

## Security Notes

1. **CORS**: Konfigurasi CORS yang tepat di n8n
2. **Rate Limiting**: Implementasi rate limiting di n8n untuk mencegah spam
3. **Input Validation**: Validasi input di sisi n8n
4. **Session Security**: Gunakan session ID yang aman untuk production

## Production Deployment

1. Ganti URL webhook dengan URL production n8n
2. Implementasi proper error handling
3. Add logging untuk monitoring
4. Setup analytics untuk chat usage
5. Implementasi rate limiting di frontend

---

**Catatan**: Komponen chat ini siap digunakan dan akan menampilkan fallback response jika n8n belum dikonfigurasi. Untuk pengalaman chat yang optimal, pastikan workflow n8n sudah berjalan dengan baik.