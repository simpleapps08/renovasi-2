import { useAuth } from '@/contexts/AuthContext'
import { Navigate } from 'react-router-dom'
import { ReactNode } from 'react'

interface ProtectedAdminTokoRouteProps {
  children: ReactNode
}

const ProtectedAdminTokoRoute = ({ children }: ProtectedAdminTokoRouteProps) => {
  const { user, profile, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/auth" replace />
  }

  // Check if user has admin_store, admin_toko, or admin role
  if (profile?.role !== 'admin_store' && profile?.role !== 'admin_toko' && profile?.role !== 'admin') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Akses Ditolak</h1>
          <p className="text-gray-600 mb-4">Anda tidak memiliki akses ke halaman admin toko.</p>
          <p className="text-sm text-gray-500">Hubungi administrator untuk mendapatkan akses.</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}

export default ProtectedAdminTokoRoute