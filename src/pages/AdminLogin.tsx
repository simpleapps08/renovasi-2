import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Shield, ArrowLeft } from "lucide-react"

const AdminLogin = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    // Redirect if already authenticated as admin
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
      const { data: profile } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', data.user.id)
        .single()
      
      if (profile?.role === 'admin') {
        toast({
          title: "Login Berhasil",
          description: "Selamat datang, Administrator!",
        })
        navigate('/admin')
      } else {
        toast({
          title: "Akses Ditolak",
          description: "Akun ini tidak memiliki akses administrator.",
          variant: "destructive",
        })
        await supabase.auth.signOut()
      }
    }
    setIsLoading(false)
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
                  onChange={(e) => setLoginData({...loginData, email: e.target.value})}
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
                  onChange={(e) => setLoginData({...loginData, password: e.target.value})}
                  className="h-12 border-gray-300 focus:border-purple-500 focus:ring-purple-500"
                  required
                />
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