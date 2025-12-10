# N8N Workflow Integration Guide untuk FloatingChat SERVISOO

## 🔧 Perubahan yang Dilakukan

### 1. **Perbaikan Input Data Structure**
**Masalah Sebelumnya:**
- AI Agent mengharapkan input: `{{ $json.message.text }}`
- FloatingChat mengirim: `{ "message": "...", "timestamp": "...", "sessionId": "..." }`
- Mismatch struktur data menyebabkan AI Agent tidak dapat membaca pesan

**Solusi:**
- Ubah AI Agent input dari `{{ $json.message.text }}` menjadi `{{ $json.message }}`
- Sekarang AI Agent dapat langsung membaca field `message` dari FloatingChat

### 2. **Update Model OpenAI**
**Perubahan:**
- Model diubah dari `gpt-4.1-mini` menjadi `gpt-4o-mini`
- Model yang lebih stabil dan tersedia

### 3. **Optimasi Workflow Name**
**Perubahan:**
- Nama workflow diubah menjadi "SERVISOO Chat Workflow - Fixed"
- Lebih deskriptif dan mudah diidentifikasi

## 📋 Struktur Data yang Kompatibel

### Input dari FloatingChat:
```json
{
  "message": "Halo, saya ingin tanya tentang layanan renovasi",
  "timestamp": "2025-01-05T10:30:00.000Z",
  "sessionId": "chat-session-1704448200000"
}
```

### Output ke FloatingChat:
```
Halo! Terima kasih telah menghubungi SERVISOO. 
Kami siap membantu Anda dengan layanan renovasi rumah dan gedung...
```

## 🚀 Cara Implementasi

### Step 1: Import Workflow ke N8N
1. Buka N8N dashboard
2. Klik "Import from file" atau "New Workflow"
3. Copy-paste isi file `n8n-chat-workflow-fixed.json`
4. Save workflow

### Step 2: Konfigurasi Credentials
1. Pastikan OpenAI API credentials sudah dikonfigurasi
2. Credential name: "OpenAi account 3"
3. Masukkan API Key OpenAI yang valid

### Step 3: Aktivasi Webhook
1. Klik node "Webhook - Chat Input"
2. Pastikan URL webhook: `https://n8n-5g0tjrr8.n8x.biz.id/webhook/c684fd84-12fe-4349-b82f-f2087a78d314/chat`
3. Method: POST
4. Activate workflow

### Step 4: Test Integration
1. Buka website SERVISOO: `http://localhost:8080/`
2. Klik tombol chat floating
3. Kirim pesan test
4. Verifikasi response dari AI

## ✅ Checklist Verifikasi

- [ ] Webhook URL sesuai dengan FloatingChat
- [ ] HTTP Method: POST
- [ ] CORS headers sudah dikonfigurasi
- [ ] OpenAI credentials valid
- [ ] AI Agent dapat membaca `{{ $json.message }}`
- [ ] Response format: text/plain
- [ ] Workflow status: Active

## 🔍 Troubleshooting

### Masalah: Chat tidak mendapat response
**Solusi:**
1. Cek status workflow di N8N (harus Active)
2. Verifikasi OpenAI API key masih valid
3. Cek logs di N8N untuk error messages
4. Pastikan URL webhook benar di FloatingChat

### Masalah: Response kosong atau error
**Solusi:**
1. Cek input data structure di N8N logs
2. Pastikan AI Agent input: `{{ $json.message }}`
3. Verifikasi OpenAI model tersedia

### Masalah: CORS Error
**Solusi:**
1. Pastikan headers CORS sudah dikonfigurasi:
   - `Access-Control-Allow-Origin: *`
   - `Access-Control-Allow-Methods: POST, OPTIONS`
   - `Access-Control-Allow-Headers: Content-Type`

## 📊 Monitoring & Analytics

### Data yang Dikirim FloatingChat:
- `message`: Pesan dari user
- `timestamp`: Waktu pengiriman
- `sessionId`: ID sesi chat

### Data yang Dapat Ditrack:
- Jumlah pesan per hari
- Response time AI
- Jenis pertanyaan yang sering ditanya
- Session duration

## 🔐 Security Considerations

1. **API Key Protection**: Jangan expose OpenAI API key
2. **Rate Limiting**: Implementasi rate limiting jika diperlukan
3. **Input Validation**: Validasi input dari user
4. **CORS Policy**: Sesuaikan CORS sesuai domain production

## 📝 Next Steps

1. Test workflow dengan berbagai jenis pertanyaan
2. Monitor performance dan response quality
3. Implementasi logging untuk analytics
4. Optimize system message untuk response yang lebih baik
5. Deploy ke production environment

---

**File yang Diupdate:**
- ✅ `n8n-chat-workflow-fixed.json` - Workflow N8N yang sudah diperbaiki
- ✅ `src/components/ui/FloatingChat.tsx` - Sudah kompatibel dengan workflow

**Status Integration:** ✅ Ready for Testing