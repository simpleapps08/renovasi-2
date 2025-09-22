import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/enhanced-button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/contexts/AuthContext"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { Navigate } from "react-router-dom"
import SuperAdminSidebar from "@/components/layout/SuperAdminSidebar"
import {
  Users,
  Shield,
  Database,
  Settings,
  Activity,
  TrendingUp,
  AlertTriangle,
  CheckCircle
} from "lucide-react"

interface SystemStats {
  totalUsers: number
  totalAdmins: number
  totalProjects: number
  totalRevenue: number
  activeUsers: number
  systemHealth: 'good' | 'warning' | 'critical'
}

const SuperAdminDashboard = () => {
  const { profile } = useAuth()
  const { toast } = useToast()
  const [stats, setStats] = useState<SystemStats>({
    totalUsers: 0,
    totalAdmins: 0,
    totalProjects: 0,
    totalRevenue: 0,
    activeUsers: 0,
    systemHealth: 'good'
  })
  const [loading, setLoading] = useState(true)

  // Redirect if not super admin
  if (profile?.role !== 'super_admin') {
    return <Navigate to="/dashboard" replace />
  }

  useEffect(() => {
    fetchSystemStats()
  }, [])

  const fetchSystemStats = async () => {
    try {
      setLoading(true)
      
      // Fetch user statistics
      const { data: profiles, error: profilesError } = await supabase
        .from('profiles')
        .select('role, created_at')
      
      if (profilesError) throw profilesError

      const totalUsers = profiles?.filter(p => p.role === 'user').length || 0
      const totalAdmins = profiles?.filter(p => ['admin', 'super_admin'].includes(p.role)).length || 0
      
      // Calculate active users (users created in last 30 days)
      const thirtyDaysAgo = new Date()
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
      const activeUsers = profiles?.filter(p => 
        new Date(p.created_at) > thirtyDaysAgo
      ).length || 0

      // Fetch project statistics (assuming you have a projects table)
      const { data: projects } = await supabase
        .from('projects')
        .select('id')
      
      const totalProjects = projects?.length || 0

      // Mock revenue data (replace with actual revenue calculation)
      const totalRevenue = 0

      // Determine system health
      let systemHealth: 'good' | 'warning' | 'critical' = 'good'
      if (totalUsers > 1000) systemHealth = 'warning'
      if (totalUsers > 5000) systemHealth = 'critical'

      setStats({
        totalUsers,
        totalAdmins,
        totalProjects,
        totalRevenue,
        activeUsers,
        systemHealth
      })
    } catch (error) {
      console.error('Error fetching system stats:', error)
      toast({
        title: "Error",
        description: "Gagal memuat statistik sistem",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'good': return 'text-green-600'
      case 'warning': return 'text-yellow-600'
      case 'critical': return 'text-red-600'
      default: return 'text-gray-600'
    }
  }

  const getHealthIcon = (health: string) => {
    switch (health) {
      case 'good': return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'warning': return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'critical': return <AlertTriangle className="h-5 w-5 text-red-600" />
      default: return <Activity className="h-5 w-5 text-gray-600" />
    }
  }

  if (loading) {
    return (
      <div className="flex h-screen bg-gray-50">
        <SuperAdminSidebar />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Memuat dashboard...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex h-screen bg-gray-50">
      <SuperAdminSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-8">
          {/* Header */}
          <div className="mb-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Super Admin Dashboard
                </h1>
                <p className="text-gray-600">
                  Selamat datang di panel kontrol super administrator SERVISOO
                </p>
              </div>
              <Badge variant="outline" className="bg-purple-50 text-purple-700 border-purple-200">
                <Shield className="h-4 w-4 mr-1" />
                Super Admin
              </Badge>
            </div>
          </div>

          {/* System Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Users</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  Pengguna terdaftar
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Administrators</CardTitle>
                <Shield className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAdmins}</div>
                <p className="text-xs text-muted-foreground">
                  Admin & Super Admin
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                <Activity className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  30 hari terakhir
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">System Health</CardTitle>
                {getHealthIcon(stats.systemHealth)}
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold capitalize ${getHealthColor(stats.systemHealth)}`}>
                  {stats.systemHealth}
                </div>
                <p className="text-xs text-muted-foreground">
                  Status sistem
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content Tabs */}
          <Tabs defaultValue="overview" className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="users">User Management</TabsTrigger>
              <TabsTrigger value="system">System</TabsTrigger>
              <TabsTrigger value="settings">Settings</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Activity</CardTitle>
                    <CardDescription>
                      Aktivitas terbaru dalam sistem
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Sistem berjalan normal</p>
                          <p className="text-xs text-gray-500">2 menit yang lalu</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">User baru terdaftar</p>
                          <p className="text-xs text-gray-500">15 menit yang lalu</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-4">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        <div className="flex-1">
                          <p className="text-sm font-medium">Database backup selesai</p>
                          <p className="text-xs text-gray-500">1 jam yang lalu</p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                    <CardDescription>
                      Aksi cepat untuk manajemen sistem
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button className="w-full justify-start" variant="outline">
                      <Users className="h-4 w-4 mr-2" />
                      Kelola Pengguna
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Database className="h-4 w-4 mr-2" />
                      Backup Database
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <Settings className="h-4 w-4 mr-2" />
                      Pengaturan Sistem
                    </Button>
                    <Button className="w-full justify-start" variant="outline">
                      <TrendingUp className="h-4 w-4 mr-2" />
                      Lihat Analytics
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="users">
              <Card>
                <CardHeader>
                  <CardTitle>User Management</CardTitle>
                  <CardDescription>
                    Kelola semua pengguna dalam sistem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-500 py-8">
                    Fitur manajemen pengguna akan segera tersedia.
                    Sementara ini, gunakan menu Admin untuk mengelola pengguna.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="system">
              <Card>
                <CardHeader>
                  <CardTitle>System Information</CardTitle>
                  <CardDescription>
                    Informasi dan monitoring sistem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Database Status</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Connected
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Authentication</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Active
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2 border-b">
                      <span className="font-medium">Storage</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Available
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center py-2">
                      <span className="font-medium">API Status</span>
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        Operational
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="settings">
              <Card>
                <CardHeader>
                  <CardTitle>System Settings</CardTitle>
                  <CardDescription>
                    Konfigurasi pengaturan sistem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-center text-gray-500 py-8">
                    Pengaturan sistem akan segera tersedia.
                  </p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

export default SuperAdminDashboard