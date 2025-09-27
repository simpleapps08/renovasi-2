import { supabase } from '@/integrations/supabase/client';

export interface Product {
  id?: string;
  name: string;
  description?: string;
  price: number;
  category: string;
  stock: number;
  image_url?: string;
  store_id?: string;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
}

export class ProductService {
  // Upload image to Supabase Storage
  static async uploadProductImage(file: File): Promise<string | null> {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `products/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
      
      const { data, error } = await supabase.storage
        .from('product-images')
        .upload(fileName, file, {
          cacheControl: '3600',
          upsert: false
        });

      if (error) {
        console.error('Error uploading image:', error);
        return null;
      }

      // Get public URL
      const { data: { publicUrl } } = supabase.storage
        .from('product-images')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (error) {
      console.error('Error in uploadProductImage:', error);
      return null;
    }
  }

  // Delete image from Supabase Storage
  static async deleteProductImage(imageUrl: string): Promise<boolean> {
    try {
      // Extract path from URL
      const urlParts = imageUrl.split('/');
      const bucketIndex = urlParts.findIndex(part => part === 'product-images');
      if (bucketIndex === -1) return false;
      
      const path = urlParts.slice(bucketIndex + 1).join('/');
      
      const { error } = await supabase.storage
        .from('product-images')
        .remove([path]);

      if (error) {
        console.error('Error deleting image:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteProductImage:', error);
      return false;
    }
  }

  // Create new product
  static async createProduct(product: Omit<Product, 'id' | 'created_at' | 'updated_at'>): Promise<Product | null> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('User not authenticated');

      const productData = {
        ...product,
        store_id: user.user.id,
        is_active: true
      };

      const { data, error } = await supabase
        .from('products')
        .insert([productData])
        .select()
        .single();

      if (error) {
        console.error('Error creating product:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in createProduct:', error);
      return null;
    }
  }

  // Get all products for current store
  static async getProducts(): Promise<Product[]> {
    try {
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) return [];

      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('store_id', user.user.id)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching products:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getProducts:', error);
      return [];
    }
  }

  // Update product
  static async updateProduct(id: string, updates: Partial<Product>): Promise<Product | null> {
    try {
      const { data, error } = await supabase
        .from('products')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating product:', error);
        return null;
      }

      return data;
    } catch (error) {
      console.error('Error in updateProduct:', error);
      return null;
    }
  }

  // Delete product
  static async deleteProduct(id: string): Promise<boolean> {
    try {
      // First get the product to delete its image
      const { data: product } = await supabase
        .from('products')
        .select('image_url')
        .eq('id', id)
        .single();

      // Delete the image if exists
      if (product?.image_url) {
        await this.deleteProductImage(product.image_url);
      }

      // Delete the product
      const { error } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting product:', error);
        return false;
      }

      return true;
    } catch (error) {
      console.error('Error in deleteProduct:', error);
      return false;
    }
  }

  // Get public products (for store front)
  static async getPublicProducts(storeId?: string): Promise<Product[]> {
    try {
      let query = supabase
        .from('products')
        .select('*')
        .eq('is_active', true);

      if (storeId) {
        query = query.eq('store_id', storeId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching public products:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error in getPublicProducts:', error);
      return [];
    }
  }
}