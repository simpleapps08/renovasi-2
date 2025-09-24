import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Store, 
  Upload, 
  Save, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star, 
  Users, 
  Calendar,
  Camera,
  Edit,
  CheckCircle,
  AlertCircle,
  Clock,
  Truck,
  CreditCard,
  Shield
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

interface StoreProfile {
  id: string;
  name: string;
  description: string;
  address: string;
  phone: string;
  email: string;
  website?: string;
  logo_url?: string;
  banner_url?: string;
  is_active: boolean;
  rating: number;
  total_reviews: number;
  total_followers: number;
  category: string;
  established_year?: number;
  business_hours: {
    monday: { open: string; close: string; is_open: boolean };
    tuesday: { open: string; close: string; is_open: boolean };
    wednesday: { open: string; close: string; is_open: boolean };
    thursday: { open: string; close: string; is_open: boolean };
    friday: { open: string; close: string; is_open: boolean };
    saturday: { open: string; close: string; is_open: boolean };
    sunday: { open: string; close: string; is_open: boolean };
  };
  shipping_info: {
    free_shipping_min: number;
    shipping_cost: number;
    processing_time: string;
    shipping_areas: string[];
  };
  payment_methods: string[];
  policies: {
    return_policy: string;
    warranty_policy: string;
    privacy_policy: string;
  };
  social_media: {
    facebook?: string;
    instagram?: string;
    whatsapp?: string;
    telegram?: string;
  };
  verification_status: 'pending' | 'verified' | 'rejected';
  created_at: string;
  updated_at: string;
}

const storeCategories = [
  'Bahan Bangunan',
  'Alat Konstruksi', 
  'Cat & Finishing',
  'Kayu & Furniture',
  'Listrik & Plumbing',
  'Keramik & Lantai'
];

const paymentMethods = [
  'Transfer Bank',
  'E-Wallet (OVO, GoPay, DANA)',
  'Kartu Kredit/Debit',
  'COD (Cash on Delivery)',
  'Cicilan 0%',
  'Crypto'
];

const daysOfWeek = [
  { key: 'monday', label: 'Senin' },
  { key: 'tuesday', label: 'Selasa' },
  { key: 'wednesday', label: 'Rabu' },
  { key: 'thursday', label: 'Kamis' },
  { key: 'friday', label: 'Jumat' },
  { key: 'saturday', label: 'Sabtu' },
  { key: 'sunday', label: 'Minggu' }
];

const StoreManagement: React.FC = () => {
  const [storeProfile, setStoreProfile] = useState<StoreProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [bannerFile, setBannerFile] = useState<File | null>(null);
  const [logoPreview, setLogoPreview] = useState<string>('');
  const [bannerPreview, setBannerPreview] = useState<string>('');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const loadStoreProfile = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setStoreProfile({
          id: '1',
          name: 'Toko Bangunan Sejahtera',
          description: 'Toko bahan bangunan terpercaya dengan pengalaman lebih dari 15 tahun. Menyediakan berbagai macam bahan bangunan berkualitas dengan harga terjangkau.',
          address: 'Jl. Raya Pembangunan No. 123, Jakarta Selatan 12345',
          phone: '021-12345678',
          email: 'info@tokosejahtera.com',
          website: 'https://tokosejahtera.com',
          logo_url: '/placeholder-logo.jpg',
          banner_url: '/placeholder-banner.jpg',
          is_active: true,
          rating: 4.8,
          total_reviews: 234,
          total_followers: 1567,
          category: 'Bahan Bangunan',
          established_year: 2008,
          business_hours: {
            monday: { open: '08:00', close: '17:00', is_open: true },
            tuesday: { open: '08:00', close: '17:00', is_open: true },
            wednesday: { open: '08:00', close: '17:00', is_open: true },
            thursday: { open: '08:00', close: '17:00', is_open: true },
            friday: { open: '08:00', close: '17:00', is_open: true },
            saturday: { open: '08:00', close: '15:00', is_open: true },
            sunday: { open: '09:00', close: '14:00', is_open: false }
          },
          shipping_info: {
            free_shipping_min: 500000,
            shipping_cost: 25000,
            processing_time: '1-2 hari kerja',
            shipping_areas: ['Jakarta', 'Bogor', 'Depok', 'Tangerang', 'Bekasi']
          },
          payment_methods: ['Transfer Bank', 'E-Wallet (OVO, GoPay, DANA)', 'COD (Cash on Delivery)'],
          policies: {
            return_policy: 'Barang dapat dikembalikan dalam 7 hari jika ada kerusakan atau tidak sesuai pesanan.',
            warranty_policy: 'Garansi sesuai dengan ketentuan dari masing-masing produsen.',
            privacy_policy: 'Data pelanggan dijaga kerahasiaannya dan tidak akan disebarluaskan.'
          },
          social_media: {
            facebook: 'https://facebook.com/tokosejahtera',
            instagram: '@tokosejahtera',
            whatsapp: '6281234567890',
            telegram: '@tokosejahtera'
          },
          verification_status: 'verified',
          created_at: '2024-01-01',
          updated_at: '2024-01-15'
        });
        setLoading(false);
      }, 1000);
    };

    loadStoreProfile();
  }, []);

  const handleLogoUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setLogoFile(file);
      const previewUrl = URL.createObjectURL(file);
      setLogoPreview(previewUrl);
    }
  };

  const handleBannerUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setBannerFile(file);
      const previewUrl = URL.createObjectURL(file);
      setBannerPreview(previewUrl);
    }
  };

  const handleSave = async () => {
    if (!storeProfile) return;
    
    setSaving(true);
    try {
      // Here you would upload images and update store profile
      console.log('Saving store profile:', storeProfile);
      console.log('Logo file:', logoFile);
      console.log('Banner file:', bannerFile);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      alert('Profil toko berhasil disimpan!');
    } catch (error) {
      console.error('Error saving store profile:', error);
      alert('Gagal menyimpan profil toko');
    } finally {
      setSaving(false);
    }
  };

  const updateStoreProfile = (updates: Partial<StoreProfile>) => {
    if (storeProfile) {
      setStoreProfile({ ...storeProfile, ...updates });
    }
  };

  const updateBusinessHours = (day: string, updates: Partial<{ open: string; close: string; is_open: boolean }>) => {
    if (storeProfile) {
      setStoreProfile({
        ...storeProfile,
        business_hours: {
          ...storeProfile.business_hours,
          [day]: {
            ...storeProfile.business_hours[day as keyof typeof storeProfile.business_hours],
            ...updates
          }
        }
      });
    }
  };

  const updateShippingInfo = (updates: Partial<StoreProfile['shipping_info']>) => {
    if (storeProfile) {
      setStoreProfile({
        ...storeProfile,
        shipping_info: {
          ...storeProfile.shipping_info,
          ...updates
        }
      });
    }
  };

  const updatePolicies = (updates: Partial<StoreProfile['policies']>) => {
    if (storeProfile) {
      setStoreProfile({
        ...storeProfile,
        policies: {
          ...storeProfile.policies,
          ...updates
        }
      });
    }
  };

  const updateSocialMedia = (updates: Partial<StoreProfile['social_media']>) => {
    if (storeProfile) {
      setStoreProfile({
        ...storeProfile,
        social_media: {
          ...storeProfile.social_media,
          ...updates
        }
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getVerificationBadge = (status: string) => {
    const statusConfig = {
      verified: { label: 'Terverifikasi', variant: 'default' as const, icon: CheckCircle, color: 'text-green-600' },
      pending: { label: 'Menunggu Verifikasi', variant: 'secondary' as const, icon: Clock, color: 'text-yellow-600' },
      rejected: { label: 'Ditolak', variant: 'destructive' as const, icon: AlertCircle, color: 'text-red-600' }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    const Icon = config.icon;
    
    return (
      <Badge variant={config.variant} className="flex items-center space-x-1">
        <Icon className="h-3 w-3" />
        <span>{config.label}</span>
      </Badge>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat profil toko...</p>
        </div>
      </div>
    );
  }

  if (!storeProfile) {
    return (
      <div className="text-center py-12">
        <Store className="h-12 w-12 text-gray-400 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">Profil toko tidak ditemukan</h3>
        <p className="text-gray-600">Silakan hubungi administrator untuk bantuan.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Toko</h2>
          <p className="text-gray-600">Kelola profil dan pengaturan toko Anda</p>
        </div>
        <div className="flex items-center space-x-3">
          {getVerificationBadge(storeProfile.verification_status)}
          <Button onClick={handleSave} disabled={saving}>
            {saving ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Menyimpan...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Simpan Perubahan
              </>
            )}
          </Button>
        </div>
      </div>

      {/* Store Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-yellow-400 fill-current" />
              <div>
                <div className="text-2xl font-bold">{storeProfile.rating}</div>
                <p className="text-xs text-gray-600">{storeProfile.total_reviews} ulasan</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Users className="h-5 w-5 text-blue-500" />
              <div>
                <div className="text-2xl font-bold">{storeProfile.total_followers}</div>
                <p className="text-xs text-gray-600">followers</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">{storeProfile.established_year}</div>
                <p className="text-xs text-gray-600">berdiri sejak</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-purple-500" />
              <div>
                <div className="text-sm font-bold">{storeProfile.verification_status === 'verified' ? 'Verified' : 'Pending'}</div>
                <p className="text-xs text-gray-600">status</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="basic" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
          <TabsTrigger value="branding">Branding</TabsTrigger>
          <TabsTrigger value="hours">Jam Operasional</TabsTrigger>
          <TabsTrigger value="shipping">Pengiriman</TabsTrigger>
          <TabsTrigger value="policies">Kebijakan</TabsTrigger>
          <TabsTrigger value="social">Media Sosial</TabsTrigger>
        </TabsList>

        <TabsContent value="basic">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Dasar Toko</CardTitle>
              <CardDescription>
                Informasi utama tentang toko Anda yang akan ditampilkan kepada pelanggan
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="store-name">Nama Toko *</Label>
                  <Input
                    id="store-name"
                    value={storeProfile.name}
                    onChange={(e) => updateStoreProfile({ name: e.target.value })}
                    placeholder="Masukkan nama toko"
                  />
                </div>
                
                <div>
                  <Label htmlFor="category">Kategori Toko *</Label>
                  <Select 
                    value={storeProfile.category} 
                    onValueChange={(value) => updateStoreProfile({ category: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {storeCategories.map(category => (
                        <SelectItem key={category} value={category}>{category}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div>
                <Label htmlFor="description">Deskripsi Toko</Label>
                <Textarea
                  id="description"
                  value={storeProfile.description}
                  onChange={(e) => updateStoreProfile({ description: e.target.value })}
                  placeholder="Ceritakan tentang toko Anda"
                  rows={4}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="phone">Nomor Telepon *</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                      <Phone className="h-4 w-4 text-gray-500" />
                    </div>
                    <Input
                      id="phone"
                      value={storeProfile.phone}
                      onChange={(e) => updateStoreProfile({ phone: e.target.value })}
                      placeholder="021-12345678"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="email">Email *</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                      <Mail className="h-4 w-4 text-gray-500" />
                    </div>
                    <Input
                      id="email"
                      type="email"
                      value={storeProfile.email}
                      onChange={(e) => updateStoreProfile({ email: e.target.value })}
                      placeholder="info@tokosejahtera.com"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="address">Alamat Lengkap *</Label>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                    <MapPin className="h-4 w-4 text-gray-500" />
                  </div>
                  <Textarea
                    id="address"
                    value={storeProfile.address}
                    onChange={(e) => updateStoreProfile({ address: e.target.value })}
                    placeholder="Alamat lengkap toko"
                    className="rounded-l-none"
                    rows={2}
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="website">Website (Opsional)</Label>
                <div className="flex">
                  <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                    <Globe className="h-4 w-4 text-gray-500" />
                  </div>
                  <Input
                    id="website"
                    value={storeProfile.website || ''}
                    onChange={(e) => updateStoreProfile({ website: e.target.value })}
                    placeholder="https://tokosejahtera.com"
                    className="rounded-l-none"
                  />
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <Switch
                    id="is-active"
                    checked={storeProfile.is_active}
                    onCheckedChange={(checked) => updateStoreProfile({ is_active: checked })}
                  />
                  <Label htmlFor="is-active">Toko Aktif</Label>
                </div>
                
                <div>
                  <Label htmlFor="established-year">Tahun Berdiri</Label>
                  <Input
                    id="established-year"
                    type="number"
                    value={storeProfile.established_year || ''}
                    onChange={(e) => updateStoreProfile({ established_year: parseInt(e.target.value) })}
                    placeholder="2008"
                    className="w-24"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card>
            <CardHeader>
              <CardTitle>Branding Toko</CardTitle>
              <CardDescription>
                Upload logo dan banner untuk memperkuat identitas visual toko Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Logo Upload */}
              <div>
                <Label>Logo Toko</Label>
                <div className="flex items-center space-x-6 mt-2">
                  <div className="flex-shrink-0">
                    <Avatar className="h-24 w-24">
                      <AvatarImage src={logoPreview || storeProfile.logo_url} alt="Store Logo" />
                      <AvatarFallback>
                        <Store className="h-12 w-12 text-gray-400" />
                      </AvatarFallback>
                    </Avatar>
                  </div>
                  <div className="flex-1">
                    <input
                      id="logo-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById('logo-upload')?.click()}
                    >
                      <Camera className="h-4 w-4 mr-2" />
                      Ganti Logo
                    </Button>
                    <p className="text-sm text-gray-600 mt-2">
                      Ukuran optimal: 200x200px. Format: PNG, JPG (Max 2MB)
                    </p>
                  </div>
                </div>
              </div>
              
              <Separator />
              
              {/* Banner Upload */}
              <div>
                <Label>Banner Toko</Label>
                <div className="mt-2">
                  <div className="aspect-[3/1] bg-gray-100 rounded-lg overflow-hidden border-2 border-dashed border-gray-300 relative">
                    {(bannerPreview || storeProfile.banner_url) ? (
                      <img
                        src={bannerPreview || storeProfile.banner_url}
                        alt="Store Banner"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <div className="text-center">
                          <Upload className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                          <p className="text-gray-600">Banner toko belum diupload</p>
                        </div>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                      <input
                        id="banner-upload"
                        type="file"
                        accept="image/*"
                        onChange={handleBannerUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => document.getElementById('banner-upload')?.click()}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Ganti Banner
                      </Button>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Ukuran optimal: 1200x400px. Format: PNG, JPG (Max 5MB)
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="hours">
          <Card>
            <CardHeader>
              <CardTitle>Jam Operasional</CardTitle>
              <CardDescription>
                Atur jam buka dan tutup toko untuk setiap hari dalam seminggu
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {daysOfWeek.map(({ key, label }) => {
                  const hours = storeProfile.business_hours[key as keyof typeof storeProfile.business_hours];
                  return (
                    <div key={key} className="flex items-center space-x-4 p-4 border rounded-lg">
                      <div className="w-20">
                        <Label className="font-medium">{label}</Label>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={hours.is_open}
                          onCheckedChange={(checked) => updateBusinessHours(key, { is_open: checked })}
                        />
                        <span className="text-sm text-gray-600">
                          {hours.is_open ? 'Buka' : 'Tutup'}
                        </span>
                      </div>
                      
                      {hours.is_open && (
                        <div className="flex items-center space-x-2">
                          <Input
                            type="time"
                            value={hours.open}
                            onChange={(e) => updateBusinessHours(key, { open: e.target.value })}
                            className="w-32"
                          />
                          <span className="text-gray-500">-</span>
                          <Input
                            type="time"
                            value={hours.close}
                            onChange={(e) => updateBusinessHours(key, { close: e.target.value })}
                            className="w-32"
                          />
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="shipping">
          <Card>
            <CardHeader>
              <CardTitle>Informasi Pengiriman</CardTitle>
              <CardDescription>
                Atur kebijakan pengiriman dan area layanan toko Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="shipping-cost">Biaya Pengiriman</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                      <Truck className="h-4 w-4 text-gray-500" />
                    </div>
                    <Input
                      id="shipping-cost"
                      type="number"
                      value={storeProfile.shipping_info.shipping_cost}
                      onChange={(e) => updateShippingInfo({ shipping_cost: parseInt(e.target.value) })}
                      placeholder="25000"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="free-shipping-min">Minimum Gratis Ongkir</Label>
                  <div className="flex">
                    <div className="flex items-center px-3 border border-r-0 rounded-l-md bg-gray-50">
                      <CreditCard className="h-4 w-4 text-gray-500" />
                    </div>
                    <Input
                      id="free-shipping-min"
                      type="number"
                      value={storeProfile.shipping_info.free_shipping_min}
                      onChange={(e) => updateShippingInfo({ free_shipping_min: parseInt(e.target.value) })}
                      placeholder="500000"
                      className="rounded-l-none"
                    />
                  </div>
                </div>
              </div>
              
              <div>
                <Label htmlFor="processing-time">Waktu Proses</Label>
                <Input
                  id="processing-time"
                  value={storeProfile.shipping_info.processing_time}
                  onChange={(e) => updateShippingInfo({ processing_time: e.target.value })}
                  placeholder="1-2 hari kerja"
                />
              </div>
              
              <div>
                <Label htmlFor="shipping-areas">Area Pengiriman</Label>
                <Textarea
                  id="shipping-areas"
                  value={storeProfile.shipping_info.shipping_areas.join(', ')}
                  onChange={(e) => updateShippingInfo({ shipping_areas: e.target.value.split(', ').filter(area => area.trim()) })}
                  placeholder="Jakarta, Bogor, Depok, Tangerang, Bekasi"
                  rows={2}
                />
                <p className="text-sm text-gray-600 mt-1">
                  Pisahkan dengan koma untuk multiple area
                </p>
              </div>
              
              <div>
                <Label>Metode Pembayaran</Label>
                <div className="grid grid-cols-2 gap-2 mt-2">
                  {paymentMethods.map(method => (
                    <div key={method} className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        id={`payment-${method}`}
                        checked={storeProfile.payment_methods.includes(method)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            updateStoreProfile({ 
                              payment_methods: [...storeProfile.payment_methods, method] 
                            });
                          } else {
                            updateStoreProfile({ 
                              payment_methods: storeProfile.payment_methods.filter(m => m !== method) 
                            });
                          }
                        }}
                        className="rounded"
                      />
                      <Label htmlFor={`payment-${method}`} className="text-sm">
                        {method}
                      </Label>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="policies">
          <Card>
            <CardHeader>
              <CardTitle>Kebijakan Toko</CardTitle>
              <CardDescription>
                Atur kebijakan return, garansi, dan privasi untuk toko Anda
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <Label htmlFor="return-policy">Kebijakan Return</Label>
                <Textarea
                  id="return-policy"
                  value={storeProfile.policies.return_policy}
                  onChange={(e) => updatePolicies({ return_policy: e.target.value })}
                  placeholder="Jelaskan kebijakan return barang"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="warranty-policy">Kebijakan Garansi</Label>
                <Textarea
                  id="warranty-policy"
                  value={storeProfile.policies.warranty_policy}
                  onChange={(e) => updatePolicies({ warranty_policy: e.target.value })}
                  placeholder="Jelaskan kebijakan garansi produk"
                  rows={3}
                />
              </div>
              
              <div>
                <Label htmlFor="privacy-policy">Kebijakan Privasi</Label>
                <Textarea
                  id="privacy-policy"
                  value={storeProfile.policies.privacy_policy}
                  onChange={(e) => updatePolicies({ privacy_policy: e.target.value })}
                  placeholder="Jelaskan bagaimana data pelanggan dikelola"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="social">
          <Card>
            <CardHeader>
              <CardTitle>Media Sosial</CardTitle>
              <CardDescription>
                Hubungkan akun media sosial toko untuk meningkatkan engagement
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="facebook">Facebook</Label>
                  <Input
                    id="facebook"
                    value={storeProfile.social_media.facebook || ''}
                    onChange={(e) => updateSocialMedia({ facebook: e.target.value })}
                    placeholder="https://facebook.com/tokosejahtera"
                  />
                </div>
                
                <div>
                  <Label htmlFor="instagram">Instagram</Label>
                  <Input
                    id="instagram"
                    value={storeProfile.social_media.instagram || ''}
                    onChange={(e) => updateSocialMedia({ instagram: e.target.value })}
                    placeholder="@tokosejahtera"
                  />
                </div>
                
                <div>
                  <Label htmlFor="whatsapp">WhatsApp</Label>
                  <Input
                    id="whatsapp"
                    value={storeProfile.social_media.whatsapp || ''}
                    onChange={(e) => updateSocialMedia({ whatsapp: e.target.value })}
                    placeholder="6281234567890"
                  />
                </div>
                
                <div>
                  <Label htmlFor="telegram">Telegram</Label>
                  <Input
                    id="telegram"
                    value={storeProfile.social_media.telegram || ''}
                    onChange={(e) => updateSocialMedia({ telegram: e.target.value })}
                    placeholder="@tokosejahtera"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreManagement;