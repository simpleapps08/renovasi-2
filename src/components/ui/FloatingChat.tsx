import React, { useState } from 'react'
import { MessageCircle, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

const FloatingChat = () => {
  const [isOpen, setIsOpen] = useState(false)

  // URL embedded chat n8n
  const N8N_CHAT_URL = 'https://n8n-5g0tjrr8.n8x.biz.id/webhook/c684fd84-12fe-4349-b82f-f2087a78d314/chat'

  return (
    <div className="fixed bottom-4 right-4 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-2xl animate-pulse-glow hover:bg-[#FFD465] transition-colors duration-300"
          style={{ backgroundColor: '#39FF14' }}
          size="icon"
        >
          <MessageCircle className="h-6 w-6 text-white" />
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-96 h-[500px] shadow-2xl border-0 bg-white">
          <CardHeader className="bg-green-600 text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                <MessageCircle className="h-5 w-5" />
                Chat SERVISOO
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-0 h-[440px]">
            {/* Embedded N8N Chat */}
            <iframe
              src={N8N_CHAT_URL}
              className="w-full h-full border-0 rounded-b-lg"
              title="SERVISOO Chat Assistant"
              allow="microphone; camera"
              sandbox="allow-scripts allow-same-origin allow-forms allow-popups allow-popups-to-escape-sandbox"
            />
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default FloatingChat