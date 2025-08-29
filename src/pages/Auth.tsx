import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"

const Auth = () => {
  const [isLoading, setIsLoading] = useState(false)
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
        const { data: profile } = await supabase
          .from('profiles')
          .select('role')
          .eq('user_id', session.user.id)
          .single()
        
        if (profile?.role === 'admin') {
          navigate('/admin')
        } else {
          navigate('/dashboard')
        }
      }
    }
    checkUser()
  }, [navigate])

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
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', data.user.id)
        .single()
      
      toast({
        title: "Login Berhasil",
        description: "Selamat datang di SERVISOO!",
      })

      if (profile?.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
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
        emailRedirectTo: `${window.location.origin}/dashboard`
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
      toast({
        title: "Registrasi Berhasil",
        description: "Akun berhasil dibuat! Silakan login.",
      })
      setRegisterData({ nama: '', email: '', lokasi: '', password: '' })
    }
    setIsLoading(false)
  }

  return (
    <div className="min-h-screen bg-secondary/20 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
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
                      onChange={(e) => setLoginData({...loginData, email: e.target.value})}
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
                      onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                      required
                    />
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
                      onChange={(e) => setRegisterData({...registerData, nama: e.target.value})}
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
                      onChange={(e) => setRegisterData({...registerData, email: e.target.value})}
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
                      onChange={(e) => setRegisterData({...registerData, lokasi: e.target.value})}
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
                      onChange={(e) => setRegisterData({...registerData, password: e.target.value})}
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