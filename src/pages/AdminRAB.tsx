import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Badge } from '@/components/ui/badge';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, Search, Filter, Edit, Trash2, Download, Upload, ChevronLeft, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface RABItem {
  id: string;
  kategori: string;
  namaItem: string;
  satuan: string;
  hargaSatuan: number;
  tanggalUpdate: string;
}

const AdminRAB = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  // State management
  const [items, setItems] = useState<RABItem[]>([]);
  const [filteredItems, setFilteredItems] = useState<RABItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedKategori, setSelectedKategori] = useState('semua');
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<RABItem | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Form state
  const [formData, setFormData] = useState({
    kategori: '',
    namaItem: '',
    satuan: '',
    hargaSatuan: ''
  });
  
  // Categories
  const kategoriOptions = [
    'Pekerjaan Persiapan',
    'Pekerjaan Struktur', 
    'Pekerjaan Arsitektur',
    'Mekanikal & Elektrikal',
    'Pekerjaan Finishing'
  ];
  
  // Dummy data
  const dummyData: RABItem[] = [
    {
      id: '1',
      kategori: 'Pekerjaan Persiapan',
      namaItem: 'Pembersihan Lahan',
      satuan: 'm²',
      hargaSatuan: 15000,
      tanggalUpdate: '2024-01-15'
    },
    {
      id: '2',
      kategori: 'Pekerjaan Struktur',
      namaItem: 'Pondasi Batu Kali',
      satuan: 'm³',
      hargaSatuan: 850000,
      tanggalUpdate: '2024-01-14'
    },
    {
      id: '3',
      kategori: 'Pekerjaan Arsitektur',
      namaItem: 'Dinding Bata Merah',
      satuan: 'm²',
      hargaSatuan: 125000,
      tanggalUpdate: '2024-01-13'
    },
    {
      id: '4',
      kategori: 'Mekanikal & Elektrikal',
      namaItem: 'Instalasi Listrik',
      satuan: 'titik',
      hargaSatuan: 75000,
      tanggalUpdate: '2024-01-12'
    },
    {
      id: '5',
      kategori: 'Pekerjaan Finishing',
      namaItem: 'Cat Dinding Interior',
      satuan: 'm²',
      hargaSatuan: 35000,
      tanggalUpdate: '2024-01-11'
    },
    {
      id: '6',
      kategori: 'Pekerjaan Struktur',
      namaItem: 'Sloof Beton Bertulang',
      satuan: 'm',
      hargaSatuan: 450000,
      tanggalUpdate: '2024-01-10'
    },
    {
      id: '7',
      kategori: 'Pekerjaan Arsitektur',
      namaItem: 'Plester Dinding',
      satuan: 'm²',
      hargaSatuan: 45000,
      tanggalUpdate: '2024-01-09'
    },
    {
      id: '8',
      kategori: 'Pekerjaan Finishing',
      namaItem: 'Keramik Lantai 40x40',
      satuan: 'm²',
      hargaSatuan: 85000,
      tanggalUpdate: '2024-01-08'
    },
    {
      id: '9',
      kategori: 'Mekanikal & Elektrikal',
      namaItem: 'Instalasi Air Bersih',
      satuan: 'titik',
      hargaSatuan: 125000,
      tanggalUpdate: '2024-01-07'
    },
    {
      id: '10',
      kategori: 'Pekerjaan Persiapan',
      namaItem: 'Pengukuran & Bouwplank',
      satuan: 'm',
      hargaSatuan: 25000,
      tanggalUpdate: '2024-01-06'
    },
    {
      id: '11',
      kategori: 'Pekerjaan Struktur',
      namaItem: 'Kolom Beton Bertulang',
      satuan: 'unit',
      hargaSatuan: 1250000,
      tanggalUpdate: '2024-01-05'
    },
    {
      id: '12',
      kategori: 'Pekerjaan Finishing',
      namaItem: 'Pintu Kayu Jati',
      satuan: 'unit',
      hargaSatuan: 2500000,
      tanggalUpdate: '2024-01-04'
    }
  ];
  
  // Initialize data
  useEffect(() => {
    setItems(dummyData);
    setFilteredItems(dummyData);
  }, []);
  
  // Filter and search effect
  useEffect(() => {
    let filtered = items;
    
    // Filter by category
    if (selectedKategori !== 'semua') {
      filtered = filtered.filter(item => item.kategori === selectedKategori);
    }
    
    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item => 
        item.namaItem.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredItems(filtered);
    setCurrentPage(1); // Reset to first page when filtering
  }, [items, selectedKategori, searchTerm]);
  
  // Pagination
  const totalPages = Math.ceil(filteredItems.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredItems.slice(startIndex, endIndex);
  
  // Form handlers
  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };
  
  const resetForm = () => {
    setFormData({
      kategori: '',
      namaItem: '',
      satuan: '',
      hargaSatuan: ''
    });
    setEditingItem(null);
  };
  
  const handleSubmit = () => {
    // Validation
    if (!formData.kategori || !formData.namaItem || !formData.satuan || !formData.hargaSatuan) {
      toast({
        title: "Error",
        description: "Semua field harus diisi",
        variant: "destructive"
      });
      return;
    }
    
    const harga = parseFloat(formData.hargaSatuan);
    if (isNaN(harga) || harga <= 0) {
      toast({
        title: "Error",
        description: "Harga satuan harus berupa angka yang valid",
        variant: "destructive"
      });
      return;
    }
    
    if (editingItem) {
      // Update existing item
      const updatedItems = items.map(item => 
        item.id === editingItem.id 
          ? {
              ...item,
              kategori: formData.kategori,
              namaItem: formData.namaItem,
              satuan: formData.satuan,
              hargaSatuan: harga,
              tanggalUpdate: new Date().toISOString().split('T')[0]
            }
          : item
      );
      setItems(updatedItems);
      toast({
        title: "Berhasil",
        description: "Item berhasil diperbarui"
      });
    } else {
      // Add new item
      const newItem: RABItem = {
        id: Date.now().toString(),
        kategori: formData.kategori,
        namaItem: formData.namaItem,
        satuan: formData.satuan,
        hargaSatuan: harga,
        tanggalUpdate: new Date().toISOString().split('T')[0]
      };
      setItems(prev => [newItem, ...prev]);
      toast({
        title: "Berhasil",
        description: "Item berhasil ditambahkan"
      });
    }
    
    resetForm();
    setIsDialogOpen(false);
  };
  
  const handleEdit = (item: RABItem) => {
    setEditingItem(item);
    setFormData({
      kategori: item.kategori,
      namaItem: item.namaItem,
      satuan: item.satuan,
      hargaSatuan: item.hargaSatuan.toString()
    });
    setIsDialogOpen(true);
  };
  
  const handleDelete = (id: string) => {
    setItems(prev => prev.filter(item => item.id !== id));
    toast({
      title: "Berhasil",
      description: "Item berhasil dihapus"
    });
  };
  
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };
  
  // Import/Export functions
  const handleExportCSV = () => {
    const headers = ['Kategori', 'Nama Item', 'Satuan', 'Harga Satuan', 'Tanggal Update'];
    const csvContent = [
      headers.join(','),
      ...filteredItems.map(item => [
        `"${item.kategori}"`,
        `"${item.namaItem}"`,
        `"${item.satuan}"`,
        item.hargaSatuan,
        item.tanggalUpdate
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `data-rab-${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast({
      title: "Berhasil",
      description: "Data RAB berhasil diekspor ke CSV"
    });
  };
  
  const handleImportCSV = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const csv = e.target?.result as string;
        const lines = csv.split('\n');
        const headers = lines[0].split(',');
        
        // Validate headers
        const expectedHeaders = ['Kategori', 'Nama Item', 'Satuan', 'Harga Satuan', 'Tanggal Update'];
        const isValidFormat = expectedHeaders.every(header => 
          headers.some(h => h.replace(/"/g, '').trim() === header)
        );
        
        if (!isValidFormat) {
          toast({
            title: "Error",
            description: "Format CSV tidak valid. Pastikan header sesuai dengan format yang benar.",
            variant: "destructive"
          });
          return;
        }
        
        const newItems: RABItem[] = [];
        
        for (let i = 1; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;
          
          const values = line.split(',').map(v => v.replace(/"/g, '').trim());
          
          if (values.length >= 5) {
            const harga = parseFloat(values[3]);
            if (isNaN(harga)) continue;
            
            newItems.push({
              id: Date.now().toString() + i,
              kategori: values[0],
              namaItem: values[1],
              satuan: values[2],
              hargaSatuan: harga,
              tanggalUpdate: values[4] || new Date().toISOString().split('T')[0]
            });
          }
        }
        
        if (newItems.length > 0) {
          setItems(prev => [...newItems, ...prev]);
          toast({
            title: "Berhasil",
            description: `${newItems.length} item berhasil diimpor dari CSV`
          });
        } else {
          toast({
            title: "Warning",
            description: "Tidak ada data valid yang dapat diimpor",
            variant: "destructive"
          });
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "Gagal membaca file CSV. Pastikan format file benar.",
          variant: "destructive"
        });
      }
    };
    
    reader.readAsText(file);
    // Reset input
    event.target.value = '';
  };
  
  const getCategoryColor = (kategori: string) => {
    const colors: { [key: string]: string } = {
      'Pekerjaan Persiapan': 'bg-blue-100 text-blue-800',
      'Pekerjaan Struktur': 'bg-green-100 text-green-800',
      'Pekerjaan Arsitektur': 'bg-purple-100 text-purple-800',
      'Mekanikal & Elektrikal': 'bg-orange-100 text-orange-800',
      'Pekerjaan Finishing': 'bg-pink-100 text-pink-800'
    };
    return colors[kategori] || 'bg-gray-100 text-gray-800';
  };
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <Button 
          variant="ghost" 
          size="sm" 
          onClick={() => navigate('/admin')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali
        </Button>
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Admin RAB</h1>
          <p className="text-gray-600">Kelola data harga material dan pekerjaan</p>
        </div>
      </div>
      
      {/* Controls */}
      <Card>
        <CardHeader>
          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
            <div>
              <CardTitle>Dashboard Data Harga</CardTitle>
              <CardDescription>Kelola semua item material dan pekerjaan</CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleImportCSV}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  id="csv-import"
                />
                <Button variant="outline" size="sm" asChild>
                  <label htmlFor="csv-import" className="cursor-pointer">
                    <Upload className="h-4 w-4 mr-2" />
                    Import CSV
                  </label>
                </Button>
              </div>
              <Button variant="outline" size="sm" onClick={handleExportCSV}>
                <Download className="h-4 w-4 mr-2" />
                Export CSV
              </Button>
              <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <DialogTrigger asChild>
                  <Button onClick={resetForm}>
                    <Plus className="h-4 w-4 mr-2" />
                    Tambah Item
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[500px]">
                  <DialogHeader>
                    <DialogTitle>
                      {editingItem ? 'Edit Item RAB' : 'Tambah Item RAB'}
                    </DialogTitle>
                    <DialogDescription>
                      {editingItem ? 'Perbarui informasi item RAB' : 'Tambahkan item material atau pekerjaan baru'}
                    </DialogDescription>
                  </DialogHeader>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="kategori">Kategori</Label>
                      <Select value={formData.kategori} onValueChange={(value) => handleInputChange('kategori', value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Pilih kategori" />
                        </SelectTrigger>
                        <SelectContent>
                          {kategoriOptions.map((kategori) => (
                            <SelectItem key={kategori} value={kategori}>
                              {kategori}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="namaItem">Nama Item</Label>
                      <Input
                        id="namaItem"
                        value={formData.namaItem}
                        onChange={(e) => handleInputChange('namaItem', e.target.value)}
                        placeholder="Masukkan nama item"
                      />
                    </div>
                    <div>
                      <Label htmlFor="satuan">Satuan</Label>
                      <Input
                        id="satuan"
                        value={formData.satuan}
                        onChange={(e) => handleInputChange('satuan', e.target.value)}
                        placeholder="m², m³, unit, titik, dll"
                      />
                    </div>
                    <div>
                      <Label htmlFor="hargaSatuan">Harga Satuan (Rp)</Label>
                      <Input
                        id="hargaSatuan"
                        type="number"
                        value={formData.hargaSatuan}
                        onChange={(e) => handleInputChange('hargaSatuan', e.target.value)}
                        placeholder="Masukkan harga satuan"
                      />
                    </div>
                    <div className="flex gap-2 pt-4">
                      <Button onClick={handleSubmit} className="flex-1">
                        {editingItem ? 'Update' : 'Simpan'}
                      </Button>
                      <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                        Batal
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {/* Search and Filter */}
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Cari nama item..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-gray-400" />
              <Select value={selectedKategori} onValueChange={setSelectedKategori}>
                <SelectTrigger className="w-[200px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="semua">Semua Kategori</SelectItem>
                  {kategoriOptions.map((kategori) => (
                    <SelectItem key={kategori} value={kategori}>
                      {kategori}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          {/* Table */}
          <div className="border rounded-lg overflow-hidden">
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Kategori</TableHead>
                    <TableHead>Nama Item</TableHead>
                    <TableHead>Satuan</TableHead>
                    <TableHead>Harga Satuan</TableHead>
                    <TableHead>Tanggal Update</TableHead>
                    <TableHead className="text-center">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentItems.length > 0 ? (
                    currentItems.map((item) => (
                      <TableRow key={item.id}>
                        <TableCell>
                          <Badge className={getCategoryColor(item.kategori)}>
                            {item.kategori}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{item.namaItem}</TableCell>
                        <TableCell>{item.satuan}</TableCell>
                        <TableCell className="font-semibold">{formatCurrency(item.hargaSatuan)}</TableCell>
                        <TableCell>{new Date(item.tanggalUpdate).toLocaleDateString('id-ID')}</TableCell>
                        <TableCell>
                          <div className="flex gap-2 justify-center">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEdit(item)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="outline" size="sm">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>Hapus Item</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Apakah Anda yakin ingin menghapus item "{item.namaItem}"? 
                                    Tindakan ini tidak dapat dibatalkan.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Batal</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDelete(item.id)}>
                                    Hapus
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                        {searchTerm || selectedKategori !== 'semua' 
                          ? 'Tidak ada item yang sesuai dengan filter'
                          : 'Belum ada data item RAB'
                        }
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </div>
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-6">
              <div className="text-sm text-gray-500">
                Menampilkan {startIndex + 1}-{Math.min(endIndex, filteredItems.length)} dari {filteredItems.length} item
              </div>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm font-medium">
                  {currentPage} / {totalPages}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminRAB;