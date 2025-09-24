import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Store, 
  Package, 
  TrendingUp, 
  Users, 
  Star, 
  Eye, 
  ShoppingCart, 
  DollarSign,
  Plus,
  Settings,
  BarChart3,
  FileText,
  Image,
  Bell,
  Calendar,
  Filter,
  Search,
  Download
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import AdminSidebar from '@/components/AdminSidebar';

interface StoreStats {
  totalProducts: number;
  activeProducts: number;
  totalOrders: number;
  totalRevenue: number;
  totalViews: number;
  totalFollowers: number;
  averageRating: number;
  totalReviews: number;
}

interface Product {
  id: string;
  name: string;
  price: number;
  stock: number;
  category: string;
  status: 'active' | 'inactive' | 'out_of_stock';
  views: number;
  sales: number;
  rating: number;
  image?: string;
  created_at: string;
}

interface Order {
  id: string;
  customer_name: string;
  total: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  items: number;
  created_at: string;
}

const AdminTokoNew: React.FC = () => {
  const [storeStats, setStoreStats] = useState<StoreStats>({
    totalProducts: 0,
    activeProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
    totalViews: 0,
    totalFollowers: 0,
    averageRating: 0,
    totalReviews: 0
  });

  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const [recentOrders, setRecentOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPeriod, setFilterPeriod] = useState('7d');

  // Mock data - replace with actual API calls
  useEffect(() => {
    const loadDashboardData = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setStoreStats({
          totalProducts: 45,
          activeProducts: 42,
          totalOrders: 128,
          totalRevenue: 15750000,
          totalViews: 2340,
          totalFollowers: 156,
          averageRating: 4.7,
          totalReviews: 89
        });

        setRecentProducts([
          {
            id: '1',
            name: 'Semen Portland 50kg',
            price: 65000,
            stock: 150,
            category: 'Bahan Bangunan',
            status: 'active',
            views: 234,
            sales: 45,
            rating: 4.8,
            created_at: '2024-01-15'
          },
          {
            id: '2',
            name: 'Batu Bata Merah',
            price: 800,
            stock: 0,
            category: 'Bahan Bangunan',
            status: 'out_of_stock',
            views: 189,
            sales: 120,
            rating: 4.5,
            created_at: '2024-01-14'
          },
          {
            id: '3',
            name: 'Cat Tembok Putih 25kg',
            price: 285000,
            stock: 25,
            category: 'Cat & Finishing',
            status: 'active',
            views: 156,
            sales: 18,
            rating: 4.9,
            created_at: '2024-01-13'
          }
        ]);

        setRecentOrders([
          {
            id: 'ORD-001',
            customer_name: 'Budi Santoso',
            total: 1250000,
            status: 'processing',
            items: 3,
            created_at: '2024-01-15'
          },
          {
            id: 'ORD-002',
            customer_name: 'Siti Aminah',
            total: 650000,
            status: 'shipped',
            items: 2,
            created_at: '2024-01-15'
          },
          {
            id: 'ORD-003',
            customer_name: 'Ahmad Rahman',
            total: 2100000,
            status: 'delivered',
            items: 5,
            created_at: '2024-01-14'
          }
        ]);

        setLoading(false);
      }, 1000);
    };

    loadDashboardData();
  }, [filterPeriod]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      active: { label: 'Aktif', variant: 'default' as const },
      inactive: { label: 'Tidak Aktif', variant: 'secondary' as const },
      out_of_stock: { label: 'Stok Habis', variant: 'destructive' as const },
      pending: { label: 'Menunggu', variant: 'secondary' as const },
      processing: { label: 'Diproses', variant: 'default' as const },
      shipped: { label: 'Dikirim', variant: 'default' as const },
      delivered: { label: 'Selesai', variant: 'default' as const },
      cancelled: { label: 'Dibatalkan', variant: 'destructive' as const }
    };

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.active;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <AdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat dashboard...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          {/* Header */}
          <div className="mb-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Dashboard Toko</h1>
                <p className="text-gray-600 mt-1">Kelola produk dan pantau performa toko Anda</p>
              </div>
              <div className="flex items-center space-x-3">
                <Select value={filterPeriod} onValueChange={setFilterPeriod}>
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1d">Hari Ini</SelectItem>
                    <SelectItem value="7d">7 Hari</SelectItem>
                    <SelectItem value="30d">30 Hari</SelectItem>
                    <SelectItem value="90d">90 Hari</SelectItem>
                  </SelectContent>
                </Select>
                <Button>
                  <Download className="h-4 w-4 mr-2" />
                  Export
                </Button>
              </div>
            </div>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Produk</CardTitle>
                <Package className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{storeStats.totalProducts}</div>
                <p className="text-xs text-muted-foreground">
                  {storeStats.activeProducts} aktif
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pesanan</CardTitle>
                <ShoppingCart className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{storeStats.totalOrders}</div>
                <p className="text-xs text-green-600">
                  +12% dari bulan lalu
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Pendapatan</CardTitle>
                <DollarSign className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(storeStats.totalRevenue)}</div>
                <p className="text-xs text-green-600">
                  +8% dari bulan lalu
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Rating Toko</CardTitle>
                <Star className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold flex items-center">
                  {storeStats.averageRating}
                  <Star className="h-5 w-5 text-yellow-400 ml-1 fill-current" />
                </div>
                <p className="text-xs text-muted-foreground">
                  {storeStats.totalReviews} ulasan
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Additional Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Views</CardTitle>
                <Eye className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{storeStats.totalViews.toLocaleString()}</div>
                <p className="text-xs text-green-600">+15% dari minggu lalu</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Followers</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{storeStats.totalFollowers}</div>
                <p className="text-xs text-green-600">+5 follower baru</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Conversion Rate</CardTitle>
                <TrendingUp className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5.47%</div>
                <p className="text-xs text-green-600">+0.3% dari bulan lalu</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Button className="h-20 flex flex-col items-center justify-center space-y-2">
                <Plus className="h-6 w-6" />
                <span className="text-sm">Tambah Produk</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Settings className="h-6 w-6" />
                <span className="text-sm">Pengaturan Toko</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <BarChart3 className="h-6 w-6" />
                <span className="text-sm">Laporan</span>
              </Button>
              <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
                <Bell className="h-6 w-6" />
                <span className="text-sm">Notifikasi</span>
              </Button>
            </div>
          </div>

          {/* Recent Activity Tabs */}
          <Tabs defaultValue="products" className="space-y-4">
            <TabsList>
              <TabsTrigger value="products">Produk Terbaru</TabsTrigger>
              <TabsTrigger value="orders">Pesanan Terbaru</TabsTrigger>
            </TabsList>

            <TabsContent value="products">
              <Card>
                <CardHeader>
                  <CardTitle>Produk Terbaru</CardTitle>
                  <CardDescription>
                    Produk yang baru ditambahkan ke toko Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentProducts.map((product) => (
                      <div key={product.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg flex items-center justify-center">
                            <Package className="h-6 w-6 text-gray-500" />
                          </div>
                          <div>
                            <h3 className="font-medium">{product.name}</h3>
                            <p className="text-sm text-gray-600">{product.category}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(product.price)}</p>
                            <p className="text-sm text-gray-600">Stok: {product.stock}</p>
                          </div>
                          {getStatusBadge(product.status)}
                          <div className="flex items-center space-x-2 text-sm text-gray-600">
                            <Eye className="h-4 w-4" />
                            <span>{product.views}</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="orders">
              <Card>
                <CardHeader>
                  <CardTitle>Pesanan Terbaru</CardTitle>
                  <CardDescription>
                    Pesanan yang masuk ke toko Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {recentOrders.map((order) => (
                      <div key={order.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                            <ShoppingCart className="h-6 w-6 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="font-medium">{order.id}</h3>
                            <p className="text-sm text-gray-600">{order.customer_name}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-4">
                          <div className="text-right">
                            <p className="font-medium">{formatCurrency(order.total)}</p>
                            <p className="text-sm text-gray-600">{order.items} item</p>
                          </div>
                          {getStatusBadge(order.status)}
                          <p className="text-sm text-gray-600">{order.created_at}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminTokoNew;