// Types untuk Gallery dengan integrasi Supabase

export interface GalleryItem {
  id: string
  title: string
  description: string | null
  category: string
  foto_url: string // Sesuai dengan kolom di database Supabase
  tags: string[]
  status: 'active' | 'inactive'
  created_at: string
  updated_at: string
  views: number
  caption?: string | null // Untuk backward compatibility
}

// Interface untuk form upload
export interface GalleryUploadForm {
  title: string
  description: string
  category: string
  tags: string
  status: 'active' | 'inactive'
  imageFile: File | null
}

// Interface untuk update gallery item
export interface GalleryUpdateForm {
  title: string
  description: string
  category: string
  tags: string
  status: 'active' | 'inactive'
}

// Interface untuk filter
export interface GalleryFilters {
  search: string
  category: string
  status: string
}

// Interface untuk kategori
export interface GalleryCategory {
  value: string
  label: string
}

// Interface untuk response dari Supabase
export interface SupabaseGalleryItem {
  id: string
  title: string | null
  description: string | null
  category: string | null
  foto_url: string
  tags: string[] | null
  status: string | null
  created_at: string
  updated_at: string
  views: number | null
  caption: string | null
}

// Interface untuk upload ke Supabase Storage
export interface StorageUploadResult {
  data: {
    path: string
    id: string
    fullPath: string
  } | null
  error: Error | null
}

// Interface untuk gallery service
export interface GalleryService {
  uploadImage: (file: File, path: string) => Promise<StorageUploadResult>
  getImageUrl: (path: string) => string
  createGalleryItem: (item: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>) => Promise<GalleryItem>
  updateGalleryItem: (id: string, updates: Partial<GalleryItem>) => Promise<GalleryItem>
  deleteGalleryItem: (id: string) => Promise<void>
  getGalleryItems: (filters?: Partial<GalleryFilters>) => Promise<GalleryItem[]>
  incrementViews: (id: string) => Promise<void>
}