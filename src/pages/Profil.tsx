import React, { useState } from 'react'
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
  ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'

const Profil = () => {
  const navigate = useNavigate()
  
  // Data dummy untuk pengguna Agus
  const [profileData, setProfileData] = useState({
    firstName: 'Agus',
    lastName: 'Setiawan',
    email: 'simple.apps08@gmail.com',
    phone: '081234567890',
    address: 'Jl. Merdeka No. 123',
    city: 'Jakarta Selatan',
    province: 'DKI Jakarta',
    postalCode: '12560',
    dateOfBirth: '1985-05-15',
    gender: 'male',
    occupation: 'Wiraswasta',
    bio: 'Pengusaha yang tertarik dengan renovasi dan desain interior modern. Sudah berpengalaman dalam beberapa proyek renovasi rumah.'
  })

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

  const handleProfileUpdate = () => {
    // Validate required fields
    if (!profileData.firstName || !profileData.lastName || !profileData.email) {
      toast.error('Mohon lengkapi nama dan email')
      return
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(profileData.email)) {
      toast.error('Format email tidak valid')
      return
    }

    // Validate phone number
    if (profileData.phone && !/^[0-9+\-\s()]+$/.test(profileData.phone)) {
      toast.error('Format nomor telepon tidak valid')
      return
    }

    // Simulate API call
    console.log('Updating profile:', profileData)
    toast.success('Profil berhasil diperbarui')
  }

  const handlePasswordChange = () => {
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

    // Simulate API call
    console.log('Changing password')
    toast.success('Password berhasil diubah')
    setPasswordData({
      currentPassword: '',
      newPassword: '',
      confirmPassword: ''
    })
  }

  const handleNotificationUpdate = () => {
    // Simulate API call
    console.log('Updating notifications:', notificationSettings)
    toast.success('Pengaturan notifikasi berhasil diperbarui')
  }

  const handleAvatarUpload = () => {
    toast.info('Fitur upload foto profil akan segera tersedia')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate('/dashboard')} 
            variant="outline" 
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Profil Saya</h1>
            <p className="text-muted-foreground">Kelola informasi profil dan pengaturan akun Anda</p>
          </div>
        </div>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList>
          <TabsTrigger value="profile">Informasi Profil</TabsTrigger>
          <TabsTrigger value="security">Keamanan</TabsTrigger>
          <TabsTrigger value="notifications">Notifikasi</TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="space-y-6">
          {/* Profile Photo */}
          <Card>
            <CardHeader>
              <CardTitle>Foto Profil</CardTitle>
              <CardDescription>Ubah foto profil Anda</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-6">
                <Avatar className="h-24 w-24">
                  <AvatarImage src="" alt="Agus Setiawan" />
                  <AvatarFallback className="text-2xl">
                    {profileData.firstName.charAt(0)}{profileData.lastName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-2">
                  <Button onClick={handleAvatarUpload} variant="outline">
                    <Camera className="h-4 w-4 mr-2" />
                    Ubah Foto
                  </Button>
                  <p className="text-sm text-muted-foreground">
                    Format: JPG, PNG. Maksimal 2MB
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Informasi Pribadi
              </CardTitle>
              <CardDescription>Perbarui informasi pribadi Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">Nama Depan *</Label>
                  <Input
                    id="firstName"
                    value={profileData.firstName}
                    onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                    placeholder="Nama depan"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Nama Belakang *</Label>
                  <Input
                    id="lastName"
                    value={profileData.lastName}
                    onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                    placeholder="Nama belakang"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                    placeholder="email@example.com"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">Nomor Telepon</Label>
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                    placeholder="081234567890"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Tanggal Lahir</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={profileData.dateOfBirth}
                    onChange={(e) => setProfileData({...profileData, dateOfBirth: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="gender">Jenis Kelamin</Label>
                  <Select value={profileData.gender} onValueChange={(value) => setProfileData({...profileData, gender: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis kelamin" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="male">Laki-laki</SelectItem>
                      <SelectItem value="female">Perempuan</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2 md:col-span-2">
                  <Label htmlFor="occupation">Pekerjaan</Label>
                  <Input
                    id="occupation"
                    value={profileData.occupation}
                    onChange={(e) => setProfileData({...profileData, occupation: e.target.value})}
                    placeholder="Pekerjaan Anda"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  value={profileData.bio}
                  onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                  placeholder="Ceritakan sedikit tentang diri Anda..."
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Address Information */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                Alamat
              </CardTitle>
              <CardDescription>Informasi alamat tempat tinggal</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="address">Alamat Lengkap</Label>
                <Textarea
                  id="address"
                  value={profileData.address}
                  onChange={(e) => setProfileData({...profileData, address: e.target.value})}
                  placeholder="Jalan, nomor rumah, RT/RW"
                  rows={2}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="city">Kota</Label>
                  <Input
                    id="city"
                    value={profileData.city}
                    onChange={(e) => setProfileData({...profileData, city: e.target.value})}
                    placeholder="Nama kota"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="province">Provinsi</Label>
                  <Input
                    id="province"
                    value={profileData.province}
                    onChange={(e) => setProfileData({...profileData, province: e.target.value})}
                    placeholder="Nama provinsi"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="postalCode">Kode Pos</Label>
                  <Input
                    id="postalCode"
                    value={profileData.postalCode}
                    onChange={(e) => setProfileData({...profileData, postalCode: e.target.value})}
                    placeholder="12345"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button onClick={handleProfileUpdate}>
              <Save className="h-4 w-4 mr-2" />
              Simpan Perubahan
            </Button>
          </div>
        </TabsContent>

        <TabsContent value="security" className="space-y-6">
          {/* Change Password */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Ubah Password
              </CardTitle>
              <CardDescription>Perbarui password untuk keamanan akun</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="currentPassword">Password Saat Ini</Label>
                <div className="relative">
                  <Input
                    id="currentPassword"
                    type={showCurrentPassword ? 'text' : 'password'}
                    value={passwordData.currentPassword}
                    onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                    placeholder="Masukkan password saat ini"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                <Label htmlFor="newPassword">Password Baru</Label>
                <div className="relative">
                  <Input
                    id="newPassword"
                    type={showNewPassword ? 'text' : 'password'}
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                    placeholder="Masukkan password baru (minimal 8 karakter)"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
                <Label htmlFor="confirmPassword">Konfirmasi Password Baru</Label>
                <div className="relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                    placeholder="Ulangi password baru"
                  />
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
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
              <Button onClick={handlePasswordChange}>
                <Shield className="h-4 w-4 mr-2" />
                Ubah Password
              </Button>
            </CardContent>
          </Card>

          {/* Account Info */}
          <Card>
            <CardHeader>
              <CardTitle>Informasi Akun</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Pengaturan Notifikasi
              </CardTitle>
              <CardDescription>Kelola preferensi notifikasi Anda</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifikasi Email</p>
                    <p className="text-sm text-muted-foreground">Terima notifikasi melalui email</p>
                  </div>
                  <Button
                    variant={notificationSettings.emailNotifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      emailNotifications: !notificationSettings.emailNotifications
                    })}
                  >
                    {notificationSettings.emailNotifications ? 'Aktif' : 'Nonaktif'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Notifikasi SMS</p>
                    <p className="text-sm text-muted-foreground">Terima notifikasi melalui SMS</p>
                  </div>
                  <Button
                    variant={notificationSettings.smsNotifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      smsNotifications: !notificationSettings.smsNotifications
                    })}
                  >
                    {notificationSettings.smsNotifications ? 'Aktif' : 'Nonaktif'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Push Notification</p>
                    <p className="text-sm text-muted-foreground">Notifikasi langsung di browser</p>
                  </div>
                  <Button
                    variant={notificationSettings.pushNotifications ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      pushNotifications: !notificationSettings.pushNotifications
                    })}
                  >
                    {notificationSettings.pushNotifications ? 'Aktif' : 'Nonaktif'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Update Proyek</p>
                    <p className="text-sm text-muted-foreground">Notifikasi progress dan update proyek</p>
                  </div>
                  <Button
                    variant={notificationSettings.projectUpdates ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      projectUpdates: !notificationSettings.projectUpdates
                    })}
                  >
                    {notificationSettings.projectUpdates ? 'Aktif' : 'Nonaktif'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Email Promosi</p>
                    <p className="text-sm text-muted-foreground">Penawaran khusus dan promosi</p>
                  </div>
                  <Button
                    variant={notificationSettings.promotionalEmails ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      promotionalEmails: !notificationSettings.promotionalEmails
                    })}
                  >
                    {notificationSettings.promotionalEmails ? 'Aktif' : 'Nonaktif'}
                  </Button>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Pengingat Pembayaran</p>
                    <p className="text-sm text-muted-foreground">Reminder untuk pembayaran yang jatuh tempo</p>
                  </div>
                  <Button
                    variant={notificationSettings.paymentReminders ? "default" : "outline"}
                    size="sm"
                    onClick={() => setNotificationSettings({
                      ...notificationSettings,
                      paymentReminders: !notificationSettings.paymentReminders
                    })}
                  >
                    {notificationSettings.paymentReminders ? 'Aktif' : 'Nonaktif'}
                  </Button>
                </div>
              </div>
              
              <Button onClick={handleNotificationUpdate}>
                <Save className="h-4 w-4 mr-2" />
                Simpan Pengaturan
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Profil