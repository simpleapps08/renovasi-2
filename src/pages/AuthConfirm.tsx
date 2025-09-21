import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { CheckCircle, XCircle, Loader2 } from 'lucide-react'

const AuthConfirm = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('')

  useEffect(() => {
    const confirmEmail = async () => {
      try {
        const tokenHash = searchParams.get('token_hash')
        const type = searchParams.get('type')
        const next = searchParams.get('next')

        if (!tokenHash || !type) {
          setStatus('error')
          setMessage('Link konfirmasi tidak valid atau sudah kedaluwarsa.')
          return
        }

        console.log('Confirming email with:', { tokenHash, type, next })

        const { data, error } = await supabase.auth.verifyOtp({
          token_hash: tokenHash,
          type: type as any
        })

        if (error) {
          console.error('Email confirmation error:', error)
          setStatus('error')
          setMessage(`Konfirmasi gagal: ${error.message}`)
          toast({
            title: "Konfirmasi Gagal",
            description: error.message,
            variant: "destructive",
          })
          return
        }

        if (data.user) {
          console.log('Email confirmed successfully for user:', data.user.email)
          
          // Check if profile exists, create if not
          const { data: existingProfile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', data.user.id)
            .single()
          
          if (!existingProfile) {
            console.log('Creating profile for confirmed user...')
            const { error: profileError } = await supabase
              .from('user_profiles')
              .insert({
                user_id: data.user.id,
                nama: data.user.user_metadata?.nama || data.user.email?.split('@')[0] || 'User',
                lokasi: data.user.user_metadata?.lokasi || null,
                role: 'user'
              })
            
            if (profileError) {
              console.error('Error creating profile:', profileError)
            }
          }

          setStatus('success')
          setMessage('Email berhasil dikonfirmasi! Anda akan diarahkan ke dashboard.')
          
          toast({
            title: "Email Terkonfirmasi",
            description: "Selamat datang di SERVISOO! Akun Anda sudah aktif.",
          })

          // Redirect after 3 seconds
          setTimeout(() => {
            if (next) {
              window.location.href = next
            } else {
              navigate('/dashboard')
            }
          }, 3000)
        }
      } catch (error) {
        console.error('Unexpected error during email confirmation:', error)
        setStatus('error')
        setMessage('Terjadi kesalahan saat mengkonfirmasi email. Silakan coba lagi.')
        toast({
          title: "Konfirmasi Gagal",
          description: "Terjadi kesalahan tak terduga. Silakan coba lagi.",
          variant: "destructive",
        })
      }
    }

    confirmEmail()
  }, [searchParams, navigate, toast])

  const handleBackToAuth = () => {
    navigate('/auth')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4">
            {status === 'loading' && (
              <Loader2 className="h-12 w-12 text-blue-600 animate-spin" />
            )}
            {status === 'success' && (
              <CheckCircle className="h-12 w-12 text-green-600" />
            )}
            {status === 'error' && (
              <XCircle className="h-12 w-12 text-red-600" />
            )}
          </div>
          <CardTitle className="text-2xl font-bold">
            {status === 'loading' && 'Mengkonfirmasi Email...'}
            {status === 'success' && 'Email Terkonfirmasi!'}
            {status === 'error' && 'Konfirmasi Gagal'}
          </CardTitle>
          <CardDescription>
            {message || 'Mohon tunggu sebentar...'}
          </CardDescription>
        </CardHeader>
        
        {status === 'error' && (
          <CardContent className="text-center">
            <Button onClick={handleBackToAuth} variant="outline" className="w-full">
              Kembali ke Halaman Login
            </Button>
          </CardContent>
        )}
        
        {status === 'success' && (
          <CardContent className="text-center">
            <p className="text-sm text-muted-foreground mb-4">
              Anda akan diarahkan ke dashboard dalam beberapa detik...
            </p>
            <Button onClick={() => navigate('/dashboard')} className="w-full">
              Lanjut ke Dashboard
            </Button>
          </CardContent>
        )}
      </Card>
    </div>
  )
}

export default AuthConfirm