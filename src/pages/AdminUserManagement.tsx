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
import { getRoleBadgeVariant, formatRoleName, getAllRoles, getEditableRoles, hasPermission } from "@/utils/roleUtils"

interface UserData {
  id: string
  user_id: string
  email: string
  name: string
  role: string
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

  // Fetch current user role and permissions
  const fetchCurrentUserRole = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) return
      
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('user_id', user.id)
        .single()
      
      if (profileError) {
        console.error('Error fetching current user role:', profileError)
        return
      }
      
      // Set role info based on the role string
      const roleInfo = {
        role_name: profileData.role,
        role_display_name: profileData.role === 'admin' ? 'Administrator' : profileData.role === 'super_admin' ? 'Super Administrator' : 'User',
        role_level: profileData.role === 'super_admin' ? 1 : profileData.role === 'admin' ? 2 : 5,
        permissions: {}
      }
      
      setCurrentUserRole(roleInfo)
      setCurrentUserPermissions(roleInfo.permissions)
    } catch (error) {
      console.error('Error fetching current user role:', error)
    }
  }

  // Set available roles (static list)
  const fetchRoles = async () => {
    try {
      // Use static roles since we're not using user_roles table anymore
      setAvailableRoles([
        { id: 'super_admin', name: 'Super Admin', level: 1 },
        { id: 'admin', name: 'Admin', level: 2 },
        { id: 'user', name: 'User', level: 5 }
      ])
    } catch (error) {
      console.error('Error fetching roles:', error)
      // Fallback to default roles
      setAvailableRoles([
        { id: 'super_admin', name: 'Super Admin', level: 100 },
        { id: 'admin', name: 'Admin', level: 80 },
        { id: 'moderator', name: 'Moderator', level: 60 },
        { id: 'premium_user', name: 'Premium User', level: 40 },
        { id: 'user', name: 'User', level: 20 }
      ])
    }
  }

  // Fetch users from Supabase profiles table
  const fetchUsers = async () => {
    try {
      setLoading(true)
      
      // Get user profiles with role information
      const { data: profilesData, error: profilesError } = await supabase
        .from('profiles')
        .select(`
          id,
          user_id,
          full_name,
          email,
          role,
          phone,
          address,
          city,
          province,
          postal_code,
          date_of_birth,
          gender,
          occupation,
          bio,
          created_at,
          updated_at
        `)
        .order('created_at', { ascending: false })
      
      if (profilesError) {
        console.error('Error fetching profiles:', profilesError)
        toast({
          title: "Error",
          description: "Gagal memuat data pengguna: " + profilesError.message,
          variant: "destructive",
        })
        return
      }
      
      // Transform data to match UserData interface
      const transformedData = (profilesData || []).map(profile => ({
        id: profile.id,
        user_id: profile.user_id,
        email: profile.email || 'No email',
        name: profile.full_name || 'No name',
        role: profile.role || 'user',
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
      
      console.log('Fetched users:', transformedData)
      setUsers(transformedData)
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
    fetchCurrentUserRole()
    fetchRoles()
    fetchUsers()
  }, [])

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'user',
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

  const [availableRoles, setAvailableRoles] = useState([])
  const [currentUserRole, setCurrentUserRole] = useState(null)
  const [currentUserPermissions, setCurrentUserPermissions] = useState({})
  const genderOptions = ['male', 'female']

  // Permission check functions
  const canCreateUser = () => {
    // Only super_admin and admin can create users
    return currentUserRole?.role_name === 'super_admin' || currentUserRole?.role_name === 'admin'
  }
  
  const canUpdateUser = () => {
    // Only super_admin and admin can update users
    return currentUserRole?.role_name === 'super_admin' || currentUserRole?.role_name === 'admin'
  }
  
  const canDeleteUser = () => {
    // Only super_admin and admin can delete users
    return currentUserRole?.role_name === 'super_admin' || currentUserRole?.role_name === 'admin'
  }
  
  const canChangeRole = (targetRole) => {
    if (!currentUserRole) return false
    const targetRoleData = availableRoles.find(r => r.id === targetRole)
    return currentUserRole.role_level > (targetRoleData?.level || 0)
  }
  
  const getEditableRoles = () => {
    if (!currentUserRole) return []
    return availableRoles.filter(role => role.level < currentUserRole.role_level)
  }

  // Filter dan search
  const filteredUsers = users.filter(user => {
    const matchesSearch = (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.city || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (user.occupation || '').toLowerCase().includes(searchTerm.toLowerCase())
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
        email: formData.email,
        role: formData.role,
        phone: formData.phone || null,
        address: formData.address || null,
        city: formData.city || null,
        province: formData.province || null,
        postal_code: formData.postal_code || null,
        date_of_birth: formData.date_of_birth || null,
        gender: formData.gender || null,
        occupation: formData.occupation || null,
        bio: formData.bio || null,
        updated_at: new Date().toISOString()
      }

      if (editingUser) {
        const { error } = await supabase
          .from('profiles')
          .update(profileData)
          .eq('user_id', editingUser.user_id)

        if (error) {
          console.error('Error updating user:', error)
          toast({
            title: "Error",
            description: "Gagal memperbarui data pengguna: " + error.message,
            variant: "destructive",
          })
          return
        }

        // Note: User metadata in auth is not updated here
        // This requires admin privileges that are not available in client-side code

        toast({
          title: "Berhasil",
          description: "Data pengguna berhasil diperbarui.",
        })
      } else {
        // Create user functionality is disabled for security reasons
        // Users should register through the normal registration process
        toast({
          title: "Info",
          description: "Fitur tambah user dinonaktifkan. User baru harus mendaftar melalui halaman registrasi.",
          variant: "default",
        })
        setIsDialogOpen(false)
        return
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

  const handleDelete = async (userId: string) => {
    try {
      setLoading(true)
      
      // Delete user profile from profiles table
      const { error } = await supabase
        .from('profiles')
        .delete()
        .eq('user_id', userId)
      
      if (error) {
        console.error('Error deleting user profile:', error)
        toast({
          title: "Error",
          description: "Gagal menghapus user: " + error.message,
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
    } finally {
      setLoading(false)
    }
  }

  const handleChangeRole = async (userId: string, newRole: string) => {
    try {
      // Update role directly in profiles table
      const { error } = await supabase
        .from('profiles')
        .update({ 
          role: newRole,
          updated_at: new Date().toISOString()
        })
        .eq('user_id', userId)

      if (error) {
        console.error('Error updating role:', error)
        toast({
          title: "Error",
          description: "Gagal mengubah role pengguna: " + error.message,
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
                        {availableRoles.map(role => (
                          <SelectItem key={role.id} value={role.id}>
                            {role.name}
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
                {canCreateUser() && (
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
                          <Select value={formData.role} onValueChange={(value) => setFormData({...formData, role: value})}>
                            <SelectTrigger className="text-sm">
                              <SelectValue placeholder="Pilih role" />
                            </SelectTrigger>
                            <SelectContent>
                              {getEditableRoles().map(role => (
                                <SelectItem key={role.id} value={role.id}>
                                  {role.name}
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
                )}
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
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-500">Memuat data user...</p>
                </div>
              </div>
            ) : (
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
                        <div className="truncate max-w-[180px] sm:max-w-none">{user.email || 'No email'}</div>
                      </TableCell>
                      <TableCell className="text-sm">
                        <div className="truncate max-w-[120px] sm:max-w-none">{user.name || 'No name'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-1 sm:gap-2">
                          <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                            {formatRoleName(user.role)}
                          </Badge>
                          {canChangeRole(user.role) && canUpdateUser() && (
                            <Select value={user.role} onValueChange={(newRole) => handleChangeRole(user.user_id, newRole)}>
                              <SelectTrigger className="text-xs h-6 w-auto min-w-[100px] hidden sm:inline-flex">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {getEditableRoles().map(role => (
                                  <SelectItem key={role.id} value={role.id}>
                                    {role.name}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                          {canUpdateUser() && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(user)}
                              className="h-8 w-8 p-0 sm:h-9 sm:w-auto sm:px-3"
                            >
                              <Edit className="h-3 w-3 sm:h-4 sm:w-4" />
                              <span className="sr-only sm:not-sr-only sm:ml-2">Edit</span>
                            </Button>
                          )}
                          {canDeleteUser() && user.id !== '1' && (
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
                                  <AlertDialogAction onClick={() => handleDelete(user.user_id)}>
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
              
              {/* Empty state */}
              {!loading && paginatedUsers.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <User className="h-12 w-12 text-gray-400 mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada data user</h3>
                  <p className="text-gray-500 mb-4">
                    {filteredUsers.length === 0 && users.length > 0 
                      ? "Tidak ada user yang sesuai dengan filter pencarian."
                      : "Belum ada user yang terdaftar di sistem."}
                  </p>
                  {filteredUsers.length === 0 && users.length > 0 && (
                    <Button 
                      variant="outline" 
                      onClick={() => {
                        setSearchTerm('')
                        setFilterRole('semua')
                      }}
                    >
                      Reset Filter
                    </Button>
                  )}
                </div>
              )}
            </div>
            )}
            
            {/* Pagination */}
            {!loading && totalPages > 1 && (
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