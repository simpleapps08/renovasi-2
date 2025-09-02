import { useState, useEffect } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Edit, Trash2, Plus, Save, Upload, Eye, Settings } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { AdminSidebar } from "@/components/layout/AdminSidebar"

// Mock data - akan diganti dengan data dari database
const initialHeaderData = {
  title: "Renovasi Rumah & Gedung",
  subtitle: "Profesional",
  description: "Dapatkan estimasi biaya renovasi yang akurat dengan simulasi RAB digital. Transparan, cepat, dan terpercaya untuk proyek impian Anda.",
  stats: [
    { label: "Proyek Selesai", value: "500+" },
    { label: "Kontraktor Mitra", value: "50+" },
    { label: "Kepuasan Klien", value: "98%" },
    { label: "Konsultasi", value: "24/7" }
  ]
}

const initialServicesData = [
  {
    id: 1,
    title: "Renovasi Rumah",
    description: "Renovasi total atau parsial rumah tinggal dengan desain modern dan fungsional",
    features: ["Desain Interior", "Renovasi Kamar Mandi", "Renovasi Dapur", "Renovasi Taman"],
    icon: "🏠"
  },
  {
    id: 2,
    title: "Pembangunan Gedung",
    description: "Konstruksi gedung komersial dan perkantoran dengan standar internasional",
    features: ["Gedung Perkantoran", "Ruko & Toko", "Warehouse", "Fasilitas Umum"],
    icon: "🏢"
  },
  {
    id: 3,
    title: "Desain & Perencanaan",
    description: "Layanan arsitektur dan perencanaan dengan teknologi BIM terkini",
    features: ["Desain Arsitektur", "Gambar Teknik", "3D Visualization", "IMB & Perizinan"],
    icon: "📐"
  },
  {
    id: 4,
    title: "Konsultasi RAB",
    description: "Estimasi biaya yang akurat dan transparan untuk semua jenis proyek",
    features: ["Analisa Harga", "BOQ Detail", "Time Schedule", "Risk Assessment"],
    icon: "💰"
  }
]

const initialPortfolioData = [
  {
    id: 1,
    image: "https://images.unsplash.com/photo-1503387762-592deb58ef4e?w=600&h=400&fit=crop",
    title: "Renovasi Rumah Modern",
    category: "Residensial",
    description: "Transformasi rumah klasik menjadi hunian modern minimalis"
  },
  {
    id: 2,
    image: "https://images.unsplash.com/photo-1460472178825-e5240623afd5?w=600&h=400&fit=crop",
    title: "Gedung Perkantoran",
    category: "Komersial",
    description: "Pembangunan gedung perkantoran 5 lantai dengan desain kontemporer"
  },
  {
    id: 3,
    image: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=600&h=400&fit=crop",
    title: "Renovasi Dapur Modern",
    category: "Interior",
    description: "Desain dapur terbuka dengan island counter dan pencahayaan optimal"
  }
]

const initialFooterData = {
  description: "Platform digital terdepan untuk renovasi rumah dan gedung. Dapatkan estimasi biaya yang akurat dan transparan untuk proyek impian Anda.",
  services: [
    "Renovasi Rumah",
    "Pembangunan Gedung",
    "Desain & Perencanaan",
    "Konsultasi RAB"
  ],
  contact: {
    email: "info@servisoo.com",
    phone: "+62 811-2345-6789",
    whatsapp: "+62 811-2345-6789",
    address: "Jl. Pahlawan Gang Selorejo 2, No. 248 B, Kabupaten Tuban, Jawa Timur 62318"
  },
  socialMedia: [
    { name: "Facebook", url: "#", icon: "facebook" },
    { name: "Instagram", url: "#", icon: "instagram" },
    { name: "Twitter", url: "#", icon: "twitter" },
    { name: "LinkedIn", url: "#", icon: "linkedin" }
  ]
}

const AdminContentManagement = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  
  // State untuk setiap section
  const [headerData, setHeaderData] = useState(initialHeaderData)
  const [servicesData, setServicesData] = useState(initialServicesData)
  const [portfolioData, setPortfolioData] = useState(initialPortfolioData)
  const [footerData, setFooterData] = useState(initialFooterData)
  
  // State untuk dialog
  const [isEditingHeader, setIsEditingHeader] = useState(false)
  const [isEditingService, setIsEditingService] = useState(false)
  const [isEditingPortfolio, setIsEditingPortfolio] = useState(false)
  const [isEditingFooter, setIsEditingFooter] = useState(false)
  
  // State untuk form
  const [editingService, setEditingService] = useState(null)
  const [editingPortfolio, setEditingPortfolio] = useState(null)
  const [newService, setNewService] = useState({ title: '', description: '', features: [], icon: '' })
  const [newPortfolio, setNewPortfolio] = useState({ title: '', category: '', description: '', image: '' })

  const handleSaveHeader = () => {
    // Implementasi save header ke database
    toast({
      title: "Header berhasil diperbarui",
      description: "Perubahan header telah disimpan.",
    })
    setIsEditingHeader(false)
  }

  const handleSaveService = () => {
    // Implementasi save service ke database
    toast({
      title: "Layanan berhasil diperbarui",
      description: "Perubahan layanan telah disimpan.",
    })
    setIsEditingService(false)
    setEditingService(null)
  }

  const handleAddService = () => {
    const id = Math.max(...servicesData.map(s => s.id)) + 1
    setServicesData([...servicesData, { ...newService, id }])
    setNewService({ title: '', description: '', features: [], icon: '' })
    toast({
      title: "Layanan berhasil ditambahkan",
      description: "Layanan baru telah ditambahkan ke daftar.",
    })
  }

  const handleDeleteService = (id) => {
    setServicesData(servicesData.filter(s => s.id !== id))
    toast({
      title: "Layanan berhasil dihapus",
      description: "Layanan telah dihapus dari daftar.",
    })
  }

  const handleSavePortfolio = () => {
    // Implementasi save portfolio ke database
    toast({
      title: "Portfolio berhasil diperbarui",
      description: "Perubahan portfolio telah disimpan.",
    })
    setIsEditingPortfolio(false)
    setEditingPortfolio(null)
  }

  const handleAddPortfolio = () => {
    const id = Math.max(...portfolioData.map(p => p.id)) + 1
    setPortfolioData([...portfolioData, { ...newPortfolio, id }])
    setNewPortfolio({ title: '', category: '', description: '', image: '' })
    toast({
      title: "Portfolio berhasil ditambahkan",
      description: "Portfolio baru telah ditambahkan ke galeri.",
    })
  }

  const handleDeletePortfolio = (id) => {
    setPortfolioData(portfolioData.filter(p => p.id !== id))
    toast({
      title: "Portfolio berhasil dihapus",
      description: "Portfolio telah dihapus dari galeri.",
    })
  }

  const handleSaveFooter = () => {
    // Implementasi save footer ke database
    toast({
      title: "Footer berhasil diperbarui",
      description: "Perubahan footer telah disimpan.",
    })
    setIsEditingFooter(false)
  }

  return (
    <div className="min-h-screen bg-secondary/20 flex">
      <AdminSidebar />
      
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6">
          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 sm:mb-8 gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Manajemen Konten</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Kelola konten landing page website</p>
            </div>
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="flex items-center gap-2 self-start sm:self-auto"
            >
              <ArrowLeft className="h-4 w-4" />
              <span className="hidden sm:inline">Kembali ke Dashboard</span>
              <span className="sm:hidden">Kembali</span>
            </Button>
          </div>

          <Tabs defaultValue="header" className="space-y-4 sm:space-y-6">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 h-auto">
              <TabsTrigger value="header" className="text-xs sm:text-sm py-2">Header</TabsTrigger>
              <TabsTrigger value="services" className="text-xs sm:text-sm py-2">Layanan</TabsTrigger>
              <TabsTrigger value="portfolio" className="text-xs sm:text-sm py-2">Portfolio</TabsTrigger>
              <TabsTrigger value="footer" className="text-xs sm:text-sm py-2">Footer</TabsTrigger>
            </TabsList>

            {/* Header Management */}
            <TabsContent value="header">
              <Card>
                <CardHeader>
                  <CardTitle className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <span>Manajemen Header</span>
                    <Button onClick={() => setIsEditingHeader(true)} className="self-start sm:self-auto">
                      <Edit className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Edit Header</span>
                      <span className="sm:hidden">Edit</span>
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Kelola judul, deskripsi, dan statistik pada bagian header
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label className="text-sm font-medium">Judul Utama</Label>
                      <p className="text-lg font-semibold">{headerData.title}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Sub Judul</Label>
                      <p className="text-lg font-semibold text-accent">{headerData.subtitle}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Deskripsi</Label>
                      <p className="text-muted-foreground">{headerData.description}</p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Statistik</Label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mt-2">
                        {headerData.stats.map((stat, index) => (
                          <div key={index} className="text-center p-2 sm:p-3 bg-muted rounded-lg">
                            <div className="text-lg sm:text-2xl font-bold text-accent">{stat.value}</div>
                            <div className="text-xs sm:text-sm text-muted-foreground">{stat.label}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Services Management */}
            <TabsContent value="services">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Manajemen Layanan
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Tambah Layanan
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Tambah Layanan Baru</DialogTitle>
                          <DialogDescription>
                            Tambahkan layanan baru ke daftar layanan
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="service-title">Judul Layanan</Label>
                            <Input
                              id="service-title"
                              value={newService.title}
                              onChange={(e) => setNewService({...newService, title: e.target.value})}
                              placeholder="Masukkan judul layanan"
                            />
                          </div>
                          <div>
                            <Label htmlFor="service-description">Deskripsi</Label>
                            <Textarea
                              id="service-description"
                              value={newService.description}
                              onChange={(e) => setNewService({...newService, description: e.target.value})}
                              placeholder="Masukkan deskripsi layanan"
                            />
                          </div>
                          <div>
                            <Label htmlFor="service-icon">Icon (Emoji)</Label>
                            <Input
                              id="service-icon"
                              value={newService.icon}
                              onChange={(e) => setNewService({...newService, icon: e.target.value})}
                              placeholder="🏠"
                            />
                          </div>
                          <Button onClick={handleAddService} className="w-full">
                            Tambah Layanan
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                  <CardDescription>
                    Kelola daftar layanan yang ditampilkan di website
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {servicesData.map((service) => (
                      <Card key={service.id} className="p-4">
                        <div className="flex items-start justify-between">
                          <div className="flex items-start space-x-4">
                            <div className="text-2xl">{service.icon}</div>
                            <div className="flex-1">
                              <h3 className="font-semibold text-lg">{service.title}</h3>
                              <p className="text-muted-foreground text-sm mb-2">{service.description}</p>
                              <div className="flex flex-wrap gap-1">
                                {service.features.map((feature, index) => (
                                  <Badge key={index} variant="secondary" className="text-xs">
                                    {feature}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Hapus Layanan</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus layanan "{service.title}"?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteService(service.id)}>
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Portfolio Management */}
            <TabsContent value="portfolio">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Manajemen Portfolio
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button>
                          <Plus className="h-4 w-4 mr-2" />
                          Tambah Portfolio
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Tambah Portfolio Baru</DialogTitle>
                          <DialogDescription>
                            Tambahkan proyek baru ke portfolio
                          </DialogDescription>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label htmlFor="portfolio-title">Judul Proyek</Label>
                            <Input
                              id="portfolio-title"
                              value={newPortfolio.title}
                              onChange={(e) => setNewPortfolio({...newPortfolio, title: e.target.value})}
                              placeholder="Masukkan judul proyek"
                            />
                          </div>
                          <div>
                            <Label htmlFor="portfolio-category">Kategori</Label>
                            <Select
                              value={newPortfolio.category}
                              onValueChange={(value) => setNewPortfolio({...newPortfolio, category: value})}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Pilih kategori" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="Residensial">Residensial</SelectItem>
                                <SelectItem value="Komersial">Komersial</SelectItem>
                                <SelectItem value="Interior">Interior</SelectItem>
                                <SelectItem value="Landscape">Landscape</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                          <div>
                            <Label htmlFor="portfolio-description">Deskripsi</Label>
                            <Textarea
                              id="portfolio-description"
                              value={newPortfolio.description}
                              onChange={(e) => setNewPortfolio({...newPortfolio, description: e.target.value})}
                              placeholder="Masukkan deskripsi proyek"
                            />
                          </div>
                          <div>
                            <Label htmlFor="portfolio-image">URL Gambar</Label>
                            <Input
                              id="portfolio-image"
                              value={newPortfolio.image}
                              onChange={(e) => setNewPortfolio({...newPortfolio, image: e.target.value})}
                              placeholder="https://example.com/image.jpg"
                            />
                          </div>
                          <Button onClick={handleAddPortfolio} className="w-full">
                            Tambah Portfolio
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </CardTitle>
                  <CardDescription>
                    Kelola portfolio proyek yang ditampilkan di galeri
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {portfolioData.map((portfolio) => (
                      <Card key={portfolio.id} className="overflow-hidden">
                        <div className="relative">
                          <img
                            src={portfolio.image}
                            alt={portfolio.title}
                            className="w-full h-48 object-cover"
                          />
                          <Badge className="absolute top-2 left-2">
                            {portfolio.category}
                          </Badge>
                        </div>
                        <CardContent className="p-4">
                          <h3 className="font-semibold mb-2">{portfolio.title}</h3>
                          <p className="text-sm text-muted-foreground mb-4">{portfolio.description}</p>
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" className="flex-1">
                              <Edit className="h-4 w-4 mr-1" />
                              Edit
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Hapus Portfolio</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus portfolio "{portfolio.title}"?
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeletePortfolio(portfolio.id)}>
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Footer Management */}
            <TabsContent value="footer">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center justify-between">
                    Manajemen Footer
                    <Button onClick={() => setIsEditingFooter(true)}>
                      <Edit className="h-4 w-4 mr-2" />
                      Edit Footer
                    </Button>
                  </CardTitle>
                  <CardDescription>
                    Kelola konten footer, kontak, dan social media
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div>
                      <Label className="text-sm font-medium">Deskripsi Perusahaan</Label>
                      <p className="text-muted-foreground mt-1">{footerData.description}</p>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Layanan</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {footerData.services.map((service, index) => (
                          <Badge key={index} variant="secondary">{service}</Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Informasi Kontak</Label>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">Email:</span>
                            <p className="text-sm text-muted-foreground">{footerData.contact.email}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Phone:</span>
                            <p className="text-sm text-muted-foreground">{footerData.contact.phone}</p>
                          </div>
                        </div>
                        <div className="space-y-2">
                          <div>
                            <span className="text-sm font-medium">WhatsApp:</span>
                            <p className="text-sm text-muted-foreground">{footerData.contact.whatsapp}</p>
                          </div>
                          <div>
                            <span className="text-sm font-medium">Alamat:</span>
                            <p className="text-sm text-muted-foreground">{footerData.contact.address}</p>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <Label className="text-sm font-medium">Social Media</Label>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {footerData.socialMedia.map((social, index) => (
                          <Badge key={index} variant="outline">
                            {social.name}: {social.url}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>

          {/* Header Edit Dialog */}
          <Dialog open={isEditingHeader} onOpenChange={setIsEditingHeader}>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Edit Header</DialogTitle>
                <DialogDescription>
                  Edit judul, deskripsi, dan statistik pada bagian header
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="header-title">Judul Utama</Label>
                    <Input
                      id="header-title"
                      value={headerData.title}
                      onChange={(e) => setHeaderData({...headerData, title: e.target.value})}
                    />
                  </div>
                  <div>
                    <Label htmlFor="header-subtitle">Sub Judul</Label>
                    <Input
                      id="header-subtitle"
                      value={headerData.subtitle}
                      onChange={(e) => setHeaderData({...headerData, subtitle: e.target.value})}
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="header-description">Deskripsi</Label>
                  <Textarea
                    id="header-description"
                    value={headerData.description}
                    onChange={(e) => setHeaderData({...headerData, description: e.target.value})}
                    rows={3}
                  />
                </div>
                <div>
                  <Label>Statistik</Label>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-2">
                    {headerData.stats.map((stat, index) => (
                      <div key={index} className="space-y-2">
                        <Input
                          placeholder="Label"
                          value={stat.label}
                          onChange={(e) => {
                            const newStats = [...headerData.stats]
                            newStats[index].label = e.target.value
                            setHeaderData({...headerData, stats: newStats})
                          }}
                        />
                        <Input
                          placeholder="Nilai"
                          value={stat.value}
                          onChange={(e) => {
                            const newStats = [...headerData.stats]
                            newStats[index].value = e.target.value
                            setHeaderData({...headerData, stats: newStats})
                          }}
                        />
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditingHeader(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleSaveHeader}>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Footer Edit Dialog */}
          <Dialog open={isEditingFooter} onOpenChange={setIsEditingFooter}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Edit Footer</DialogTitle>
                <DialogDescription>
                  Edit konten footer, kontak, dan social media
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pr-2">
                <div>
                  <Label htmlFor="footer-description">Deskripsi Perusahaan</Label>
                  <Textarea
                    id="footer-description"
                    value={footerData.description}
                    onChange={(e) => setFooterData({...footerData, description: e.target.value})}
                    rows={3}
                  />
                </div>
                
                <div>
                  <Label>Informasi Kontak</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="contact-email">Email</Label>
                        <Input
                          id="contact-email"
                          value={footerData.contact.email}
                          onChange={(e) => setFooterData({
                            ...footerData,
                            contact: {...footerData.contact, email: e.target.value}
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-phone">Phone</Label>
                        <Input
                          id="contact-phone"
                          value={footerData.contact.phone}
                          onChange={(e) => setFooterData({
                            ...footerData,
                            contact: {...footerData.contact, phone: e.target.value}
                          })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div>
                        <Label htmlFor="contact-whatsapp">WhatsApp</Label>
                        <Input
                          id="contact-whatsapp"
                          value={footerData.contact.whatsapp}
                          onChange={(e) => setFooterData({
                            ...footerData,
                            contact: {...footerData.contact, whatsapp: e.target.value}
                          })}
                        />
                      </div>
                      <div>
                        <Label htmlFor="contact-address">Alamat</Label>
                        <Textarea
                          id="contact-address"
                          value={footerData.contact.address}
                          onChange={(e) => setFooterData({
                            ...footerData,
                            contact: {...footerData.contact, address: e.target.value}
                          })}
                          rows={2}
                        />
                      </div>
                    </div>
                  </div>
                </div>
                
                <div>
                  <Label>Social Media Links</Label>
                  <div className="space-y-3 mt-2">
                    {footerData.socialMedia.map((social, index) => (
                      <div key={index} className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border rounded-lg">
                        <div>
                          <Label htmlFor={`social-name-${index}`}>Platform</Label>
                          <Input
                            id={`social-name-${index}`}
                            value={social.name}
                            onChange={(e) => {
                              const newSocialMedia = [...footerData.socialMedia]
                              newSocialMedia[index].name = e.target.value
                              setFooterData({...footerData, socialMedia: newSocialMedia})
                            }}
                            placeholder="Nama platform (e.g., Facebook)"
                          />
                        </div>
                        <div>
                          <Label htmlFor={`social-url-${index}`}>URL Link</Label>
                          <Input
                            id={`social-url-${index}`}
                            value={social.url}
                            onChange={(e) => {
                              const newSocialMedia = [...footerData.socialMedia]
                              newSocialMedia[index].url = e.target.value
                              setFooterData({...footerData, socialMedia: newSocialMedia})
                            }}
                            placeholder="https://facebook.com/yourpage"
                          />
                        </div>
                        <div className="flex items-end">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const newSocialMedia = footerData.socialMedia.filter((_, i) => i !== index)
                              setFooterData({...footerData, socialMedia: newSocialMedia})
                            }}
                            className="w-full"
                          >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Hapus
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button
                      variant="outline"
                      onClick={() => {
                        const newSocialMedia = [...footerData.socialMedia, { name: "", url: "", icon: "" }]
                        setFooterData({...footerData, socialMedia: newSocialMedia})
                      }}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Platform Social Media
                    </Button>
                  </div>
                </div>
                
                <div className="flex justify-end space-x-2">
                  <Button variant="outline" onClick={() => setIsEditingFooter(false)}>
                    Batal
                  </Button>
                  <Button onClick={handleSaveFooter}>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </main>
    </div>
  )
}

export default AdminContentManagement