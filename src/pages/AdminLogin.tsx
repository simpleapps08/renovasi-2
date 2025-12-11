import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { Shield, ArrowLeft } from "lucide-react"
import { sendPasswordResetEmailStandard } from "@/lib/resetPasswordHelper"

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const { toast } = useToast()
  const { signOut: contextSignOut } = useAuth()

  useEffect(() => {
    // Redirect if already authenticated as admin
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        const { data: profile, error } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', session.user.id)
          .single()

        if (error) {
          console.log('Profile fetch error:', error.message)
          toast({
            title: "Error",
            description: "Gagal mengambil data profil pengguna.",
            variant: "destructive",
          })
          return
        }

        if (profile?.role === 'super_admin') {
          navigate('/super-admin/dashboard')
        } else if (profile?.role === 'admin') {
          navigate('/admin')
        } else if (profile?.role === 'admin_store') {
          navigate('/admin/toko')
        } else {
          toast({
            title: "Akses Ditolak",
            description: "Anda tidak memiliki akses administrator.",
            variant: "destructive",
          })
          navigate('/dashboard')
        }
      }
    }
    checkUser()
  }, [navigate, toast])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { data, error } = await supabase.auth.signInWithPassword({
      email: loginData.email,
      password: loginData.password,
    })

    if (error) {
      toast({
        title: "Login Gagal",
        description: error.message,
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (data.user) {
      const { data: profile, error } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', data.user.id)
        .single()

      if (error) {
        console.log('Profile fetch error during login:', error.message)
        toast({
          title: "Error",
          description: "Gagal mengambil data profil pengguna.",
          variant: "destructive",
        })
        try {
          await contextSignOut()
        } catch (e) {
          console.error('Error during cleanup:', e)
        }
        setIsLoading(false)
        return
      }

      if (profile?.role === 'super_admin') {
        toast({
          title: "Login Berhasil",
          description: "Selamat datang di Super Admin Portal!",
        })
        navigate('/super-admin/dashboard')
      } else if (profile?.role === 'admin') {
        toast({
          title: "Login Berhasil",
          description: "Selamat datang, Administrator!",
        })
        navigate('/admin')
      } else if (profile?.role === 'admin_store') {
        toast({
          title: "Login Berhasil",
          description: "Selamat datang, Admin Toko!",
        })
        navigate('/admin/toko')
      } else {
        toast({
          title: "Akses Ditolak",
          description: "Akun ini tidak memiliki akses administrator.",
          variant: "destructive",
        })
        try {
          await contextSignOut()
        } catch (e) {
          console.error('Error during cleanup:', e)
        }
      }
    }
    setIsLoading(false)
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(forgotPasswordEmail)) {
      toast({
        title: "Email Tidak Valid",
        description: "Silakan masukkan email yang valid.",
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    try {
      console.log('📧 Initiating password reset for:', forgotPasswordEmail)
      
      // Use helper function that sends with proper expiry configuration
      const { error } = await sendPasswordResetEmailStandard(
        forgotPasswordEmail,
        `${window.location.origin}/reset-password`
      )

      if (error) {
        console.error('❌ Reset password error:', error)
        toast({
          title: "Gagal Mengirim Email",
          description: error.message || "Terjadi kesalahan saat mengirim email. Silakan coba lagi.",
          variant: "destructive",
        })
      } else {
        console.log('✅ Reset password email sent successfully')
        toast({
          title: "Email Terkirim!",
          description: "Silakan cek email Anda untuk link reset password. Link berlaku selama 1 jam.",
          duration: 6000,
        })
        setShowForgotPassword(false)
        setForgotPasswordEmail('')
      }
    } catch (err) {
      console.error('❌ Unexpected error:', err)
      toast({
        title: "Error",
        description: "Terjadi kesalahan yang tidak terduga. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Back Button */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/')}
            className="text-white hover:bg-white/10"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Beranda
          </Button>
        </div>

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-white/10 rounded-full mb-4">
            <Shield className="h-8 w-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-white/70">SERVISOO Administrator Access</p>
        </div>

        <Card className="border-0 shadow-2xl bg-white/95 backdrop-blur-sm">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold text-gray-900">Login Administrator</CardTitle>
            <CardDescription className="text-gray-600">
              Masukkan kredensial administrator untuk mengakses panel admin
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleLogin} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700 font-medium">Email Administrator</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="admin@servisoo.com"
                  value={loginData.email}
                  onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                  className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="password" className="text-gray-700 font-medium">Password</Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Masukkan password administrator"
                  value={loginData.password}
                  onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                  className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
              </div>

              <div className="flex items-center justify-end mb-4">
                <button
                  type="button"
                  onClick={() => setShowForgotPassword(true)}
                  className="text-sm text-purple-600 hover:underline"
                >
                  Lupa password?
                </button>
              </div>

              <Button
                type="submit"
                className="w-full h-12 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-semibold"
                disabled={isLoading}
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Memproses...
                  </div>
                ) : (
                  "Masuk ke Admin Panel"
                )}
              </Button>
            </form>

            {/* Forgot Password Modal */}
            {showForgotPassword && (
              <div className="mt-4 p-4 border rounded-lg bg-white/50">
                <h3 className="font-semibold mb-2">Reset Password</h3>
                <form onSubmit={handleForgotPassword} className="space-y-3">
                  <Input
                    type="email"
                    placeholder="Masukkan email administrator"
                    value={forgotPasswordEmail}
                    onChange={(e) => setForgotPasswordEmail(e.target.value)}
                    required
                  />
                  <div className="flex gap-2">
                    <Button type="submit" size="sm" disabled={isLoading}>
                      {isLoading ? "Mengirim..." : "Kirim Link Reset"}
                    </Button>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => {
                        setShowForgotPassword(false)
                        setForgotPasswordEmail('')
                      }}
                    >
                      Batal
                    </Button>
                  </div>
                </form>
              </div>
            )}

            <div className="mt-6 text-center">
              <Link
                to="/auth"
                className="text-sm text-purple-600 hover:text-purple-800 hover:underline"
              >
                Login sebagai pengguna biasa?
              </Link>
            </div>
          </CardContent>
        </Card>

        {/* Info Box */}
        <div className="mt-6 p-4 bg-white/10 backdrop-blur-sm rounded-lg border border-white/20">
          <p className="text-white/80 text-sm text-center">
            <strong>Info:</strong> Halaman ini khusus untuk administrator SERVISOO.
            Jika Anda pengguna biasa, silakan gunakan halaman login reguler.
          </p>
        </div>
      </div>
    </div>
  )
}

export default AdminLogin