import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useToast } from '@/hooks/use-toast'

const AuthCallback = () => {
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        console.log('Processing OAuth callback...')
        
        // Get the session from the URL hash
        const { data: { session }, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Auth callback error:', error)
          toast({
            title: "Login Gagal",
            description: `Error: ${error.message}`,
            variant: "destructive",
          })
          navigate('/auth')
          return
        }

        if (session?.user) {
          console.log('OAuth callback successful, user:', session.user.email)
          
          // Check if profile exists
          const { data: existingProfile } = await supabase
            .from('user_profiles')
            .select('*')
            .eq('user_id', session.user.id)
            .single()
          
          if (!existingProfile) {
            console.log('Creating new profile for OAuth user...')
            const { error: profileError } = await supabase
              .from('user_profiles')
              .insert({
                user_id: session.user.id,
                full_name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'User',
                role: 'user'
              })
            
            if (profileError) {
              console.error('Error creating profile:', profileError)
            }
          }
          
          // Get user profile to determine redirect
          const { data: profile } = await supabase
            .from('user_profiles')
            .select('role')
            .eq('user_id', session.user.id)
            .single()
          
          toast({
            title: "Login Berhasil",
            description: "Selamat datang di SERVISOO!",
          })

          // Redirect based on role
          if (profile?.role === 'admin') {
            navigate('/admin')
          } else {
            navigate('/dashboard')
          }
        } else {
          console.log('No session found in callback')
          navigate('/auth')
        }
      } catch (error) {
        console.error('Unexpected error in auth callback:', error)
        toast({
          title: "Login Gagal",
          description: "Terjadi kesalahan saat memproses login. Silakan coba lagi.",
          variant: "destructive",
        })
        navigate('/auth')
      }
    }

    handleAuthCallback()
  }, [navigate, toast])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Memproses Login...</h2>
        <p className="text-gray-500">Mohon tunggu sebentar</p>
      </div>
    </div>
  )
}

export default AuthCallback