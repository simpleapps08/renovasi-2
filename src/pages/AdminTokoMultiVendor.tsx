import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  Package, 
  Settings, 
  BarChart3, 
  Users, 
  ShoppingCart, 
  TrendingUp, 
  Eye,
  Star,
  Calendar,
  Bell,
  Menu,
  X,
  Home,
  LogOut
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';

// Import komponen yang telah dibuat
import AdminTokoNew from '@/components/AdminTokoNew';
import ProductManagement from '@/components/ProductManagement';
import StoreManagement from '@/components/StoreManagement';
import StoreAuth from '@/components/StoreAuth';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'store_owner' | 'store_admin' | 'store_staff';
  store_id: string;
  avatar_url?: string;
  is_active: boolean;
}

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'info' | 'warning' | 'success' | 'error';
  read: boolean;
  created_at: string;
}

const AdminTokoMultiVendor: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);

  // Check authentication status
  useEffect(() => {
    checkAuthStatus();
    loadNotifications();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('store_auth_token');
      const userData = localStorage.getItem('store_user');
      
      if (token && userData) {
        const user = JSON.parse(userData);
        setCurrentUser(user);
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.error('Error checking auth status:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadNotifications = () => {
    // Mock notifications data
    const mockNotifications: Notification[] = [
      {
        id: '1',
        title: 'Pesanan Baru',
        message: 'Anda memiliki 3 pesanan baru yang perlu diproses',
        type: 'info',
        read: false,
        created_at: '2024-01-15T10:30:00Z'
      },
      {
        id: '2',
        title: 'Stok Menipis',
        message: 'Produk "Semen Portland" stok tersisa 5 unit',
        type: 'warning',
        read: false,
        created_at: '2024-01-15T09:15:00Z'
      },
      {
        id: '3',
        title: 'Pembayaran Diterima',
        message: 'Pembayaran untuk pesanan #ORD-001 telah dikonfirmasi',
        type: 'success',
        read: true,
        created_at: '2024-01-15T08:45:00Z'
      }
    ];
    
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  };

  const handleLogout = () => {
    localStorage.removeItem('store_auth_token');
    localStorage.removeItem('store_user');
    setCurrentUser(null);
    setIsAuthenticated(false);
    setActiveTab('dashboard');
  };

  const menuItems = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      description: 'Ringkasan toko dan statistik'
    },
    {
      id: 'products',
      label: 'Manajemen Produk',
      icon: Package,
      description: 'Kelola produk dan inventori'
    },
    {
      id: 'store',
      label: 'Pengaturan Toko',
      icon: Store,
      description: 'Profil dan konfigurasi toko'
    },
    {
      id: 'analytics',
      label: 'Analitik',
      icon: BarChart3,
      description: 'Laporan dan analisis penjualan'
    }
  ];

  const getNotificationIcon = (type: string) => {
    const icons = {
      info: '🔔',
      warning: '⚠️',
      success: '✅',
      error: '❌'
    };
    return icons[type as keyof typeof icons] || '🔔';
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 60) {
      return `${diffInMinutes} menit yang lalu`;
    } else if (diffInMinutes < 1440) {
      return `${Math.floor(diffInMinutes / 60)} jam yang lalu`;
    } else {
      return `${Math.floor(diffInMinutes / 1440)} hari yang lalu`;
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat aplikasi...</p>
        </div>
      </div>
    );
  }

  // Show authentication if not logged in
  if (!isAuthenticated || !currentUser) {
    return <StoreAuth />;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-50 w-64 bg-white shadow-lg transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      }`}>
        <div className="flex items-center justify-between h-16 px-6 border-b">
          <div className="flex items-center space-x-2">
            <div className="bg-blue-100 p-2 rounded-lg">
              <Store className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-gray-900">Admin Toko</h1>
              <p className="text-xs text-gray-600">Multi-Vendor</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="lg:hidden"
            onClick={() => setSidebarOpen(false)}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* User Profile */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={currentUser.avatar_url} alt={currentUser.name} />
              <AvatarFallback>
                <Users className="h-5 w-5" />
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-gray-900 truncate">
                {currentUser.name}
              </p>
              <p className="text-xs text-gray-600 truncate">
                {currentUser.email}
              </p>
              <Badge variant="outline" className="mt-1 text-xs">
                {currentUser.role === 'store_owner' ? 'Pemilik' : 
                 currentUser.role === 'store_admin' ? 'Admin' : 'Staff'}
              </Badge>
            </div>
          </div>
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 px-4 py-6 space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setSidebarOpen(false);
                }}
                className={`w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                  activeTab === item.id
                    ? 'bg-blue-100 text-blue-700 border border-blue-200'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className="h-5 w-5 mr-3" />
                <div className="text-left">
                  <div>{item.label}</div>
                  <div className="text-xs text-gray-500 mt-0.5">
                    {item.description}
                  </div>
                </div>
              </button>
            );
          })}
        </nav>

        {/* Logout Button */}
        <div className="p-4 border-t">
          <Button
            variant="outline"
            className="w-full justify-start"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="lg:ml-64">
        {/* Top Header */}
        <header className="bg-white shadow-sm border-b">
          <div className="flex items-center justify-between h-16 px-6">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                className="lg:hidden"
                onClick={() => setSidebarOpen(true)}
              >
                <Menu className="h-5 w-5" />
              </Button>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {menuItems.find(item => item.id === activeTab)?.label || 'Dashboard'}
                </h2>
                <p className="text-sm text-gray-600">
                  {menuItems.find(item => item.id === activeTab)?.description}
                </p>
              </div>
            </div>

            {/* Notifications */}
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Button variant="ghost" size="sm" className="relative">
                  <Bell className="h-5 w-5" />
                  {unreadCount > 0 && (
                    <Badge 
                      variant="destructive" 
                      className="absolute -top-1 -right-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                    >
                      {unreadCount}
                    </Badge>
                  )}
                </Button>
              </div>
              
              <div className="text-sm text-gray-600">
                Toko ID: {currentUser.store_id}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-6">
          {activeTab === 'dashboard' && <AdminTokoNew />}
          {activeTab === 'products' && <ProductManagement />}
          {activeTab === 'store' && <StoreManagement />}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BarChart3 className="h-5 w-5" />
                    <span>Analitik Toko</span>
                  </CardTitle>
                  <CardDescription>
                    Fitur analitik sedang dalam pengembangan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="text-center py-12">
                    <TrendingUp className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      Analitik Akan Segera Hadir
                    </h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Kami sedang mengembangkan fitur analitik yang komprehensif untuk membantu Anda memahami performa toko dengan lebih baik.
                    </p>
                    <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4 max-w-2xl mx-auto">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <BarChart3 className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900">Laporan Penjualan</h4>
                        <p className="text-sm text-gray-600 mt-1">Grafik dan tren penjualan</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <Users className="h-8 w-8 text-green-500 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900">Analisis Pelanggan</h4>
                        <p className="text-sm text-gray-600 mt-1">Perilaku dan demografi</p>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <Package className="h-8 w-8 text-purple-500 mx-auto mb-2" />
                        <h4 className="font-medium text-gray-900">Performa Produk</h4>
                        <p className="text-sm text-gray-600 mt-1">Produk terlaris dan stok</p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </main>
      </div>

      {/* Notifications Panel (Hidden by default, can be toggled) */}
      <div className="hidden">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Notifikasi</span>
              <Badge variant="secondary">{unreadCount} baru</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border ${
                  notification.read ? 'bg-gray-50' : 'bg-blue-50 border-blue-200'
                }`}
              >
                <div className="flex items-start space-x-3">
                  <span className="text-lg">
                    {getNotificationIcon(notification.type)}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">
                      {notification.title}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-500 mt-2">
                      {formatTimeAgo(notification.created_at)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminTokoMultiVendor;