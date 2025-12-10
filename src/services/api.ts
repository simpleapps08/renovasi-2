// Example function to fetch services
export const getServices = async () => {
  const services = [
    { id: '1', name: 'Pengecatan', description: 'Painting services', icon: 'PaintBucket', path: '/dashboard/painting' },
    { id: '2', name: 'Perbaikan Plafon', description: 'Ceiling repair services', icon: 'Hammer', path: '/dashboard/ceiling-repair' },
    { id: '3', name: 'Renovasi Rumah', description: 'Home renovation services', icon: 'HomeIcon', path: '/dashboard/renovation' },
    { id: '5', name: 'Perbaikan', description: 'General repair', icon: 'Wrench', path: '/dashboard/repair' },
    { id: '9', name: 'Desain Interior', description: 'Interior Design', icon: 'Palette', path: '/dashboard/interior-design' },
    { id: '10', name: 'Konstruksi Baja', description: 'Steel Construction', icon: 'Building', path: '/dashboard/steel-construction' },
    { id: '6', name: 'Proyek Saya', description: 'My Projects', icon: 'FolderOpen', path: '/dashboard/history' },
    { id: '7', name: 'Lainnya', description: 'More services', icon: 'MoreHorizontal', path: '/dashboard/more' },
  ];
  return await Promise.resolve(services);
};

// Example function to fetch promotions
export const getPromotions = async () => {
  return await Promise.resolve([]);
};

// Example function to fetch recent projects
export const getRecentProjects = async (userId: string) => {
  console.log('Fetching recent projects for user:', userId);
  return await Promise.resolve([]);
};

