import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"
import { Calculator, History, CreditCard, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"


const Dashboard = () => {
  return (
    <div className="min-h-screen bg-secondary/20 flex">
      <DashboardSidebar />
      
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Dashboard Pengguna</h1>
            <p className="text-muted-foreground">Kelola proyek renovasi Anda dengan mudah</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Proyek</CardTitle>
                <History className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">Simulasi RAB tersimpan</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Saldo Deposit</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Rp 0</div>
                <p className="text-xs text-muted-foreground">Tersedia untuk digunakan</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Estimasi Terakhir</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">-</div>
                <p className="text-xs text-muted-foreground">Belum ada simulasi</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card className="gradient-card border-0 shadow-lg hover:shadow-xl transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calculator className="h-5 w-5 text-accent" />
                  Simulasi RAB Baru
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Hitung estimasi biaya renovasi dengan tools canggih kami
                </p>
              </CardHeader>
              <CardContent>
                <Button asChild variant="hero" className="w-full">
                  <Link to="/dashboard/simulate">Mulai Simulasi</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <History className="h-5 w-5 text-accent" />
                  Histori Proyek
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Lihat dan kelola semua simulasi RAB yang pernah dibuat
                </p>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/dashboard/history">Lihat Histori</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-5 w-5 text-accent" />
                  Deposit & Billing
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  Kelola saldo deposit dan riwayat transaksi Anda
                </p>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/dashboard/billing">Kelola Deposit</Link>
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Welcome Message */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Selamat Datang di SERVISOO!</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Platform digital terpercaya untuk simulasi RAB (Rencana Anggaran Biaya) renovasi rumah dan gedung. 
                Dengan SERVISOO, Anda dapat:
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Menghitung estimasi biaya renovasi secara akurat</li>
                <li>• Mendapatkan breakdown detail material dan tenaga kerja</li>
                <li>• Menyimpan dan mengelola histori proyek</li>
                <li>• Mengatur deposit untuk kemudahan transaksi</li>
                <li>• Export hasil simulasi dalam format PDF/Excel</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  )
}

export default Dashboard