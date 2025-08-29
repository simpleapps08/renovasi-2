import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/enhanced-button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  CreditCard, 
  Wallet, 
  Plus, 
  Download, 
  Calendar,
  TrendingUp,
  TrendingDown,
  Receipt,
  ArrowLeft
} from 'lucide-react'
import { toast } from 'sonner'

interface Transaction {
  id: string
  type: 'deposit' | 'payment' | 'refund'
  amount: number
  description: string
  date: string
  status: 'completed' | 'pending' | 'failed'
  method: string
  projectId?: string
}

const BillingDeposit = () => {
  const navigate = useNavigate()
  const [topUpAmount, setTopUpAmount] = useState('')
  const [paymentMethod, setPaymentMethod] = useState('')
  const [filterType, setFilterType] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')

  // Data dummy untuk pengguna Agus
  const currentBalance = 2500000
  const pendingBalance = 500000

  const transactions: Transaction[] = [
    {
      id: 'TXN-001',
      type: 'deposit',
      amount: 5000000,
      description: 'Top Up Saldo via Transfer Bank',
      date: '2024-12-01',
      status: 'completed',
      method: 'Bank Transfer'
    },
    {
      id: 'TXN-002',
      type: 'payment',
      amount: -2500000,
      description: 'Pembayaran Proyek Renovasi Dapur',
      date: '2024-12-02',
      status: 'completed',
      method: 'Saldo Deposit',
      projectId: 'PRJ-001'
    },
    {
      id: 'TXN-003',
      type: 'deposit',
      amount: 1000000,
      description: 'Top Up Saldo via E-Wallet',
      date: '2024-12-05',
      status: 'completed',
      method: 'GoPay'
    },
    {
      id: 'TXN-004',
      type: 'payment',
      amount: -1000000,
      description: 'Pembayaran Konsultasi Desain',
      date: '2024-12-08',
      status: 'completed',
      method: 'Saldo Deposit'
    },
    {
      id: 'TXN-005',
      type: 'deposit',
      amount: 500000,
      description: 'Top Up Saldo via Virtual Account',
      date: '2024-12-10',
      status: 'pending',
      method: 'Virtual Account BCA'
    },
    {
      id: 'TXN-006',
      type: 'refund',
      amount: 250000,
      description: 'Refund Pembatalan Konsultasi',
      date: '2024-12-12',
      status: 'completed',
      method: 'Saldo Deposit'
    }
  ]

  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'deposit':
        return <TrendingUp className="h-4 w-4 text-green-600" />
      case 'payment':
        return <TrendingDown className="h-4 w-4 text-red-600" />
      case 'refund':
        return <TrendingUp className="h-4 w-4 text-blue-600" />
      default:
        return <Receipt className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800'
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Berhasil'
      case 'pending':
        return 'Menunggu'
      case 'failed':
        return 'Gagal'
      default:
        return status
    }
  }

  const getTypeText = (type: string) => {
    switch (type) {
      case 'deposit':
        return 'Deposit'
      case 'payment':
        return 'Pembayaran'
      case 'refund':
        return 'Refund'
      default:
        return type
    }
  }

  const filteredTransactions = transactions.filter(transaction => {
    const matchesType = filterType === 'all' || transaction.type === filterType
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus
    return matchesType && matchesStatus
  })

  const handleTopUp = () => {
    if (!topUpAmount || !paymentMethod) {
      toast.error('Mohon lengkapi jumlah dan metode pembayaran')
      return
    }

    const amount = parseFloat(topUpAmount)
    if (amount < 50000) {
      toast.error('Minimal top up Rp 50.000')
      return
    }

    if (amount > 10000000) {
      toast.error('Maksimal top up Rp 10.000.000')
      return
    }

    // Simulate payment process
    toast.success(`Permintaan top up Rp ${amount.toLocaleString('id-ID')} via ${paymentMethod} berhasil dibuat`)
    setTopUpAmount('')
    setPaymentMethod('')
  }

  const downloadStatement = () => {
    toast.info('Mengunduh laporan transaksi...')
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
            <h1 className="text-3xl font-bold">Billing & Deposit</h1>
            <p className="text-muted-foreground">Kelola saldo dan riwayat transaksi Anda</p>
          </div>
        </div>
        <Button onClick={downloadStatement} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Unduh Laporan
        </Button>
      </div>

      {/* Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Saldo Tersedia</p>
                <p className="text-2xl font-bold text-green-600">
                  Rp {currentBalance.toLocaleString('id-ID')}
                </p>
              </div>
              <Wallet className="h-8 w-8 text-green-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Saldo Pending</p>
                <p className="text-2xl font-bold text-yellow-600">
                  Rp {pendingBalance.toLocaleString('id-ID')}
                </p>
              </div>
              <Calendar className="h-8 w-8 text-yellow-600" />
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total Saldo</p>
                <p className="text-2xl font-bold text-blue-600">
                  Rp {(currentBalance + pendingBalance).toLocaleString('id-ID')}
                </p>
              </div>
              <CreditCard className="h-8 w-8 text-blue-600" />
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="transactions" className="space-y-6">
        <TabsList>
          <TabsTrigger value="transactions">Riwayat Transaksi</TabsTrigger>
          <TabsTrigger value="topup">Top Up Saldo</TabsTrigger>
        </TabsList>

        <TabsContent value="transactions" className="space-y-6">
          {/* Filters */}
          <Card>
            <CardHeader>
              <CardTitle>Filter Transaksi</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Jenis Transaksi</Label>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih jenis" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Jenis</SelectItem>
                      <SelectItem value="deposit">Deposit</SelectItem>
                      <SelectItem value="payment">Pembayaran</SelectItem>
                      <SelectItem value="refund">Refund</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Status</Label>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger>
                      <SelectValue placeholder="Pilih status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">Semua Status</SelectItem>
                      <SelectItem value="completed">Berhasil</SelectItem>
                      <SelectItem value="pending">Menunggu</SelectItem>
                      <SelectItem value="failed">Gagal</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Transactions List */}
          <Card>
            <CardHeader>
              <CardTitle>Riwayat Transaksi</CardTitle>
              <CardDescription>
                Menampilkan {filteredTransactions.length} dari {transactions.length} transaksi
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {filteredTransactions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">Tidak ada transaksi yang ditemukan</p>
                  </div>
                ) : (
                  filteredTransactions.map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                      <div className="flex items-center gap-4">
                        {getTransactionIcon(transaction.type)}
                        <div>
                          <p className="font-medium">{transaction.description}</p>
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>{new Date(transaction.date).toLocaleDateString('id-ID')}</span>
                            <span>•</span>
                            <span>{transaction.method}</span>
                            <span>•</span>
                            <span>ID: {transaction.id}</span>
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-semibold ${
                          transaction.amount > 0 ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}Rp {Math.abs(transaction.amount).toLocaleString('id-ID')}
                        </p>
                        <div className="flex items-center gap-2">
                          <Badge className={getStatusColor(transaction.status)}>
                            {getStatusText(transaction.status)}
                          </Badge>
                          <Badge variant="outline">
                            {getTypeText(transaction.type)}
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="topup" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Plus className="h-5 w-5" />
                Top Up Saldo
              </CardTitle>
              <CardDescription>
                Tambahkan saldo untuk pembayaran proyek renovasi
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="amount">Jumlah Top Up</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="Minimal Rp 50.000"
                      value={topUpAmount}
                      onChange={(e) => setTopUpAmount(e.target.value)}
                    />
                    <p className="text-xs text-muted-foreground">
                      Minimal Rp 50.000 - Maksimal Rp 10.000.000
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label>Metode Pembayaran</Label>
                    <Select value={paymentMethod} onValueChange={setPaymentMethod}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih metode pembayaran" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="bank-transfer">Transfer Bank</SelectItem>
                        <SelectItem value="virtual-account">Virtual Account</SelectItem>
                        <SelectItem value="gopay">GoPay</SelectItem>
                        <SelectItem value="ovo">OVO</SelectItem>
                        <SelectItem value="dana">DANA</SelectItem>
                        <SelectItem value="shopeepay">ShopeePay</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <Button onClick={handleTopUp} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Top Up Sekarang
                  </Button>
                </div>

                <div className="space-y-4">
                  <h3 className="font-semibold">Nominal Cepat</h3>
                  <div className="grid grid-cols-2 gap-2">
                    {[100000, 250000, 500000, 1000000, 2500000, 5000000].map((amount) => (
                      <Button
                        key={amount}
                        variant="outline"
                        onClick={() => setTopUpAmount(amount.toString())}
                        className="text-sm"
                      >
                        Rp {amount.toLocaleString('id-ID')}
                      </Button>
                    ))}
                  </div>

                  <div className="mt-6 p-4 bg-blue-50 rounded-lg">
                    <h4 className="font-semibold text-blue-900 mb-2">Keuntungan Top Up</h4>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• Pembayaran proyek lebih cepat</li>
                      <li>• Tidak perlu repot transfer berulang</li>
                      <li>• Mendapat notifikasi real-time</li>
                      <li>• Riwayat transaksi tersimpan rapi</li>
                    </ul>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default BillingDeposit