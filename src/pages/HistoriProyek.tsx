import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Calendar, Eye, Download, Search, Filter, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/integrations/supabase/client'
import { useAuth } from '@/contexts/AuthContext'

interface Project {
  id: string
  project_id: string
  name: string
  type: string
  status: 'completed' | 'in-progress' | 'pending' | 'cancelled'
  start_date: string
  end_date?: string
  budget: number
  actual_cost?: number
  progress: number
  description: string
  location: string
  created_at: string
  updated_at: string
}

const HistoriProyek = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  // Fetch projects from Supabase
  useEffect(() => {
    const fetchProjects = async () => {
      if (!user) {
        setLoading(false)
        return
      }

      try {
        const { data, error } = await supabase
          .from('projects')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false })

        if (error) {
          console.error('Error fetching projects:', error)
          toast.error('Gagal memuat data proyek')
        } else {
          setProjects(data || [])
        }
      } catch (error) {
        console.error('Error:', error)
        toast.error('Terjadi kesalahan saat memuat data')
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [user])

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
📅 Periode: ${new Date(project.start_date).toLocaleDateString('id-ID')}${project.end_date ? ` - ${new Date(project.end_date).toLocaleDateString('id-ID')}` : ''}
💰 Anggaran: Rp ${project.budget.toLocaleString('id-ID')}
${project.actual_cost ? `💸 Biaya Aktual: Rp ${project.actual_cost.toLocaleString('id-ID')}` : ''}
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
      startDate: project.start_date,
      endDate: project.end_date,
      budget: project.budget,
      actualCost: project.actual_cost,
      progress: project.progress,
      description: project.description,
      location: project.location,
      generatedAt: new Date().toISOString()
    }
    
    // Create a blob with report data (simulating PDF content)
    const reportContent = `LAPORAN PROYEK\n\nNama Proyek: ${project.name}\nID Proyek: ${project.id}\nJenis: ${project.type}\nStatus: ${getStatusText(project.status)}\nTanggal Mulai: ${new Date(project.start_date).toLocaleDateString('id-ID')}\n${project.end_date ? `Tanggal Selesai: ${new Date(project.end_date).toLocaleDateString('id-ID')}\n` : ''}Anggaran: Rp ${project.budget.toLocaleString('id-ID')}\n${project.actual_cost ? `Biaya Aktual: Rp ${project.actual_cost.toLocaleString('id-ID')}\n` : ''}Progress: ${project.progress}%\nLokasi: ${project.location}\nDeskripsi: ${project.description}\n\nLaporan dibuat pada: ${new Date().toLocaleString('id-ID')}`
    
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
      <div className="flex flex-col items-center space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div className="flex flex-col items-center space-y-3 sm:flex-row sm:items-center sm:gap-4 sm:space-y-0">
          <Button 
            onClick={() => navigate('/dashboard')} 
            variant="outline" 
            size="sm"
            className="w-fit"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Histori Proyek</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Riwayat semua proyek renovasi dan pembangunan</p>
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
        {loading ? (
          <Card>
            <CardContent className="flex items-center justify-center py-12">
              <div className="text-center">
                <p className="text-muted-foreground">Memuat data proyek...</p>
              </div>
            </CardContent>
          </Card>
        ) : filteredProjects.length === 0 ? (
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
                        {new Date(project.start_date).toLocaleDateString('id-ID')}
                        {project.end_date && ` - ${new Date(project.end_date).toLocaleDateString('id-ID')}`}
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
                  {project.actual_cost && (
                    <div>
                      <p className="text-sm font-medium">Biaya Aktual</p>
                      <p className={`text-lg font-semibold ${
                        project.actual_cost <= project.budget ? 'text-green-600' : 'text-red-600'
                      }`}>
                        Rp {project.actual_cost.toLocaleString('id-ID')}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {project.actual_cost <= project.budget ? 'Hemat' : 'Lebih'}: 
                        Rp {Math.abs(project.actual_cost - project.budget).toLocaleString('id-ID')}
                      </p>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Statistics */}
      {(() => {
        const totalProjects = projects.length
        const completedProjects = projects.filter(p => p.status === 'completed').length
        const inProgressProjects = projects.filter(p => p.status === 'in-progress').length
        const totalBudget = projects.reduce((sum, p) => sum + p.budget, 0)
        const totalActualCost = projects.reduce((sum, p) => sum + (p.actual_cost || 0), 0)

        return (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{totalProjects}</p>
                  <p className="text-sm text-muted-foreground">Total Proyek</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-600">{completedProjects}</p>
                  <p className="text-sm text-muted-foreground">Proyek Selesai</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-blue-600">{inProgressProjects}</p>
                  <p className="text-sm text-muted-foreground">Sedang Berlangsung</p>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-orange-600">
                    Rp {totalBudget.toLocaleString('id-ID')}
                  </p>
                  <p className="text-sm text-muted-foreground">Total Investasi</p>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      })()}
    </div>
  )
}

export default HistoriProyek