import React, { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/enhanced-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Badge } from '@/components/ui/badge'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { 
  ArrowLeft,
  Plus, 
  Edit, 
  Trash2, 
  Eye,
  Upload,
  Search,
  Filter,
  Download,
  ImageIcon,
  X
} from 'lucide-react'
import { toast } from 'sonner'

interface GalleryItem {
  id: string
  title: string
  description: string
  category: string
  imageUrl: string
  tags: string[]
  status: 'active' | 'inactive'
  uploadDate: string
  views: number
}

const AdminGallery = () => {
  const navigate = useNavigate()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterCategory, setFilterCategory] = useState('all')
  const [filterStatus, setFilterStatus] = useState('all')
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false)
  const [isUploadDialogOpen, setIsUploadDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<GalleryItem | null>(null)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [uploadFormData, setUploadFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    status: 'active' as 'active' | 'inactive'
  })
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    tags: '',
    status: 'active' as 'active' | 'inactive',
    imageFile: null as File | null
  })

  // Data dummy galeri
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>([
    {
      id: 'GAL-001',
      title: 'Renovasi Dapur Modern',
      description: 'Transformasi dapur tradisional menjadi dapur modern dengan island dan kitchen set minimalis',
      category: 'kitchen',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxyZWN0IHg9IjUwIiB5PSI1MCIgd2lkdGg9IjMwMCIgaGVpZ2h0PSIyMDAiIGZpbGw9IiNlNWU3ZWIiLz4KPHN2ZyB4PSIxNzUiIHk9IjEyNSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjUwIiBmaWxsPSIjOWNhM2FmIj4KICA8cGF0aCBkPSJNMjUgNUwyMCA0MEgzMEwyNSA1WiIvPgo8L3N2Zz4KPHR4dCB4PSIyMDAiIHk9IjI3MCIgZm9udC1mYW1pbHk9IkFyaWFsIiBmb250LXNpemU9IjE0IiBmaWxsPSIjNjM3MzgxIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIj5EYXB1ciBNb2Rlcm48L3R4dD4KPC9zdmc+',
      tags: ['modern', 'minimalis', 'island'],
      status: 'active',
      uploadDate: '2024-12-01',
      views: 245
    },
    {
      id: 'GAL-002',
      title: 'Kamar Tidur Scandinavian',
      description: 'Desain kamar tidur dengan konsep Scandinavian yang nyaman dan fungsional',
      category: 'bedroom',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjlmYWZiIi8+CjxyZWN0IHg9IjEwMCIgeT0iMTAwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Q5ZjNmZiIvPgo8cmVjdCB4PSIxMjAiIHk9IjgwIiB3aWR0aD0iMTYwIiBoZWlnaHQ9IjQwIiBmaWxsPSIjYmZkYmZlIi8+Cjx0eHQgeD0iMjAwIiB5PSIyNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzYzNzM4MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+S2FtYXIgU2NhbmRpbmF2aWFuPC90eHQ+Cjwvc3ZnPg==',
      tags: ['scandinavian', 'nyaman', 'natural'],
      status: 'active',
      uploadDate: '2024-12-02',
      views: 189
    },
    {
      id: 'GAL-003',
      title: 'Ruang Tamu Industrial',
      description: 'Konsep ruang tamu industrial dengan perpaduan material beton dan kayu',
      category: 'living-room',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjFmNWY5Ii8+CjxyZWN0IHg9IjgwIiB5PSIxMjAiIHdpZHRoPSIyNDAiIGhlaWdodD0iODAiIGZpbGw9IiM2Yjc0ODEiLz4KPHN2ZyB4PSIxNzUiIHk9IjE0NSIgd2lkdGg9IjUwIiBoZWlnaHQ9IjMwIiBmaWxsPSIjZjNmNGY2Ij4KICA8cmVjdCB3aWR0aD0iNTAiIGhlaWdodD0iMzAiIGZpbGw9IiNmM2Y0ZjYiLz4KPC9zdmc+Cjx0eHQgeD0iMjAwIiB5PSIyNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzYzNzM4MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+UnVhbmcgVGFtdSBJbmR1c3RyaWFsPC90eHQ+Cjwvc3ZnPg==',
      tags: ['industrial', 'beton', 'kayu'],
      status: 'active',
      uploadDate: '2024-12-03',
      views: 156
    },
    {
      id: 'GAL-004',
      title: 'Kamar Mandi Luxury',
      description: 'Desain kamar mandi mewah dengan bathtub dan shower terpisah',
      category: 'bathroom',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZmVmZWZlIi8+CjxlbGxpcHNlIGN4PSIyMDAiIGN5PSIxNTAiIHJ4PSIxMDAiIHJ5PSI0MCIgZmlsbD0iI2VkZjJmNyIvPgo8cmVjdCB4PSIzMDAiIHk9IjEwMCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjEwMCIgZmlsbD0iI2Q5ZjNmZiIvPgo8dHh0IHg9IjIwMCIgeT0iMjcwIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMTQiIGZpbGw9IiM2MzczODEiIHRleHQtYW5jaG9yPSJtaWRkbGUiPkthbWFyIE1hbmRpIEx1eHVyeTwvdHh0Pgo8L3N2Zz4=',
      tags: ['luxury', 'bathtub', 'modern'],
      status: 'active',
      uploadDate: '2024-12-04',
      views: 298
    },
    {
      id: 'GAL-005',
      title: 'Taman Indoor Minimalis',
      description: 'Konsep taman indoor dengan tanaman hias dan pencahayaan alami',
      category: 'garden',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjBmZGY0Ii8+CjxjaXJjbGUgY3g9IjE1MCIgY3k9IjE1MCIgcj0iMzAiIGZpbGw9IiMxNmE2NGEiLz4KPGNpcmNsZSBjeD0iMjUwIiBjeT0iMTMwIiByPSIyNSIgZmlsbD0iIzIyYzU1ZSIvPgo8Y2lyY2xlIGN4PSIyMDAiIGN5PSIxODAiIHI9IjIwIiBmaWxsPSIjMTVhZjRhIi8+Cjx0eHQgeD0iMjAwIiB5PSIyNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzYzNzM4MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+VGFtYW4gSW5kb29yPC90eHQ+Cjwvc3ZnPg==',
      tags: ['indoor', 'minimalis', 'natural'],
      status: 'inactive',
      uploadDate: '2024-12-05',
      views: 87
    },
    {
      id: 'GAL-006',
      title: 'Home Office Modern',
      description: 'Ruang kerja di rumah dengan desain modern dan ergonomis',
      category: 'office',
      imageUrl: 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZmFmYWZhIi8+CjxyZWN0IHg9IjEwMCIgeT0iMTIwIiB3aWR0aD0iMjAwIiBoZWlnaHQ9IjgwIiBmaWxsPSIjZTVlN2ViIi8+CjxyZWN0IHg9IjE0MCIgeT0iMTAwIiB3aWR0aD0iMTIwIiBoZWlnaHQ9IjIwIiBmaWxsPSIjMzc0MTUxIi8+Cjx0eHQgeD0iMjAwIiB5PSIyNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzYzNzM4MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+SG9tZSBPZmZpY2U8L3R4dD4KPC9zdmc+',
      tags: ['office', 'modern', 'ergonomis'],
      status: 'active',
      uploadDate: '2024-12-06',
      views: 134
    }
  ])

  const categories = [
    { value: 'kitchen', label: 'Dapur' },
    { value: 'bedroom', label: 'Kamar Tidur' },
    { value: 'living-room', label: 'Ruang Tamu' },
    { value: 'bathroom', label: 'Kamar Mandi' },
    { value: 'garden', label: 'Taman' },
    { value: 'office', label: 'Ruang Kerja' }
  ]

  const filteredItems = galleryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesCategory = filterCategory === 'all' || item.category === filterCategory
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const handleAdd = () => {
    if (!formData.title || !formData.description || !formData.category) {
      toast.error('Mohon lengkapi semua field yang wajib diisi')
      return
    }

    const imageUrl = selectedImage || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjMwMCIgdmlld0JveD0iMCAwIDQwMCAzMDAiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSI0MDAiIGhlaWdodD0iMzAwIiBmaWxsPSIjZjNmNGY2Ii8+CjxzdmcgeD0iMTc1IiB5PSIxMjUiIHdpZHRoPSI1MCIgaGVpZ2h0PSI1MCIgZmlsbD0iIzljYTNhZiI+CiAgPHBhdGggZD0iTTI1IDVMMjAgNDBIMzBMMjUgNVoiLz4KPC9zdmc+Cjx0eHQgeD0iMjAwIiB5PSIyNzAiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzYzNzM4MSIgdGV4dC1hbmNob3I9Im1pZGRsZSI+R2FtYmFyIEJhcnU8L3R4dD4KPC9zdmc+'

    const newItem: GalleryItem = {
      id: `GAL-${String(galleryItems.length + 1).padStart(3, '0')}`,
      title: formData.title,
      description: formData.description,
      category: formData.category,
      imageUrl,
      tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      status: formData.status,
      uploadDate: new Date().toISOString().split('T')[0],
      views: 0
    }

    setGalleryItems([...galleryItems, newItem])
    setFormData({ title: '', description: '', category: '', tags: '', status: 'active', imageFile: null })
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setIsAddDialogOpen(false)
    toast.success('Item galeri berhasil ditambahkan')
  }

  const handleEdit = (item: GalleryItem) => {
    setSelectedItem(item)
    setFormData({
      title: item.title,
      description: item.description,
      category: item.category,
      tags: item.tags.join(', '),
      status: item.status
    })
    setIsEditDialogOpen(true)
  }

  const handleUpdate = () => {
    if (!selectedItem || !formData.title || !formData.description || !formData.category) {
      toast.error('Mohon lengkapi semua field yang wajib diisi')
      return
    }

    const updatedItems = galleryItems.map(item => 
      item.id === selectedItem.id 
        ? {
            ...item,
            title: formData.title,
            description: formData.description,
            category: formData.category,
            tags: formData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
            status: formData.status
          }
        : item
    )

    setGalleryItems(updatedItems)
    setFormData({ title: '', description: '', category: '', tags: '', status: 'active', imageFile: null })
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setSelectedItem(null)
    setIsEditDialogOpen(false)
    toast.success('Item galeri berhasil diperbarui')
  }

  const handleDelete = (id: string) => {
    setGalleryItems(galleryItems.filter(item => item.id !== id))
    toast.success('Item galeri berhasil dihapus')
  }

  const handleView = (item: GalleryItem) => {
    // Update views count
    const updatedItems = galleryItems.map(galleryItem => 
      galleryItem.id === item.id 
        ? { ...galleryItem, views: galleryItem.views + 1 }
        : galleryItem
    )
    setGalleryItems(updatedItems)
    setSelectedItem(item)
    setIsViewDialogOpen(true)
  }

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Ukuran file terlalu besar. Maksimal 5MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
        setFormData({ ...formData, imageFile: file })
      }
      reader.readAsDataURL(file)
      toast.success('Gambar berhasil dipilih')
    }
  }

  const handleUploadClick = () => {
    setIsUploadDialogOpen(true)
  }

  const handleDirectImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        toast.error('Ukuran file terlalu besar. Maksimal 5MB')
        return
      }
      
      if (!file.type.startsWith('image/')) {
        toast.error('File harus berupa gambar')
        return
      }

      const reader = new FileReader()
      reader.onload = (e) => {
        setSelectedImage(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      toast.success('Gambar berhasil dipilih')
    }
  }

  const handleQuickUpload = () => {
    if (!selectedImage) {
      toast.error('Mohon pilih gambar terlebih dahulu')
      return
    }

    if (!uploadFormData.title || !uploadFormData.category) {
      toast.error('Mohon lengkapi judul dan kategori')
      return
    }

    const newItem: GalleryItem = {
      id: `GAL-${String(galleryItems.length + 1).padStart(3, '0')}`,
      title: uploadFormData.title,
      description: uploadFormData.description || 'Gambar galeri proyek',
      category: uploadFormData.category,
      imageUrl: selectedImage,
      tags: uploadFormData.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
      status: uploadFormData.status,
      uploadDate: new Date().toISOString().split('T')[0],
      views: 0
    }

    setGalleryItems([...galleryItems, newItem])
    setUploadFormData({ title: '', description: '', category: '', tags: '', status: 'active' })
    setSelectedImage(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    setIsUploadDialogOpen(false)
    toast.success('Gambar berhasil diupload ke galeri')
  }

  const removeSelectedImage = () => {
    setSelectedImage(null)
    setFormData({ ...formData, imageFile: null })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const getCategoryLabel = (category: string) => {
    const cat = categories.find(c => c.value === category)
    return cat ? cat.label : category
  }

  const getStatusColor = (status: string) => {
    return status === 'active' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate('/admin')} 
            variant="outline" 
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Manajemen Galeri</h1>
            <p className="text-muted-foreground">Kelola gambar dan konten galeri proyek</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={handleUploadClick}
            variant="outline"
          >
            <Upload className="h-4 w-4 mr-2" />
            Upload Gambar
          </Button>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Item
              </Button>
            </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>Tambah Item Galeri</DialogTitle>
              <DialogDescription>
                Tambahkan item baru ke galeri proyek
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleImageUpload}
                accept="image/*"
                className="hidden"
              />
              
              <div className="space-y-2">
                <Label>Upload Gambar</Label>
                <div className="flex flex-col gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleUploadClick}
                    className="w-full"
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    {selectedImage ? 'Ganti Gambar' : 'Pilih Gambar'}
                  </Button>
                  {selectedImage && (
                    <div className="relative">
                      <img
                        src={selectedImage}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded border"
                      />
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        onClick={removeSelectedImage}
                        className="absolute top-1 right-1"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Judul *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="Masukkan judul"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="description">Deskripsi *</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Masukkan deskripsi"
                  rows={3}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="category">Kategori *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.value} value={category.value}>
                        {category.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="tags">Tags</Label>
                <Input
                  id="tags"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="Pisahkan dengan koma"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">Aktif</SelectItem>
                    <SelectItem value="inactive">Tidak Aktif</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                Batal
              </Button>
              <Button onClick={handleAdd}>
                Tambah
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Cari berdasarkan judul, deskripsi, atau tags..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <Select value={filterCategory} onValueChange={setFilterCategory}>
                <SelectTrigger className="w-40">
                  <Filter className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Kategori</SelectItem>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Semua Status</SelectItem>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Gallery Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
          <Card key={item.id} className="overflow-hidden">
            <div className="aspect-video relative">
              <img 
                src={item.imageUrl} 
                alt={item.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-2 right-2">
                <Badge className={getStatusColor(item.status)}>
                  {item.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                </Badge>
              </div>
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex items-start justify-between">
                  <h3 className="font-semibold text-lg line-clamp-1">{item.title}</h3>
                  <Badge variant="outline" className="text-xs">
                    {getCategoryLabel(item.category)}
                  </Badge>
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  {item.description}
                </p>
                <div className="flex flex-wrap gap-1">
                  {item.tags.slice(0, 3).map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {item.tags.length > 3 && (
                    <Badge variant="secondary" className="text-xs">
                      +{item.tags.length - 3}
                    </Badge>
                  )}
                </div>
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{item.uploadDate}</span>
                  <span>{item.views} views</span>
                </div>
              </div>
              <div className="flex gap-2 mt-4">
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleView(item)}
                  className="flex-1"
                >
                  <Eye className="h-4 w-4 mr-1" />
                  Lihat
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleEdit(item)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => handleDelete(item.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <ImageIcon className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Tidak ada item ditemukan</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm || filterCategory !== 'all' || filterStatus !== 'all' 
                ? 'Coba ubah filter atau kata kunci pencarian'
                : 'Belum ada item galeri. Tambahkan item pertama Anda!'}
            </p>
            {!searchTerm && filterCategory === 'all' && filterStatus === 'all' && (
              <Button onClick={() => setIsAddDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Tambah Item Pertama
              </Button>
            )}
          </CardContent>
        </Card>
      )}

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Edit Item Galeri</DialogTitle>
            <DialogDescription>
              Perbarui informasi item galeri
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Judul *</Label>
              <Input
                id="edit-title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Masukkan judul"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Deskripsi *</Label>
              <Textarea
                id="edit-description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Masukkan deskripsi"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-category">Kategori *</Label>
              <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-tags">Tags</Label>
              <Input
                id="edit-tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder="Pisahkan dengan koma"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Status</Label>
              <Select value={formData.status} onValueChange={(value: 'active' | 'inactive') => setFormData({ ...formData, status: value })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="active">Aktif</SelectItem>
                  <SelectItem value="inactive">Tidak Aktif</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Batal
            </Button>
            <Button onClick={handleUpdate}>
              Perbarui
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Upload Dialog */}
      <Dialog open={isUploadDialogOpen} onOpenChange={setIsUploadDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Upload Gambar</DialogTitle>
            <DialogDescription>
              Upload gambar baru ke galeri proyek
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleDirectImageUpload}
              accept="image/*"
              className="hidden"
            />
            
            <div className="space-y-2">
              <Label>Pilih Gambar *</Label>
              <div className="flex flex-col gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full"
                >
                  <Upload className="h-4 w-4 mr-2" />
                  {selectedImage ? 'Ganti Gambar' : 'Pilih Gambar'}
                </Button>
                {selectedImage && (
                  <div className="relative">
                    <img
                      src={selectedImage}
                      alt="Preview"
                      className="w-full h-32 object-cover rounded border"
                    />
                    <Button
                      type="button"
                      variant="destructive"
                      size="sm"
                      onClick={removeSelectedImage}
                      className="absolute top-1 right-1"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="upload-title">Judul *</Label>
              <Input
                id="upload-title"
                value={uploadFormData.title}
                onChange={(e) => setUploadFormData({ ...uploadFormData, title: e.target.value })}
                placeholder="Masukkan judul gambar"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="upload-category">Kategori *</Label>
              <Select value={uploadFormData.category} onValueChange={(value) => setUploadFormData({ ...uploadFormData, category: value })}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.value} value={category.value}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="upload-description">Deskripsi</Label>
              <Textarea
                id="upload-description"
                value={uploadFormData.description}
                onChange={(e) => setUploadFormData({ ...uploadFormData, description: e.target.value })}
                placeholder="Deskripsi gambar (opsional)"
                rows={2}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="upload-tags">Tags</Label>
              <Input
                id="upload-tags"
                value={uploadFormData.tags}
                onChange={(e) => setUploadFormData({ ...uploadFormData, tags: e.target.value })}
                placeholder="Pisahkan dengan koma"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsUploadDialogOpen(false)
              setSelectedImage(null)
              setUploadFormData({ title: '', description: '', category: '', tags: '', status: 'active' })
              if (fileInputRef.current) {
                fileInputRef.current.value = ''
              }
            }}>
              Batal
            </Button>
            <Button onClick={handleQuickUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Upload
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Detail Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Item Galeri</DialogTitle>
            <DialogDescription>
              Informasi lengkap item galeri
            </DialogDescription>
          </DialogHeader>
          {selectedItem && (
            <div className="space-y-4">
              <div className="aspect-video relative rounded-lg overflow-hidden">
                <img 
                  src={selectedItem.imageUrl} 
                  alt={selectedItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 right-2">
                  <Badge className={getStatusColor(selectedItem.status)}>
                    {selectedItem.status === 'active' ? 'Aktif' : 'Tidak Aktif'}
                  </Badge>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">ID</Label>
                  <p className="text-sm">{selectedItem.id}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Kategori</Label>
                  <p className="text-sm">{getCategoryLabel(selectedItem.category)}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Tanggal Upload</Label>
                  <p className="text-sm">{selectedItem.uploadDate}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-muted-foreground">Views</Label>
                  <p className="text-sm">{selectedItem.views} kali dilihat</p>
                </div>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Judul</Label>
                <p className="text-sm font-semibold">{selectedItem.title}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Deskripsi</Label>
                <p className="text-sm">{selectedItem.description}</p>
              </div>
              
              <div>
                <Label className="text-sm font-medium text-muted-foreground">Tags</Label>
                <div className="flex flex-wrap gap-1 mt-1">
                  {selectedItem.tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Tutup
            </Button>
            <Button onClick={() => {
              setIsViewDialogOpen(false)
              if (selectedItem) {
                handleEdit(selectedItem)
              }
            }}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Item
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AdminGallery