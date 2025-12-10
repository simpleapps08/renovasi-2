import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link, useNavigate } from "react-router-dom"
import { Home } from "lucide-react"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')

  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({
    nama: '',
    email: '',
    lokasi: '',
    password: ''
  })
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    // Redirect if already authenticated
    const checkUser = async () => {
      const { data: { session } } = await supabase.auth.getSession()
      if (session) {
        // Check user profile and redirect
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', session.user.id)
          .single()


        if (profile?.role === 'super_admin') {
          navigate('/super-admin/dashboard')
        } else if (profile?.role === 'admin') {
          navigate('/admin')
        } else if (profile?.role === 'admin_store') {
          navigate('/admin/toko')
        } else {
          navigate('/dashboard')
        }
      }
    }
    checkUser()
  }, [navigate, toast])

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      console.log('🔐 Attempting login for:', loginData.email)

      const { data, error } = await supabase.auth.signInWithPassword({
        email: loginData.email,
        password: loginData.password,
      })

      if (error) {
        console.error('❌ Login error:', error)
        toast({
          title: "Login Gagal",
          description: error.message,
          variant: "destructive",
        })
        setIsLoading(false)
        return
      }

      console.log('✅ Login successful, user:', data.user?.email)

      if (data.user) {
        console.log('🔍 Fetching profile for user_id:', data.user.id)

        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', data.user.id)
          .single()

        if (profileError) {
          console.error('❌ Profile fetch error:', profileError)
          toast({
            title: "Login Berhasil",
            description: "Tapi gagal mengambil data profil. Silakan coba lagi.",
            variant: "destructive",
          })
          setIsLoading(false)
          return
        }

        console.log('✅ Profile found:', profile)

        toast({
          title: "Login Berhasil",
          description: "Selamat datang di SERVISOO!",
        })

        // Navigate based on role
        if (profile?.role === 'super_admin') {
          console.log('➡️ Redirecting to super admin dashboard')
          navigate('/super-admin/dashboard')
        } else if (profile?.role === 'admin') {
          console.log('➡️ Redirecting to admin dashboard')
          navigate('/admin')
        } else if (profile?.role === 'admin_store') {
          console.log('➡️ Redirecting to admin toko')
          navigate('/admin/toko')
        } else {
          console.log('➡️ Redirecting to user dashboard')
          navigate('/dashboard')
        }
      }
    } catch (err) {
      console.error('❌ Unexpected error during login:', err)
      toast({
        title: "Error",
        description: "Terjadi kesalahan yang tidak terduga. Silakan coba lagi.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) {
      toast({
        title: "Gagal Mengirim Email",
        description: error.message,
        variant: "destructive",
      })
    } else {
      toast({
        title: "Email Terkirim!",
        description: "Silakan cek email Anda untuk link reset password.",
        duration: 6000,
      })
      setShowForgotPassword(false)
      setForgotPasswordEmail('')
    }

    setIsLoading(false)
  }

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    const { data, error } = await supabase.auth.signUp({
      email: registerData.email,
      password: registerData.password,
      options: {
        data: {
          nama: registerData.nama,
          lokasi: registerData.lokasi,
        },
        emailRedirectTo: `${window.location.origin}/auth/confirm`
      }
    })

    if (error) {
      toast({
        title: "Registrasi Gagal",
        description: error.message,
        variant: "destructive",
      })
      setIsLoading(false)
      return
    }

    if (data.user) {
      // Check if user needs email confirmation
      if (!data.session) {
        toast({
          title: "Registrasi Berhasil!",
          description: "Silakan cek email Anda dan konfirmasi via link yang telah dikirim.",
          duration: 6000,
        })
      } else {
        toast({
          title: "Registrasi Berhasil",
          description: "Akun berhasil dibuat! Silakan login.",
        })
      }
      setRegisterData({ nama: '', email: '', lokasi: '', password: '' })
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="flex justify-between items-center mb-4">
            <Button asChild variant="outline" size="sm">
              <Link to="/">
                <Home className="h-4 w-4 mr-2" />
                Beranda
              </Link>
            </Button>
          </div>
          <Link to="/" className="inline-flex items-center">
            <span className="text-3xl font-bold text-primary">SERVISOO</span>
            <div className="ml-2 h-3 w-3 rounded-full bg-accent"></div>
          </Link>
          <p className="text-muted-foreground mt-2">Platform Renovasi Digital</p>
        </div>

        <Card className="gradient-card border-0 shadow-lg">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-bold">Selamat Datang</CardTitle>
            <CardDescription>
              Masuk atau daftar untuk mulai simulasi RAB
            </CardDescription>
          </CardHeader>

          <CardContent>
            <Tabs defaultValue="login" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="login">Masuk</TabsTrigger>
                <TabsTrigger value="register">Daftar</TabsTrigger>
              </TabsList>

              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      placeholder="nama@email.com"
                      value={loginData.email}
                      onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password">Password</Label>
                    <Input
                      id="password"
                      type="password"
                      placeholder="Masukkan password"
                      value={loginData.password}
                      onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                      required
                    />
                  </div>

                  <div className="flex items-center justify-end mb-4">
                    <button
                      type="button"
                      onClick={() => setShowForgotPassword(true)}
                      className="text-sm text-primary hover:underline"
                    >
                      Lupa password?
                    </button>
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Memproses..." : "Masuk"}
                  </Button>
                </form>

                {/* Forgot Password Modal */}
                {showForgotPassword && (
                  <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                    <h3 className="font-semibold mb-2">Reset Password</h3>
                    <form onSubmit={handleForgotPassword} className="space-y-3">
                      <Input
                        type="email"
                        placeholder="Masukkan email Anda"
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
              </TabsContent>

              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Lengkap</Label>
                    <Input
                      id="name"
                      type="text"
                      placeholder="Nama lengkap Anda"
                      value={registerData.nama}
                      onChange={(e) => setRegisterData({ ...registerData, nama: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="email-register">Email</Label>
                    <Input
                      id="email-register"
                      type="email"
                      placeholder="nama@email.com"
                      value={registerData.email}
                      onChange={(e) => setRegisterData({ ...registerData, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="location">Lokasi Proyek</Label>
                    <Input
                      id="location"
                      type="text"
                      placeholder="Kota/Kabupaten"
                      value={registerData.lokasi}
                      onChange={(e) => setRegisterData({ ...registerData, lokasi: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="password-register">Password</Label>
                    <Input
                      id="password-register"
                      type="password"
                      placeholder="Minimal 6 karakter"
                      value={registerData.password}
                      onChange={(e) => setRegisterData({ ...registerData, password: e.target.value })}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    variant="hero"
                    className="w-full"
                    disabled={isLoading}
                  >
                    {isLoading ? "Memproses..." : "Daftar Sekarang"}
                  </Button>



                </form>
              </TabsContent>
            </Tabs>

            <div className="mt-6 text-center text-sm text-muted-foreground">
              Dengan mendaftar, Anda menyetujui{" "}
              <Link to="/terms" className="text-accent hover:underline">
                Syarat & Ketentuan
              </Link>{" "}
              kami
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Auth