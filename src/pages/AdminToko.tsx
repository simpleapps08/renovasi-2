import { useState, useEffect, useMemo, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Edit, Plus, Save, X, Home, Search, Upload, Image } from "lucide-react"
import { toast } from "sonner"
import { ProductService, Product } from "@/services/productService"

interface StoreSettings {
  name: string
  description: string
  address: string
  phone: string
  email: string
}

const AdminToko = () => {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const editFileInputRef = useRef<HTMLInputElement>(null)

  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: "Toko Bangunan Servisoo",
    description: "Menyediakan berbagai kebutuhan material bangunan berkualitas",
    address: "Jl. Raya Pembangunan No. 123, Jakarta",
    phone: "+62 21 1234 5678",
    email: "info@servisoo.com"
  })

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id' | 'created_at' | 'updated_at' | 'store_id' | 'is_active'>>({
    name: "",
    price: 0,
    category: "",
    description: "",
    image_url: "",
    stock: 0
  })

  const categories = [
    { value: "material", label: "Material Bangunan" },
    { value: "tools", label: "Alat & Perkakas" },
    { value: "finishing", label: "Finishing" },
    { value: "electrical", label: "Listrik" },
    { value: "plumbing", label: "Plambing" },
    { value: "hardware", label: "Hardware" }
  ]

  // Load products on component mount
  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    setLoading(true)
    try {
      const fetchedProducts = await ProductService.getProducts()
      setProducts(fetchedProducts)
    } catch (error) {
      toast.error("Gagal memuat produk")
      console.error('Error loading products:', error)
    } finally {
      setLoading(false)
    }
  }

  // Handle image upload for new product
  const handleImageUpload = async (file: File) => {
    if (!file) return

    setUploadingImage(true)
    try {
      const imageUrl = await ProductService.uploadProductImage(file)
      if (imageUrl) {
        setNewProduct(prev => ({ ...prev, image_url: imageUrl }))
        toast.success("Gambar berhasil diupload")
      } else {
        toast.error("Gagal mengupload gambar")
      }
    } catch (error) {
      toast.error("Gagal mengupload gambar")
      console.error('Error uploading image:', error)
    } finally {
      setUploadingImage(false)
    }
  }

  // Handle image upload for editing product
  const handleEditImageUpload = async (file: File) => {
    if (!file || !editingProduct) return

    setUploadingImage(true)
    try {
      const imageUrl = await ProductService.uploadProductImage(file)
      if (imageUrl) {
        setEditingProduct(prev => prev ? { ...prev, image_url: imageUrl } : null)
        toast.success("Gambar berhasil diupload")
      } else {
        toast.error("Gagal mengupload gambar")
      }
    } catch (error) {
      toast.error("Gagal mengupload gambar")
      console.error('Error uploading image:', error)
    } finally {
      setUploadingImage(false)
    }
  }

  const handleAddProduct = async () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast.error("Mohon lengkapi semua field yang diperlukan")
      return
    }

    setLoading(true)
    try {
      const createdProduct = await ProductService.createProduct(newProduct)
      if (createdProduct) {
        setProducts(prev => [createdProduct, ...prev])
        setNewProduct({
          name: "",
          price: 0,
          category: "",
          description: "",
          image_url: "",
          stock: 0
        })
        // Reset file input
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        toast.success("Produk berhasil ditambahkan")
      } else {
        toast.error("Gagal menambahkan produk")
      }
    } catch (error) {
      toast.error("Gagal menambahkan produk")
      console.error('Error adding product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateProduct = async () => {
    if (!editingProduct?.id) return
    
    setLoading(true)
    try {
      const updatedProduct = await ProductService.updateProduct(editingProduct.id, editingProduct)
      if (updatedProduct) {
        setProducts(prev => prev.map(p => p.id === editingProduct.id ? updatedProduct : p))
        setEditingProduct(null)
        toast.success("Produk berhasil diperbarui")
      } else {
        toast.error("Gagal memperbarui produk")
      }
    } catch (error) {
      toast.error("Gagal memperbarui produk")
      console.error('Error updating product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Apakah Anda yakin ingin menghapus produk ini?")) return

    setLoading(true)
    try {
      const success = await ProductService.deleteProduct(id)
      if (success) {
        setProducts(prev => prev.filter(p => p.id !== id))
        toast.success("Produk berhasil dihapus")
      } else {
        toast.error("Gagal menghapus produk")
      }
    } catch (error) {
      toast.error("Gagal menghapus produk")
      console.error('Error deleting product:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdateStore = () => {
    toast.success("Pengaturan toko berhasil diperbarui")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(price)
  }

  const [searchTerm, setSearchTerm] = useState("")

  // Filter produk berdasarkan pencarian
  const filteredProducts = useMemo(() => {
    if (!searchTerm) return products
    return products.filter(product => 
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      product.description.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [products, searchTerm])

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-green-100 to-green-200">
      {/* Header dengan tema seperti halaman Toko */}
      <div className="bg-gradient-to-r from-green-800 via-green-700 to-green-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo dan Tombol Beranda */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.location.href = '/'}
                className="text-white hover:bg-green-600 flex items-center space-x-2"
              >
                <Home className="h-4 w-4" />
                <span>Beranda</span>
              </Button>
              <div className="flex items-center space-x-2">
                <div className="bg-white text-green-800 px-3 py-1 rounded font-bold text-lg">
                  SERVISOO
                </div>
                <span className="text-sm hidden md:block">Admin Toko</span>
              </div>
            </div>

            {/* Kotak Pencarian */}
            <div className="flex-1 max-w-2xl mx-4">
              <div className="relative">
                <Input
                  placeholder="Cari produk untuk dikelola..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-4 pr-12 py-2 rounded-md border-0 focus:ring-2 focus:ring-yellow-400 text-black placeholder:text-gray-500"
                />
                <Button
                  size="sm"
                  className="absolute right-0 top-0 h-full px-4 bg-yellow-400 hover:bg-yellow-500 text-black rounded-l-none"
                >
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>

            {/* Info Admin */}
            <div className="flex items-center space-x-2">
              <span className="text-sm hidden md:block">Admin Panel</span>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-6 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-green-800">Dashboard Admin Toko</h1>
            <p className="text-green-600">Kelola produk dan pengaturan toko</p>
          </div>
        </div>

        <Tabs defaultValue="products" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="products">Manajemen Produk</TabsTrigger>
            <TabsTrigger value="settings">Pengaturan Toko</TabsTrigger>
          </TabsList>

          <TabsContent value="products" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tambah Produk Baru</CardTitle>
                <CardDescription>Tambahkan produk baru ke toko Anda</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="product-name">Nama Produk</Label>
                    <Input
                      id="product-name"
                      value={newProduct.name}
                      onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                      placeholder="Masukkan nama produk"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-price">Harga</Label>
                    <Input
                      id="product-price"
                      type="number"
                      value={newProduct.price}
                      onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                      placeholder="Masukkan harga"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-category">Kategori</Label>
                    <Select value={newProduct.category} onValueChange={(value) => setNewProduct({...newProduct, category: value})}>
                      <SelectTrigger>
                        <SelectValue placeholder="Pilih kategori" />
                      </SelectTrigger>
                      <SelectContent>
                        {categories.map((cat) => (
                          <SelectItem key={cat.value} value={cat.value}>
                            {cat.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-stock">Stok</Label>
                    <Input
                      id="product-stock"
                      type="number"
                      value={newProduct.stock}
                      onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                      placeholder="Masukkan jumlah stok"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="product-image">Gambar Produk</Label>
                    <div className="flex items-center space-x-2">
                      <Input
                        id="product-image"
                        type="file"
                        ref={fileInputRef}
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0]
                          if (file) handleImageUpload(file)
                        }}
                        className="flex-1"
                        disabled={uploadingImage}
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={uploadingImage}
                        onClick={() => fileInputRef.current?.click()}
                      >
                        {uploadingImage ? (
                          <>
                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                            Uploading...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Upload
                          </>
                        )}
                      </Button>
                    </div>
                    {newProduct.image_url && (
                      <div className="mt-2">
                        <img
                          src={newProduct.image_url}
                          alt="Preview"
                          className="w-20 h-20 object-cover rounded-md border"
                        />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="product-description">Deskripsi</Label>
                    <Textarea
                      id="product-description"
                      value={newProduct.description}
                      onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                      placeholder="Masukkan deskripsi produk"
                      rows={3}
                    />
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <Button onClick={handleAddProduct} disabled={loading || uploadingImage}>
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Menambahkan...
                      </>
                    ) : (
                      <>
                        <Plus className="h-4 w-4 mr-2" />
                        Tambah Produk
                      </>
                    )}
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Daftar Produk</CardTitle>
                <CardDescription>
                  Total {filteredProducts.length} produk
                  {searchTerm && ` untuk pencarian "${searchTerm}"`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredProducts.length > 0 ? filteredProducts.map((product) => (
                    <Card key={product.id} className="relative">
                      <CardContent className="p-4">
                        {editingProduct?.id === product.id ? (
                          <div className="space-y-4">
                            <div className="space-y-2">
                              <Label>Nama Produk</Label>
                              <Input
                                value={editingProduct.name}
                                onChange={(e) => setEditingProduct({...editingProduct, name: e.target.value})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Harga</Label>
                              <Input
                                type="number"
                                value={editingProduct.price}
                                onChange={(e) => setEditingProduct({...editingProduct, price: Number(e.target.value)})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Kategori</Label>
                              <Select value={editingProduct.category} onValueChange={(value) => setEditingProduct({...editingProduct, category: value})}>
                                <SelectTrigger>
                                  <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                  {categories.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                      {cat.label}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            <div className="space-y-2">
                              <Label>Stok</Label>
                              <Input
                                type="number"
                                value={editingProduct.stock}
                                onChange={(e) => setEditingProduct({...editingProduct, stock: Number(e.target.value)})}
                              />
                            </div>
                            <div className="space-y-2">
                              <Label>Gambar Produk</Label>
                              <div className="flex items-center space-x-2">
                                <Input
                                  type="file"
                                  accept="image/*"
                                  onChange={(e) => {
                                    const file = e.target.files?.[0]
                                    if (file) handleEditImageUpload(file)
                                  }}
                                  className="flex-1"
                                  disabled={uploadingImage}
                                />
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  disabled={uploadingImage}
                                >
                                  {uploadingImage ? (
                                    <>
                                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-green-600 mr-2"></div>
                                      Uploading...
                                    </>
                                  ) : (
                                    <>
                                      <Upload className="h-4 w-4 mr-2" />
                                      Upload
                                    </>
                                  )}
                                </Button>
                              </div>
                              {editingProduct.image_url && (
                                <div className="mt-2">
                                  <img
                                    src={editingProduct.image_url}
                                    alt="Preview"
                                    className="w-20 h-20 object-cover rounded-md border"
                                  />
                                </div>
                              )}
                            </div>
                            <div className="space-y-2">
                              <Label>Deskripsi</Label>
                              <Textarea
                                value={editingProduct.description}
                                onChange={(e) => setEditingProduct({...editingProduct, description: e.target.value})}
                                rows={2}
                              />
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => setEditingProduct(null)}>
                                Batal
                              </Button>
                              <Button size="sm" onClick={handleUpdateProduct} disabled={loading || uploadingImage}>
                                {loading ? (
                                  <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                                    Menyimpan...
                                  </>
                                ) : (
                                  <>
                                    <Save className="h-4 w-4 mr-1" />
                                    Simpan
                                  </>
                                )}
                              </Button>
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-3">
                            <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center overflow-hidden">
                              {product.image_url ? (
                                <img
                                  src={product.image_url}
                                  alt={product.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <div className="flex flex-col items-center justify-center text-gray-400">
                                  <Image className="h-8 w-8 mb-2" />
                                  <span className="text-sm">Tidak ada gambar</span>
                                </div>
                              )}
                            </div>
                            <div>
                              <h3 className="font-semibold text-lg">{product.name}</h3>
                              <p className="text-2xl font-bold text-green-600">{formatPrice(product.price)}</p>
                              <Badge variant="secondary" className="mt-1">
                                {categories.find(c => c.value === product.category)?.label}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground line-clamp-2">{product.description}</p>
                            <div className="flex items-center justify-between text-sm text-muted-foreground">
                              <span>Stok: {product.stock}</span>
                              <span>Rating: {product.rating}/5</span>
                            </div>
                            <div className="flex justify-end gap-2">
                              <Button variant="outline" size="sm" onClick={() => setEditingProduct(product)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button variant="destructive" size="sm" onClick={() => handleDeleteProduct(product.id)}>
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  )) : (
                    <div className="col-span-full text-center py-8">
                      <div className="text-gray-500">
                        {searchTerm ? (
                          <div>
                            <p className="text-lg mb-2">Tidak ada produk yang ditemukan</p>
                            <p className="text-sm">Coba gunakan kata kunci yang berbeda</p>
                          </div>
                        ) : (
                          <p className="text-lg">Belum ada produk yang ditambahkan</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Pengaturan Toko</CardTitle>
                <CardDescription>Kelola informasi dan pengaturan toko</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="store-name">Nama Toko</Label>
                      <Input
                        id="store-name"
                        value={storeSettings.name}
                        onChange={(e) => setStoreSettings({...storeSettings, name: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-phone">Nomor Telepon</Label>
                      <Input
                        id="store-phone"
                        value={storeSettings.phone}
                        onChange={(e) => setStoreSettings({...storeSettings, phone: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-email">Email</Label>
                      <Input
                        id="store-email"
                        type="email"
                        value={storeSettings.email}
                        onChange={(e) => setStoreSettings({...storeSettings, email: e.target.value})}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="store-description">Deskripsi Toko</Label>
                      <Textarea
                        id="store-description"
                        value={storeSettings.description}
                        onChange={(e) => setStoreSettings({...storeSettings, description: e.target.value})}
                        rows={3}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="store-address">Alamat</Label>
                      <Textarea
                        id="store-address"
                        value={storeSettings.address}
                        onChange={(e) => setStoreSettings({...storeSettings, address: e.target.value})}
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button onClick={handleUpdateStore}>
                    <Save className="h-4 w-4 mr-2" />
                    Simpan Pengaturan
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}

export default AdminToko