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

interface Material {
  id: string
  nama: string
  kategori: string
  satuan: string
  harga: number
  supplier?: string
  deskripsi?: string
  status: 'aktif' | 'nonaktif'
  created_at: string
  updated_at: string
}

const AdminMaterial = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterKategori, setFilterKategori] = useState('semua')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingMaterial, setEditingMaterial] = useState<Material | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Dummy data material
  const [materials, setMaterials] = useState<Material[]>([
    {
      id: '1',
      nama: 'Semen Portland',
      kategori: 'Semen',
      satuan: 'sak',
      harga: 65000,
      supplier: 'PT Semen Indonesia',
      deskripsi: 'Semen portland type I untuk konstruksi umum',
      status: 'aktif',
      created_at: '2024-01-15',
      updated_at: '2024-01-15'
    },
    {
      id: '2',
      nama: 'Bata Merah',
      kategori: 'Bata',
      satuan: 'buah',
      harga: 800,
      supplier: 'CV Bata Jaya',
      deskripsi: 'Bata merah berkualitas tinggi',
      status: 'aktif',
      created_at: '2024-01-16',
      updated_at: '2024-01-16'
    },
    {
      id: '3',
      nama: 'Pasir Cor',
      kategori: 'Pasir',
      satuan: 'm3',
      harga: 350000,
      supplier: 'UD Pasir Sejahtera',
      deskripsi: 'Pasir cor halus untuk pengecoran',
      status: 'aktif',
      created_at: '2024-01-17',
      updated_at: '2024-01-17'
    },
    {
      id: '4',
      nama: 'Keramik 40x40',
      kategori: 'Keramik',
      satuan: 'm2',
      harga: 85000,
      supplier: 'PT Keramik Indah',
      deskripsi: 'Keramik lantai ukuran 40x40 cm',
      status: 'nonaktif',
      created_at: '2024-01-18',
      updated_at: '2024-01-18'
    },
    {
      id: '5',
      nama: 'Cat Tembok',
      kategori: 'Cat',
      satuan: 'kaleng',
      harga: 125000,
      supplier: 'PT Cat Warna',
      deskripsi: 'Cat tembok interior berkualitas premium',
      status: 'aktif',
      created_at: '2024-01-19',
      updated_at: '2024-01-19'
    }
  ])

  const [formData, setFormData] = useState({
    nama: '',
    kategori: '',
    satuan: '',
    harga: '',
    supplier: '',
    deskripsi: '',
    status: 'aktif' as 'aktif' | 'nonaktif'
  })

  const kategoriOptions = ['Semen', 'Bata', 'Pasir', 'Keramik', 'Cat', 'Besi', 'Kayu', 'Pipa', 'Kabel', 'Lainnya']
  const satuanOptions = ['buah', 'kg', 'm', 'm2', 'm3', 'sak', 'kaleng', 'batang', 'lembar', 'roll']

  // Filter dan search
  const filteredMaterials = materials.filter(material => {
    const matchesSearch = material.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.kategori.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         material.supplier?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesKategori = filterKategori === 'semua' || material.kategori === filterKategori
    return matchesSearch && matchesKategori
  })

  // Pagination
  const totalPages = Math.ceil(filteredMaterials.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedMaterials = filteredMaterials.slice(startIndex, startIndex + itemsPerPage)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.nama || !formData.kategori || !formData.satuan || !formData.harga) {
      toast({
        title: "Error",
        description: "Mohon lengkapi semua field yang wajib diisi.",
        variant: "destructive",
      })
      return
    }

    const materialData: Material = {
      id: editingMaterial ? editingMaterial.id : Date.now().toString(),
      nama: formData.nama,
      kategori: formData.kategori,
      satuan: formData.satuan,
      harga: parseInt(formData.harga),
      supplier: formData.supplier,
      deskripsi: formData.deskripsi,
      status: formData.status,
      created_at: editingMaterial ? editingMaterial.created_at : new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    }

    if (editingMaterial) {
      setMaterials(materials.map(m => m.id === editingMaterial.id ? materialData : m))
      toast({
        title: "Berhasil",
        description: "Data material berhasil diperbarui.",
      })
    } else {
      setMaterials([...materials, materialData])
      toast({
        title: "Berhasil",
        description: "Material baru berhasil ditambahkan.",
      })
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (material: Material) => {
    setEditingMaterial(material)
    setFormData({
      nama: material.nama,
      kategori: material.kategori,
      satuan: material.satuan,
      harga: material.harga.toString(),
      supplier: material.supplier || '',
      deskripsi: material.deskripsi || '',
      status: material.status
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setMaterials(materials.filter(m => m.id !== id))
    toast({
      title: "Berhasil",
      description: "Material berhasil dihapus.",
    })
  }

  const resetForm = () => {
    setFormData({
      nama: '',
      kategori: '',
      satuan: '',
      harga: '',
      supplier: '',
      deskripsi: '',
      status: 'aktif'
    })
    setEditingMaterial(null)
  }

  const handleExportCSV = () => {
    const csvContent = [
      ['Nama', 'Kategori', 'Satuan', 'Harga', 'Supplier', 'Status', 'Tanggal Dibuat'],
      ...materials.map(m => [
        m.nama,
        m.kategori,
        m.satuan,
        m.harga.toString(),
        m.supplier || '',
        m.status,
        m.created_at
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `data-material-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Berhasil",
      description: "Data material berhasil diekspor ke CSV.",
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
        
        if (headers.length < 4) {
          throw new Error('Format CSV tidak valid')
        }

        const newMaterials: Material[] = []
        for (let i = 1; i < lines.length; i++) {
          const values = lines[i].split(',')
          if (values.length >= 4 && values[0].trim()) {
            newMaterials.push({
              id: Date.now().toString() + i,
              nama: values[0].trim(),
              kategori: values[1].trim(),
              satuan: values[2].trim(),
              harga: parseInt(values[3].trim()) || 0,
              supplier: values[4]?.trim() || '',
              status: (values[5]?.trim() as 'aktif' | 'nonaktif') || 'aktif',
              deskripsi: '',
              created_at: new Date().toISOString().split('T')[0],
              updated_at: new Date().toISOString().split('T')[0]
            })
          }
        }

        setMaterials([...materials, ...newMaterials])
        toast({
          title: "Berhasil",
          description: `${newMaterials.length} material berhasil diimpor.`,
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

  return (
    <div className="min-h-screen bg-gray-50 p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header dengan tombol kembali */}
        <div className="mb-6">
          <Button
            variant="ghost"
            onClick={() => navigate('/admin')}
            className="mb-4 text-gray-600 hover:text-gray-900"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Kembali ke Admin Dashboard</span>
            <span className="sm:hidden">Kembali</span>
          </Button>
          
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Manajemen Harga Material</h1>
              <p className="text-gray-600 mt-2 text-sm sm:text-base">Kelola data harga material konstruksi</p>
            </div>
          </div>
        </div>

        {/* Controls */}
        <Card className="mb-6">
          <CardContent className="p-4 sm:p-6">
            <div className="flex flex-col gap-4">
              {/* Search and Filter Row */}
              <div className="flex flex-col sm:flex-row gap-4">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari material, kategori, atau supplier..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
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
              </div>
              
              {/* Action Buttons Row */}
              <div className="flex flex-col sm:flex-row gap-2">
                <Button onClick={handleExportCSV} variant="outline" className="flex-1 sm:flex-none">
                  <Download className="h-4 w-4 mr-2" />
                  <span className="hidden sm:inline">Export CSV</span>
                  <span className="sm:hidden">Export</span>
                </Button>
                <label className="flex-1 sm:flex-none">
                  <Button variant="outline" className="cursor-pointer w-full">
                    <Upload className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Import CSV</span>
                    <span className="sm:hidden">Import</span>
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
                    <Button onClick={resetForm} className="flex-1 sm:flex-none">
                      <Plus className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Tambah Material</span>
                      <span className="sm:hidden">Tambah</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto mx-4">
                    <DialogHeader>
                      <DialogTitle className="text-lg sm:text-xl">
                        {editingMaterial ? 'Edit Material' : 'Tambah Material Baru'}
                      </DialogTitle>
                      <DialogDescription className="text-sm">
                        {editingMaterial ? 'Perbarui informasi material' : 'Tambahkan material baru ke database'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="nama">Nama Material *</Label>
                          <Input
                            id="nama"
                            value={formData.nama}
                            onChange={(e) => setFormData({...formData, nama: e.target.value})}
                            placeholder="Contoh: Semen Portland"
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
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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
                          <Label htmlFor="harga">Harga (Rp) *</Label>
                          <Input
                            id="harga"
                            type="number"
                            value={formData.harga}
                            onChange={(e) => setFormData({...formData, harga: e.target.value})}
                            placeholder="0"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="supplier">Supplier</Label>
                          <Input
                            id="supplier"
                            value={formData.supplier}
                            onChange={(e) => setFormData({...formData, supplier: e.target.value})}
                            placeholder="Nama supplier"
                          />
                        </div>
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
                      </div>
                      
                      <div>
                        <Label htmlFor="deskripsi">Deskripsi</Label>
                        <Input
                          id="deskripsi"
                          value={formData.deskripsi}
                          onChange={(e) => setFormData({...formData, deskripsi: e.target.value})}
                          placeholder="Deskripsi material (opsional)"
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Batal
                        </Button>
                        <Button type="submit">
                          {editingMaterial ? 'Perbarui' : 'Tambah'} Material
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
            <CardTitle className="text-lg sm:text-xl">Data Material ({filteredMaterials.length} item)</CardTitle>
            <CardDescription className="text-sm">
              Daftar semua material konstruksi dengan harga terkini
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[150px]">Nama Material</TableHead>
                    <TableHead className="min-w-[120px]">Kategori</TableHead>
                    <TableHead className="min-w-[80px]">Satuan</TableHead>
                    <TableHead className="min-w-[100px]">Harga</TableHead>
                    <TableHead className="min-w-[120px]">Supplier</TableHead>
                    <TableHead className="min-w-[80px]">Status</TableHead>
                    <TableHead className="min-w-[120px]">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedMaterials.map((material) => (
                    <TableRow key={material.id}>
                      <TableCell className="font-medium">{material.nama}</TableCell>
                      <TableCell>{material.kategori}</TableCell>
                      <TableCell>{material.satuan}</TableCell>
                      <TableCell>Rp {material.harga.toLocaleString('id-ID')}</TableCell>
                      <TableCell>{material.supplier || '-'}</TableCell>
                      <TableCell>
                        <Badge variant={material.status === 'aktif' ? 'default' : 'secondary'}>
                          {material.status}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-1 sm:space-x-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(material)}
                            className="px-2 sm:px-3"
                          >
                            <Edit className="h-4 w-4 sm:mr-1" />
                            <span className="hidden sm:inline">Edit</span>
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="px-2 sm:px-3">
                                <Trash2 className="h-4 w-4 sm:mr-1" />
                                <span className="hidden sm:inline">Hapus</span>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hapus Material</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus material "{material.nama}"? 
                                  Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(material.id)}>
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

export default AdminMaterial