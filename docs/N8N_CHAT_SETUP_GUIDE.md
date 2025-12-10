# N8N Chat Workflow Setup Guide

## Overview
File `n8n-chat-workflow.json` berisi workflow n8n yang siap diimport untuk mengintegrasikan sistem chat SERVISOO dengan n8n automation platform.

## Fitur Workflow

### 1. Webhook Endpoint
- **Path**: `/webhook/c684fd84-12fe-4349-b82f-f2087a78d314/chat`
- **Method**: POST
- **CORS**: Enabled untuk semua origin
- **Response**: Text/plain dengan respons bot

### 2. Message Processing
- Keyword-based responses untuk pertanyaan umum
- Logging semua interaksi chat
- Session tracking dengan sessionId
- Timestamp untuk setiap pesan

### 3. Database Integration
- Menyimpan chat logs ke tabel `chat_logs`
- Integrasi dengan Supabase (opsional)
- Tracking user messages dan bot responses

## Cara Import ke N8N

### Step 1: Import Workflow
1. Login ke N8N dashboard
2. Klik "Import from file" atau "New Workflow"
3. Upload file `n8n-chat-workflow.json`
4. Workflow akan otomatis ter-import dengan semua nodes

### Step 2: Konfigurasi Credentials (Opsional)
Jika ingin menggunakan database logging:
1. Buat credential baru untuk Supabase
2. Masukkan Supabase URL dan API Key
3. Assign credential ke node "Save Chat Log"

### Step 3: Aktivasi Workflow
1. Klik tombol "Active" di workflow
2. Webhook endpoint akan aktif di: `https://your-n8n-domain.com/webhook/c684fd84-12fe-4349-b82f-f2087a78d314/chat`

## Struktur Data

### Input (dari FloatingChat)
```json
{
  "message": "Halo, saya ingin tanya tentang layanan renovasi",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "sessionId": "chat-session-1705312200000"
}
```

### Output (ke FloatingChat)
```text
Halo! Selamat datang di SERVISOO. Bagaimana saya bisa membantu Anda hari ini?
```

### Database Log (chat_logs table)
```sql
CREATE TABLE chat_logs (
  id SERIAL PRIMARY KEY,
  session_id VARCHAR(255),
  user_message TEXT,
  bot_response TEXT,
  timestamp TIMESTAMP,
  processed_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW()
);
```

## Keyword Responses

Workflow ini sudah dilengkapi dengan respons otomatis untuk keyword berikut:

- **Greeting**: "halo", "hai" → Pesan selamat datang
- **Services**: "layanan", "service" → Informasi layanan SERVISOO
- **Pricing**: "harga", "biaya" → Arahan ke simulasi RAB
- **Contact**: "kontak", "hubungi" → Informasi kontak
- **Default**: Pesan umum untuk pertanyaan lainnya

## Customization

### Menambah Keyword Response
Edit node "Process Message" dan tambahkan kondisi baru:
```javascript
else if (message.toLowerCase().includes('keyword_baru')) {
  response = 'Respons untuk keyword baru';
}
```

### Integrasi AI/Chatbot
Ganti logic di node "Process Message" dengan:
- OpenAI API call
- Google Dialogflow
- Custom AI model
- Database query untuk FAQ

### Notifikasi Admin
Tambah node baru untuk:
- Email notification
- Slack/Discord webhook
- WhatsApp API
- Telegram bot

## Testing

### Test dengan cURL
```bash
curl -X POST https://your-n8n-domain.com/webhook/c684fd84-12fe-4349-b82f-f2087a78d314/chat \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Halo",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "sessionId": "test-session"
  }'
```

### Expected Response
```
Halo! Selamat datang di SERVISOO. Bagaimana saya bisa membantu Anda hari ini?
```

## Troubleshooting

### Webhook tidak merespons
1. Pastikan workflow sudah aktif
2. Cek URL webhook sudah benar
3. Periksa CORS settings
4. Lihat execution logs di N8N

### Database error
1. Pastikan credentials Supabase benar
2. Cek tabel `chat_logs` sudah dibuat
3. Verifikasi permissions database

### CORS issues
1. Pastikan "Access-Control-Allow-Origin: *" di response headers
2. Cek browser developer tools untuk CORS errors
3. Test dengan Postman/cURL terlebih dahulu

## Security Notes

- Webhook ID sudah menggunakan UUID untuk keamanan
- CORS diset ke "*" untuk development, ubah ke domain spesifik untuk production
- Pertimbangkan rate limiting untuk mencegah spam
- Validasi input message untuk mencegah injection attacks

## Next Steps

1. Import workflow ke N8N
2. Test dengan FloatingChat di website
3. Customize responses sesuai kebutuhan
4. Setup database logging (opsional)
5. Deploy ke production environment
6. Monitor dan optimize performance