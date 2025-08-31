import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import TestDashboard from "./pages/TestDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import AdminRAB from "./pages/AdminRAB";
import AdminMaterial from "./pages/AdminMaterial";
import AdminUpah from "./pages/AdminUpah";
import AdminUserManagement from "./pages/AdminUserManagement";
import AdminGallery from "./pages/AdminGallery";
import AdminDepositBilling from "./pages/AdminDepositBilling";
import AdminContentManagement from "./pages/AdminContentManagement";
import SimulasiRAB from "./pages/SimulasiRAB";
import HistoriProyek from "./pages/HistoriProyek";
import BillingDeposit from "./pages/BillingDeposit";
import Profil from "./pages/Profil";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

// Protected Route Component
function ProtectedRoute({ children, adminOnly = false }: { children: React.ReactNode, adminOnly?: boolean }) {
  const { user, profile, loading } = useAuth();
  
  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
  if (adminOnly && profile?.role !== 'admin') {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <>{children}</>;
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/test-dashboard" element={<TestDashboard />} />
            <Route path="/dashboard" element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/simulate" element={
              <ProtectedRoute>
                <SimulasiRAB />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/history" element={
              <ProtectedRoute>
                <HistoriProyek />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/billing" element={
              <ProtectedRoute>
                <BillingDeposit />
              </ProtectedRoute>
            } />
            <Route path="/dashboard/profile" element={
              <ProtectedRoute>
                <Profil />
              </ProtectedRoute>
            } />
            <Route path="/admin" element={
              <ProtectedRoute adminOnly>
                <AdminDashboard />
              </ProtectedRoute>
            } />
            <Route path="/admin/rab" element={
              <ProtectedRoute adminOnly>
                <AdminRAB />
              </ProtectedRoute>
            } />
            <Route path="/admin/material" element={
              <ProtectedRoute adminOnly>
                <AdminMaterial />
              </ProtectedRoute>
            } />
            <Route path="/admin/upah" element={
              <ProtectedRoute adminOnly>
                <AdminUpah />
              </ProtectedRoute>
            } />
            <Route path="/admin/users" element={
              <ProtectedRoute adminOnly>
                <AdminUserManagement />
              </ProtectedRoute>
            } />
            <Route path="/admin/gallery" element={
              <ProtectedRoute adminOnly>
                <AdminGallery />
              </ProtectedRoute>
            } />
            <Route path="/admin/deposit-billing" element={
              <ProtectedRoute adminOnly>
                <AdminDepositBilling />
              </ProtectedRoute>
            } />
            <Route path="/admin/content" element={
              <ProtectedRoute adminOnly>
                <AdminContentManagement />
              </ProtectedRoute>
            } />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
