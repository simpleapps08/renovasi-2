import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Plus, Search, Edit, Trash2, Download, Upload } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface Upah {
  id: string
  jenis_pekerjaan: string
  kategori: string
  satuan: string
  upah_per_satuan: number
  tingkat_keahlian: 'pemula' | 'menengah' | 'ahli' | 'master'
  lokasi?: string
  deskripsi?: string
  status: 'aktif' | 'nonaktif'
  created_at: string
  updated_at: string
}

const AdminUpah = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterKategori, setFilterKategori] = useState('semua')
  const [filterKeahlian, setFilterKeahlian] = useState('semua')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUpah, setEditingUpah] = useState<Upah | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Dummy data upah tenaga kerja
  const [upahData, setUpahData] = useState<Upah[]>([
    {
      id: '1',
      jenis_pekerjaan: 'Tukang Batu',
      kategori: 'Struktur',
      satuan: 'hari',
      upah_per_satuan: 150000,
      tingkat_keahlian: 'ahli',
      lokasi: 'Jakarta',
      deskripsi: 'Tukang batu berpengalaman untuk pekerjaan struktur',
      status: 'aktif',
      created_at: '2024-01-15',
      updated_at: '2024-01-15'
    },
    {
      id: '2',
      jenis_pekerjaan: 'Tukang Kayu',
      kategori: 'Finishing',
      satuan: 'hari',
      upah_per_satuan: 140000,
      tingkat_keahlian: 'ahli',
      lokasi: 'Jakarta',
      deskripsi: 'Tukang kayu untuk pekerjaan finishing interior',
      status: 'aktif',
      created_at: '2024-01-16',
      updated_at: '2024-01-16'
    },
    {
      id: '3',
      jenis_pekerjaan: 'Tukang Cat',
      kategori: 'Finishing',
      satuan: 'm2',
      upah_per_satuan: 25000,
      tingkat_keahlian: 'menengah',
      lokasi: 'Jakarta',
      deskripsi: 'Tukang cat untuk pengecatan dinding dan plafon',
      status: 'aktif',
      created_at: '2024-01-17',
      updated_at: '2024-01-17'
    },
    {
      id: '4',
      jenis_pekerjaan: 'Tukang Listrik',
      kategori: 'MEP',
      satuan: 'titik',
      upah_per_satuan: 75000,
      tingkat_keahlian: 'ahli',
      lokasi: 'Jakarta',
      deskripsi: 'Teknisi listrik bersertifikat untuk instalasi listrik',
      status: 'aktif',
      created_at: '2024-01-18',
      updated_at: '2024-01-18'
    },
    {
      id: '5',
      jenis_pekerjaan: 'Tukang Plumbing',
      kategori: 'MEP',
      satuan: 'titik',
      upah_per_satuan: 85000,
      tingkat_keahlian: 'ahli',
      lokasi: 'Jakarta',
      deskripsi: 'Teknisi plumbing untuk instalasi air dan sanitasi',
      status: 'nonaktif',
      created_at: '2024-01-19',
      updated_at: '2024-01-19'
    }
  ])

  const [formData, setFormData] = useState({
    jenis_pekerjaan: '',
    kategori: '',
    satuan: '',
    upah_per_satuan: '',
    tingkat_keahlian: 'menengah' as 'pemula' | 'menengah' | 'ahli' | 'master',
    lokasi: '',
    deskripsi: '',
    status: 'aktif' as 'aktif' | 'nonaktif'
  })

  const kategoriOptions = ['Struktur', 'Finishing', 'MEP', 'Landscaping', 'Demolisi', 'Lainnya']
  const satuanOptions = ['hari', 'jam', 'm2', 'm3', 'titik', 'unit', 'paket', 'borongan']
  const keahlianOptions = ['pemula', 'menengah', 'ahli', 'master']

  // Filter dan search
  const filteredUpah = upahData.filter(upah => {
    const matchesSearch = upah.jenis_pekerjaan.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         upah.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         upah.lokasi?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesKategori = filterKategori === 'semua' || upah.kategori === filterKategori
    const matchesKeahlian = filterKeahlian === 'semua' || upah.tingkat_keahlian === filterKeahlian
    return matchesSearch && matchesKategori && matchesKeahlian
  })

  // Pagination
  const totalPages = Math.ceil(filteredUpah.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUpah = filteredUpah.slice(startIndex, startIndex + itemsPerPage)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.jenis_pekerjaan || !formData.kategori || !formData.satuan || !formData.upah_per_satuan) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi.",
        variant: "destructive",
      })
      return
    }

    const upahDataNew: Upah = {
      id: editingUpah ? editingUpah.id : Date.now().toString(),
      jenis_pekerjaan: formData.jenis_pekerjaan,
      kategori: formData.kategori,
      satuan: formData.satuan,
      upah_per_satuan: parseInt(formData.upah_per_satuan),
      tingkat_keahlian: formData.tingkat_keahlian,
      lokasi: formData.lokasi,
      deskripsi: formData.deskripsi,
      status: formData.status,
      created_at: editingUpah ? editingUpah.created_at : new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    }

    if (editingUpah) {
      setUpahData(upahData.map(u => u.id === editingUpah.id ? upahDataNew : u))
      toast({
        title: "Berhasil",
        description: "Data upah tenaga kerja berhasil diperbarui.",
      })
    } else {
      setUpahData([...upahData, upahDataNew])
      toast({
        title: "Berhasil",
        description: "Data upah tenaga kerja baru berhasil ditambahkan.",
      })
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (upah: Upah) => {
    setEditingUpah(upah)
    setFormData({
      jenis_pekerjaan: upah.jenis_pekerjaan,
      kategori: upah.kategori,
      satuan: upah.satuan,
      upah_per_satuan: upah.upah_per_satuan.toString(),
      tingkat_keahlian: upah.tingkat_keahlian,
      lokasi: upah.lokasi || '',
      deskripsi: upah.deskripsi || '',
      status: upah.status
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setUpahData(upahData.filter(u => u.id !== id))
    toast({
      title: "Berhasil",
      description: "Data upah tenaga kerja berhasil dihapus.",
    })
  }

  const resetForm = () => {
    setFormData({
      jenis_pekerjaan: '',
      kategori: '',
      satuan: '',
      upah_per_satuan: '',
      tingkat_keahlian: 'menengah',
      lokasi: '',
      deskripsi: '',
      status: 'aktif'
    })
    setEditingUpah(null)
  }

  const handleExportCSV = () => {
    const csvContent = [
      ['Jenis Pekerjaan', 'Kategori', 'Satuan', 'Upah per Satuan', 'Tingkat Keahlian', 'Lokasi', 'Status', 'Tanggal Dibuat'],
      ...upahData.map(u => [
        u.jenis_pekerjaan,
        u.kategori,
        u.satuan,
        u.upah_per_satuan.toString(),
        u.tingkat_keahlian,
        u.lokasi || '',
        u.status,
        u.created_at
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `data-upah-tenaga-kerja-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Berhasil",
      description: "Data upah tenaga kerja berhasil diekspor ke CSV.",
    })
  }

  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string
        const lines = csv.split('\n')
        const headers = lines[0].split(',')
        
        if (headers.length < 5) {
          throw new Error('Format CSV tidak valid')
        }

        const newUpahData: Upah[] = []
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',')
          if (values.length >= 5 && values[0].trim()) {
            newUpahData.push({
              id: Date.now().toString() + i,
              jenis_pekerjaan: values[0].trim(),
              kategori: values[1].trim(),
              satuan: values[2].trim(),
              upah_per_satuan: parseInt(values[3].trim()) || 0,
              tingkat_keahlian: (values[4]?.trim() as 'pemula' | 'menengah' | 'ahli' | 'master') || 'menengah',
              lokasi: values[5]?.trim() || '',
              status: (values[6]?.trim() as 'aktif' | 'nonaktif') || 'aktif',
              deskripsi: '',
              created_at: new Date().toISOString().split('T')[0],
              updated_at: new Date().toISOString().split('T')[0]
            })
          }
        }

        setUpahData([...upahData, ...newUpahData])
        toast({
          title: "Berhasil",
          description: `${newUpahData.length} data upah tenaga kerja berhasil diimpor.`,
        })
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal mengimpor file CSV. Periksa format file.",
          variant: "destructive",
        })
      }
    }
    reader.readAsText(file)
    event.target.value = ''
  }

  const getKeahlianBadgeVariant = (keahlian: string) => {
    switch (keahlian) {
      case 'pemula': return 'secondary'
      case 'menengah': return 'outline'
      case 'ahli': return 'default'
      case 'master': return 'destructive'
      default: return 'secondary'
    }
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header dengan tombol kembali */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali ke Admin Dashboard
          </Button>
          
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Manajemen Upah Tenaga Kerja</h1>
              <p className="text-gray-600 mt-2">Kelola data upah tenaga kerja berdasarkan jenis pekerjaan dan tingkat keahlian</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari jenis pekerjaan, kategori, atau lokasi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterKategori} onValueChange={setFilterKategori}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter Kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua">Semua Kategori</SelectItem>
                    {kategoriOptions.map(kategori => (
                      <SelectItem key={kategori} value={kategori}>{kategori}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={filterKeahlian} onValueChange={setFilterKeahlian}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter Keahlian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua">Semua Keahlian</SelectItem>
                    {keahlianOptions.map(keahlian => (
                      <SelectItem key={keahlian} value={keahlian}>
                        {keahlian.charAt(0).toUpperCase() + keahlian.slice(1)}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="flex gap-2">
                <Button onClick={handleExportCSV} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <label>
                  <Button variant="outline" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Import CSV
                  </Button>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={handleImportCSV}
                    className="hidden"
                  />
                </label>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm}>
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Data Upah
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingUpah ? 'Edit Data Upah' : 'Tambah Data Upah Baru'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingUpah ? 'Perbarui informasi upah tenaga kerja' : 'Tambahkan data upah tenaga kerja baru'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="jenis_pekerjaan">Jenis Pekerjaan *</Label>
                          <Input
                            id="jenis_pekerjaan"
                            value={formData.jenis_pekerjaan}
                            onChange={(e) => setFormData({...formData, jenis_pekerjaan: e.target.value})}
                            placeholder="Contoh: Tukang Batu"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="kategori">Kategori *</Label>
                          <Select value={formData.kategori} onValueChange={(value) => setFormData({...formData, kategori: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih kategori" />
                            </SelectTrigger>
                            <SelectContent>
                              {kategoriOptions.map(kategori => (
                                <SelectItem key={kategori} value={kategori}>{kategori}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="satuan">Satuan *</Label>
                          <Select value={formData.satuan} onValueChange={(value) => setFormData({...formData, satuan: value})}>
                            <SelectTrigger>
                              <SelectValue placeholder="Pilih satuan" />
                            </SelectTrigger>
                            <SelectContent>
                              {satuanOptions.map(satuan => (
                                <SelectItem key={satuan} value={satuan}>{satuan}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="upah_per_satuan">Upah per Satuan (Rp) *</Label>
                          <Input
                            id="upah_per_satuan"
                            type="number"
                            value={formData.upah_per_satuan}
                            onChange={(e) => setFormData({...formData, upah_per_satuan: e.target.value})}
                            placeholder="0"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="tingkat_keahlian">Tingkat Keahlian *</Label>
                          <Select value={formData.tingkat_keahlian} onValueChange={(value: 'pemula' | 'menengah' | 'ahli' | 'master') => setFormData({...formData, tingkat_keahlian: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {keahlianOptions.map(keahlian => (
                                <SelectItem key={keahlian} value={keahlian}>
                                  {keahlian.charAt(0).toUpperCase() + keahlian.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="lokasi">Lokasi</Label>
                          <Input
                            id="lokasi"
                            value={formData.lokasi}
                            onChange={(e) => setFormData({...formData, lokasi: e.target.value})}
                            placeholder="Contoh: Jakarta"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="status">Status</Label>
                          <Select value={formData.status} onValueChange={(value: 'aktif' | 'nonaktif') => setFormData({...formData, status: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="aktif">Aktif</SelectItem>
                              <SelectItem value="nonaktif">Non-aktif</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="deskripsi">Deskripsi</Label>
                          <Input
                            id="deskripsi"
                            value={formData.deskripsi}
                            onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                            placeholder="Deskripsi pekerjaan (opsional)"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Batal
                        </Button>
                        <Button type="submit">
                          {editingUpah ? 'Perbarui' : 'Tambah'} Data Upah
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Table */}
        <Card>
          <CardHeader>
            <CardTitle>Data Upah Tenaga Kerja ({filteredUpah.length} item)</CardTitle>
            <CardDescription>
              Daftar upah tenaga kerja berdasarkan jenis pekerjaan dan tingkat keahlian
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Jenis Pekerjaan</TableHead>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead>Upah per Satuan</TableHead>
                    <TableHead>Tingkat Keahlian</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUpah.map((upah) => (
                    <TableRow key={upah.id}>
                      <TableCell className="font-medium">{upah.jenis_pekerjaan}</TableCell>
                      <TableCell>{upah.kategori}</TableCell>
                      <TableCell>{upah.satuan}</TableCell>
                      <TableCell>Rp {upah.upah_per_satuan.toLocaleString('id-ID')}</TableCell>
                      <TableCell>
                        <Badge variant={getKeahlianBadgeVariant(upah.tingkat_keahlian)}>
                          {upah.tingkat_keahlian.charAt(0).toUpperCase() + upah.tingkat_keahlian.slice(1)}
                        </Badge>
                      </TableCell>
                      <TableCell>{upah.lokasi || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={upah.status === 'aktif' ? 'default' : 'secondary'}>
                          {upah.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(upah)}
                          >
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
                                <AlertDialogTitle>Hapus Data Upah</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus data upah "{upah.jenis_pekerjaan}"? 
                                  Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(upah.id)}>
                                  Hapus
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex justify-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  Previous
                </Button>
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    onClick={() => setCurrentPage(page)}
                  >
                    {page}
                  </Button>
                ))}
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  Next
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default AdminUpah