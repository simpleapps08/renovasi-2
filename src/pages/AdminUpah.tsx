import { useState, useEffect } from "react"
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
import { supabase } from "@/integrations/supabase/client"

interface Upah {
  id: string
  jenis_pekerjaan: string
  kategori: string
  satuan: string
  upah_per_satuan: number
  tingkat_keahlian: string
  lokasi?: string
  created_at?: string
  updated_at?: string
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
  const [upahData, setUpahData] = useState<Upah[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch data upah dari Supabase
  useEffect(() => {
    fetchUpahData()
  }, [])

  const fetchUpahData = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('labour_rates')
        .select('*')
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching upah data:', error)
        toast({
          title: "Error",
          description: "Gagal mengambil data upah tenaga kerja.",
          variant: "destructive",
        })
        return
      }

      setUpahData(data || [])
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat mengambil data.",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const [formData, setFormData] = useState({
    jenis_pekerjaan: '',
    kategori: '',
    satuan: '',
    upah_per_satuan: '',
    tingkat_keahlian: 'menengah',
    lokasi: ''
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.jenis_pekerjaan || !formData.kategori || !formData.satuan || !formData.upah_per_satuan) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi.",
        variant: "destructive",
      })
      return
    }

    try {
      const upahDataNew = {
        jenis_pekerjaan: formData.jenis_pekerjaan,
        kategori: formData.kategori,
        satuan: formData.satuan,
        upah_per_satuan: parseInt(formData.upah_per_satuan),
        tingkat_keahlian: formData.tingkat_keahlian,
        lokasi: formData.lokasi || null
      }

      if (editingUpah) {
        const { error } = await supabase
          .from('labour_rates')
          .update(upahDataNew)
          .eq('id', editingUpah.id)

        if (error) {
          console.error('Error updating upah:', error)
          toast({
            title: "Error",
            description: "Gagal memperbarui data upah tenaga kerja.",
            variant: "destructive",
          })
          return
        }

        toast({
          title: "Berhasil",
          description: "Data upah tenaga kerja berhasil diperbarui.",
        })
      } else {
        const { error } = await supabase
          .from('labour_rates')
          .insert([upahDataNew])

        if (error) {
          console.error('Error inserting upah:', error)
          toast({
            title: "Error",
            description: "Gagal menambahkan data upah tenaga kerja.",
            variant: "destructive",
          })
          return
        }

        toast({
          title: "Berhasil",
          description: "Data upah tenaga kerja baru berhasil ditambahkan.",
        })
      }

      // Refresh data
      await fetchUpahData()
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan data.",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (upah: Upah) => {
    setEditingUpah(upah)
    setFormData({
      jenis_pekerjaan: upah.jenis_pekerjaan,
      kategori: upah.kategori,
      satuan: upah.satuan,
      upah_per_satuan: upah.upah_per_satuan.toString(),
      tingkat_keahlian: upah.tingkat_keahlian,
      lokasi: upah.lokasi || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('labour_rates')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting upah:', error)
        toast({
          title: "Error",
          description: "Gagal menghapus data upah tenaga kerja.",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Berhasil",
        description: "Data upah tenaga kerja berhasil dihapus.",
      })

      // Refresh data
      await fetchUpahData()
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus data.",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      jenis_pekerjaan: '',
      kategori: '',
      satuan: '',
      upah_per_satuan: '',
      tingkat_keahlian: 'menengah',
      lokasi: ''
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
            <div className="flex flex-col gap-4">
              {/* Search and Filters */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari jenis pekerjaan, kategori, atau lokasi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <Select value={filterKategori} onValueChange={setFilterKategori}>
                    <SelectTrigger className="w-full sm:w-48">
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
                    <SelectTrigger className="w-full sm:w-48">
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
              </div>
              
              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                <Button onClick={handleExportCSV} variant="outline" className="w-full sm:w-auto">
                  <Download className="h-4 w-4 mr-2" />
                  <span className="sm:inline">Export CSV</span>
                </Button>
                <label className="w-full sm:w-auto">
                  <Button variant="outline" className="cursor-pointer w-full sm:w-auto">
                    <Upload className="h-4 w-4 mr-2" />
                    <span className="sm:inline">Import CSV</span>
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
                    <Button onClick={resetForm} className="w-full sm:w-auto">
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="sm:inline">Tambah Data Upah</span>
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
                          <Select value={formData.tingkat_keahlian} onValueChange={(value) => setFormData({...formData, tingkat_keahlian: value})}>
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
                    <TableHead>Upah/Satuan</TableHead>
                    <TableHead>Tingkat Keahlian</TableHead>
                    <TableHead>Lokasi</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUpah.map((upah) => (
                    <TableRow key={upah.id}>
                      <TableCell className="font-medium">{upah.jenis_pekerjaan}</TableCell>
                      <TableCell>{upah.kategori}</TableCell>
                      <TableCell>{upah.satuan}</TableCell>
                      <TableCell>Rp {upah.upah_per_satuan?.toLocaleString('id-ID')}</TableCell>
                      <TableCell>
                        <Badge variant={upah.tingkat_keahlian === 'ahli' ? 'default' : upah.tingkat_keahlian === 'terampil' ? 'secondary' : 'outline'}>
                          {upah.tingkat_keahlian}
                        </Badge>
                      </TableCell>
                      <TableCell>{upah.lokasi}</TableCell>
                      <TableCell>
                        <div className="flex flex-col sm:flex-row gap-1 sm:gap-2 sm:space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(upah)}
                            className="w-full sm:w-auto sm:inline"
                          >
                            <Edit className="h-4 w-4 sm:mr-0" />
                            <span className="ml-2 sm:hidden">Edit</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="w-full sm:w-auto sm:inline">
                                <Trash2 className="h-4 w-4 sm:mr-0" />
                                <span className="ml-2 sm:hidden">Hapus</span>
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
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-6">
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="w-full sm:w-auto"
                >
                  Previous
                </Button>
                <div className="flex flex-wrap justify-center gap-1 sm:gap-2">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      onClick={() => setCurrentPage(page)}
                      className="w-8 h-8 sm:w-auto sm:h-auto p-0 sm:p-2"
                    >
                      {page}
                    </Button>
                  ))}
                </div>
                <Button
                  variant="outline"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="w-full sm:w-auto"
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