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
import { ArrowLeft, Search, Edit, Trash2, Download, UserPlus, Shield, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { AdminSidebar } from "@/components/layout/AdminSidebar"

interface UserData {
  id: string
  email: string
  name: string
  role: 'user' | 'admin'
  status: 'active' | 'inactive' | 'suspended'
  project_location?: string
  phone?: string
  last_login?: string
  created_at: string
  updated_at: string
}

const AdminUserManagement = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('semua')
  const [filterStatus, setFilterStatus] = useState('semua')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Dummy data users
  const [users, setUsers] = useState<UserData[]>([
    {
      id: '1',
      email: 'admin@servisoo.com',
      name: 'Administrator',
      role: 'admin',
      status: 'active',
      project_location: 'Jakarta',
      phone: '081234567890',
      last_login: '2024-01-20 10:30:00',
      created_at: '2024-01-01',
      updated_at: '2024-01-20'
    },
    {
      id: '2',
      email: 'john.doe@email.com',
      name: 'John Doe',
      role: 'user',
      status: 'active',
      project_location: 'Bandung',
      phone: '081234567891',
      last_login: '2024-01-19 15:45:00',
      created_at: '2024-01-10',
      updated_at: '2024-01-19'
    },
    {
      id: '3',
      email: 'jane.smith@email.com',
      name: 'Jane Smith',
      role: 'user',
      status: 'active',
      project_location: 'Surabaya',
      phone: '081234567892',
      last_login: '2024-01-18 09:20:00',
      created_at: '2024-01-12',
      updated_at: '2024-01-18'
    },
    {
      id: '4',
      email: 'bob.wilson@email.com',
      name: 'Bob Wilson',
      role: 'user',
      status: 'inactive',
      project_location: 'Medan',
      phone: '081234567893',
      last_login: '2024-01-10 14:15:00',
      created_at: '2024-01-05',
      updated_at: '2024-01-10'
    },
    {
      id: '5',
      email: 'alice.brown@email.com',
      name: 'Alice Brown',
      role: 'user',
      status: 'suspended',
      project_location: 'Yogyakarta',
      phone: '081234567894',
      last_login: '2024-01-08 11:30:00',
      created_at: '2024-01-03',
      updated_at: '2024-01-15'
    }
  ])

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'user' as 'user' | 'admin',
    status: 'active' as 'active' | 'inactive' | 'suspended',
    project_location: '',
    phone: ''
  })

  const roleOptions = ['user', 'admin']
  const statusOptions = ['active', 'inactive', 'suspended']

  // Filter dan search
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.project_location?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'semua' || user.role === filterRole
    const matchesStatus = filterStatus === 'semua' || user.status === filterStatus
    return matchesSearch && matchesRole && matchesStatus
  })

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.email || !formData.name) {
      toast({
        title: "Error",
        description: "Email dan nama wajib diisi.",
        variant: "destructive",
      })
      return
    }

    const userData: UserData = {
      id: editingUser ? editingUser.id : Date.now().toString(),
      email: formData.email,
      name: formData.name,
      role: formData.role,
      status: formData.status,
      project_location: formData.project_location,
      phone: formData.phone,
      last_login: editingUser ? editingUser.last_login : undefined,
      created_at: editingUser ? editingUser.created_at : new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0]
    }

    if (editingUser) {
      setUsers(users.map(u => u.id === editingUser.id ? userData : u))
      toast({
        title: "Berhasil",
        description: "Data user berhasil diperbarui.",
      })
    } else {
      setUsers([...users, userData])
      toast({
        title: "Berhasil",
        description: "User baru berhasil ditambahkan.",
      })
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (user: UserData) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      name: user.name,
      role: user.role,
      status: user.status,
      project_location: user.project_location || '',
      phone: user.phone || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setUsers(users.filter(u => u.id !== id))
    toast({
      title: "Berhasil",
      description: "User berhasil dihapus.",
    })
  }

  const handleChangeRole = (userId: string, newRole: 'user' | 'admin') => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, role: newRole, updated_at: new Date().toISOString().split('T')[0] }
        : u
    ))
    toast({
      title: "Berhasil",
      description: `Role user berhasil diubah menjadi ${newRole}.`,
    })
  }

  const handleChangeStatus = (userId: string, newStatus: 'active' | 'inactive' | 'suspended') => {
    setUsers(users.map(u => 
      u.id === userId 
        ? { ...u, status: newStatus, updated_at: new Date().toISOString().split('T')[0] }
        : u
    ))
    toast({
      title: "Berhasil",
      description: `Status user berhasil diubah menjadi ${newStatus}.`,
    })
  }

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      role: 'user',
      status: 'active',
      project_location: '',
      phone: ''
    })
    setEditingUser(null)
  }

  const handleExportCSV = () => {
    const csvContent = [
      ['Email', 'Nama', 'Role', 'Status', 'Lokasi Proyek', 'Telepon', 'Last Login', 'Tanggal Dibuat'],
      ...users.map(u => [
        u.email,
        u.name,
        u.role,
        u.status,
        u.project_location || '',
        u.phone || '',
        u.last_login || '',
        u.created_at
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `data-users-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Berhasil",
      description: "Data user berhasil diekspor ke CSV.",
    })
  }

  const getRoleBadgeVariant = (role: string) => {
    return role === 'admin' ? 'destructive' : 'default'
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active': return 'default'
      case 'inactive': return 'secondary'
      case 'suspended': return 'destructive'
      default: return 'secondary'
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID')
  }

  return (
    <div className="min-h-screen bg-secondary/20 flex">
      <AdminSidebar />
      
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
        <div className="p-4 sm:p-6">
          {/* Header dengan tombol kembali */}
          <div className="mb-6">
            <Button
              variant="ghost"
              onClick={() => navigate('/admin')}
              className="mb-4 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              <span className="hidden sm:inline">Kembali ke Admin Dashboard</span>
              <span className="sm:hidden">Kembali</span>
            </Button>
            
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold text-foreground">Manajemen User</h1>
                <p className="text-sm sm:text-base text-muted-foreground mt-2">Kelola data user dan ubah role akses</p>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total User</p>
                  <p className="text-2xl font-bold">{users.length}</p>
                </div>
                <User className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Admin</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.role === 'admin').length}</p>
                </div>
                <Shield className="h-8 w-8 text-red-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">User Aktif</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.status === 'active').length}</p>
                </div>
                <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">User Suspended</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.status === 'suspended').length}</p>
                </div>
                <div className="h-8 w-8 bg-red-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-red-600 rounded-full"></div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

          {/* Controls */}
          <Card className="mb-6">
            <CardContent className="p-4 sm:p-6">
              <div className="flex flex-col gap-4">
                <div className="flex flex-col sm:flex-row gap-4 flex-1">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Cari email, nama, atau lokasi..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                    <Select value={filterRole} onValueChange={setFilterRole}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter Role" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semua">Semua Role</SelectItem>
                        {roleOptions.map(role => (
                          <SelectItem key={role} value={role}>
                            {role.charAt(0).toUpperCase() + role.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Select value={filterStatus} onValueChange={setFilterStatus}>
                      <SelectTrigger className="w-full sm:w-48">
                        <SelectValue placeholder="Filter Status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="semua">Semua Status</SelectItem>
                        {statusOptions.map(status => (
                          <SelectItem key={status} value={status}>
                            {status.charAt(0).toUpperCase() + status.slice(1)}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <Button onClick={handleExportCSV} variant="outline" className="w-full sm:w-auto">
                    <Download className="h-4 w-4 mr-2" />
                    <span className="hidden sm:inline">Export CSV</span>
                    <span className="sm:hidden">Export</span>
                  </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm} className="w-full sm:w-auto">
                      <UserPlus className="h-4 w-4 mr-2" />
                      <span className="hidden sm:inline">Tambah User</span>
                      <span className="sm:hidden">Tambah</span>
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl mx-4 sm:mx-0 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                      <DialogTitle className="text-lg sm:text-xl">
                        {editingUser ? 'Edit User' : 'Tambah User Baru'}
                      </DialogTitle>
                      <DialogDescription className="text-sm">
                        {editingUser ? 'Perbarui informasi user' : 'Tambahkan user baru ke sistem'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4 pr-2">
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email" className="text-sm">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="user@example.com"
                            required
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="name" className="text-sm">Nama Lengkap *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Nama lengkap"
                            required
                            className="text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="role" className="text-sm">Role *</Label>
                          <Select value={formData.role} onValueChange={(value: 'user' | 'admin') => setFormData({...formData, role: value})}>
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {roleOptions.map(role => (
                                <SelectItem key={role} value={role}>
                                  {role.charAt(0).toUpperCase() + role.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="status" className="text-sm">Status *</Label>
                          <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'suspended') => setFormData({...formData, status: value})}>
                            <SelectTrigger className="text-sm">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {statusOptions.map(status => (
                                <SelectItem key={status} value={status}>
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="project_location" className="text-sm">Lokasi Proyek</Label>
                          <Input
                            id="project_location"
                            value={formData.project_location}
                            onChange={(e) => setFormData({...formData, project_location: e.target.value})}
                            placeholder="Kota/Kabupaten"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone" className="text-sm">Nomor Telepon</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="08xxxxxxxxxx"
                            className="text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="flex flex-col sm:flex-row justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)} className="w-full sm:w-auto order-2 sm:order-1">
                          Batal
                        </Button>
                        <Button type="submit" className="w-full sm:w-auto order-1 sm:order-2">
                          {editingUser ? 'Perbarui' : 'Tambah'} User
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
          <CardHeader className="p-4 sm:p-6">
            <CardTitle className="text-lg sm:text-xl">Data User ({filteredUsers.length} user)</CardTitle>
            <CardDescription className="text-sm">
              Daftar semua user yang terdaftar di sistem
            </CardDescription>
          </CardHeader>
          <CardContent className="p-0 sm:p-6">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[200px] sm:min-w-0">Email</TableHead>
                    <TableHead className="min-w-[150px] sm:min-w-0">Nama</TableHead>
                    <TableHead className="min-w-[100px] sm:min-w-0">Role</TableHead>
                    <TableHead className="min-w-[100px] sm:min-w-0">Status</TableHead>
                    <TableHead className="min-w-[150px] sm:min-w-0 hidden md:table-cell">Lokasi Proyek</TableHead>
                    <TableHead className="min-w-[150px] sm:min-w-0 hidden lg:table-cell">Last Login</TableHead>
                    <TableHead className="min-w-[120px] sm:min-w-0">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium text-sm">
                        <div className="truncate max-w-[180px] sm:max-w-none">{user.email}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="truncate max-w-[120px] sm:max-w-none">{user.name}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                          <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                          {user.role === 'user' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleChangeRole(user.id, 'admin')}
                              className="text-xs h-6 px-2 hidden sm:inline-flex"
                            >
                              Jadikan Admin
                            </Button>
                          )}
                          {user.role === 'admin' && user.id !== '1' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleChangeRole(user.id, 'user')}
                              className="text-xs h-6 px-2 hidden sm:inline-flex"
                            >
                              Jadikan User
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                          <Badge variant={getStatusBadgeVariant(user.status)} className="text-xs">
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                          {user.status !== 'active' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleChangeStatus(user.id, 'active')}
                              className="text-xs h-6 px-2 hidden sm:inline-flex"
                            >
                              Aktifkan
                            </Button>
                          )}
                          {user.status === 'active' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleChangeStatus(user.id, 'suspended')}
                              className="text-xs h-6 px-2 hidden sm:inline-flex"
                            >
                              Suspend
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell className="hidden md:table-cell text-sm">{user.project_location || '-'}</TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        {user.last_login ? formatDate(user.last_login.split(' ')[0]) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1 sm:gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(user)}
                            className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                          >
                            <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="sr-only sm:not-sr-only sm:ml-2">Edit</span>
                          </Button>
                          {user.id !== '1' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3">
                                  <Trash2 className="h-3 w-3 sm:h-4 sm:w-4" />
                                  <span className="sr-only sm:not-sr-only sm:ml-2">Hapus</span>
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent className="mx-4 sm:mx-0">
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Hapus User</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus user "{user.name}"? 
                                    Tindakan ini tidak dapat dibatalkan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(user.id)}>
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
            
            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row justify-center items-center gap-2 mt-6 px-4 sm:px-0">
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="text-xs sm:text-sm"
                  >
                    <span className="hidden sm:inline">Previous</span>
                    <span className="sm:hidden">Prev</span>
                  </Button>
                  <div className="flex gap-1 sm:gap-2 max-w-[200px] sm:max-w-none overflow-x-auto">
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page)}
                        className="min-w-[32px] h-8 text-xs sm:text-sm sm:min-w-[40px] sm:h-9"
                      >
                        {page}
                      </Button>
                    ))}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="text-xs sm:text-sm"
                  >
                    <span className="hidden sm:inline">Next</span>
                    <span className="sm:hidden">Next</span>
                  </Button>
                </div>
                <div className="text-xs sm:text-sm text-gray-500 mt-2 sm:mt-0">
                  Halaman {currentPage} dari {totalPages}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        </div>
      </main>
    </div>
  )
}

export default AdminUserManagement