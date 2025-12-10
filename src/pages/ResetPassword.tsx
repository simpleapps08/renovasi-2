import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Lock, CheckCircle2, AlertCircle } from "lucide-react"

const ResetPassword = () => {
    const [isLoading, setIsLoading] = useState(false)
    const [password, setPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [isSuccess, setIsSuccess] = useState(false)
    const [isTokenValid, setIsTokenValid] = useState<boolean | null>(null)
    const navigate = useNavigate()
    const { toast } = useToast()

    useEffect(() => {
        // Handle the auth callback from email link
        const handleAuthCallback = async () => {
            console.log('🔍 Checking for auth session...')
            console.log('URL hash:', window.location.hash)

            // Supabase automatically handles the hash and creates session
            // We just need to check if session exists
            const { data: { session }, error } = await supabase.auth.getSession()

            console.log('Session check result:', { session: !!session, error })

            if (error) {
                console.error('❌ Session error:', error)
                setIsTokenValid(false)
                toast({
                    title: "Error",
                    description: error.message,
                    variant: "destructive",
                })
                return
            }

            if (!session) {
                // Check if there's a hash in URL (recovery token)
                const hashParams = new URLSearchParams(window.location.hash.substring(1))
                const accessToken = hashParams.get('access_token')
                const type = hashParams.get('type')

                console.log('Hash params:', { accessToken: !!accessToken, type })

                if (type === 'recovery' && accessToken) {
                    // Token is in URL, Supabase should handle it automatically
                    // Wait a bit for Supabase to process
                    setTimeout(async () => {
                        const { data: { session: newSession } } = await supabase.auth.getSession()
                        if (newSession) {
                            console.log('✅ Session created from recovery token')
                            setIsTokenValid(true)
                        } else {
                            console.log('⚠️ Session still not available')
                            setIsTokenValid(false)
                        }
                    }, 500)
                } else {
                    console.log('❌ No valid recovery token found')
                    setIsTokenValid(false)
                    toast({
                        title: "Link Tidak Valid",
                        description: "Link reset password tidak valid atau sudah kadaluarsa.",
                        variant: "destructive",
                    })
                }
            } else {
                console.log('✅ Valid session found')
                setIsTokenValid(true)
            }
        }

        handleAuthCallback()

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            console.log('🔄 Auth state changed:', event, !!session)
            if (event === 'PASSWORD_RECOVERY') {
                console.log('✅ Password recovery event detected')
                setIsTokenValid(true)
            }
        })

        return () => {
            subscription.unsubscribe()
        }
    }, [toast])

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault()

        if (password !== confirmPassword) {
            toast({
                title: "Password Tidak Cocok",
                description: "Password dan konfirmasi password harus sama.",
                variant: "destructive",
            })
            return
        }

        if (password.length < 6) {
            toast({
                title: "Password Terlalu Pendek",
                description: "Password minimal 6 karakter.",
                variant: "destructive",
            })
            return
        }

        setIsLoading(true)

        console.log('🔄 Attempting to update password...')

        const { error } = await supabase.auth.updateUser({
            password: password
        })

        if (error) {
            console.error('❌ Update password error:', error)
            toast({
                title: "Reset Password Gagal",
                description: error.message,
                variant: "destructive",
            })
            setIsLoading(false)
            return
        }

        console.log('✅ Password updated successfully')
        setIsSuccess(true)
        toast({
            title: "Password Berhasil Direset!",
            description: "Anda akan diarahkan ke halaman login.",
        })

        // Sign out to clear session
        await supabase.auth.signOut()

        // Redirect to login after 3 seconds
        setTimeout(() => {
            navigate('/auth')
        }, 3000)

        setIsLoading(false)
    }

    // Show loading while checking token
    if (isTokenValid === null) {
        return (
            <div className="min-h-screen bg-secondary/20 flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-0 shadow-lg">
                    <CardContent className="pt-6">
                        <div className="text-center space-y-4">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="text-muted-foreground">Memverifikasi link reset password...</p>
                        </div>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (isTokenValid === false) {
        return (
            <div className="min-h-screen bg-secondary/20 flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-0 shadow-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-destructive/10 rounded-full flex items-center justify-center mb-4">
                            <AlertCircle className="h-8 w-8 text-destructive" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Link Tidak Valid</CardTitle>
                        <CardDescription>
                            Link reset password tidak valid atau sudah kadaluarsa
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground mb-4">
                            Silakan minta link reset password baru dari halaman login.
                        </p>
                        <Button asChild variant="hero" className="w-full">
                            <Link to="/auth">Kembali ke Login</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    if (isSuccess) {
        return (
            <div className="min-h-screen bg-secondary/20 flex items-center justify-center p-4">
                <Card className="w-full max-w-md border-0 shadow-lg">
                    <CardHeader className="text-center">
                        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                            <CheckCircle2 className="h-8 w-8 text-green-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Password Berhasil Direset</CardTitle>
                        <CardDescription>
                            Password Anda telah berhasil diperbarui
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="text-center">
                        <p className="text-sm text-muted-foreground mb-4">
                            Anda akan diarahkan ke halaman login dalam beberapa detik...
                        </p>
                        <Button asChild variant="hero" className="w-full">
                            <Link to="/auth">Login Sekarang</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-secondary/20 flex items-center justify-center p-4">
            <div className="w-full max-w-md">
                <div className="text-center mb-8">
                    <Link to="/" className="inline-flex items-center">
                        <span className="text-3xl font-bold text-primary">SERVISOO</span>
                        <div className="ml-2 h-3 w-3 rounded-full bg-accent"></div>
                    </Link>
                    <p className="text-muted-foreground mt-2">Reset Password Anda</p>
                </div>

                <Card className="gradient-card border-0 shadow-lg">
                    <CardHeader className="text-center pb-4">
                        <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                            <Lock className="h-8 w-8 text-primary" />
                        </div>
                        <CardTitle className="text-2xl font-bold">Buat Password Baru</CardTitle>
                        <CardDescription>
                            Masukkan password baru untuk akun Anda
                        </CardDescription>
                    </CardHeader>

                    <CardContent>
                        <form onSubmit={handleResetPassword} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="password">Password Baru</Label>
                                <Input
                                    id="password"
                                    type="password"
                                    placeholder="Minimal 6 karakter"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="confirm-password">Konfirmasi Password</Label>
                                <Input
                                    id="confirm-password"
                                    type="password"
                                    placeholder="Masukkan password sekali lagi"
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                    minLength={6}
                                />
                            </div>

                            <Button
                                type="submit"
                                variant="hero"
                                className="w-full"
                                disabled={isLoading}
                            >
                                {isLoading ? "Memproses..." : "Reset Password"}
                            </Button>
                        </form>

                        <div className="mt-6 text-center text-sm text-muted-foreground">
                            <Link to="/auth" className="text-accent hover:underline">
                                Kembali ke Login
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}

export default ResetPassword
