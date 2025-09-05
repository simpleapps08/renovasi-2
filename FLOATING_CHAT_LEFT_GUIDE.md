# Floating Chat Left - Panduan Implementasi

## Overview
FloatingChatLeft adalah komponen chat baru yang diposisikan di sebelah kiri halaman landing page. Komponen ini dikonfigurasi khusus untuk kompatibilitas dengan sistem embedded chat dari n8n.

## Fitur Utama

### 1. Posisi dan Styling
- **Posisi**: Fixed di `bottom-4 left-4` (pojok kiri bawah)
- **Animasi**: Bounce effect pada tombol, slide-in dari kiri saat membuka
- **Design**: Gradient background, rounded corners, shadow effects
- **Responsive**: Ukuran 96x500px (w-96 h-[500px])

### 2. Integrasi N8N
- **Webhook URL**: `https://n8n-5g0tjrr8.n8x.biz.id/webhook/c684fd84-12fe-4349-b82f-f2087a78d314/chat`
- **Method**: POST
- **Content-Type**: application/json
- **Session ID**: `left-chat-session-{timestamp}` untuk membedakan dari chat kanan

### 3. Struktur Data Request
```json
{
  "message": "Pesan user",
  "timestamp": "2025-01-06T10:00:00.000Z",
  "sessionId": "left-chat-session-1704531600000"
}
```

### 4. Error Handling
- **Response kosong**: Fallback message untuk response kosong dari n8n
- **Network error**: Pesan error dengan kontak WhatsApp
- **Timeout handling**: Automatic retry mechanism

## Perbedaan dengan FloatingChat (Kanan)

| Aspek | FloatingChat (Kanan) | FloatingChatLeft (Kiri) |
|-------|---------------------|-------------------------|
| Posisi | `bottom-4 right-4` | `bottom-4 left-4` |
| Session ID | `chat-session-{timestamp}` | `left-chat-session-{timestamp}` |
| Animasi | Pulse glow | Bounce effect |
| Design | Standard | Gradient + Enhanced UI |
| Welcome Message | Tidak ada | Ada pesan pembuka |
| Footer Info | Tidak ada | "Powered by SERVISOO AI" |

## Konfigurasi N8N

### Workflow Compatibility
FloatingChatLeft kompatibel dengan kedua workflow n8n:
1. `n8n-chat-workflow-fixed.json` - Menggunakan AI Agent
2. `n8n-chat-workflow-simple.json` - Menggunakan HTTP Request langsung

### Response Format
N8N harus mengembalikan response dalam format plain text:
```
Halo! Servisoo adalah platform digital untuk Renovasi dan Pembangunan...
```

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

### 3. Integration Testing
- [x] Kompatibilitas dengan workflow n8n
- [x] Tidak conflict dengan FloatingChat kanan
- [x] Performance pada multiple chat instances

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