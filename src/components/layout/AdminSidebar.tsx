import { useState } from "react"
import { Images, DollarSign, Users, CreditCard, LogOut, Menu, X, Hammer, Calculator, ImageIcon, Settings } from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/enhanced-button"
import { useToast } from "@/hooks/use-toast"

const navigation = [
  { name: 'Dashboard', href: '/admin', icon: Images },
  { name: 'Admin RAB', href: '/admin/rab', icon: Calculator },
  { name: 'Harga Material', href: '/admin/material', icon: DollarSign },
  { name: 'Upah Tenaga Kerja', href: '/admin/upah', icon: Hammer },
  { name: 'Manajemen User', href: '/admin/users', icon: Users },
  { name: 'Manajemen Galeri', href: '/admin/gallery', icon: ImageIcon },
  { name: 'Manajemen Konten', href: '/admin/content', icon: Settings },
  { name: 'Deposit & Billing', href: '/admin/deposit-billing', icon: CreditCard },
]

export function AdminSidebar() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { signOut, profile } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSignOut = async () => {
    await signOut()
    toast({
      title: "Logout Berhasil",
      description: "Anda telah keluar dari sistem.",
    })
    navigate('/')
  }

  return (
    <>
      {/* Mobile sidebar toggle */}
      <div className="lg:hidden fixed top-4 left-4 z-50">
        <Button
          variant="outline"
          size="sm"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
        </Button>
      </div>

      {/* Sidebar */}
      <div className={`
        fixed inset-y-0 left-0 z-40 w-64 bg-card border-r transform transition-transform duration-300 ease-in-out
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0 lg:static lg:inset-0
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b">
            <span className="text-2xl font-bold text-primary">SERVISOO</span>
            <div className="ml-2 h-2 w-2 rounded-full bg-accent"></div>
          </div>

          {/* User Info */}
          <div className="p-4 border-b">
            <div className="text-sm font-medium text-foreground">{profile?.nama}</div>
            <div className="text-xs text-accent font-medium">Administrator</div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/admin'}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`
                }
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* Logout */}
          <div className="p-4 border-t">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-4 w-4" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </>
  )
}