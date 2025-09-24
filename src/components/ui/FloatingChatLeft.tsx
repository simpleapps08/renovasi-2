import React, { useState, useEffect } from 'react'
import { X, Send } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ScrollArea } from '@/components/ui/scroll-area'

interface Message {
  id: string
  text: string
  sender: 'user' | 'bot'
  timestamp: Date
}

const FloatingChatLeft = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [inputMessage, setInputMessage] = useState('')
  const [isTyping, setIsTyping] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  // URL n8n Chat Trigger untuk workflow Servisoo
  const N8N_CHAT_URL = 'https://n8n-djgsdd49u07h.siomay.sumopod.my.id/webhook/c684fd84-12fe-4349-b82f-f2087a78d314/chat'
  
  // Session ID untuk memory management
  const [sessionId] = useState(() => `servisoo-left-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`)

  // Send welcome message when chat opens for the first time
  useEffect(() => {
    if (isOpen && !isInitialized) {
      setIsInitialized(true)
      setIsTyping(true)
      
      // Send welcome message to n8n AI Agent
      const sendWelcomeMessage = async () => {
        try {
          const requestBody = {
            action: 'sendMessage',
            chatInput: 'WELCOME_MESSAGE',
            sessionId: sessionId,
            metadata: {
              source: 'floating-chat-left',
              timestamp: new Date().toISOString(),
              userAgent: navigator.userAgent,
              isWelcome: true
            }
          }

          console.log('Sending welcome message to N8N:', {
            url: N8N_CHAT_URL,
            body: requestBody
          })

          const response = await fetch(N8N_CHAT_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json',
              'Access-Control-Allow-Origin': '*',
              'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
              'Access-Control-Allow-Headers': 'Content-Type, Accept'
            },
            body: JSON.stringify(requestBody),
            mode: 'cors'
          })

          if (response.ok) {
            const contentType = response.headers.get('content-type')
            let botResponse = ''
            
            if (contentType && contentType.includes('application/json')) {
              const data = await response.json()
              if (data.output) {
                botResponse = data.output
              } else if (data.text) {
                botResponse = data.text
              } else if (data.response) {
                botResponse = data.response
              } else if (typeof data === 'string') {
                botResponse = data
              } else {
                botResponse = 'Halo! Selamat datang di SERVISOO. Saya adalah AI Assistant yang siap membantu Anda 24/7. Bagaimana saya bisa membantu Anda hari ini?'
              }
            } else {
              botResponse = await response.text()
            }
            
            if (botResponse && botResponse.trim()) {
              const welcomeMessage: Message = {
                id: Date.now().toString(),
                text: botResponse.trim(),
                sender: 'bot',
                timestamp: new Date()
              }
              setMessages([welcomeMessage])
            } else {
              const welcomeMessage: Message = {
                id: Date.now().toString(),
                text: 'Halo! Selamat datang di SERVISOO. Saya adalah AI Assistant yang siap membantu Anda 24/7. Bagaimana saya bisa membantu Anda hari ini?',
                sender: 'bot',
                timestamp: new Date()
              }
              setMessages([welcomeMessage])
            }
          } else {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`)
          }
        } catch (error) {
          console.error('Error sending welcome message to n8n:', error)
          console.error('N8N URL (Welcome):', N8N_CHAT_URL)
          console.error('Welcome error details:', {
            name: error.name,
            message: error.message,
            stack: error.stack
          })
          
          // Always show welcome message even if N8N fails
          const welcomeMessage: Message = {
            id: Date.now().toString(),
            text: 'Halo! Selamat datang di SERVISOO. Saya adalah AI Assistant yang siap membantu Anda 24/7. Bagaimana saya bisa membantu Anda hari ini?',
            sender: 'bot',
            timestamp: new Date()
          }
          setMessages([welcomeMessage])
        } finally {
          setIsTyping(false)
        }
      }

      // Delay welcome message slightly for better UX
      setTimeout(sendWelcomeMessage, 500)
    }
  }, [isOpen, isInitialized, sessionId])

  const sendMessage = async () => {
    if (!inputMessage.trim()) return

    const userMessage: Message = {
      id: Date.now().toString(),
      text: inputMessage,
      sender: 'user',
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const currentMessage = inputMessage
    setInputMessage('')
    setIsTyping(true)

    try {
      // Format request untuk n8n Chat Trigger langchain
      const requestBody = {
        action: 'sendMessage',
        chatInput: currentMessage,
        sessionId: sessionId,
        metadata: {
          source: 'floating-chat-left',
          timestamp: new Date().toISOString(),
          userAgent: navigator.userAgent
        }
      }

      console.log('Sending request to N8N:', {
        url: N8N_CHAT_URL,
        body: requestBody
      })

      const response = await fetch(N8N_CHAT_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type, Accept'
        },
        body: JSON.stringify(requestBody),
        mode: 'cors'
      })

      if (response.ok) {
        const contentType = response.headers.get('content-type')
        let botResponse = ''
        
        if (contentType && contentType.includes('application/json')) {
          const data = await response.json()
          // Handle berbagai format response dari n8n langchain
          if (data.output) {
            botResponse = data.output
          } else if (data.text) {
            botResponse = data.text
          } else if (data.response) {
            botResponse = data.response
          } else if (typeof data === 'string') {
            botResponse = data
          } else {
            botResponse = 'Terima kasih atas pesan Anda. Tim customer service SERVISOO akan segera membantu Anda.'
          }
        } else {
          // Handle text response
          botResponse = await response.text()
        }
        
        if (botResponse && botResponse.trim()) {
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: botResponse.trim(),
            sender: 'bot',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, botMessage])
        } else {
          // Fallback response
          const botMessage: Message = {
            id: (Date.now() + 1).toString(),
            text: 'Halo! Saya adalah Customer Service SERVISOO. Bagaimana saya bisa membantu Anda hari ini?',
            sender: 'bot',
            timestamp: new Date()
          }
          setMessages(prev => [...prev, botMessage])
        }
      } else {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`)
      }
    } catch (error) {
      console.error('Error sending message to n8n:', error)
      console.error('N8N URL:', N8N_CHAT_URL)
      console.error('Error details:', {
        name: error.name,
        message: error.message,
        stack: error.stack
      })
      
      let errorText = 'Chat sedang gangguan. Hubungi WhatsApp: 085808675233'
      
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        text: errorText,
        sender: 'bot',
        timestamp: new Date()
      }
      setMessages(prev => [...prev, errorMessage])
    } finally {
      setIsTyping(false)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <div className="fixed bottom-4 left-4 z-50">
      {/* Chat Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="h-14 w-14 rounded-full shadow-2xl animate-bounce hover:animate-none hover:bg-[#128C7E] transition-all duration-300 group"
          style={{ backgroundColor: '#25D366' }}
          size="icon"
        >
          {/* WhatsApp Icon SVG */}
          <svg 
            className="h-8 w-8 text-white group-hover:scale-110 transition-transform" 
            viewBox="0 0 24 24" 
            fill="currentColor"
          >
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
          </svg>
        </Button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <Card className="w-96 h-[500px] shadow-2xl border-2 border-green-200 bg-white animate-in slide-in-from-left-5 duration-300">
          <CardHeader className="bg-gradient-to-r from-[#128C7E] to-[#25D366] text-white p-4 rounded-t-lg">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg font-semibold flex items-center gap-2">
                {/* WhatsApp Icon for Header */}
                <svg 
                  className="h-5 w-5" 
                  viewBox="0 0 24 24" 
                  fill="currentColor"
                >
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.465 3.516"/>
                </svg>
                <div>
                  <div>WhatsApp SERVISOO</div>
                  <div className="text-xs font-normal opacity-90">Customer Service Online</div>
                </div>
              </CardTitle>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 h-8 w-8 p-0 rounded-full"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="p-4 h-[440px] flex flex-col bg-gradient-to-b from-gray-50 to-white">
            {/* Messages Area */}
            <ScrollArea className="flex-1 mb-4 pr-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-[85%] p-3 rounded-2xl shadow-sm ${message.sender === 'user'
                          ? 'bg-gradient-to-r from-green-600 to-green-700 text-white rounded-br-md'
                          : 'bg-white text-gray-800 border border-gray-200 rounded-bl-md'
                        }`}
                    >
                      <div className="text-sm leading-relaxed whitespace-pre-wrap">
                        {message.text.split('\n').map((line, index) => (
                          <React.Fragment key={index}>
                            {line}
                            {index < message.text.split('\n').length - 1 && <br />}
                          </React.Fragment>
                        ))}
                      </div>
                      <p className="text-xs opacity-70 mt-1">
                        {message.timestamp.toLocaleTimeString('id-ID', {
                          hour: '2-digit',
                          minute: '2-digit'
                        })}
                      </p>
                    </div>
                  </div>
                ))}
                {isTyping && (
                  <div className="flex justify-start">
                    <div className="bg-white text-gray-800 p-3 rounded-2xl rounded-bl-md border border-gray-200 shadow-sm">
                      <div className="flex items-center gap-1">
                        <div className="flex gap-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                        </div>
                        <span className="text-xs text-gray-500 ml-2">Sedang mengetik...</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            {/* Input Area */}
            <div className="flex gap-2 p-2 bg-white rounded-xl border border-gray-200 shadow-sm">
              <Input
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ketik pesan Anda..."
                className="flex-1 border-0 focus-visible:ring-0 bg-transparent"
                disabled={isTyping}
              />
              <Button
                onClick={sendMessage}
                disabled={!inputMessage.trim() || isTyping}
                size="icon"
                className="bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 rounded-xl shadow-sm"
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Footer Info */}
            <div className="text-center mt-2">
              <p className="text-xs text-gray-500">
                Powered by SERVISOO AI • Respons dalam hitungan detik
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default FloatingChatLeft