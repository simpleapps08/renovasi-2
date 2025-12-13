import { useState } from "react"
import { 
  Shield, 
  Users, 
  Database, 
  Settings, 
  Activity, 
  BarChart3, 
  LogOut, 
  Menu, 
  X, 
  Home,
  UserCheck,
  Server,
  Lock
} from "lucide-react"
import { NavLink, useNavigate } from "react-router-dom"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/enhanced-button"
import { useToast } from "@/hooks/use-toast"

const navigation = [
  { name: 'Beranda', href: '/', icon: Home },
  { name: 'Dashboard', href: '/super-admin/dashboard', icon: Shield },
  { name: 'User Management', href: '/super-admin/users', icon: Users },
  { name: 'Admin Management', href: '/super-admin/admins', icon: UserCheck },
  { name: 'System Monitor', href: '/super-admin/system', icon: Server },
  { name: 'Analytics', href: '/super-admin/analytics', icon: BarChart3 },
  { name: 'Security', href: '/super-admin/security', icon: Lock },
  { name: 'Database', href: '/super-admin/database', icon: Database },
  { name: 'Settings', href: '/super-admin/settings', icon: Settings },
]

interface SuperAdminSidebarProps {
  className?: string
}

export function SuperAdminSidebar({ className }: SuperAdminSidebarProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { profile, signOut } = useAuth()
  const navigate = useNavigate()
  const { toast } = useToast()

  const handleSignOut = async () => {
    try {
      await signOut()
      toast({
        title: "Logout Berhasil",
        description: "Anda telah keluar dari sistem.",
      })
      navigate("/")
    } catch (error) {
      console.error('Error signing out:', error)
      toast({
        title: "Error",
        description: "Gagal logout. Silakan coba lagi.",
        variant: "destructive"
      })
    }
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
        ${className || ''}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-center h-16 border-b bg-gradient-to-r from-purple-600 to-blue-600">
            <Shield className="h-8 w-8 text-white mr-2" />
            <span className="text-xl font-bold text-white">SUPER ADMIN</span>
          </div>

          {/* User Info */}
          <div className="p-4 border-b bg-gradient-to-r from-purple-50 to-blue-50">
            <div className="text-sm font-medium text-foreground">{profile?.nama || 'Super Administrator'}</div>
            <div className="text-xs text-purple-600 font-medium flex items-center">
              <Shield className="h-3 w-3 mr-1" />
              Super Administrator
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-4 py-4 space-y-2">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                end={item.href === '/super-admin/dashboard'}
                className={({ isActive }) =>
                  `flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors ${
                    isActive
                      ? 'bg-gradient-to-r from-purple-100 to-blue-100 text-purple-700 border border-purple-200'
                      : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  }`
                }
              >
                <item.icon className="mr-3 h-4 w-4" />
                {item.name}
              </NavLink>
            ))}
          </nav>

          {/* System Status */}
          <div className="px-4 py-2 border-t border-b">
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">System Status</span>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-1"></div>
                <span className="text-xs text-green-600 font-medium">Online</span>
              </div>
            </div>
          </div>

          {/* Logout */}
          <div className="p-4">
            <Button
              variant="ghost"
              className="w-full justify-start text-muted-foreground hover:text-foreground hover:bg-red-50 hover:text-red-600"
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

export default SuperAdminSidebar