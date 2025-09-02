import { DashboardSidebar } from "@/components/layout/DashboardSidebar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"
import { Calculator, History, CreditCard, TrendingUp } from "lucide-react"
import { Link } from "react-router-dom"
import FloatingChat from "@/components/ui/FloatingChat"

const TestDashboard = () => {
  return (
    <div className="min-h-screen bg-secondary/20 flex">
      <DashboardSidebar />
      
      <main className="flex-1 lg:ml-0 pt-16 lg:pt-0">
        <div className="p-6">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-foreground">Test Dashboard - Chatbot Demo</h1>
            <p className="text-muted-foreground">Halaman test untuk melihat chatbot dengan warna hijau</p>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Chatbot Status</CardTitle>
                <History className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Active</div>
                <p className="text-xs text-muted-foreground">Chatbot dengan warna hijau</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Warna Theme</CardTitle>
                <CreditCard className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-600">Hijau</div>
                <p className="text-xs text-muted-foreground">Berhasil diubah dari hitam</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Lokasi</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">Pojok Kanan</div>
                <p className="text-xs text-muted-foreground">Floating chat button</p>
              </CardContent>
            </Card>
          </div>

          {/* Welcome Message */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Chatbot Test Dashboard</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-4">
                Halaman ini dibuat untuk mendemonstrasikan bahwa chatbot dengan warna hijau sudah berhasil ditambahkan ke dashboard pengguna.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Chatbot button berwarna hijau di pojok kanan bawah</li>
                <li>• Header chat window berwarna hijau</li>
                <li>• Pesan pengguna berwarna hijau</li>
                <li>• Tombol kirim berwarna hijau</li>
                <li>• Siap untuk integrasi dengan n8n webhook</li>
              </ul>
              <div className="mt-4">
                <Button asChild variant="outline">
                  <Link to="/">Kembali ke Landing Page</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <FloatingChat />
    </div>
  )
}

export default TestDashboard