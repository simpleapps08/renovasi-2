import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/enhanced-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar,
  Camera,
  Save,
  Shield,
  Bell,
  Eye,
  EyeOff,
  ArrowLeft,
  Loader2
} from 'lucide-react'
import { toast } from 'sonner'
import { useAuth } from '@/contexts/AuthContext'
import { supabase } from '@/integrations/supabase/client'

const Profil = () => {
  const navigate = useNavigate()
  const { user, profile, loading: authLoading } = useAuth()
  
  // State untuk data profil yang dapat diedit
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    province: '',
    postalCode: '',
    dateOfBirth: '',
    gender: '',
    occupation: '',
    bio: ''
  })
  
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    smsNotifications: false,
    pushNotifications: true,
    projectUpdates: true,
    promotionalEmails: false,
    paymentReminders: true
  })

  const [showCurrentPassword, setShowCurrentPassword] = useState(false)
  const [showNewPassword, setShowNewPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  // Load user data from auth context and database
  useEffect(() => {
    const loadUserData = async () => {
      if (!user || authLoading) return
      
      try {
        setLoading(true)
        
        // Get additional profile data from user_profiles table
        const { data: profileDetails, error } = await supabase
          .from('user_profiles')
          .select('*')
          .eq('user_id', user.id)
          .single()
        
        if (error && error.code !== 'PGRST116') {
          console.error('Error loading profile:', error)
        }
        
        // Parse name from profile or user metadata
        const fullName = profile?.nama || user.user_metadata?.full_name || user.email?.split('@')[0] || ''
        const nameParts = fullName.split(' ')
        const firstName = nameParts[0] || ''
        const lastName = nameParts.slice(1).join(' ') || ''
        
        // Set profile data from various sources
        setProfileData({
          firstName,
          lastName,
          email: user.email || '',
          phone: profileDetails?.phone || user.user_metadata?.phone || '',
          address: profileDetails?.address || profile?.lokasi || '',
          city: profileDetails?.city || '',
          province: profileDetails?.province || '',
          postalCode: profileDetails?.postal_code || '',
          dateOfBirth: profileDetails?.date_of_birth || '',
          gender: profileDetails?.gender || '',
          occupation: profileDetails?.occupation || '',
          bio: profileDetails?.bio || ''
        })
        
      } catch (error) {
        console.error('Error loading user data:', error)
        // Fallback to basic user data
        const fullName = profile?.nama || user.user_metadata?.full_name || user.email?.split('@')[0] || ''
        const nameParts = fullName.split(' ')
        
        setProfileData(prev => ({
          ...prev,
          firstName: nameParts[0] || '',
          lastName: nameParts.slice(1).join(' ') || '',
          email: user.email || ''
        }))
      } finally {
        setLoading(false)
      }
    }
    
    loadUserData()
  }, [user, profile, authLoading])

  const handleProfileUpdate = async () => {
    if (!user) {
      toast.error('Anda harus login terlebih dahulu')
      return
    }

    // Validate required fields
    if (!profileData.firstName || !profileData.lastName || !profileData.email) {
      toast.error('Nama depan, nama belakang, dan email wajib diisi')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(profileData.email)) {
      toast.error('Format email tidak valid')
      return
    }

    // Validate phone number (Indonesian format)
    if (profileData.phone && !/^(\+62|62|0)[0-9]{9,13}$/.test(profileData.phone.replace(/[\s-]/g, ''))) {
      toast.error('Format nomor telepon tidak valid')
      return
    }

    try {
      setSaving(true)
      
      // Update user profile in user_profiles table
      const { error: profileError } = await supabase
        .from('user_profiles')
        .upsert({
          user_id: user.id,
          phone: profileData.phone,
          address: profileData.address,
          city: profileData.city,
          province: profileData.province,
          postal_code: profileData.postalCode,
          date_of_birth: profileData.dateOfBirth,
          gender: profileData.gender,
          occupation: profileData.occupation,
          bio: profileData.bio,
          updated_at: new Date().toISOString()
        })
      
      if (profileError) throw profileError
      
      // Update profiles table (for nama)
      const fullName = `${profileData.firstName} ${profileData.lastName}`.trim()
      const { error: nameError } = await supabase
        .from('profiles')
        .upsert({
          id: user.id,
          nama: fullName,
          updated_at: new Date().toISOString()
        })
      
      if (nameError) throw nameError
      
      // Update user metadata if email changed
      if (profileData.email !== user.email) {
        const { error: emailError } = await supabase.auth.updateUser({
          email: profileData.email
        })
        
        if (emailError) {
          console.warn('Email update failed:', emailError)
          toast.warning('Profil diperbarui, namun perubahan email memerlukan verifikasi')
        } else {
          toast.success('Profil berhasil diperbarui! Silakan cek email untuk verifikasi perubahan email.')
        }
      } else {
        toast.success('Profil berhasil diperbarui!')
      }
      
    } catch (error) {
      console.error('Error updating profile:', error)
      toast.error('Gagal memperbarui profil. Silakan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const handlePasswordChange = async () => {
    if (!user) {
      toast.error('Anda harus login terlebih dahulu')
      return
    }

    if (!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword) {
      toast.error('Mohon lengkapi semua field password')
      return
    }

    if (passwordData.newPassword.length < 8) {
      toast.error('Password baru minimal 8 karakter')
      return
    }

    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast.error('Konfirmasi password tidak cocok')
      return
    }

    try {
      setSaving(true)
      
      // Update password using Supabase auth
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      })
      
      if (error) throw error
      
      toast.success('Password berhasil diubah!')
      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      })
      
    } catch (error) {
      console.error('Error updating password:', error)
      toast.error('Gagal mengubah password. Silakan coba lagi.')
    } finally {
      setSaving(false)
    }
  }

  const handleNotificationUpdate = () => {
    // Simulate API call
    console.log('Updating notifications:', notificationSettings)
    toast.success('Pengaturan notifikasi berhasil diperbarui')
  }

  const handleAvatarUpload = () => {
    toast.info('Fitur upload foto profil akan segera tersedia')
  }

  // Show loading state
  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground">Memuat data profil...</p>
        </div>
      </div>
    )
  }

  // Redirect if not authenticated
  if (!user) {
    navigate('/login')
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => navigate(-1)}
                className="text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Kembali
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Profil Saya</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
       <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
         <div className="space-y-4 sm:space-y-6">
           {/* Profile Header */}
           <Card>
             <CardContent className="pt-4 sm:pt-6">
               <div className="flex flex-col sm:flex-row items-center sm:items-center gap-4 sm:gap-6">
                 <div className="relative">
                   <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                     <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} alt="Profile" />
                     <AvatarFallback className="text-base sm:text-lg font-semibold bg-primary text-primary-foreground">
                       {loading ? '...' : `${profileData.firstName.charAt(0)}${profileData.lastName.charAt(0)}`.toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                     </AvatarFallback>
                   </Avatar>
                   <Button 
                     size="sm" 
                     className="absolute -bottom-2 -right-2 h-7 w-7 sm:h-8 sm:w-8 rounded-full p-0"
                     onClick={() => toast.info('Fitur upload foto akan segera tersedia')}
                   >
                     <Camera className="h-3 w-3 sm:h-4 sm:w-4" />
                   </Button>
                 </div>
                 
                 <div className="flex-1 text-center sm:text-left">
                   <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                     {profileData.firstName} {profileData.lastName}
                   </h2>
                   <p className="text-gray-600 mt-1 text-sm sm:text-base">{profileData.email}</p>
                   <p className="text-gray-500 text-xs sm:text-sm mt-1 sm:mt-2">{profileData.occupation || 'Belum diisi'}</p>
                 </div>
               </div>
             </CardContent>
           </Card>

           <Tabs defaultValue="profile" className="space-y-4 sm:space-y-6">
             <TabsList className="grid w-full grid-cols-3">
               <TabsTrigger value="profile" className="text-xs sm:text-sm">Profil</TabsTrigger>
               <TabsTrigger value="security" className="text-xs sm:text-sm">Keamanan</TabsTrigger>
               <TabsTrigger value="notifications" className="text-xs sm:text-sm">Notifikasi</TabsTrigger>
             </TabsList>

              <TabsContent value="profile" className="space-y-4 sm:space-y-6">
                {/* Profile Photo */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="text-lg sm:text-xl">Foto Profil</CardTitle>
                    <CardDescription className="text-sm">Upload dan kelola foto profil Anda</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6">
                      <Avatar className="h-20 w-20 sm:h-24 sm:w-24">
                        <AvatarImage src={profile?.avatar_url || user?.user_metadata?.avatar_url} alt="Profile" />
                        <AvatarFallback className="text-lg sm:text-2xl">
                          {loading ? '...' : `${profileData.firstName.charAt(0)}${profileData.lastName.charAt(0)}`.toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 text-center sm:text-left">
                        <h3 className="font-medium text-sm sm:text-base">{profileData.firstName} {profileData.lastName}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-3 sm:mb-4">
                          Format yang didukung: JPG, PNG. Maksimal 2MB.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-2">
                          <Button size="sm" onClick={() => toast.info('Fitur upload foto akan segera tersedia')} className="w-full sm:w-auto">
                            <Camera className="h-4 w-4 mr-2" />
                            Upload Foto
                          </Button>
                          <Button variant="outline" size="sm" onClick={() => toast.info('Fitur hapus foto akan segera tersedia')} className="w-full sm:w-auto">
                            Hapus
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Personal Information */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg sm:text-xl">
                      <User className="h-4 w-4 sm:h-5 sm:w-5" />
                      Informasi Pribadi
                    </CardTitle>
                    <CardDescription className="text-sm">Perbarui informasi pribadi Anda</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 sm:space-y-6">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName" className="text-sm font-medium">Nama Depan *</Label>
                        <Input
                          id="firstName"
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                          placeholder="Nama depan"
                          className="h-10 sm:h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName" className="text-sm font-medium">Nama Belakang *</Label>
                        <Input
                          id="lastName"
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                          placeholder="Nama belakang"
                          className="h-10 sm:h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-medium">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={profileData.email}
                          onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                          placeholder="email@example.com"
                          className="h-10 sm:h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone" className="text-sm font-medium">Nomor Telepon</Label>
                        <Input
                          id="phone"
                          value={profileData.phone}
                          onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                          placeholder="081234567890"
                          className="h-10 sm:h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="dateOfBirth" className="text-sm font-medium">Tanggal Lahir</Label>
                        <Input
                          id="dateOfBirth"
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                          className="h-10 sm:h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="gender" className="text-sm font-medium">Jenis Kelamin</Label>
                        <Select value={profileData.gender} onValueChange={(value) => setProfileData({...profileData, gender: value})}>
                          <SelectTrigger className="h-10 sm:h-10">
                            <SelectValue placeholder="Pilih jenis kelamin" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="male">Laki-laki</SelectItem>
                            <SelectItem value="female">Perempuan</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-2 md:col-span-2">
                        <Label htmlFor="occupation" className="text-sm font-medium">Pekerjaan</Label>
                        <Input
                          id="occupation"
                          value={profileData.occupation}
                          onChange={(e) => setProfileData({...profileData, occupation: e.target.value})}
                          placeholder="Pekerjaan Anda"
                          className="h-10 sm:h-10"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="bio" className="text-sm font-medium">Bio</Label>
                      <Textarea
                        id="bio"
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                        placeholder="Ceritakan sedikit tentang diri Anda..."
                        rows={3}
                        className="min-h-[80px] resize-none"
                      />
                    </div>
                  </CardContent>
                </Card>

                {/* Address Information */}
                <Card>
                  <CardHeader className="pb-4">
                    <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                      <MapPin className="h-5 w-5" />
                      Alamat
                    </CardTitle>
                    <CardDescription className="text-sm text-muted-foreground">Informasi alamat tempat tinggal</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4 p-4 sm:p-6">
                    <div className="space-y-2">
                      <Label htmlFor="address" className="text-sm font-medium">Alamat Lengkap</Label>
                      <Textarea
                        id="address"
                        value={profileData.address}
                        onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                        placeholder="Jalan, nomor rumah, RT/RW"
                        rows={2}
                        className="min-h-[60px] resize-none"
                      />
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-medium">Kota</Label>
                        <Input
                          id="city"
                          value={profileData.city}
                          onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                          placeholder="Nama kota"
                          className="h-10 sm:h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="province" className="text-sm font-medium">Provinsi</Label>
                        <Input
                          id="province"
                          value={profileData.province}
                          onChange={(e) => setProfileData({...profileData, province: e.target.value})}
                          placeholder="Nama provinsi"
                          className="h-10 sm:h-10"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="postalCode" className="text-sm font-medium">Kode Pos</Label>
                        <Input
                          id="postalCode"
                          value={profileData.postalCode}
                          onChange={(e) => setProfileData({...profileData, postalCode: e.target.value})}
                          placeholder="12345"
                          className="h-10 sm:h-10"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <div className="flex flex-col sm:flex-row justify-end gap-3">
                  <Button onClick={handleProfileUpdate} disabled={saving} className="w-full sm:w-auto h-10 sm:h-10">
                    {saving ? (
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4 mr-2" />
                    )}
                    {saving ? 'Menyimpan...' : 'Simpan Perubahan'}
                  </Button>
                </div>
        </TabsContent>

             <TabsContent value="security" className="space-y-6">
               {/* Change Password */}
               <Card>
                 <CardHeader className="pb-4">
                   <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                     <Shield className="h-5 w-5" />
                     Ubah Password
                   </CardTitle>
                   <CardDescription className="text-sm text-muted-foreground">Perbarui password untuk keamanan akun</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-4 p-4 sm:p-6">
                   <div className="space-y-2">
                     <Label htmlFor="currentPassword" className="text-sm font-medium">Password Saat Ini</Label>
                     <div className="relative">
                       <Input
                         id="currentPassword"
                         type={showCurrentPassword ? 'text' : 'password'}
                         value={passwordData.currentPassword}
                         onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                         placeholder="Masukkan password saat ini"
                         className="h-10 sm:h-10 pr-10"
                       />
                       <Button
                         type="button"
                         variant="ghost"
                         size="sm"
                         className="absolute right-0 top-0 h-10 w-10 px-0 hover:bg-transparent"
                         onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                       >
                         {showCurrentPassword ? (
                           <EyeOff className="h-4 w-4" />
                         ) : (
                           <Eye className="h-4 w-4" />
                         )}
                       </Button>
                     </div>
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="newPassword" className="text-sm font-medium">Password Baru</Label>
                     <div className="relative">
                       <Input
                         id="newPassword"
                         type={showNewPassword ? 'text' : 'password'}
                         value={passwordData.newPassword}
                         onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                         placeholder="Masukkan password baru (minimal 8 karakter)"
                         className="h-10 sm:h-10 pr-10"
                       />
                       <Button
                         type="button"
                         variant="ghost"
                         size="sm"
                         className="absolute right-0 top-0 h-10 w-10 px-0 hover:bg-transparent"
                         onClick={() => setShowNewPassword(!showNewPassword)}
                       >
                         {showNewPassword ? (
                           <EyeOff className="h-4 w-4" />
                         ) : (
                           <Eye className="h-4 w-4" />
                         )}
                       </Button>
                     </div>
                   </div>
                   <div className="space-y-2">
                     <Label htmlFor="confirmPassword" className="text-sm font-medium">Konfirmasi Password Baru</Label>
                     <div className="relative">
                       <Input
                         id="confirmPassword"
                         type={showConfirmPassword ? 'text' : 'password'}
                         value={passwordData.confirmPassword}
                         onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                         placeholder="Ulangi password baru"
                         className="h-10 sm:h-10 pr-10"
                       />
                       <Button
                         type="button"
                         variant="ghost"
                         size="sm"
                         className="absolute right-0 top-0 h-10 w-10 px-0 hover:bg-transparent"
                         onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                       >
                         {showConfirmPassword ? (
                           <EyeOff className="h-4 w-4" />
                         ) : (
                           <Eye className="h-4 w-4" />
                         )}
                       </Button>
                     </div>
                   </div>
                   <Button onClick={handlePasswordChange} disabled={saving} className="w-full sm:w-auto h-10 sm:h-10">
                     {saving ? (
                       <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                     ) : (
                       <Shield className="h-4 w-4 mr-2" />
                     )}
                     {saving ? 'Mengubah Password...' : 'Ubah Password'}
                   </Button>
                 </CardContent>
               </Card>

               {/* Account Info */}
               <Card>
                 <CardHeader className="pb-4">
                   <CardTitle className="text-lg font-semibold">Informasi Akun</CardTitle>
                 </CardHeader>
                 <CardContent className="space-y-4 p-4 sm:p-6">
                   <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div>
                       <p className="text-sm font-medium">Tanggal Bergabung</p>
                       <p className="text-sm text-muted-foreground">15 Januari 2024</p>
                     </div>
                     <div>
                       <p className="text-sm font-medium">Login Terakhir</p>
                       <p className="text-sm text-muted-foreground">Hari ini, 14:30 WIB</p>
                     </div>
                     <div>
                       <p className="text-sm font-medium">Status Akun</p>
                       <p className="text-sm text-green-600 font-medium">Aktif & Terverifikasi</p>
                     </div>
                     <div>
                       <p className="text-sm font-medium">ID Pengguna</p>
                       <p className="text-sm text-muted-foreground">USR-2024-001</p>
                     </div>
                   </div>
                 </CardContent>
               </Card>
             </TabsContent>

             <TabsContent value="notifications" className="space-y-6">
               <Card>
                 <CardHeader className="pb-4">
                   <CardTitle className="flex items-center gap-2 text-lg font-semibold">
                     <Bell className="h-5 w-5" />
                     Pengaturan Notifikasi
                   </CardTitle>
                   <CardDescription className="text-sm text-muted-foreground">Kelola preferensi notifikasi Anda</CardDescription>
                 </CardHeader>
                 <CardContent className="space-y-6 p-4 sm:p-6">
                   <div className="space-y-4">
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                       <div className="flex-1">
                         <p className="font-medium text-sm sm:text-base">Notifikasi Email</p>
                         <p className="text-sm text-muted-foreground">Terima notifikasi melalui email</p>
                       </div>
                       <Button
                         variant={notificationSettings.emailNotifications ? "default" : "outline"}
                         size="sm"
                         className="w-full sm:w-auto h-9"
                         onClick={() => setNotificationSettings({
                           ...notificationSettings,
                           emailNotifications: !notificationSettings.emailNotifications
                         })}
                       >
                         {notificationSettings.emailNotifications ? 'Aktif' : 'Nonaktif'}
                       </Button>
                     </div>
                     
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                       <div className="flex-1">
                         <p className="font-medium text-sm sm:text-base">Notifikasi SMS</p>
                         <p className="text-sm text-muted-foreground">Terima notifikasi melalui SMS</p>
                       </div>
                       <Button
                         variant={notificationSettings.smsNotifications ? "default" : "outline"}
                         size="sm"
                         className="w-full sm:w-auto h-9"
                         onClick={() => setNotificationSettings({
                           ...notificationSettings,
                           smsNotifications: !notificationSettings.smsNotifications
                         })}
                       >
                         {notificationSettings.smsNotifications ? 'Aktif' : 'Nonaktif'}
                       </Button>
                     </div>
                     
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                       <div className="flex-1">
                         <p className="font-medium text-sm sm:text-base">Push Notification</p>
                         <p className="text-sm text-muted-foreground">Notifikasi langsung di browser</p>
                       </div>
                       <Button
                         variant={notificationSettings.pushNotifications ? "default" : "outline"}
                         size="sm"
                         className="w-full sm:w-auto h-9"
                         onClick={() => setNotificationSettings({
                           ...notificationSettings,
                           pushNotifications: !notificationSettings.pushNotifications
                         })}
                       >
                         {notificationSettings.pushNotifications ? 'Aktif' : 'Nonaktif'}
                       </Button>
                     </div>
                     
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                       <div className="flex-1">
                         <p className="font-medium text-sm sm:text-base">Update Proyek</p>
                         <p className="text-sm text-muted-foreground">Notifikasi progress dan update proyek</p>
                       </div>
                       <Button
                         variant={notificationSettings.projectUpdates ? "default" : "outline"}
                         size="sm"
                         className="w-full sm:w-auto h-9"
                         onClick={() => setNotificationSettings({
                           ...notificationSettings,
                           projectUpdates: !notificationSettings.projectUpdates
                         })}
                       >
                         {notificationSettings.projectUpdates ? 'Aktif' : 'Nonaktif'}
                       </Button>
                     </div>
                     
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                       <div className="flex-1">
                         <p className="font-medium text-sm sm:text-base">Email Promosi</p>
                         <p className="text-sm text-muted-foreground">Penawaran khusus dan promosi</p>
                       </div>
                       <Button
                         variant={notificationSettings.promotionalEmails ? "default" : "outline"}
                         size="sm"
                         className="w-full sm:w-auto h-9"
                         onClick={() => setNotificationSettings({
                           ...notificationSettings,
                           promotionalEmails: !notificationSettings.promotionalEmails
                         })}
                       >
                         {notificationSettings.promotionalEmails ? 'Aktif' : 'Nonaktif'}
                       </Button>
                     </div>
                     
                     <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                       <div className="flex-1">
                         <p className="font-medium text-sm sm:text-base">Pengingat Pembayaran</p>
                         <p className="text-sm text-muted-foreground">Reminder untuk pembayaran yang jatuh tempo</p>
                       </div>
                       <Button
                         variant={notificationSettings.paymentReminders ? "default" : "outline"}
                         size="sm"
                         className="w-full sm:w-auto h-9"
                         onClick={() => setNotificationSettings({
                           ...notificationSettings,
                           paymentReminders: !notificationSettings.paymentReminders
                         })}
                       >
                         {notificationSettings.paymentReminders ? 'Aktif' : 'Nonaktif'}
                       </Button>
                     </div>
                   </div>
                   
                   <Button onClick={handleNotificationUpdate} className="w-full sm:w-auto h-10 sm:h-10">
                     <Save className="h-4 w-4 mr-2" />
                     Simpan Pengaturan
                   </Button>
                 </CardContent>
               </Card>
             </TabsContent>
           </Tabs>
        </div>
      </div>
    </div>
  )
}

export default Profil