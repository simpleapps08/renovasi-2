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
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { ArrowLeft, Search, Edit, Trash2, Download, Plus, CreditCard, CheckCircle, XCircle, Clock, DollarSign } from "lucide-react"
import { useNavigate } from "react-router-dom"

interface DepositData {
  id: string
  user_email: string
  user_name: string
  project_name: string
  amount: number
  status: 'pending' | 'approved' | 'rejected' | 'completed'
  payment_method: 'bank_transfer' | 'credit_card' | 'e_wallet'
  payment_proof?: string
  notes?: string
  admin_notes?: string
  created_at: string
  updated_at: string
  approved_by?: string
  approved_at?: string
}

const AdminDepositBilling = () => {
  const navigate = useNavigate()
  const { toast } = useToast()
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('semua')
  const [filterPaymentMethod, setFilterPaymentMethod] = useState('semua')
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [editingDeposit, setEditingDeposit] = useState<DepositData | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Dummy data deposits
  const [deposits, setDeposits] = useState<DepositData[]>([
    {
      id: '1',
      user_email: 'john.doe@email.com',
      user_name: 'John Doe',
      project_name: 'Renovasi Rumah Bandung',
      amount: 50000000,
      status: 'pending',
      payment_method: 'bank_transfer',
      payment_proof: 'proof_001.jpg',
      notes: 'Deposit untuk tahap pertama renovasi',
      created_at: '2024-01-20',
      updated_at: '2024-01-20'
    },
    {
      id: '2',
      user_email: 'jane.smith@email.com',
      user_name: 'Jane Smith',
      project_name: 'Pembangunan Rumah Surabaya',
      amount: 75000000,
      status: 'approved',
      payment_method: 'credit_card',
      notes: 'Deposit untuk material dan tenaga kerja',
      admin_notes: 'Pembayaran telah diverifikasi',
      approved_by: 'admin@servisoo.com',
      approved_at: '2024-01-19 10:30:00',
      created_at: '2024-01-18',
      updated_at: '2024-01-19'
    },
    {
      id: '3',
      user_email: 'bob.wilson@email.com',
      user_name: 'Bob Wilson',
      project_name: 'Renovasi Dapur Medan',
      amount: 25000000,
      status: 'completed',
      payment_method: 'e_wallet',
      notes: 'Deposit untuk renovasi dapur',
      admin_notes: 'Proyek telah selesai, deposit dikembalikan',
      approved_by: 'admin@servisoo.com',
      approved_at: '2024-01-15 14:20:00',
      created_at: '2024-01-10',
      updated_at: '2024-01-17'
    },
    {
      id: '4',
      user_email: 'alice.brown@email.com',
      user_name: 'Alice Brown',
      project_name: 'Pembangunan Kamar Mandi Yogyakarta',
      amount: 30000000,
      status: 'rejected',
      payment_method: 'bank_transfer',
      payment_proof: 'proof_004.jpg',
      notes: 'Deposit untuk pembangunan kamar mandi',
      admin_notes: 'Bukti pembayaran tidak valid',
      created_at: '2024-01-16',
      updated_at: '2024-01-17'
    },
    {
      id: '5',
      user_email: 'charlie.davis@email.com',
      user_name: 'Charlie Davis',
      project_name: 'Renovasi Teras Jakarta',
      amount: 15000000,
      status: 'pending',
      payment_method: 'bank_transfer',
      payment_proof: 'proof_005.jpg',
      notes: 'Deposit untuk renovasi teras rumah',
      created_at: '2024-01-21',
      updated_at: '2024-01-21'
    }
  ])

  const [formData, setFormData] = useState({
    user_email: '',
    user_name: '',
    project_name: '',
    amount: '',
    status: 'pending' as 'pending' | 'approved' | 'rejected' | 'completed',
    payment_method: 'bank_transfer' as 'bank_transfer' | 'credit_card' | 'e_wallet',
    notes: '',
    admin_notes: ''
  })

  const statusOptions = ['pending', 'approved', 'rejected', 'completed']
  const paymentMethodOptions = ['bank_transfer', 'credit_card', 'e_wallet']

  // Filter dan search
  const filteredDeposits = deposits.filter(deposit => {
    const matchesSearch = deposit.user_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deposit.user_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         deposit.project_name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = filterStatus === 'semua' || deposit.status === filterStatus
    const matchesPaymentMethod = filterPaymentMethod === 'semua' || deposit.payment_method === filterPaymentMethod
    return matchesSearch && matchesStatus && matchesPaymentMethod
  })

  // Pagination
  const totalPages = Math.ceil(filteredDeposits.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const paginatedDeposits = filteredDeposits.slice(startIndex, startIndex + itemsPerPage)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.user_email || !formData.user_name || !formData.project_name || !formData.amount) {
      toast({
        title: "Error",
        description: "Semua field wajib diisi.",
        variant: "destructive",
      })
      return
    }

    const depositData: DepositData = {
      id: editingDeposit ? editingDeposit.id : Date.now().toString(),
      user_email: formData.user_email,
      user_name: formData.user_name,
      project_name: formData.project_name,
      amount: parseInt(formData.amount),
      status: formData.status,
      payment_method: formData.payment_method,
      notes: formData.notes,
      admin_notes: formData.admin_notes,
      created_at: editingDeposit ? editingDeposit.created_at : new Date().toISOString().split('T')[0],
      updated_at: new Date().toISOString().split('T')[0],
      approved_by: formData.status === 'approved' ? 'admin@servisoo.com' : editingDeposit?.approved_by,
      approved_at: formData.status === 'approved' ? new Date().toISOString() : editingDeposit?.approved_at
    }

    if (editingDeposit) {
      setDeposits(deposits.map(d => d.id === editingDeposit.id ? depositData : d))
      toast({
        title: "Berhasil",
        description: "Data deposit berhasil diperbarui.",
      })
    } else {
      setDeposits([...deposits, depositData])
      toast({
        title: "Berhasil",
        description: "Deposit baru berhasil ditambahkan.",
      })
    }

    resetForm()
    setIsDialogOpen(false)
  }

  const handleEdit = (deposit: DepositData) => {
    setEditingDeposit(deposit)
    setFormData({
      user_email: deposit.user_email,
      user_name: deposit.user_name,
      project_name: deposit.project_name,
      amount: deposit.amount.toString(),
      status: deposit.status,
      payment_method: deposit.payment_method,
      notes: deposit.notes || '',
      admin_notes: deposit.admin_notes || ''
    })
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    setDeposits(deposits.filter(d => d.id !== id))
    toast({
      title: "Berhasil",
      description: "Deposit berhasil dihapus.",
    })
  }

  const handleStatusChange = (depositId: string, newStatus: 'pending' | 'approved' | 'rejected' | 'completed') => {
    setDeposits(deposits.map(d => 
      d.id === depositId 
        ? { 
            ...d, 
            status: newStatus, 
            updated_at: new Date().toISOString().split('T')[0],
            approved_by: newStatus === 'approved' ? 'admin@servisoo.com' : d.approved_by,
            approved_at: newStatus === 'approved' ? new Date().toISOString() : d.approved_at
          }
        : d
    ))
    toast({
      title: "Berhasil",
      description: `Status deposit berhasil diubah menjadi ${newStatus}.`,
    })
  }

  const resetForm = () => {
    setFormData({
      user_email: '',
      user_name: '',
      project_name: '',
      amount: '',
      status: 'pending',
      payment_method: 'bank_transfer',
      notes: '',
      admin_notes: ''
    })
    setEditingDeposit(null)
  }

  const handleExportCSV = () => {
    const csvContent = [
      ['Email User', 'Nama User', 'Nama Proyek', 'Jumlah', 'Status', 'Metode Pembayaran', 'Catatan', 'Catatan Admin', 'Tanggal Dibuat'],
      ...deposits.map(d => [
        d.user_email,
        d.user_name,
        d.project_name,
        d.amount.toString(),
        d.status,
        d.payment_method,
        d.notes || '',
        d.admin_notes || '',
        d.created_at
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `data-deposits-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)

    toast({
      title: "Berhasil",
      description: "Data deposit berhasil diekspor ke CSV.",
    })
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'pending': return 'secondary'
      case 'approved': return 'default'
      case 'rejected': return 'destructive'
      case 'completed': return 'outline'
      default: return 'secondary'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="h-4 w-4" />
      case 'approved': return <CheckCircle className="h-4 w-4" />
      case 'rejected': return <XCircle className="h-4 w-4" />
      case 'completed': return <CheckCircle className="h-4 w-4" />
      default: return <Clock className="h-4 w-4" />
    }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID')
  }

  const getTotalByStatus = (status: string) => {
    return deposits.filter(d => d.status === status).reduce((sum, d) => sum + d.amount, 0)
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
              <h1 className="text-3xl font-bold text-gray-900">Deposit & Billing</h1>
              <p className="text-gray-600 mt-2">Kelola deposit dan transaksi pembayaran</p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Deposit</p>
                  <p className="text-2xl font-bold">{formatCurrency(deposits.reduce((sum, d) => sum + d.amount, 0))}</p>
                </div>
                <DollarSign className="h-8 w-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold">{formatCurrency(getTotalByStatus('pending'))}</p>
                </div>
                <Clock className="h-8 w-8 text-yellow-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Approved</p>
                  <p className="text-2xl font-bold">{formatCurrency(getTotalByStatus('approved'))}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold">{formatCurrency(getTotalByStatus('completed'))}</p>
                </div>
                <CheckCircle className="h-8 w-8 text-blue-600" />
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
                    placeholder="Cari email, nama, atau proyek..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
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
                <Select value={filterPaymentMethod} onValueChange={setFilterPaymentMethod}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Filter Metode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="semua">Semua Metode</SelectItem>
                    <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                    <SelectItem value="credit_card">Credit Card</SelectItem>
                    <SelectItem value="e_wallet">E-Wallet</SelectItem>
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
                      <Plus className="h-4 w-4 mr-2" />
                      Tambah Deposit
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-2xl">
                    <DialogHeader>
                      <DialogTitle>
                        {editingDeposit ? 'Edit Deposit' : 'Tambah Deposit Baru'}
                      </DialogTitle>
                      <DialogDescription>
                        {editingDeposit ? 'Perbarui informasi deposit' : 'Tambahkan deposit baru ke sistem'}
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="user_email">Email User *</Label>
                          <Input
                            id="user_email"
                            type="email"
                            value={formData.user_email}
                            onChange={(e) => setFormData({...formData, user_email: e.target.value})}
                            placeholder="user@example.com"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="user_name">Nama User *</Label>
                          <Input
                            id="user_name"
                            value={formData.user_name}
                            onChange={(e) => setFormData({...formData, user_name: e.target.value})}
                            placeholder="Nama lengkap user"
                            required
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="project_name">Nama Proyek *</Label>
                        <Input
                          id="project_name"
                          value={formData.project_name}
                          onChange={(e) => setFormData({...formData, project_name: e.target.value})}
                          placeholder="Nama proyek renovasi/pembangunan"
                          required
                        />
                      </div>
                      
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="amount">Jumlah Deposit (Rp) *</Label>
                          <Input
                            id="amount"
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({...formData, amount: e.target.value})}
                            placeholder="50000000"
                            required
                          />
                        </div>
                        <div>
                          <Label htmlFor="payment_method">Metode Pembayaran *</Label>
                          <Select value={formData.payment_method} onValueChange={(value: 'bank_transfer' | 'credit_card' | 'e_wallet') => setFormData({...formData, payment_method: value})}>
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="bank_transfer">Bank Transfer</SelectItem>
                              <SelectItem value="credit_card">Credit Card</SelectItem>
                              <SelectItem value="e_wallet">E-Wallet</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor="status">Status *</Label>
                        <Select value={formData.status} onValueChange={(value: 'pending' | 'approved' | 'rejected' | 'completed') => setFormData({...formData, status: value})}>
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
                      
                      <div>
                        <Label htmlFor="notes">Catatan User</Label>
                        <Textarea
                          id="notes"
                          value={formData.notes}
                          onChange={(e) => setFormData({...formData, notes: e.target.value})}
                          placeholder="Catatan dari user mengenai deposit"
                          rows={3}
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor="admin_notes">Catatan Admin</Label>
                        <Textarea
                          id="admin_notes"
                          value={formData.admin_notes}
                          onChange={(e) => setFormData({...formData, admin_notes: e.target.value})}
                          placeholder="Catatan internal admin"
                          rows={3}
                        />
                      </div>
                      
                      <div className="flex justify-end gap-2 pt-4">
                        <Button type="button" variant="outline" onClick={() => setIsDialogOpen(false)}>
                          Batal
                        </Button>
                        <Button type="submit">
                          {editingDeposit ? 'Perbarui' : 'Tambah'} Deposit
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
            <CardTitle>Data Deposit & Billing ({filteredDeposits.length} transaksi)</CardTitle>
            <CardDescription>
              Daftar semua transaksi deposit dan pembayaran
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Proyek</TableHead>
                    <TableHead>Jumlah</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Metode</TableHead>
                    <TableHead>Tanggal</TableHead>
                    <TableHead>Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedDeposits.map((deposit) => (
                    <TableRow key={deposit.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium">{deposit.user_name}</div>
                          <div className="text-sm text-gray-500">{deposit.user_email}</div>
                        </div>
                      </TableCell>
                      <TableCell className="font-medium">{deposit.project_name}</TableCell>
                      <TableCell className="font-bold text-green-600">
                        {formatCurrency(deposit.amount)}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Badge variant={getStatusBadgeVariant(deposit.status)} className="flex items-center gap-1">
                            {getStatusIcon(deposit.status)}
                            {deposit.status.charAt(0).toUpperCase() + deposit.status.slice(1)}
                          </Badge>
                          {deposit.status === 'pending' && (
                            <div className="flex gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(deposit.id, 'approved')}
                                className="text-xs text-green-600"
                              >
                                Approve
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleStatusChange(deposit.id, 'rejected')}
                                className="text-xs text-red-600"
                              >
                                Reject
                              </Button>
                            </div>
                          )}
                          {deposit.status === 'approved' && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleStatusChange(deposit.id, 'completed')}
                              className="text-xs text-blue-600"
                            >
                              Complete
                            </Button>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">
                          {deposit.payment_method === 'bank_transfer' && 'Bank Transfer'}
                          {deposit.payment_method === 'credit_card' && 'Credit Card'}
                          {deposit.payment_method === 'e_wallet' && 'E-Wallet'}
                        </Badge>
                      </TableCell>
                      <TableCell>{formatDate(deposit.created_at)}</TableCell>
                      <TableCell>
                        <div className="flex gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(deposit)}
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
                                <AlertDialogTitle>Hapus Deposit</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Apakah Anda yakin ingin menghapus deposit "{deposit.project_name}"? 
                                  Tindakan ini tidak dapat dibatalkan.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Batal</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(deposit.id)}>
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

export default AdminDepositBilling