import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Plus, 
  Edit, 
  Trash2, 
  Upload, 
  Image as ImageIcon, 
  Search, 
  Filter, 
  Eye, 
  Star,
  Package,
  AlertCircle,
  CheckCircle,
  X,
  Save,
  MoreHorizontal
} from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount_price?: number;
  category: string;
  subcategory?: string;
  brand?: string;
  sku: string;
  stock: number;
  min_stock: number;
  unit: string;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
  };
  is_active: boolean;
  is_featured: boolean;
  rating: number;
  total_reviews: number;
  total_sold: number;
  images: ProductImage[];
  tags: string[];
  created_at: string;
  updated_at: string;
}

interface ProductImage {
  id: string;
  image_url: string;
  alt_text: string;
  is_primary: boolean;
  sort_order: number;
}

interface ProductFormData {
  name: string;
  description: string;
  price: string;
  discount_price: string;
  category: string;
  subcategory: string;
  brand: string;
  sku: string;
  stock: string;
  min_stock: string;
  unit: string;
  weight: string;
  dimensions: {
    length: string;
    width: string;
    height: string;
  };
  is_active: boolean;
  is_featured: boolean;
  tags: string;
}

const categories = [
  'Bahan Bangunan',
  'Alat Konstruksi', 
  'Cat & Finishing',
  'Kayu & Furniture',
  'Listrik & Plumbing',
  'Keramik & Lantai'
];

const units = ['pcs', 'kg', 'meter', 'liter', 'pack', 'roll', 'lembar', 'set'];

const ProductManagement: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<ProductFormData>({
    name: '',
    description: '',
    price: '',
    discount_price: '',
    category: '',
    subcategory: '',
    brand: '',
    sku: '',
    stock: '',
    min_stock: '',
    unit: 'pcs',
    weight: '',
    dimensions: {
      length: '',
      width: '',
      height: ''
    },
    is_active: true,
    is_featured: false,
    tags: ''
  });

  // Mock data - replace with actual API calls
  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      
      // Simulate API call
      setTimeout(() => {
        setProducts([
          {
            id: '1',
            name: 'Semen Portland 50kg',
            description: 'Semen Portland berkualitas tinggi untuk konstruksi bangunan',
            price: 65000,
            category: 'Bahan Bangunan',
            sku: 'SEM-POR-50',
            stock: 150,
            min_stock: 20,
            unit: 'sak',
            weight: 50,
            is_active: true,
            is_featured: true,
            rating: 4.8,
            total_reviews: 45,
            total_sold: 234,
            images: [
              {
                id: '1',
                image_url: '/placeholder-product.jpg',
                alt_text: 'Semen Portland 50kg',
                is_primary: true,
                sort_order: 0
              }
            ],
            tags: ['semen', 'portland', 'bangunan'],
            created_at: '2024-01-15',
            updated_at: '2024-01-15'
          },
          {
            id: '2',
            name: 'Batu Bata Merah',
            description: 'Batu bata merah berkualitas untuk dinding bangunan',
            price: 800,
            category: 'Bahan Bangunan',
            sku: 'BTB-MRH-001',
            stock: 0,
            min_stock: 100,
            unit: 'pcs',
            is_active: true,
            is_featured: false,
            rating: 4.5,
            total_reviews: 23,
            total_sold: 567,
            images: [],
            tags: ['batu bata', 'merah', 'dinding'],
            created_at: '2024-01-14',
            updated_at: '2024-01-14'
          },
          {
            id: '3',
            name: 'Cat Tembok Putih 25kg',
            description: 'Cat tembok putih berkualitas tinggi, tahan lama dan mudah diaplikasikan',
            price: 285000,
            discount_price: 250000,
            category: 'Cat & Finishing',
            sku: 'CAT-PTH-25',
            stock: 25,
            min_stock: 5,
            unit: 'kaleng',
            weight: 25,
            is_active: true,
            is_featured: true,
            rating: 4.9,
            total_reviews: 67,
            total_sold: 123,
            images: [],
            tags: ['cat', 'putih', 'tembok'],
            created_at: '2024-01-13',
            updated_at: '2024-01-13'
          }
        ]);
        setLoading(false);
      }, 1000);
    };

    loadProducts();
  }, []);

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      price: '',
      discount_price: '',
      category: '',
      subcategory: '',
      brand: '',
      sku: '',
      stock: '',
      min_stock: '',
      unit: 'pcs',
      weight: '',
      dimensions: {
        length: '',
        width: '',
        height: ''
      },
      is_active: true,
      is_featured: false,
      tags: ''
    });
    setSelectedImages([]);
    setImagePreviewUrls([]);
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setSelectedImages(files);
    
    // Create preview URLs
    const previewUrls = files.map(file => URL.createObjectURL(file));
    setImagePreviewUrls(previewUrls);
  };

  const removeImage = (index: number) => {
    const newImages = selectedImages.filter((_, i) => i !== index);
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    
    setSelectedImages(newImages);
    setImagePreviewUrls(newPreviewUrls);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    if (!formData.name || !formData.price || !formData.category) {
      alert('Mohon lengkapi field yang wajib diisi');
      return;
    }

    try {
      // Here you would upload images and create/update product
      console.log('Form data:', formData);
      console.log('Selected images:', selectedImages);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Reset form and close dialog
      resetForm();
      setIsAddDialogOpen(false);
      setIsEditDialogOpen(false);
      setEditingProduct(null);
      
      // Reload products
      // loadProducts();
      
      alert('Produk berhasil disimpan!');
    } catch (error) {
      console.error('Error saving product:', error);
      alert('Gagal menyimpan produk');
    }
  };

  const handleEdit = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      price: product.price.toString(),
      discount_price: product.discount_price?.toString() || '',
      category: product.category,
      subcategory: product.subcategory || '',
      brand: product.brand || '',
      sku: product.sku,
      stock: product.stock.toString(),
      min_stock: product.min_stock.toString(),
      unit: product.unit,
      weight: product.weight?.toString() || '',
      dimensions: {
        length: product.dimensions?.length.toString() || '',
        width: product.dimensions?.width.toString() || '',
        height: product.dimensions?.height.toString() || ''
      },
      is_active: product.is_active,
      is_featured: product.is_featured,
      tags: product.tags.join(', ')
    });
    setIsEditDialogOpen(true);
  };

  const handleDelete = async (productId: string) => {
    if (confirm('Apakah Anda yakin ingin menghapus produk ini?')) {
      try {
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 500));
        
        setProducts(products.filter(p => p.id !== productId));
        alert('Produk berhasil dihapus!');
      } catch (error) {
        console.error('Error deleting product:', error);
        alert('Gagal menghapus produk');
      }
    }
  };

  const toggleProductStatus = async (productId: string, isActive: boolean) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setProducts(products.map(p => 
        p.id === productId ? { ...p, is_active: isActive } : p
      ));
    } catch (error) {
      console.error('Error updating product status:', error);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStockStatus = (stock: number, minStock: number) => {
    if (stock === 0) {
      return { label: 'Habis', variant: 'destructive' as const, icon: AlertCircle };
    } else if (stock <= minStock) {
      return { label: 'Rendah', variant: 'secondary' as const, icon: AlertCircle };
    } else {
      return { label: 'Tersedia', variant: 'default' as const, icon: CheckCircle };
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
    const matchesStatus = statusFilter === 'all' || 
                         (statusFilter === 'active' && product.is_active) ||
                         (statusFilter === 'inactive' && !product.is_active) ||
                         (statusFilter === 'out_of_stock' && product.stock === 0);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Memuat produk...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Manajemen Produk</h2>
          <p className="text-gray-600">Kelola semua produk di toko Anda</p>
        </div>
        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
          <DialogTrigger asChild>
            <Button onClick={resetForm}>
              <Plus className="h-4 w-4 mr-2" />
              Tambah Produk
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Tambah Produk Baru</DialogTitle>
              <DialogDescription>
                Lengkapi informasi produk yang akan ditambahkan ke toko Anda
              </DialogDescription>
            </DialogHeader>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <Tabs defaultValue="basic" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="basic">Informasi Dasar</TabsTrigger>
                  <TabsTrigger value="details">Detail Produk</TabsTrigger>
                  <TabsTrigger value="images">Gambar</TabsTrigger>
                </TabsList>
                
                <TabsContent value="basic" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="name">Nama Produk *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({...formData, name: e.target.value})}
                        placeholder="Masukkan nama produk"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="sku">SKU *</Label>
                      <Input
                        id="sku"
                        value={formData.sku}
                        onChange={(e) => setFormData({...formData, sku: e.target.value})}
                        placeholder="Kode produk unik"
                        required
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Deskripsi</Label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      placeholder="Deskripsi produk"
                      rows={3}
                    />
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="category">Kategori *</Label>
                      <Select value={formData.category} onValueChange={(value) => setFormData({...formData, category: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category} value={category}>{category}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="brand">Brand</Label>
                      <Input
                        id="brand"
                        value={formData.brand}
                        onChange={(e) => setFormData({...formData, brand: e.target.value})}
                        placeholder="Nama brand"
                      />
                    </div>
                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        value={formData.tags}
                        onChange={(e) => setFormData({...formData, tags: e.target.value})}
                        placeholder="tag1, tag2, tag3"
                      />
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="details" className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="price">Harga *</Label>
                      <Input
                        id="price"
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="0"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="discount_price">Harga Diskon</Label>
                      <Input
                        id="discount_price"
                        type="number"
                        value={formData.discount_price}
                        onChange={(e) => setFormData({...formData, discount_price: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="stock">Stok *</Label>
                      <Input
                        id="stock"
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        placeholder="0"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="min_stock">Stok Minimum</Label>
                      <Input
                        id="min_stock"
                        type="number"
                        value={formData.min_stock}
                        onChange={(e) => setFormData({...formData, min_stock: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="unit">Satuan *</Label>
                      <Select value={formData.unit} onValueChange={(value) => setFormData({...formData, unit: value})}>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {units.map(unit => (
                            <SelectItem key={unit} value={unit}>{unit}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor="weight">Berat (kg)</Label>
                      <Input
                        id="weight"
                        type="number"
                        step="0.1"
                        value={formData.weight}
                        onChange={(e) => setFormData({...formData, weight: e.target.value})}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="length">Panjang (cm)</Label>
                      <Input
                        id="length"
                        type="number"
                        value={formData.dimensions.length}
                        onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, length: e.target.value}})}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="width">Lebar (cm)</Label>
                      <Input
                        id="width"
                        type="number"
                        value={formData.dimensions.width}
                        onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, width: e.target.value}})}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <Label htmlFor="height">Tinggi (cm)</Label>
                      <Input
                        id="height"
                        type="number"
                        value={formData.dimensions.height}
                        onChange={(e) => setFormData({...formData, dimensions: {...formData.dimensions, height: e.target.value}})}
                        placeholder="0"
                      />
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_active"
                        checked={formData.is_active}
                        onCheckedChange={(checked) => setFormData({...formData, is_active: checked})}
                      />
                      <Label htmlFor="is_active">Produk Aktif</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="is_featured"
                        checked={formData.is_featured}
                        onCheckedChange={(checked) => setFormData({...formData, is_featured: checked})}
                      />
                      <Label htmlFor="is_featured">Produk Unggulan</Label>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="images" className="space-y-4">
                  <div>
                    <Label htmlFor="images">Upload Gambar Produk</Label>
                    <div className="mt-2">
                      <input
                        id="images"
                        type="file"
                        multiple
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={() => document.getElementById('images')?.click()}
                        className="w-full h-32 border-dashed"
                      >
                        <div className="text-center">
                          <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                          <p className="text-sm text-gray-600">Klik untuk upload gambar</p>
                          <p className="text-xs text-gray-400">PNG, JPG, JPEG (Max 5MB per file)</p>
                        </div>
                      </Button>
                    </div>
                  </div>
                  
                  {imagePreviewUrls.length > 0 && (
                    <div>
                      <Label>Preview Gambar</Label>
                      <div className="grid grid-cols-3 gap-4 mt-2">
                        {imagePreviewUrls.map((url, index) => (
                          <div key={index} className="relative">
                            <img
                              src={url}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-32 object-cover rounded-lg border"
                            />
                            <Button
                              type="button"
                              variant="destructive"
                              size="sm"
                              className="absolute top-2 right-2 h-6 w-6 p-0"
                              onClick={() => removeImage(index)}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </TabsContent>
              </Tabs>
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  Batal
                </Button>
                <Button type="submit">
                  <Save className="h-4 w-4 mr-2" />
                  Simpan Produk
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Cari produk atau SKU..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Semua Kategori" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Kategori</SelectItem>
                {categories.map(category => (
                  <SelectItem key={category} value={category}>{category}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Semua Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="active">Aktif</SelectItem>
                <SelectItem value="inactive">Tidak Aktif</SelectItem>
                <SelectItem value="out_of_stock">Stok Habis</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Products Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProducts.map((product) => {
          const stockStatus = getStockStatus(product.stock, product.min_stock);
          const StockIcon = stockStatus.icon;
          
          return (
            <Card key={product.id} className={`${!product.is_active ? 'opacity-60' : ''}`}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg line-clamp-2">{product.name}</CardTitle>
                    <CardDescription className="text-sm">{product.sku}</CardDescription>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(product)}>
                        <Edit className="h-4 w-4 mr-2" />
                        Edit
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => toggleProductStatus(product.id, !product.is_active)}
                      >
                        {product.is_active ? 'Nonaktifkan' : 'Aktifkan'}
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => handleDelete(product.id)}
                        className="text-red-600"
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Hapus
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Product Image */}
                <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  {product.images.length > 0 ? (
                    <img 
                      src={product.images[0].image_url} 
                      alt={product.images[0].alt_text}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  ) : (
                    <ImageIcon className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                
                {/* Price */}
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="text-xl font-bold">{formatCurrency(product.price)}</span>
                    {product.discount_price && (
                      <span className="text-sm text-gray-500 line-through">
                        {formatCurrency(product.discount_price)}
                      </span>
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{product.category}</p>
                </div>
                
                {/* Stock Status */}
                <div className="flex items-center justify-between">
                  <Badge variant={stockStatus.variant} className="flex items-center space-x-1">
                    <StockIcon className="h-3 w-3" />
                    <span>{stockStatus.label}</span>
                  </Badge>
                  <span className="text-sm text-gray-600">
                    {product.stock} {product.unit}
                  </span>
                </div>
                
                {/* Stats */}
                <div className="flex items-center justify-between text-sm text-gray-600">
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-400 fill-current" />
                    <span>{product.rating}</span>
                    <span>({product.total_reviews})</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span>{product.total_sold} terjual</span>
                    {product.is_featured && (
                      <Badge variant="secondary">Unggulan</Badge>
                    )}
                  </div>
                </div>
                
                {/* Status */}
                <div className="flex items-center justify-between">
                  <Badge variant={product.is_active ? 'default' : 'secondary'}>
                    {product.is_active ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                  <div className="flex space-x-2">
                    <Button size="sm" variant="outline" onClick={() => handleEdit(product)}>
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={() => handleDelete(product.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {filteredProducts.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Tidak ada produk</h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || categoryFilter !== 'all' || statusFilter !== 'all' 
                ? 'Tidak ada produk yang sesuai dengan filter'
                : 'Belum ada produk yang ditambahkan'
              }
            </p>
            {!searchTerm && categoryFilter === 'all' && statusFilter === 'all' && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Produk Pertama
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Produk</DialogTitle>
            <DialogDescription>
              Ubah informasi produk {editingProduct?.name}
            </DialogDescription>
          </DialogHeader>
          
          {/* Same form as add dialog but with edit data */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Form content similar to add dialog */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="edit-name">Nama Produk *</Label>
                <Input
                  id="edit-name"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  placeholder="Masukkan nama produk"
                  required
                />
              </div>
              <div>
                <Label htmlFor="edit-sku">SKU *</Label>
                <Input
                  id="edit-sku"
                  value={formData.sku}
                  onChange={(e) => setFormData({...formData, sku: e.target.value})}
                  placeholder="Kode produk unik"
                  required
                />
              </div>
            </div>
            
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditDialogOpen(false)}>
                Batal
              </Button>
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                Simpan Perubahan
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProductManagement;