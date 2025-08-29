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
              <h1 className="text-3xl font-bold text-gray-900">Manajemen User</h1>
              <p className="text-gray-600 mt-2">Kelola data user dan ubah role akses</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
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
          <CardContent className="p-6">
            <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
              <div className="flex flex-col md:flex-row gap-4 flex-1">
                <div className="relative flex-1 max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                    placeholder="Cari email, nama, atau lokasi..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Select value={filterRole} onValueChange={setFilterRole}>
                  <SelectTrigger className="w-48">
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
                  <SelectTrigger className="w-48">
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
              
              <div className="flex gap-2">
                <Button onClick={handleExportCSV} variant="outline">
                  <Download className="h-4 w-4 mr-2" />
                  Export CSV
                </Button>
                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                  <DialogTrigger asChild>
                    <Button onClick={resetForm}>
                      <UserPlus className="h-4 w-4 mr-2" />
                      Tambah User
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingUser ? 'Edit User' : 'Tambah User Baru'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingUser ? 'Perbarui informasi user' : 'Tambahkan user baru ke sistem'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="email">Email *</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="user@example.com"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="name">Nama Lengkap *</Label>
                          <Input
                            id="name"
                            value={formData.name}
                            onChange={(e) => setFormData({...formData, name: e.target.value})}
                            placeholder="Nama lengkap"
                            required
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="role">Role *</Label>
                          <Select value={formData.role} onValueChange={(value: 'user' | 'admin') => setFormData({...formData, role: value})}>
                            <SelectTrigger>
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
                          <Label htmlFor="status">Status *</Label>
                          <Select value={formData.status} onValueChange={(value: 'active' | 'inactive' | 'suspended') => setFormData({...formData, status: value})}>
                            <SelectTrigger>
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
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="project_location">Lokasi Proyek</Label>
                          <Input
                            id="project_location"
                            value={formData.project_location}
                            onChange={(e) => setFormData({...formData, project_location: e.target.value})}
                            placeholder="Kota/Kabupaten"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Nomor Telepon</Label>
                          <Input
                            id="phone"
                            value={formData.phone}
                            onChange={(e) => setFormData({...formData, phone: e.target.value})}
                            placeholder="08xxxxxxxxxx"
                          />
                        </div>
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Batal
                        </Button>
                        <Button type="submit">
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
          <CardHeader>
            <CardTitle>Data User ({filteredUsers.length} user)</CardTitle>
            <CardDescription>
              Daftar semua user yang terdaftar di sistem
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Email</TableHead>
                    <TableHead>Nama</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Lokasi Proyek</TableHead>
                    <TableHead>Last Login</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedUsers.map((user) => (
                    <TableRow key={user.id}>
                      <TableCell className="font-medium">{user.email}</TableCell>
                      <TableCell>{user.name}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={getRoleBadgeVariant(user.role)}>
                            {user.role.charAt(0).toUpperCase() + user.role.slice(1)}
                          </Badge>
                          {user.role === 'user' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleChangeRole(user.id, 'admin')}
                              className="text-xs"
                            >
                              Jadikan Admin
                            </Button>
                          )}
                          {user.role === 'admin' && user.id !== '1' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleChangeRole(user.id, 'user')}
                              className="text-xs"
                            >
                              Jadikan User
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusBadgeVariant(user.status)}>
                            {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                          </Badge>
                          {user.status !== 'active' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleChangeStatus(user.id, 'active')}
                              className="text-xs"
                            >
                              Aktifkan
                            </Button>
                          )}
                          {user.status === 'active' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleChangeStatus(user.id, 'suspended')}
                              className="text-xs"
                            >
                              Suspend
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>{user.project_location || '-'}</TableCell>
                      <TableCell>
                        {user.last_login ? formatDate(user.last_login.split(' ')[0]) : '-'}
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(user)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          {user.id !== '1' && (
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
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

export default AdminUserManagement