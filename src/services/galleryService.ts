// Gallery Service untuk integrasi dengan Supabase Storage dan Database

import { supabase } from '@/integrations/supabase/client'
import { 
  GalleryItem, 
  GalleryService, 
  StorageUploadResult, 
  SupabaseGalleryItem,
  GalleryFilters 
} from '@/types/gallery'

class GalleryServiceImpl implements GalleryService {
  private readonly BUCKET_NAME = 'gallery-images'

  /**
   * Upload gambar ke Supabase Storage
   */
  async uploadImage(file: File, path: string): Promise<StorageUploadResult> {
    try {
      const { data, error } = await supabase.storage
        .from(this.BUCKET_NAME)
        .upload(path, file, {
          cacheControl: '3600',
          upsert: false
        })

      return { data, error }
    } catch (error) {
      return { data: null, error: error as Error }
    }
  }

  /**
   * Mendapatkan URL publik untuk gambar
   */
  getImageUrl(path: string): string {
    const { data } = supabase.storage
      .from(this.BUCKET_NAME)
      .getPublicUrl(path)
    
    return data.publicUrl
  }

  /**
   * Membuat item galeri baru di database
   */
  async createGalleryItem(item: Omit<GalleryItem, 'id' | 'created_at' | 'updated_at'>): Promise<GalleryItem> {
    const { data, error } = await supabase
      .from('gallery')
      .insert({
        title: item.title,
        description: item.description,
        category: item.category,
        foto_url: item.foto_url,
        tags: item.tags,
        status: item.status,
        views: item.views || 0,
        caption: item.description // Untuk backward compatibility
      })
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to create gallery item: ${error.message}`)
    }

    return this.mapSupabaseToGalleryItem(data)
  }

  /**
   * Update item galeri
   */
  async updateGalleryItem(id: string, updates: Partial<GalleryItem>): Promise<GalleryItem> {
    const updateData: any = {
      ...updates,
      updated_at: new Date().toISOString()
    }

    // Jika ada description, update juga caption untuk backward compatibility
    if (updates.description !== undefined) {
      updateData.caption = updates.description
    }

    const { data, error } = await supabase
      .from('gallery')
      .update(updateData)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      throw new Error(`Failed to update gallery item: ${error.message}`)
    }

    return this.mapSupabaseToGalleryItem(data)
  }

  /**
   * Hapus item galeri dan gambarnya dari storage
   */
  async deleteGalleryItem(id: string): Promise<void> {
    // Ambil data item untuk mendapatkan path gambar
    const { data: item, error: fetchError } = await supabase
      .from('gallery')
      .select('foto_url')
      .eq('id', id)
      .single()

    if (fetchError) {
      throw new Error(`Failed to fetch gallery item: ${fetchError.message}`)
    }

    // Hapus gambar dari storage jika ada
    if (item.foto_url && !item.foto_url.startsWith('data:')) {
      const path = this.extractPathFromUrl(item.foto_url)
      if (path) {
        await supabase.storage
          .from(this.BUCKET_NAME)
          .remove([path])
      }
    }

    // Hapus item dari database
    const { error: deleteError } = await supabase
      .from('gallery')
      .delete()
      .eq('id', id)

    if (deleteError) {
      throw new Error(`Failed to delete gallery item: ${deleteError.message}`)
    }
  }

  /**
   * Ambil semua item galeri dengan filter
   */
  async getGalleryItems(filters?: Partial<GalleryFilters>): Promise<GalleryItem[]> {
    let query = supabase
      .from('gallery')
      .select('*')
      .order('created_at', { ascending: false })

    // Apply filters
    if (filters?.category && filters.category !== 'all') {
      query = query.eq('category', filters.category)
    }

    if (filters?.status && filters.status !== 'all') {
      query = query.eq('status', filters.status)
    }

    if (filters?.search) {
      query = query.or(`title.ilike.%${filters.search}%,description.ilike.%${filters.search}%`)
    }

    const { data, error } = await query

    if (error) {
      throw new Error(`Failed to fetch gallery items: ${error.message}`)
    }

    return data.map(item => this.mapSupabaseToGalleryItem(item))
  }

  /**
   * Increment views untuk item galeri
   */
  async incrementViews(id: string): Promise<void> {
    const { error } = await supabase
      .from('gallery')
      .update({ views: supabase.sql`views + 1` })
      .eq('id', id)

    if (error) {
      console.error('Failed to increment views:', error.message)
    }
  }

  /**
   * Generate unique filename untuk upload
   */
  generateFileName(originalName: string): string {
    const timestamp = Date.now()
    const randomString = Math.random().toString(36).substring(2, 15)
    const extension = originalName.split('.').pop()
    return `${timestamp}-${randomString}.${extension}`
  }

  /**
   * Validate file sebelum upload
   */
  validateFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024 // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']

    if (file.size > maxSize) {
      return { valid: false, error: 'File size must be less than 5MB' }
    }

    if (!allowedTypes.includes(file.type)) {
      return { valid: false, error: 'Only JPEG, PNG, WebP, and GIF files are allowed' }
    }

    return { valid: true }
  }

  /**
   * Map data dari Supabase ke GalleryItem interface
   */
  private mapSupabaseToGalleryItem(data: SupabaseGalleryItem): GalleryItem {
    return {
      id: data.id,
      title: data.title || 'Untitled',
      description: data.description || '',
      category: data.category || 'general',
      foto_url: data.foto_url,
      tags: data.tags || [],
      status: (data.status as 'active' | 'inactive') || 'active',
      created_at: data.created_at,
      updated_at: data.updated_at,
      views: data.views || 0,
      caption: data.caption
    }
  }

  /**
   * Extract path dari URL Supabase Storage
   */
  private extractPathFromUrl(url: string): string | null {
    try {
      const urlObj = new URL(url)
      const pathParts = urlObj.pathname.split('/')
      const bucketIndex = pathParts.findIndex(part => part === this.BUCKET_NAME)
      if (bucketIndex !== -1 && bucketIndex < pathParts.length - 1) {
        return pathParts.slice(bucketIndex + 1).join('/')
      }
      return null
    } catch {
      return null
    }
  }
}

// Export singleton instance
export const galleryService = new GalleryServiceImpl()
export default galleryService