# N8N Chatbot Troubleshooting Guide

## Masalah: Chatbot Tidak Merespons (Pesan Default)

### Gejala
- Webhook n8n aktif dan menerima request
- FloatingChat menampilkan pesan: "Terima kasih atas pesan Anda. Tim kami akan segera merespons"
- Tidak ada respons AI yang sebenarnya

### Penyebab
1. **Response Body Kosong**: Workflow n8n mengembalikan response kosong atau null
2. **Field Mapping Error**: AI Agent tidak menghasilkan field yang diharapkan
3. **Node Connection Issue**: Koneksi antar node tidak benar

### Solusi yang Diterapkan

#### 1. Perbaikan Response Body Mapping
```json
// Sebelum (hanya mencari field 'response')
"responseBody": "={{ $json.response }}"

// Sesudah (fallback ke multiple fields)
"responseBody": "={{ $json.text || $json.response || $json.output || 'Maaf, terjadi kesalahan dalam memproses pesan Anda.' }}"
```

#### 2. Workflow Alternatif (Simple)
Dibuat workflow baru `n8n-chat-workflow-simple.json` yang menggunakan:
- **HTTP Request Node** langsung ke OpenAI API
- **Set Node** untuk extract response
- **Respond to Webhook** dengan mapping yang jelas

### File yang Tersedia
1. `n8n-chat-workflow-fixed.json` - Workflow dengan AI Agent (diperbaiki)
2. `n8n-chat-workflow-simple.json` - Workflow alternatif dengan HTTP Request

## Langkah Implementasi

### Opsi 1: Update Workflow Existing
1. Import `n8n-chat-workflow-fixed.json` ke n8n
2. Pastikan credentials OpenAI sudah dikonfigurasi
3. Test webhook dengan data sample

### Opsi 2: Gunakan Workflow Simple (Recommended)
1. Import `n8n-chat-workflow-simple.json` ke n8n
2. Update credentials OpenAI API:
   - Buka node "OpenAI API Request"
   - Set credentials dengan API key yang valid
3. Activate workflow
4. Test dengan FloatingChat

## Testing & Debugging

### 1. Test Webhook Langsung
```bash
curl -X POST https://n8n-5g0tjrr8.n8x.biz.id/webhook/c684fd84-12fe-4349-b82f-f2087a78d314/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "Halo, apa itu Servisoo?", "timestamp": "2025-01-06T10:00:00Z", "sessionId": "test-123"}'
```

### 2. Check Response Format
Response yang benar harus berupa plain text:
```
Halo! Servisoo adalah platform digital untuk Renovasi dan Pembangunan Rumah dan Gedung...
```

### 3. Debug di N8N
1. Buka workflow execution history
2. Check output setiap node:
   - Webhook input: `{"message": "...", "timestamp": "...", "sessionId": "..."}`
   - OpenAI response: `{"choices": [{"message": {"content": "..."}}]}`
   - Extract node: `{"ai_response": "..."}`
   - Final response: Plain text

## Monitoring

### Log Locations
- **N8N Executions**: Dashboard > Executions
- **Browser Console**: F12 > Console (untuk FloatingChat errors)
- **Network Tab**: F12 > Network (untuk webhook requests)

### Common Issues
1. **CORS Error**: Pastikan headers CORS sudah benar
2. **OpenAI API Limit**: Check quota dan rate limits
3. **Credential Error**: Verify OpenAI API key
4. **Timeout**: Increase timeout di HTTP Request node

## Next Steps
1. Test workflow simple terlebih dahulu
2. Jika berhasil, bisa migrate ke AI Agent workflow
3. Monitor performance dan response time
4. Implement error handling yang lebih robust

## Contact
Jika masih ada masalah, check:
1. N8N execution logs
2. Browser developer console
3. Network requests di browser