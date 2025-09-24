import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Store, 
  User, 
  Shield, 
  Key, 
  Mail, 
  Phone, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle, 
  Clock,
  LogIn,
  UserPlus,
  Lock,
  Unlock,
  Settings
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: 'store_owner' | 'store_admin' | 'store_staff';
  store_id?: string;
  is_active: boolean;
  email_verified: boolean;
  phone_verified: boolean;
  last_login?: string;
  created_at: string;
  avatar_url?: string;
}

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}

interface LoginForm {
  email: string;
  password: string;
}

interface RegisterForm {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  storeName: string;
  storeCategory: string;
  agreeToTerms: boolean;
}

interface PasswordResetForm {
  email: string;
}

const storeCategories = [
  'Bahan Bangunan',
  'Alat Konstruksi', 
  'Cat & Finishing',
  'Kayu & Furniture',
  'Listrik & Plumbing',
  'Keramik & Lantai'
];

const StoreAuth: React.FC = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    loading: true,
    error: null
  });
  
  const [activeTab, setActiveTab] = useState<'login' | 'register' | 'reset'>('login');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [loginForm, setLoginForm] = useState<LoginForm>({
    email: '',
    password: ''
  });
  
  const [registerForm, setRegisterForm] = useState<RegisterForm>({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    storeName: '',
    storeCategory: '',
    agreeToTerms: false
  });
  
  const [resetForm, setResetForm] = useState<PasswordResetForm>({
    email: ''
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Check authentication status on component mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      // Simulate checking authentication status
      // In real app, this would check JWT token or session
      const token = localStorage.getItem('store_auth_token');
      
      if (token) {
        // Simulate API call to verify token and get user data
        setTimeout(() => {
          setAuthState({
            isAuthenticated: true,
            user: {
              id: '1',
              email: 'owner@tokosejahtera.com',
              name: 'Ahmad Sejahtera',
              phone: '081234567890',
              role: 'store_owner',
              store_id: 'store_1',
              is_active: true,
              email_verified: true,
              phone_verified: true,
              last_login: '2024-01-15T10:30:00Z',
              created_at: '2024-01-01T00:00:00Z',
              avatar_url: '/placeholder-avatar.jpg'
            },
            loading: false,
            error: null
          });
        }, 1000);
      } else {
        setAuthState(prev => ({ ...prev, loading: false }));
      }
    } catch (error) {
      setAuthState({
        isAuthenticated: false,
        user: null,
        loading: false,
        error: 'Gagal memeriksa status autentikasi'
      });
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthState(prev => ({ ...prev, error: null }));
    
    try {
      // Simulate API login call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock validation
      if (loginForm.email === 'owner@tokosejahtera.com' && loginForm.password === 'password123') {
        const mockUser: User = {
          id: '1',
          email: loginForm.email,
          name: 'Ahmad Sejahtera',
          phone: '081234567890',
          role: 'store_owner',
          store_id: 'store_1',
          is_active: true,
          email_verified: true,
          phone_verified: true,
          last_login: new Date().toISOString(),
          created_at: '2024-01-01T00:00:00Z',
          avatar_url: '/placeholder-avatar.jpg'
        };
        
        // Store auth token
        localStorage.setItem('store_auth_token', 'mock_jwt_token_123');
        localStorage.setItem('store_user', JSON.stringify(mockUser));
        
        setAuthState({
          isAuthenticated: true,
          user: mockUser,
          loading: false,
          error: null
        });
        
        setSuccessMessage('Login berhasil! Selamat datang kembali.');
      } else {
        throw new Error('Email atau password salah');
      }
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Gagal login. Silakan coba lagi.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthState(prev => ({ ...prev, error: null }));
    
    try {
      // Validate form
      if (registerForm.password !== registerForm.confirmPassword) {
        throw new Error('Password dan konfirmasi password tidak cocok');
      }
      
      if (!registerForm.agreeToTerms) {
        throw new Error('Anda harus menyetujui syarat dan ketentuan');
      }
      
      if (registerForm.password.length < 8) {
        throw new Error('Password minimal 8 karakter');
      }
      
      // Simulate API register call
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      setSuccessMessage('Registrasi berhasil! Silakan cek email untuk verifikasi akun.');
      setActiveTab('login');
      
      // Reset form
      setRegisterForm({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        storeName: '',
        storeCategory: '',
        agreeToTerms: false
      });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Gagal registrasi. Silakan coba lagi.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setAuthState(prev => ({ ...prev, error: null }));
    
    try {
      // Simulate API password reset call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setSuccessMessage('Link reset password telah dikirim ke email Anda.');
      setResetForm({ email: '' });
    } catch (error: any) {
      setAuthState(prev => ({
        ...prev,
        error: error.message || 'Gagal mengirim link reset password.'
      }));
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('store_auth_token');
    localStorage.removeItem('store_user');
    
    setAuthState({
      isAuthenticated: false,
      user: null,
      loading: false,
      error: null
    });
    
    setSuccessMessage('Logout berhasil. Sampai jumpa!');
  };

  const getRoleBadge = (role: string) => {
    const roleConfig = {
      store_owner: { label: 'Pemilik Toko', variant: 'default' as const, color: 'bg-blue-100 text-blue-800' },
      store_admin: { label: 'Admin Toko', variant: 'secondary' as const, color: 'bg-green-100 text-green-800' },
      store_staff: { label: 'Staff Toko', variant: 'outline' as const, color: 'bg-gray-100 text-gray-800' }
    };
    
    const config = roleConfig[role as keyof typeof roleConfig] || roleConfig.store_staff;
    
    return (
      <Badge variant={config.variant} className={config.color}>
        {config.label}
      </Badge>
    );
  };

  const getVerificationStatus = (emailVerified: boolean, phoneVerified: boolean) => {
    if (emailVerified && phoneVerified) {
      return (
        <div className="flex items-center space-x-1 text-green-600">
          <CheckCircle className="h-4 w-4" />
          <span className="text-sm">Terverifikasi</span>
        </div>
      );
    } else if (emailVerified || phoneVerified) {
      return (
        <div className="flex items-center space-x-1 text-yellow-600">
          <Clock className="h-4 w-4" />
          <span className="text-sm">Sebagian Terverifikasi</span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center space-x-1 text-red-600">
          <AlertCircle className="h-4 w-4" />
          <span className="text-sm">Belum Terverifikasi</span>
        </div>
      );
    }
  };

  // Loading state
  if (authState.loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memeriksa status autentikasi...</p>
        </div>
      </div>
    );
  }

  // Authenticated user dashboard
  if (authState.isAuthenticated && authState.user) {
    return (
      <div className="max-w-4xl mx-auto p-6 space-y-6">
        {/* Success Message */}
        {successMessage && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}
        
        {/* User Profile Header */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Avatar className="h-16 w-16">
                  <AvatarImage src={authState.user.avatar_url} alt={authState.user.name} />
                  <AvatarFallback>
                    <User className="h-8 w-8" />
                  </AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-xl">{authState.user.name}</CardTitle>
                  <CardDescription className="flex items-center space-x-2">
                    <span>{authState.user.email}</span>
                    {getRoleBadge(authState.user.role)}
                  </CardDescription>
                </div>
              </div>
              <Button variant="outline" onClick={handleLogout}>
                <LogIn className="h-4 w-4 mr-2 rotate-180" />
                Logout
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4 text-gray-500" />
                <span className="text-sm">{authState.user.phone || 'Tidak ada'}</span>
              </div>
              
              <div className="flex items-center space-x-2">
                <Store className="h-4 w-4 text-gray-500" />
                <span className="text-sm">ID Toko: {authState.user.store_id}</span>
              </div>
              
              <div>
                {getVerificationStatus(authState.user.email_verified, authState.user.phone_verified)}
              </div>
            </div>
            
            <Separator className="my-4" />
            
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Bergabung sejak: {new Date(authState.user.created_at).toLocaleDateString('id-ID')}</span>
              <span>Login terakhir: {authState.user.last_login ? new Date(authState.user.last_login).toLocaleString('id-ID') : 'Tidak diketahui'}</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Account Status */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                {authState.user.is_active ? (
                  <>
                    <Unlock className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium text-green-700">Akun Aktif</div>
                      <p className="text-xs text-gray-600">Akun dalam kondisi normal</p>
                    </div>
                  </>
                ) : (
                  <>
                    <Lock className="h-5 w-5 text-red-500" />
                    <div>
                      <div className="font-medium text-red-700">Akun Nonaktif</div>
                      <p className="text-xs text-gray-600">Hubungi admin untuk aktivasi</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                {authState.user.email_verified ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium text-green-700">Email Terverifikasi</div>
                      <p className="text-xs text-gray-600">Email sudah dikonfirmasi</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-medium text-yellow-700">Email Belum Terverifikasi</div>
                      <p className="text-xs text-gray-600">Cek email untuk verifikasi</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center space-x-2">
                {authState.user.phone_verified ? (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <div className="font-medium text-green-700">Telepon Terverifikasi</div>
                      <p className="text-xs text-gray-600">Nomor sudah dikonfirmasi</p>
                    </div>
                  </>
                ) : (
                  <>
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                    <div>
                      <div className="font-medium text-yellow-700">Telepon Belum Terverifikasi</div>
                      <p className="text-xs text-gray-600">Verifikasi via SMS</p>
                    </div>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Aksi Cepat</CardTitle>
            <CardDescription>
              Kelola akun dan pengaturan toko Anda
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Settings className="h-6 w-6" />
                <span>Pengaturan Akun</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Shield className="h-6 w-6" />
                <span>Keamanan</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Mail className="h-6 w-6" />
                <span>Verifikasi Email</span>
              </Button>
              
              <Button variant="outline" className="h-auto p-4 flex flex-col items-center space-y-2">
                <Phone className="h-6 w-6" />
                <span>Verifikasi Telepon</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Authentication forms
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Store className="h-8 w-8 text-blue-600" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            Admin Toko
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Kelola toko online Anda dengan mudah
          </p>
        </div>

        {/* Success/Error Messages */}
        {successMessage && (
          <Alert className="border-green-200 bg-green-50">
            <CheckCircle className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              {successMessage}
            </AlertDescription>
          </Alert>
        )}
        
        {authState.error && (
          <Alert className="border-red-200 bg-red-50">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-800">
              {authState.error}
            </AlertDescription>
          </Alert>
        )}

        {/* Auth Forms */}
        <Card>
          <CardContent className="pt-6">
            <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as any)}>
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="login">Login</TabsTrigger>
                <TabsTrigger value="register">Daftar</TabsTrigger>
                <TabsTrigger value="reset">Reset</TabsTrigger>
              </TabsList>

              {/* Login Form */}
              <TabsContent value="login">
                <form onSubmit={handleLogin} className="space-y-4">
                  <div>
                    <Label htmlFor="login-email">Email</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                        <Mail className="h-4 w-4 text-gray-500" />
                      </div>
                      <Input
                        id="login-email"
                        type="email"
                        value={loginForm.email}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="owner@tokosejahtera.com"
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="login-password">Password</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                        <Key className="h-4 w-4 text-gray-500" />
                      </div>
                      <Input
                        id="login-password"
                        type={showPassword ? 'text' : 'password'}
                        value={loginForm.password}
                        onChange={(e) => setLoginForm(prev => ({ ...prev, password: e.target.value }))}
                        placeholder="Masukkan password"
                        className="rounded-none"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        className="rounded-l-none px-3"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </Button>
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Memproses...
                      </>
                    ) : (
                      <>
                        <LogIn className="h-4 w-4 mr-2" />
                        Login
                      </>
                    )}
                  </Button>
                  
                  <div className="text-center text-sm text-gray-600">
                    Demo: owner@tokosejahtera.com / password123
                  </div>
                </form>
              </TabsContent>

              {/* Register Form */}
              <TabsContent value="register">
                <form onSubmit={handleRegister} className="space-y-4">
                  <div className="grid grid-cols-1 gap-4">
                    <div>
                      <Label htmlFor="register-name">Nama Lengkap *</Label>
                      <Input
                        id="register-name"
                        value={registerForm.name}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, name: e.target.value }))}
                        placeholder="Ahmad Sejahtera"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="register-email">Email *</Label>
                      <Input
                        id="register-email"
                        type="email"
                        value={registerForm.email}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="owner@tokosejahtera.com"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="register-phone">Nomor Telepon *</Label>
                      <Input
                        id="register-phone"
                        value={registerForm.phone}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, phone: e.target.value }))}
                        placeholder="081234567890"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="store-name">Nama Toko *</Label>
                      <Input
                        id="store-name"
                        value={registerForm.storeName}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, storeName: e.target.value }))}
                        placeholder="Toko Bangunan Sejahtera"
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="store-category">Kategori Toko *</Label>
                      <select
                        id="store-category"
                        value={registerForm.storeCategory}
                        onChange={(e) => setRegisterForm(prev => ({ ...prev, storeCategory: e.target.value }))}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                      >
                        <option value="">Pilih kategori toko</option>
                        {storeCategories.map(category => (
                          <option key={category} value={category}>{category}</option>
                        ))}
                      </select>
                    </div>
                    
                    <div>
                      <Label htmlFor="register-password">Password *</Label>
                      <div className="flex">
                        <Input
                          id="register-password"
                          type={showPassword ? 'text' : 'password'}
                          value={registerForm.password}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, password: e.target.value }))}
                          placeholder="Minimal 8 karakter"
                          className="rounded-r-none"
                          required
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-l-none px-3"
                          onClick={() => setShowPassword(!showPassword)}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <Label htmlFor="confirm-password">Konfirmasi Password *</Label>
                      <div className="flex">
                        <Input
                          id="confirm-password"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={registerForm.confirmPassword}
                          onChange={(e) => setRegisterForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                          placeholder="Ulangi password"
                          className="rounded-r-none"
                          required
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="rounded-l-none px-3"
                          onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        >
                          {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="agree-terms"
                      checked={registerForm.agreeToTerms}
                      onChange={(e) => setRegisterForm(prev => ({ ...prev, agreeToTerms: e.target.checked }))}
                      className="rounded"
                      required
                    />
                    <Label htmlFor="agree-terms" className="text-sm">
                      Saya setuju dengan <a href="#" className="text-blue-600 hover:underline">syarat dan ketentuan</a>
                    </Label>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Mendaftar...
                      </>
                    ) : (
                      <>
                        <UserPlus className="h-4 w-4 mr-2" />
                        Daftar Sekarang
                      </>
                    )}
                  </Button>
                </form>
              </TabsContent>

              {/* Password Reset Form */}
              <TabsContent value="reset">
                <form onSubmit={handlePasswordReset} className="space-y-4">
                  <div>
                    <Label htmlFor="reset-email">Email</Label>
                    <div className="flex">
                      <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                        <Mail className="h-4 w-4 text-gray-500" />
                      </div>
                      <Input
                        id="reset-email"
                        type="email"
                        value={resetForm.email}
                        onChange={(e) => setResetForm(prev => ({ ...prev, email: e.target.value }))}
                        placeholder="owner@tokosejahtera.com"
                        className="rounded-l-none"
                        required
                      />
                    </div>
                  </div>
                  
                  <Button type="submit" className="w-full" disabled={isLoading}>
                    {isLoading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Mengirim...
                      </>
                    ) : (
                      <>
                        <Key className="h-4 w-4 mr-2" />
                        Kirim Link Reset
                      </>
                    )}
                  </Button>
                  
                  <div className="text-center text-sm text-gray-600">
                    Link reset password akan dikirim ke email Anda
                  </div>
                </form>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StoreAuth;