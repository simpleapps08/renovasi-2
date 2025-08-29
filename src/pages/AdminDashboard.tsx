import { AdminSidebar } from "@/components/layout/AdminSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Images, DollarSign, Users, CreditCard, Activity, Wrench } from "lucide-react"
import { Link } from "react-router-dom"

const AdminDashboard = () => {
  return (
    <div className="min-h-screen bg-secondary/20 flex">
      <AdminSidebar />
      
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Admin Dashboard</h1>
            <p className="text-muted-foreground">Kelola sistem SERVISOO dengan mudah</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total User</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">User terdaftar</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Proyek</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Simulasi dibuat</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Deposit</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 0</div>
                <p className="text-xs text-muted-foreground">Dana dikelola</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Foto Galeri</CardTitle>
                <Images className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Foto tersimpan</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="gradient-card border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Images className="h-5 w-5 text-accent" />
                  Manajemen Galeri
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Upload dan kelola foto proyek untuk ditampilkan di website
                </p>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Kelola tampilan galeri proyek yang akan dilihat pengunjung
                </p>
              </CardContent>
            </Card>

            <Link to="/admin/material">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-accent" />
                    Harga Material
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Update harga material bangunan berdasarkan lokasi dan kualitas
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Pastikan harga selalu update untuk akurasi simulasi RAB
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/upah">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Wrench className="h-5 w-5 text-accent" />
                    Upah Tenaga Kerja
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Kelola data upah tenaga kerja berdasarkan jenis dan keahlian
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Update upah pekerja untuk perhitungan biaya yang akurat
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/users">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Users className="h-5 w-5 text-accent" />
                    Manajemen User
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Kelola data user dan ubah role akses sistem
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Atur hak akses dan kelola akun pengguna
                  </p>
                </CardContent>
              </Card>
            </Link>

            <Link to="/admin/deposit-billing">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <CreditCard className="h-5 w-5 text-accent" />
                    Deposit & Billing
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    Kelola permintaan deposit dan konfirmasi pembayaran user
                  </p>
                </CardHeader>
                <CardContent>
                  <p className="text-xs text-muted-foreground">
                    Review dan konfirmasi transaksi deposit yang masuk
                  </p>
                </CardContent>
              </Card>
            </Link>
          </div>

          {/* System Status */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Status Sistem</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Database</span>
                  <span className="text-xs text-accent">Online</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">File Storage</span>
                  <span className="text-xs text-accent">Online</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                  <span className="text-sm font-medium">Authentication</span>
                  <span className="text-xs text-accent">Online</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default AdminDashboard