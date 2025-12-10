import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useServices } from '@/hooks/useServices';
import { usePromotions } from '@/hooks/usePromotions';
import { useRecentProjects } from '@/hooks/useRecentProjects';
import { Bell, Search, ChevronRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import BalanceCard from '@/components/dashboard/BalanceCard';
import ServiceCard from '@/components/dashboard/ServiceCard';
import PromotionCard from '@/components/dashboard/PromotionCard';
import BottomNav from '@/components/layout/BottomNav';
import Icon from '@/components/ui/Icon';
import { formatCurrency } from '@/lib/utils';

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'in_progress':
      return <Clock className="w-4 h-4 text-blue-500" />;
    case 'completed':
      return <CheckCircle2 className="w-4 h-4 text-green-500" />;
    case 'pending':
      return <AlertCircle className="w-4 h-4 text-yellow-500" />;
    default:
      return null;
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'in_progress':
      return 'Sedang Dikerjakan';
    case 'completed':
      return 'Selesai';
    case 'pending':
      return 'Menunggu';
    default:
      return status;
  }
};

export default function Dashboard() {
  const navigate = useNavigate();
  const { user, profile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const { services, isLoading: servicesLoading, error: servicesError } = useServices();
  const { promotions, isLoading: promotionsLoading, error: promotionsError } = usePromotions();
  const { projects, isLoading: projectsLoading, error: projectsError } = useRecentProjects();

  // Dummy data for balance, replace with actual data from your context or API
  const userBalance = 1500000;
  const userPoints = 2500;

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <div className="bg-gradient-to-br from-green-600 to-green-700 px-4 pt-6 pb-8 rounded-b-3xl shadow-lg">
        <div className="max-w-lg mx-auto">
          {/* Top Bar */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <Avatar className="w-12 h-12 border-2 border-white/30">
                <AvatarImage src={user?.user_metadata?.avatar_url} />
                <AvatarFallback className="bg-white/20 text-white font-semibold">
                  {profile?.nama?.charAt(0) || user?.email?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div>
                <p className="text-white/80 text-xs font-medium">Selamat datang,</p>
                <p className="text-white text-lg font-bold">
                  {profile?.nama || user?.email?.split('@')[0] || 'Pengguna'}
                </p>
              </div>
            </div>
            <button className="relative p-2 rounded-full bg-white/10 hover:bg-white/20 transition-colors">
              <Bell className="w-6 h-6 text-white" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
            </button>
          </div>

          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Cari layanan renovasi..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-6 rounded-xl border-0 bg-white shadow-sm focus:ring-2 focus:ring-green-300"
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-lg mx-auto px-4 -mt-4">
        {/* Balance Card */}
        <div className="mb-6">
          <BalanceCard
            balance={userBalance}
            points={userPoints}
            onTopUp={() => navigate('/dashboard/billing')}
            onPay={() => navigate('/dashboard/billing')}
            onTransfer={() => navigate('/dashboard/billing')}
          />
        </div>

        {/* AI Features */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Fitur AI</h2>
          <div className="grid grid-cols-2 gap-4">
            <button
              className="w-full text-left bg-teal-600 rounded-2xl p-4 shadow-sm cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => navigate('/room-enhancer')}
            >
              <h3 className="text-white font-bold text-lg">Simulasi AI</h3>
              <p className="text-white/80 text-sm">Coba desain ruangan Anda</p>
            </button>
            <button
              className="w-full text-left bg-indigo-600 rounded-2xl p-4 shadow-sm cursor-pointer transition-transform hover:scale-[1.02] active:scale-[0.98]"
              onClick={() => navigate('/dashboard/rab-calculator')}
            >
              <h3 className="text-white font-bold text-lg">Kalkulator RAB</h3>
              <p className="text-white/80 text-sm">Hitung biaya proyek</p>
            </button>
          </div>
        </div>

        {/* Services Grid */}
        <div className="mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">Layanan Kami</h2>
          {servicesLoading && <p>Loading services...</p>}
          {servicesError && <p>Error loading services: {servicesError.message}</p>}
          {!servicesLoading && !servicesError && (
            <div className="grid grid-cols-4 gap-1 bg-white rounded-2xl p-2 shadow-sm">
              {services.map((service) => (
                <ServiceCard
                  key={service.id}
                  icon={<Icon name={service.icon} className="w-5 h-5 text-green-600" />}
                  label={service.name}
                  onClick={() => navigate(service.path)}
                />
              ))}
            </div>
          )}
        </div>
        {/* Promotions */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Promo Spesial</h2>
            <button className="text-green-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all">
              Lihat Semua
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {promotionsLoading && <p>Loading promotions...</p>}
          {promotionsError && <p>Error loading promotions: {promotionsError.message}</p>}
          {!promotionsLoading && !promotionsError && (
            <div className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide">
              {promotions.map((promo) => (
                <PromotionCard
                  key={promo.id}
                  title={promo.title}
                  description={promo.description}
                  badge={promo.badge}
                  image={promo.image}
                  onClick={() => navigate('/dashboard/promotions')}
                />
              ))}
            </div>
          )}
        </div>

        {/* Recent Projects */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-bold text-gray-900">Proyek Terbaru</h2>
            <button
              onClick={() => navigate('/dashboard/history')}
              className="text-green-600 text-sm font-semibold flex items-center gap-1 hover:gap-2 transition-all"
            >
              Lihat Semua
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
          {projectsLoading && <p>Loading projects...</p>}
          {projectsError && <p>Error loading projects: {projectsError.message}</p>}
          {!projectsLoading && !projectsError && (
            <Card className="shadow-sm">
              <CardContent className="p-0">
                {projects.map((project, index) => (
                  <button
                    key={project.id}
                    className={`w-full text-left p-4 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors ${index !== projects.length - 1 ? 'border-b border-gray-100' : ''
                      }`}
                    onClick={() => navigate(`/dashboard/history/${project.id}`)}
                  >
                    <div className="flex items-start gap-3 flex-1">
                      <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                        {getStatusIcon(project.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm text-gray-900 mb-1 truncate">
                          {project.title}
                        </h3>
                        <div className="flex items-center gap-2 mb-1">
                          <Badge variant="outline" className="text-xs">
                            {getStatusLabel(project.status)}
                          </Badge>
                          <span className="text-xs text-gray-500">{project.date}</span>
                        </div>
                        <p className="text-sm font-semibold text-green-600">
                          {formatCurrency(project.amount)}
                        </p>
                      </div>
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </button>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}