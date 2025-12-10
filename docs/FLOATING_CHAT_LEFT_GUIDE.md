# Floating Chat Left - Panduan Konfigurasi n8n Langchain

## Overview
Floating Chat Left adalah komponen chat widget yang diposisikan di sebelah kiri halaman landing page. Komponen ini dirancang khusus untuk terintegrasi dengan workflow n8n langchain menggunakan Chat Trigger dan AI Agent dengan OpenAI GPT-4.1-mini.

## Fitur Utama

### 1. Posisi dan Design
- **Posisi**: Fixed di `bottom-4 left-4` (sebelah kiri bawah)
- **Animasi**: Bounce effect pada tombol chat
- **Warna**: Hijau neon (#39FF14) dengan hover effect kuning (#FFD465)
- **Ukuran**: 14x14 untuk tombol, 96x500px untuk jendela chat

### 2. Integrasi n8n Langchain
- **Chat Trigger URL**: `https://n8n-5g0tjrr8.n8x.biz.id/webhook/c684fd84-12fe-4349-b82f-f2087a78d314/chat`
- **Method**: POST
- **Content-Type**: application/json
- **Accept**: application/json
- **Workflow**: Chat Trigger → AI Agent → OpenAI Chat Model + Simple Memory

### 3. Struktur Data Request
```json
{
  "action": "sendMessage",
  "chatInput": "Pesan dari user",
  "sessionId": "servisoo-left-1705312200000-abc123def",
  "metadata": {
    "source": "floating-chat-left",
    "timestamp": "2024-01-15T10:30:00.000Z",
    "userAgent": "Mozilla/5.0...",
    "isWelcome": false
  }
}
```

### 4. Response Handling
- **JSON Response**: Mendukung `data.output`, `data.text`, `data.response`
- **Text Response**: Fallback untuk response text biasa
- **Error Handling**: Comprehensive error handling dengan fallback messages
- **Welcome Message**: Otomatis mengirim pesan selamat datang saat chat dibuka

## Perbedaan dengan FloatingChat (Kanan)

| Aspek | FloatingChat (Kanan) | FloatingChatLeft (Kiri) |
|-------|---------------------|-------------------------|
| Posisi | `bottom-4 right-4` | `bottom-4 left-4` |
| Session ID | `chat-session-{timestamp}` | `left-chat-session-{timestamp}` |
| Animasi | Pulse glow | Bounce effect |
| Design | Standard | Gradient + Enhanced UI |
| Welcome Message | Tidak ada | Ada pesan pembuka |
| Footer Info | Tidak ada | "Powered by SERVISOO AI" |

## Konfigurasi N8N Langchain Workflow

### Workflow Structure
```json
{
  "name": "Servisoo",
  "nodes": [
    {
      "name": "When chat message received",
      "type": "@n8n/n8n-nodes-langchain.chatTrigger",
      "webhookId": "c684fd84-12fe-4349-b82f-f2087a78d314"
    },
    {
      "name": "AI Agent",
      "type": "@n8n/n8n-nodes-langchain.agent",
      "systemMessage": "Kamu adalah seorang Customer Service SERVISOO..."
    },
    {
      "name": "OpenAI Chat Model",
      "type": "@n8n/n8n-nodes-langchain.lmChatOpenAi",
      "model": "gpt-4.1-mini"
    },
    {
      "name": "Simple Memory",
      "type": "@n8n/n8n-nodes-langchain.memoryBufferWindow"
    }
  ]
}
```

### AI Agent System Message
```
Kamu adalah seorang Customer Service SERVISOO.
Kamu bertugas untuk melayani customer yang menanyakan tentang layanan servisoo.

Servisoo adalah platform digital Renovasi dan Pembangunan Rumah dan Gedung. 
kami memberikan simulasi RAB agar customer bisa melakukan penghitungan secara mandiri 
sebelum memutuskan untuk melakukan renovasi atau membangun rumah.

Layanan Servisoo:
1. Renovasi Rumah & Gedung
2. Pembangunan Rumah & Gedung
3. Desain & Perencanaan
4. Konsultasi RAB
```

### Workflow Compatibility
FloatingChatLeft kompatibel dengan kedua workflow n8n:
1. `n8n-chat-workflow-fixed.json` - Menggunakan AI Agent
2. `n8n-chat-workflow-simple.json` - Menggunakan HTTP Request langsung

### Response Format
Workflow akan mengembalikan response dalam format:
- **JSON**: `{"output": "AI response text"}`
- **Text**: Direct text response dari AI Agent
- **Error**: HTTP status codes dengan error messages

## Implementasi

### 1. File yang Dibuat
- `src/components/ui/FloatingChatLeft.tsx` - Komponen utama
- `src/pages/Index.tsx` - Updated untuk include komponen baru

### 2. Dependencies
Menggunakan komponen UI yang sama:
- `@/components/ui/button`
- `@/components/ui/input`
- `@/components/ui/card`
- `@/components/ui/scroll-area`
- `lucide-react` icons

### 3. Styling Classes
```css
/* Posisi */
fixed bottom-4 left-4 z-50

/* Button */
h-14 w-14 rounded-full shadow-2xl animate-bounce

/* Chat Window */
w-96 h-[500px] shadow-2xl border-2 border-green-200

/* Header */
bg-gradient-to-r from-green-600 to-green-700

/* Messages */
rounded-2xl shadow-sm (dengan rounded-br-md untuk user, rounded-bl-md untuk bot)
```

## Session Management & Memory

### Session ID Generation
- **Format**: `servisoo-left-{timestamp}-{randomString}`
- **Contoh**: `servisoo-left-1705312200000-abc123def`
- **Tujuan**: Memungkinkan Simple Memory node menyimpan konteks percakapan
- **Persistensi**: Session berlangsung selama browser tab terbuka

### Memory Handling
- **Node**: Simple Memory (memoryBufferWindow)
- **Fungsi**: Menyimpan riwayat percakapan untuk konteks AI
- **Kapasitas**: Buffer window untuk beberapa pesan terakhir
- **Reset**: Session baru dimulai saat refresh halaman

### Welcome Message Flow
1. User membuka chat → `isOpen = true`
2. Sistem mengirim `WELCOME_MESSAGE` ke n8n
3. AI Agent memproses dengan system message
4. Response ditampilkan sebagai pesan pembuka
5. `isInitialized = true` untuk mencegah duplikasi

## Testing

### 1. Visual Testing
- [x] Posisi di kiri bawah
- [x] Animasi bounce pada button
- [x] Slide-in animation saat membuka
- [x] Gradient design
- [x] Responsive layout

### 2. Functional Testing
- [x] Kirim pesan ke n8n webhook
- [x] Terima response dari AI
- [x] Error handling untuk network issues
- [x] Session ID unik untuk tracking
- [x] Welcome message otomatis
- [x] Memory persistence dalam session

### 3. Integration Testing
- [x] Kompatibilitas dengan workflow n8n
- [x] Tidak conflict dengan FloatingChat kanan
- [x] Performance pada multiple chat instances
- [x] Simple Memory node integration

## Monitoring

### 1. Browser Console
```javascript
// Check for errors
console.log('FloatingChatLeft errors')

// Monitor network requests
// Network tab -> Filter by 'n8n-5g0tjrr8.n8x.biz.id'
```

### 2. N8N Dashboard
- Monitor executions untuk session ID `left-chat-session-*`
- Check response times dan error rates
- Verify webhook payload structure

## Customization

### 1. Styling
```tsx
// Ubah warna tema
style={{ backgroundColor: '#39FF14' }} // Button color
from-green-600 to-green-700 // Header gradient

// Ubah posisi
bottom-4 left-4 // Current position
bottom-4 left-20 // Moved right
top-4 left-4 // Top left
```

### 2. Behavior
```tsx
// Auto-open chat
const [isOpen, setIsOpen] = useState(true) // Default open

// Custom welcome message
const [messages, setMessages] = useState<Message[]>([
  {
    text: 'Custom welcome message',
    // ...
  }
])
```

## Troubleshooting

### Common Issues
1. **Chat tidak muncul**: Check import di Index.tsx
2. **Posisi overlap**: Adjust z-index atau position
3. **N8N tidak respond**: Verify webhook URL dan network
4. **Styling issues**: Check Tailwind classes

### Debug Steps
1. Open browser developer tools
2. Check console for JavaScript errors
3. Monitor network tab untuk webhook requests
4. Verify n8n workflow execution logs

## Next Steps
1. Test dengan real users
2. Monitor performance metrics
3. A/B test positioning effectiveness
4. Implement analytics tracking
5. Add more customization options

## Contact
Untuk support teknis:
- WhatsApp: 085808675233 (Admin)
- Email: servisoo.dev@gmail.com