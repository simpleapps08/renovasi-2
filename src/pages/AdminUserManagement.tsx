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
import { ArrowLeft, Search, Edit, Trash2, Download, UserPlus, Shield, User } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { AdminSidebar } from "@/components/layout/AdminSidebar"
import { supabase } from "@/integrations/supabase/client"

interface UserData {
  id: string
  user_id: string
  email: string
  name: string
  role: 'user' | 'admin'
  phone?: string
  address?: string
  city?: string
  province?: string
  postal_code?: string
  date_of_birth?: string
  gender?: 'male' | 'female'
  occupation?: string
  bio?: string
  created_at: string
  updated_at: string
}

const AdminUserManagement = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterRole, setFilterRole] = useState('semua')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingUser, setEditingUser] = useState<UserData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const [loading, setLoading] = useState(true)
  const itemsPerPage = 10

  const [users, setUsers] = useState<UserData[]>([])

  // Fetch users from Supabase
  const fetchUsers = async () => {
    try {
      setLoading(true)
      const { data, error } = await supabase
        .from('user_profiles')
        .select(`
          *,
          users:user_id (
            email
          )
        `)
        .order('created_at', { ascending: false })

      if (error) {
        console.error('Error fetching users:', error)
        toast({
          title: "Error",
          description: "Gagal memuat data pengguna",
          variant: "destructive",
        })
      } else {
        const transformedData = (data || []).map(profile => ({
          id: profile.id,
          user_id: profile.user_id,
          email: profile.users?.email || '',
          name: profile.full_name || '',
          role: profile.role,
          phone: profile.phone,
          address: profile.address,
          city: profile.city,
          province: profile.province,
          postal_code: profile.postal_code,
          date_of_birth: profile.date_of_birth,
          gender: profile.gender,
          occupation: profile.occupation,
          bio: profile.bio,
          created_at: profile.created_at,
          updated_at: profile.updated_at
        }))
        setUsers(transformedData)
      }
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat memuat data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'user' as 'user' | 'admin',
    phone: '',
    address: '',
    city: '',
    province: '',
    postal_code: '',
    date_of_birth: '',
    gender: '' as 'male' | 'female' | '',
    occupation: '',
    bio: ''
  })

  const roleOptions = ['user', 'admin']
  const genderOptions = ['male', 'female']

  // Filter dan search
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.occupation?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesRole = filterRole === 'semua' || user.role === filterRole
    return matchesSearch && matchesRole
  })

  // Pagination
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.name) {
      toast({
        title: "Error",
        description: "Nama wajib diisi.",
        variant: "destructive",
      })
      return
    }

    try {
      setLoading(true)
      
      const profileData = {
        full_name: formData.name,
        role: formData.role,
        phone: formData.phone || null,
        address: formData.address || null,
        city: formData.city || null,
        province: formData.province || null,
        postal_code: formData.postal_code || null,
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || null,
        occupation: formData.occupation || null,
        bio: formData.bio || null
      }

      if (editingUser) {
        const { error } = await supabase
          .from('user_profiles')
          .update(profileData)
          .eq('id', editingUser.id)

        if (error) {
          console.error('Error updating user:', error)
          toast({
            title: "Error",
            description: "Gagal memperbarui data pengguna",
            variant: "destructive",
          })
          return
        }

        toast({
          title: "Berhasil",
          description: "Data pengguna berhasil diperbarui.",
        })
      } else {
        // Note: Creating new users requires auth.users entry first
        // This is typically handled by user registration
        toast({
          title: "Info",
          description: "Pembuatan pengguna baru harus melalui proses registrasi.",
        })
      }

      await fetchUsers() // Refresh data
      resetForm()
      setIsDialogOpen(false)
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menyimpan data",
        variant: "destructive",
      })
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user: UserData) => {
    setEditingUser(user)
    setFormData({
      email: user.email,
      name: user.name,
      role: user.role,
      phone: user.phone || '',
      address: user.address || '',
      city: user.city || '',
      province: user.province || '',
      postal_code: user.postal_code || '',
      date_of_birth: user.date_of_birth || '',
      gender: user.gender || '',
      occupation: user.occupation || '',
      bio: user.bio || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .delete()
        .eq('id', id)

      if (error) {
        console.error('Error deleting user:', error)
        toast({
          title: "Error",
          description: "Gagal menghapus pengguna",
          variant: "destructive",
        })
        return
      }

      toast({
        title: "Berhasil",
        description: "Pengguna berhasil dihapus.",
      })
      
      await fetchUsers() // Refresh data
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: "Error",
        description: "Terjadi kesalahan saat menghapus data",
        variant: "destructive",
      })
    }
  }

  const handleChangeRole = async (userId: string, newRole: 'user' | 'admin') => {
    try {
      const { error } = await supabase
        .from('user_profiles')
        .update({ role: newRole })
        .eq('id', userId)

      if (error) {
        console.error('Error updating role:', error)
        toast({
          title: "Error",
          description: "Gagal mengubah role pengguna",
          variant: "destructive",
        })
        return
      }

      toast({
         title: "Berhasil",
         description: `Role pengguna berhasil diubah menjadi ${newRole}.`,
       })
       
       await fetchUsers() // Refresh data
     } catch (error) {
       console.error('Error:', error)
       toast({
         title: "Error",
         description: "Terjadi kesalahan saat mengubah role",
         variant: "destructive",
       })
     }
   }

   const resetForm = () => {
     setFormData({
       email: '',
       name: '',
       role: 'user',
       phone: '',
       address: '',
       city: '',
       province: '',
       postal_code: '',
       date_of_birth: '',
       gender: '',
       occupation: '',
       bio: ''
     })
     setEditingUser(null)
   }

   const exportToCSV = () => {
     const csvContent = "data:text/csv;charset=utf-8," + 
       "Email,Nama,Role,Telepon,Kota,Pekerjaan,Tanggal Dibuat\n" +
       filteredUsers.map(user => {
         return `${user.email},${user.name},${user.role},${user.phone || ''},${user.city || ''},${user.occupation || ''},${user.created_at}`;
       }).join("\n");
     
     const encodedUri = encodeURI(csvContent);
     const link = document.createElement("a");
     link.setAttribute("href", encodedUri);
     link.setAttribute("download", "users_data.csv");
     document.body.appendChild(link);
     link.click();
     document.body.removeChild(link);
     
     toast({
       title: "Ekspor Berhasil",
       description: "Data pengguna berhasil diekspor ke CSV.",
     });
   }

  const getRoleBadgeVariant = (role: string) => {
    return role === 'admin' ? 'destructive' : 'default'
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
                  <p className="text-sm font-medium text-gray-600">Total Kota</p>
                  <p className="text-2xl font-bold">{new Set(users.map(u => u.city).filter(Boolean)).size}</p>
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
                  <p className="text-sm font-medium text-gray-600">Dengan Profil Lengkap</p>
                  <p className="text-2xl font-bold">{users.filter(u => u.phone && u.address && u.city).length}</p>
                </div>
                <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                  <div className="h-4 w-4 bg-blue-600 rounded-full"></div>
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
                      placeholder="Cari email, nama, kota, atau pekerjaan..."
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

                  </div>
                </div>
                
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
                  <Button onClick={exportToCSV} variant="outline" className="w-full sm:w-auto">
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
                          <Label htmlFor="email" className="text-sm">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            value={formData.email}
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            placeholder="user@example.com"
                            disabled={!!editingUser}
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
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="address" className="text-sm">Alamat</Label>
                          <Input
                            id="address"
                            value={formData.address}
                            onChange={(e) => setFormData({...formData, address: e.target.value})}
                            placeholder="Alamat lengkap"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="city" className="text-sm">Kota</Label>
                          <Input
                            id="city"
                            value={formData.city}
                            onChange={(e) => setFormData({...formData, city: e.target.value})}
                            placeholder="Nama kota"
                            className="text-sm"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="province" className="text-sm">Provinsi</Label>
                          <Input
                            id="province"
                            value={formData.province}
                            onChange={(e) => setFormData({...formData, province: e.target.value})}
                            placeholder="Nama provinsi"
                            className="text-sm"
                          />
                        </div>
                        <div>
                          <Label htmlFor="occupation" className="text-sm">Pekerjaan</Label>
                          <Input
                            id="occupation"
                            value={formData.occupation}
                            onChange={(e) => setFormData({...formData, occupation: e.target.value})}
                            placeholder="Pekerjaan"
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
                    <TableHead className="min-w-[150px] sm:min-w-0 hidden md:table-cell">Kota</TableHead>
                    <TableHead className="min-w-[150px] sm:min-w-0 hidden lg:table-cell">Telepon</TableHead>
                    <TableHead className="min-w-[150px] sm:min-w-0 hidden lg:table-cell">Pekerjaan</TableHead>
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
                      <TableCell className="hidden md:table-cell text-sm">
                        <div className="truncate max-w-[120px]">{user.city || '-'}</div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        <div className="truncate max-w-[120px]">{user.phone || '-'}</div>
                      </TableCell>
                      <TableCell className="hidden lg:table-cell text-sm">
                        <div className="truncate max-w-[120px]">{user.occupation || '-'}</div>
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