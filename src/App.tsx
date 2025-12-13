import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoleRoute from "@/components/ProtectedRoleRoute";
import Index from "./pages/Index";
import Auth from "./pages/Auth";
import AuthConfirm from "./pages/AuthConfirm";
import ResetPassword from "./pages/ResetPassword";
import FloatingChatLeft from "./components/ui/FloatingChatLeft";

import AdminLogin from "./pages/AdminLogin";
import Dashboard from "./pages/Dashboard";
import TestDashboard from "./pages/TestDashboard";
import AdminDashboard from "./pages/AdminDashboard";
import SuperAdminDashboard from "./pages/SuperAdminDashboard";
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
import RoomEnhancer from "./pages/RoomEnhancer";
import Toko from "./pages/Toko";
import AdminToko from "./pages/AdminToko";
import SuperAdminUserManagement from "./pages/admin/SuperAdminUserManagement";
import ProtectedAdminTokoRoute from "./components/ProtectedAdminTokoRoute";

import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
          <FloatingChatLeft />
          <Routes>
            {/* ============ PUBLIC ROUTES ============ */}
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route path="/auth/confirm" element={<AuthConfirm />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route path="/test-dashboard" element={<TestDashboard />} />
            <Route path="/room-enhancer" element={<RoomEnhancer />} />
            <Route path="/toko" element={<Toko />} />

            {/* ============ USER DASHBOARD ROUTES (user, moderator, admin, super_admin) ============ */}
            <Route path="/dashboard" element={
              <ProtectedRoleRoute allowedRoles={['user', 'moderator', 'admin', 'super_admin']}>
                <Dashboard />
              </ProtectedRoleRoute>
            } />
            <Route path="/dashboard/simulate" element={
              <ProtectedRoleRoute allowedRoles={['user', 'moderator', 'admin', 'super_admin']}>
                <SimulasiRAB />
              </ProtectedRoleRoute>
            } />
            <Route path="/dashboard/history" element={
              <ProtectedRoleRoute allowedRoles={['user', 'moderator', 'admin', 'super_admin']}>
                <HistoriProyek />
              </ProtectedRoleRoute>
            } />
            <Route path="/dashboard/billing" element={
              <ProtectedRoleRoute allowedRoles={['user', 'moderator', 'admin', 'super_admin']}>
                <BillingDeposit />
              </ProtectedRoleRoute>
            } />
            <Route path="/dashboard/profile" element={
              <ProtectedRoleRoute allowedRoles={['user', 'moderator', 'admin', 'super_admin']}>
                <Profil />
              </ProtectedRoleRoute>
            } />

            {/* ============ ADMIN DASHBOARD ROUTES (admin, super_admin) ============ */}
            <Route path="/admin" element={
              <ProtectedRoleRoute allowedRoles={['admin', 'super_admin']} fallbackPath="/dashboard">
                <AdminDashboard />
              </ProtectedRoleRoute>
            } />
            <Route path="/admin/rab" element={
              <ProtectedRoleRoute allowedRoles={['admin', 'super_admin']} fallbackPath="/dashboard">
                <AdminRAB />
              </ProtectedRoleRoute>
            } />
            <Route path="/admin/material" element={
              <ProtectedRoleRoute allowedRoles={['admin', 'super_admin']} fallbackPath="/dashboard">
                <AdminMaterial />
              </ProtectedRoleRoute>
            } />
            <Route path="/admin/upah" element={
              <ProtectedRoleRoute allowedRoles={['admin', 'super_admin']} fallbackPath="/dashboard">
                <AdminUpah />
              </ProtectedRoleRoute>
            } />
            <Route path="/admin/gallery" element={
              <ProtectedRoleRoute allowedRoles={['admin', 'super_admin']} fallbackPath="/dashboard">
                <AdminGallery />
              </ProtectedRoleRoute>
            } />
            <Route path="/admin/deposit-billing" element={
              <ProtectedRoleRoute allowedRoles={['admin', 'super_admin']} fallbackPath="/dashboard">
                <AdminDepositBilling />
              </ProtectedRoleRoute>
            } />
            <Route path="/admin/content" element={
              <ProtectedRoleRoute allowedRoles={['admin', 'super_admin']} fallbackPath="/dashboard">
                <AdminContentManagement />
              </ProtectedRoleRoute>
            } />

            {/* ============ SUPER ADMIN ONLY ROUTES (super_admin only) ============ */}
            <Route path="/super-admin/dashboard" element={
              <ProtectedRoleRoute allowedRoles={['super_admin']} fallbackPath="/admin">
                <SuperAdminDashboard />
              </ProtectedRoleRoute>
            } />
            <Route path="/super-admin/users" element={
              <ProtectedRoleRoute allowedRoles={['super_admin']} fallbackPath="/admin">
                <SuperAdminUserManagement />
              </ProtectedRoleRoute>
            } />

            {/* ============ ADMIN USER MANAGEMENT (admin, super_admin) ============ */}
            <Route path="/admin/users" element={
              <ProtectedRoleRoute allowedRoles={['admin', 'super_admin']} fallbackPath="/dashboard">
                <AdminUserManagement />
              </ProtectedRoleRoute>
            } />

            {/* ============ ADMIN STORE ROUTES (admin_store only) ============ */}
            <Route path="/admin/toko" element={
              <ProtectedAdminTokoRoute>
                <AdminToko />
              </ProtectedAdminTokoRoute>
            } />

            {/* ============ CATCH-ALL 404 ============ */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
