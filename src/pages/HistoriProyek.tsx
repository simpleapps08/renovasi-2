import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Eye, Download, Search, Filter, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

interface Project {
  id: string
  name: string
  type: string
  status: 'completed' | 'in-progress' | 'pending' | 'cancelled'
  startDate: string
  endDate?: string
  budget: number
  actualCost?: number
  progress: number
  description: string
  location: string
}

const HistoriProyek = () => {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  // Data dummy untuk pengguna Agus
  const projects: Project[] = [
    {
      id: 'PRJ-001',
      name: 'Renovasi Dapur dan Ruang Makan',
      type: 'Renovasi Rumah',
      status: 'completed',
      startDate: '2024-01-15',
      endDate: '2024-03-20',
      budget: 85000000,
      actualCost: 82500000,
      progress: 100,
      description: 'Renovasi total dapur dengan kitchen set baru, lantai keramik, dan perluasan ruang makan',
      location: 'Jl. Merdeka No. 123, Jakarta Selatan'
    },
    {
      id: 'PRJ-002',
      name: 'Pembangunan Kamar Mandi Tambahan',
      type: 'Pembangunan Baru',
      status: 'completed',
      startDate: '2024-04-10',
      endDate: '2024-05-25',
      budget: 35000000,
      actualCost: 33800000,
      progress: 100,
      description: 'Pembangunan kamar mandi baru di lantai 2 dengan shower dan water heater',
      location: 'Jl. Merdeka No. 123, Jakarta Selatan'
    },
    {
      id: 'PRJ-003',
      name: 'Renovasi Teras dan Taman',
      type: 'Renovasi Rumah',
      status: 'in-progress',
      startDate: '2024-11-01',
      budget: 45000000,
      progress: 65,
      description: 'Renovasi teras dengan pergola, pemasangan deck kayu, dan landscaping taman',
      location: 'Jl. Merdeka No. 123, Jakarta Selatan'
    },
    {
      id: 'PRJ-004',
      name: 'Perbaikan Atap dan Talang',
      type: 'Perbaikan',
      status: 'pending',
      startDate: '2025-01-15',
      budget: 25000000,
      progress: 0,
      description: 'Perbaikan kebocoran atap, penggantian genteng, dan instalasi talang air baru',
      location: 'Jl. Merdeka No. 123, Jakarta Selatan'
    },
    {
      id: 'PRJ-005',
      name: 'Renovasi Kamar Tidur Utama',
      type: 'Renovasi Rumah',
      status: 'completed',
      startDate: '2023-09-10',
      endDate: '2023-11-15',
      budget: 55000000,
      actualCost: 58200000,
      progress: 100,
      description: 'Renovasi kamar tidur utama dengan walk-in closet, AC split, dan kamar mandi dalam',
      location: 'Jl. Merdeka No. 123, Jakarta Selatan'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'in-progress':
        return 'bg-blue-100 text-blue-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'cancelled':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Selesai'
      case 'in-progress':
        return 'Berlangsung'
      case 'pending':
        return 'Menunggu'
      case 'cancelled':
        return 'Dibatalkan'
      default:
        return status
    }
  }

  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         project.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesType = typeFilter === 'all' || project.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const viewProjectDetail = (project: Project) => {
    // Simulate opening project detail modal or page
    const detailInfo = `
📋 Detail Proyek: ${project.name}
🏷️ ID: ${project.id}
📅 Periode: ${new Date(project.startDate).toLocaleDateString('id-ID')}${project.endDate ? ` - ${new Date(project.endDate).toLocaleDateString('id-ID')}` : ''}
💰 Anggaran: Rp ${project.budget.toLocaleString('id-ID')}
${project.actualCost ? `💸 Biaya Aktual: Rp ${project.actualCost.toLocaleString('id-ID')}` : ''}
📍 Lokasi: ${project.location}
📝 Deskripsi: ${project.description}
    `
    
    toast.success('Detail Proyek', {
      description: detailInfo,
      duration: 8000
    })
  }

  const downloadReport = (project: Project) => {
    // Simulate PDF generation and download
    const reportData = {
      projectId: project.id,
      projectName: project.name,
      type: project.type,
      status: project.status,
      startDate: project.startDate,
      endDate: project.endDate,
      budget: project.budget,
      actualCost: project.actualCost,
      progress: project.progress,
      description: project.description,
      location: project.location,
      generatedAt: new Date().toISOString()
    }
    
    // Create a blob with report data (simulating PDF content)
    const reportContent = `LAPORAN PROYEK\n\nNama Proyek: ${project.name}\nID Proyek: ${project.id}\nJenis: ${project.type}\nStatus: ${getStatusText(project.status)}\nTanggal Mulai: ${new Date(project.startDate).toLocaleDateString('id-ID')}\n${project.endDate ? `Tanggal Selesai: ${new Date(project.endDate).toLocaleDateString('id-ID')}\n` : ''}Anggaran: Rp ${project.budget.toLocaleString('id-ID')}\n${project.actualCost ? `Biaya Aktual: Rp ${project.actualCost.toLocaleString('id-ID')}\n` : ''}Progress: ${project.progress}%\nLokasi: ${project.location}\nDeskripsi: ${project.description}\n\nLaporan dibuat pada: ${new Date().toLocaleString('id-ID')}`
    
    const blob = new Blob([reportContent], { type: 'text/plain' })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `Laporan_${project.id}_${project.name.replace(/\s+/g, '_')}.txt`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
    
    toast.success(`Laporan proyek ${project.name} berhasil diunduh!`)
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
            <h1 className="text-3xl font-bold">Histori Proyek</h1>
            <p className="text-muted-foreground">Riwayat semua proyek renovasi dan pembangunan</p>
          </div>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Filter & Pencarian
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Cari Proyek</label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Cari nama atau deskripsi proyek..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Status</label>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="completed">Selesai</SelectItem>
                  <SelectItem value="in-progress">Berlangsung</SelectItem>
                  <SelectItem value="pending">Menunggu</SelectItem>
                  <SelectItem value="cancelled">Dibatalkan</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Jenis Proyek</label>
              <Select value={typeFilter} onValueChange={setTypeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Jenis</SelectItem>
                  <SelectItem value="Renovasi Rumah">Renovasi Rumah</SelectItem>
                  <SelectItem value="Pembangunan Baru">Pembangunan Baru</SelectItem>
                  <SelectItem value="Perbaikan">Perbaikan</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Projects List */}
      <div className="grid gap-6">
        {filteredProjects.length === 0 ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-muted-foreground">Tidak ada proyek yang ditemukan</p>
                <p className="text-sm text-muted-foreground mt-1">Coba ubah filter pencarian Anda</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          filteredProjects.map((project) => (
            <Card key={project.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-2">
                    <div className="flex items-center gap-3">
                      <CardTitle className="text-xl">{project.name}</CardTitle>
                      <Badge className={getStatusColor(project.status)}>
                        {getStatusText(project.status)}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(project.startDate).toLocaleDateString('id-ID')}
                        {project.endDate && ` - ${new Date(project.endDate).toLocaleDateString('id-ID')}`}
                      </span>
                      <span>ID: {project.id}</span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => viewProjectDetail(project)}
                    >
                      <Eye className="h-4 w-4 mr-1" />
                      Detail
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => downloadReport(project)}
                    >
                      <Download className="h-4 w-4 mr-1" />
                      Laporan
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">Deskripsi:</p>
                  <p className="text-sm">{project.description}</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <p className="text-sm font-medium">Jenis Proyek</p>
                    <p className="text-sm text-muted-foreground">{project.type}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Lokasi</p>
                    <p className="text-sm text-muted-foreground">{project.location}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium">Progress</p>
                    <div className="flex items-center gap-2">
                      <div className="flex-1 bg-gray-200 rounded-full h-2">
                        <div 
                          className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                          style={{ width: `${project.progress}%` }}
                        />
                      </div>
                      <span className="text-sm font-medium">{project.progress}%</span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
                  <div>
                    <p className="text-sm font-medium">Anggaran</p>
                    <p className="text-lg font-semibold text-blue-600">
                      Rp {project.budget.toLocaleString('id-ID')}
                    </p>
                  </div>
                  {project.actualCost && (
                    <div>
                      <p className="text-sm font-medium">Biaya Aktual</p>
                      <p className={`text-lg font-semibold ${
                        project.actualCost <= project.budget ? 'text-green-600' : 'text-red-600'
                      }`}>
                        Rp {project.actualCost.toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {project.actualCost <= project.budget ? 'Hemat' : 'Lebih'}: 
                        Rp {Math.abs(project.actualCost - project.budget).toLocaleString('id-ID')}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{projects.length}</p>
              <p className="text-sm text-muted-foreground">Total Proyek</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">
                {projects.filter(p => p.status === 'completed').length}
              </p>
              <p className="text-sm text-muted-foreground">Proyek Selesai</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">
                {projects.filter(p => p.status === 'in-progress').length}
              </p>
              <p className="text-sm text-muted-foreground">Sedang Berlangsung</p>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">
                Rp {projects.reduce((sum, p) => sum + p.budget, 0).toLocaleString('id-ID')}
              </p>
              <p className="text-sm text-muted-foreground">Total Investasi</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default HistoriProyek