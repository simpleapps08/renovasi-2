import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Trash2, Edit, Plus, Save, X } from "lucide-react"
import { toast } from "sonner"

interface Product {
  id: string
  name: string
  price: number
  category: string
  description: string
  image: string
  stock: number
  rating: number
}

interface StoreSettings {
  name: string
  description: string
  address: string
  phone: string
  email: string
}

const AdminToko = () => {
  const [products, setProducts] = useState<Product[]>([
    {
      id: "1",
      name: "Semen Portland",
      price: 65000,
      category: "semen",
      description: "Semen berkualitas tinggi untuk konstruksi",
      image: "/api/placeholder/300/200",
      stock: 100,
      rating: 4.5
    },
    {
      id: "2",
      name: "Batu Bata Merah",
      price: 800,
      category: "batu-bata",
      description: "Batu bata merah berkualitas untuk dinding",
      image: "/api/placeholder/300/200",
      stock: 500,
      rating: 4.3
    },
    {
      id: "3",
      name: "Cat Tembok Putih",
      price: 85000,
      category: "cat",
      description: "Cat tembok berkualitas tinggi",
      image: "/api/placeholder/300/200",
      stock: 50,
      rating: 4.7
    }
  ])

  const [storeSettings, setStoreSettings] = useState<StoreSettings>({
    name: "Toko Bahan Bangunan Servisoo",
    description: "Toko bahan bangunan terlengkap dan terpercaya",
    address: "Jl. Konstruksi No. 123, Jakarta",
    phone: "+62 21 1234 5678",
    email: "toko@servisoo.com"
  })

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [isAddingProduct, setIsAddingProduct] = useState(false)
  const [newProduct, setNewProduct] = useState<Omit<Product, 'id'>>({
    name: "",
    price: 0,
    category: "",
    description: "",
    image: "/api/placeholder/300/200",
    stock: 0,
    rating: 0
  })

  const categories = [
    { value: "semen", label: "Semen" },
    { value: "batu-bata", label: "Batu Bata" },
    { value: "cat", label: "Cat" },
    { value: "kayu", label: "Kayu" },
    { value: "pipa", label: "Pipa" },
    { value: "genteng", label: "Genteng" },
    { value: "pasir", label: "Pasir" },
    { value: "keramik", label: "Keramik" },
    { value: "besi", label: "Besi" },
    { value: "kawat", label: "Kawat" },
    { value: "triplek", label: "Triplek" },
    { value: "kaca", label: "Kaca" }
  ]

  const handleAddProduct = () => {
    if (!newProduct.name || !newProduct.price || !newProduct.category) {
      toast.error("Mohon lengkapi semua field yang wajib diisi")
      return
    }

    const product: Product = {
      ...newProduct,
      id: Date.now().toString(),
      rating: newProduct.rating || 0
    }

    setProducts([...products, product])
    setNewProduct({
      name: "",
      price: 0,
      category: "",
      description: "",
      image: "/api/placeholder/300/200",
      stock: 0,
      rating: 0
    })
    setIsAddingProduct(false)
    toast.success("Produk berhasil ditambahkan")
  }

  const handleUpdateProduct = () => {
    if (!editingProduct) return

    setProducts(products.map(p => p.id === editingProduct.id ? editingProduct : p))
    setEditingProduct(null)
    toast.success("Produk berhasil diperbarui")
  }

  const handleDeleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id))
    toast.success("Produk berhasil dihapus")
  }

  const handleUpdateStore = () => {
    // In real app, this would save to database
    toast.success("Pengaturan toko berhasil diperbarui")
  }

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price)
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Admin Toko</h1>
          <p className="text-muted-foreground">Kelola produk dan pengaturan toko</p>
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
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Daftar Produk</CardTitle>
                  <CardDescription>Kelola produk bahan bangunan</CardDescription>
                </div>
                <Button onClick={() => setIsAddingProduct(true)} className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Tambah Produk
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {isAddingProduct && (
                <Card className="mb-6 border-dashed">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">Tambah Produk Baru</CardTitle>
                      <Button variant="ghost" size="sm" onClick={() => setIsAddingProduct(false)}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="new-name">Nama Produk *</Label>
                        <Input
                          id="new-name"
                          value={newProduct.name}
                          onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                          placeholder="Masukkan nama produk"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-price">Harga *</Label>
                        <Input
                          id="new-price"
                          type="number"
                          value={newProduct.price}
                          onChange={(e) => setNewProduct({...newProduct, price: Number(e.target.value)})}
                          placeholder="Masukkan harga"
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="new-category">Kategori *</Label>
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
                        <Label htmlFor="new-stock">Stok</Label>
                        <Input
                          id="new-stock"
                          type="number"
                          value={newProduct.stock}
                          onChange={(e) => setNewProduct({...newProduct, stock: Number(e.target.value)})}
                          placeholder="Masukkan jumlah stok"
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-description">Deskripsi</Label>
                      <Textarea
                        id="new-description"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                        placeholder="Masukkan deskripsi produk"
                        rows={3}
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" onClick={() => setIsAddingProduct(false)}>
                        Batal
                      </Button>
                      <Button onClick={handleAddProduct}>
                        <Save className="h-4 w-4 mr-2" />
                        Simpan Produk
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map((product) => (
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
                            <Button size="sm" onClick={handleUpdateProduct}>
                              <Save className="h-4 w-4 mr-1" />
                              Simpan
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          <div className="aspect-video bg-gray-100 rounded-md flex items-center justify-center">
                            <span className="text-gray-400 text-sm">Gambar Produk</span>
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
                ))}
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
  )
}

export default AdminToko