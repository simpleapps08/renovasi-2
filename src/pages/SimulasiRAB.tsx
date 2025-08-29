import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/enhanced-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { Calculator, Download, Save, ArrowLeft } from 'lucide-react'
import { toast } from 'sonner'
import { useNavigate } from 'react-router-dom'

interface RABItem {
  id: string
  kategori: string
  subKategori?: string
  item: string
  satuan: string
  volume: number
  hargaSatuan: number
  total: number
}

const SimulasiRAB = () => {
  const navigate = useNavigate()
  const [projectName, setProjectName] = useState('')
  const [projectType, setProjectType] = useState('')
  const [projectArea, setProjectArea] = useState('')
  const [description, setDescription] = useState('')
  const [rabItems, setRabItems] = useState<RABItem[]>([
    {
      id: '1',
      kategori: 'Pekerjaan Persiapan',
      subKategori: 'Pembersihan Lahan',
      item: 'Pembersihan Lahan',
      satuan: 'm²',
      volume: 100,
      hargaSatuan: 15000,
      total: 1500000
    },
    {
      id: '2',
      kategori: 'Pekerjaan Struktur',
      subKategori: 'Pondasi',
      item: 'Pondasi Batu Kali',
      satuan: 'm²',
      volume: 50,
      hargaSatuan: 350000,
      total: 17500000
    }
  ])
  const [newItem, setNewItem] = useState({
    kategori: '',
    subKategori: '',
    item: '',
    satuan: '',
    volume: 0,
    hargaSatuan: 0
  })

  const kategoriOptions = [
    'Pekerjaan Persiapan',
    'Pekerjaan Struktur', 
    'Pekerjaan Arsitektur',
    'Pekerjaan Mekanikal & Elektrikal (M/E)',
    'Pekerjaan Finishing'
  ]

  const subKategoriOptions = {
    'Pekerjaan Persiapan': [
      'Pembersihan Lahan',
      'Pengukuran & Bouwplank',
      'Direksi Keet & Gudang'
    ],
    'Pekerjaan Struktur': [
      'Pondasi',
      'Sloof',
      'Kolom',
      'Balok & Plat Lantai'
    ],
    'Pekerjaan Arsitektur': [
      'Dinding Bata/Panel',
      'Plester & Acian',
      'Lantai (Keramik/Granit/Vinyl)',
      'Atap (Rangka + Penutup)',
      'Pintu & Jendela'
    ],
    'Pekerjaan Mekanikal & Elektrikal (M/E)': [
      'Instalasi Listrik',
      'Instalasi Air Bersih',
      'Instalasi Air Kotor/Drainase'
    ],
    'Pekerjaan Finishing': [
      'Cat Dinding',
      'Plafon (Gypsum/PVC)',
      'Sanitair (WC, wastafel, shower)',
      'Pagar/Taman'
    ]
  }

  const satuanOptions = {
    'Pembersihan Lahan': 'm²',
    'Pengukuran & Bouwplank': 'm',
    'Direksi Keet & Gudang': 'unit',
    'Pondasi': 'm²',
    'Sloof': 'm',
    'Kolom': 'unit',
    'Balok & Plat Lantai': 'm²',
    'Dinding Bata/Panel': 'm²',
    'Plester & Acian': 'm²',
    'Lantai (Keramik/Granit/Vinyl)': 'm²',
    'Atap (Rangka + Penutup)': 'm²',
    'Pintu & Jendela': 'unit',
    'Instalasi Listrik': 'titik',
    'Instalasi Air Bersih': 'titik',
    'Instalasi Air Kotor/Drainase': 'titik',
    'Cat Dinding': 'm²',
    'Plafon (Gypsum/PVC)': 'm²',
    'Sanitair (WC, wastafel, shower)': 'unit',
    'Pagar/Taman': 'm²'
  }

  const addRABItem = () => {
    if (!newItem.kategori || !newItem.subKategori || !newItem.item || !newItem.satuan || newItem.volume <= 0 || newItem.hargaSatuan <= 0) {
      toast.error('Mohon lengkapi semua field item RAB')
      return
    }

    const item: RABItem = {
      id: Date.now().toString(),
      ...newItem,
      total: newItem.volume * newItem.hargaSatuan
    }

    setRabItems([...rabItems, item])
    setNewItem({
      kategori: '',
      subKategori: '',
      item: '',
      satuan: '',
      volume: 0,
      hargaSatuan: 0
    })
    toast.success('Item RAB berhasil ditambahkan')
  }

  const removeRABItem = (id: string) => {
    setRabItems(rabItems.filter(item => item.id !== id))
    toast.success('Item RAB berhasil dihapus')
  }

  const totalRAB = rabItems.reduce((sum, item) => sum + item.total, 0)
  const overhead = totalRAB * 0.1 // 10% overhead
  const profit = totalRAB * 0.15 // 15% profit
  const grandTotal = totalRAB + overhead + profit

  const saveRAB = () => {
    if (!projectName || !projectType || rabItems.length === 0) {
      toast.error('Mohon lengkapi data proyek dan minimal 1 item RAB')
      return
    }

    // Simulate saving to database
    const rabData = {
      projectName,
      projectType,
      projectArea,
      description,
      items: rabItems,
      totalRAB,
      overhead,
      profit,
      grandTotal,
      createdAt: new Date().toISOString()
    }

    console.log('Saving RAB:', rabData)
    toast.success('RAB berhasil disimpan')
  }

  const exportToPDF = () => {
    toast.info('Fitur export PDF akan segera tersedia')
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button 
            onClick={() => navigate('/dashboard')} 
            variant="outline" 
            size="sm"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Kembali
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Simulasi RAB (Rencana Anggaran Biaya)</h1>
            <p className="text-muted-foreground">Hitung estimasi biaya renovasi dengan struktur RAB yang detail dan akurat</p>
          </div>
        </div>
        <div className="flex gap-2">
          <Button onClick={saveRAB} variant="outline">
            <Save className="h-4 w-4 mr-2" />
            Simpan RAB
          </Button>
          <Button onClick={exportToPDF}>
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>
      </div>



      {/* Project Information */}
      <Card>
        <CardHeader>
          <CardTitle>Informasi Proyek</CardTitle>
          <CardDescription>Masukkan detail proyek renovasi</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="projectName">Nama Proyek</Label>
              <Input
                id="projectName"
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                placeholder="Contoh: Renovasi Rumah Pak Agus"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectType">Jenis Proyek</Label>
              <Select value={projectType} onValueChange={setProjectType}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jenis proyek" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="renovasi-rumah">Renovasi Rumah</SelectItem>
                  <SelectItem value="pembangunan-baru">Pembangunan Baru</SelectItem>
                  <SelectItem value="renovasi-kantor">Renovasi Kantor</SelectItem>
                  <SelectItem value="renovasi-toko">Renovasi Toko</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="projectArea">Luas Area (m²)</Label>
              <Input
                id="projectArea"
                type="number"
                value={projectArea}
                onChange={(e) => setProjectArea(e.target.value)}
                placeholder="Contoh: 120"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Deskripsi Proyek</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Jelaskan detail pekerjaan yang akan dilakukan..."
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Add RAB Item */}
      <Card>
        <CardHeader>
          <CardTitle>Tambah Item RAB</CardTitle>
          <CardDescription>Masukkan detail pekerjaan dan biaya</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4">
            <div className="space-y-2">
              <Label>Kategori</Label>
              <Select 
                value={newItem.kategori} 
                onValueChange={(value) => setNewItem({...newItem, kategori: value, subKategori: '', satuan: ''})}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih kategori" />
                </SelectTrigger>
                <SelectContent>
                  {kategoriOptions.map((kategori) => (
                    <SelectItem key={kategori} value={kategori}>{kategori}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Sub-Kategori</Label>
              <Select 
                value={newItem.subKategori} 
                onValueChange={(value) => {
                  const satuan = satuanOptions[value] || ''
                  setNewItem({...newItem, subKategori: value, satuan, item: value})
                }}
                disabled={!newItem.kategori}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Pilih sub-kategori" />
                </SelectTrigger>
                <SelectContent>
                  {newItem.kategori && subKategoriOptions[newItem.kategori]?.map((subKategori) => (
                    <SelectItem key={subKategori} value={subKategori}>{subKategori}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Item Pekerjaan</Label>
              <Input
                value={newItem.item}
                onChange={(e) => setNewItem({...newItem, item: e.target.value})}
                placeholder="Contoh: Pasang keramik"
              />
            </div>
            <div className="space-y-2">
              <Label>Satuan</Label>
              <Input
                value={newItem.satuan}
                onChange={(e) => setNewItem({...newItem, satuan: e.target.value})}
                placeholder="Contoh: m², unit, ls"
                readOnly
              />
            </div>
            <div className="space-y-2">
              <Label>Volume</Label>
              <Input
                type="number"
                value={newItem.volume}
                onChange={(e) => setNewItem({...newItem, volume: parseFloat(e.target.value) || 0})}
                placeholder="0"
              />
            </div>
            <div className="space-y-2">
              <Label>Harga Satuan (Rp)</Label>
              <Input
                type="number"
                value={newItem.hargaSatuan}
                onChange={(e) => setNewItem({...newItem, hargaSatuan: parseFloat(e.target.value) || 0})}
                placeholder="0"
              />
            </div>
          </div>
          <Button onClick={addRABItem} className="w-full md:w-auto">
            <Calculator className="h-4 w-4 mr-2" />
            Tambah Item
          </Button>
        </CardContent>
      </Card>

      {/* RAB Items List */}
      {rabItems.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Daftar Item RAB</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2 text-left">No</th>
                    <th className="border border-gray-300 p-2 text-left">Kategori</th>
                    <th className="border border-gray-300 p-2 text-left">Sub-Kategori</th>
                    <th className="border border-gray-300 p-2 text-left">Item Pekerjaan</th>
                    <th className="border border-gray-300 p-2 text-left">Satuan</th>
                    <th className="border border-gray-300 p-2 text-right">Volume</th>
                    <th className="border border-gray-300 p-2 text-right">Harga Satuan</th>
                    <th className="border border-gray-300 p-2 text-right">Total</th>
                    <th className="border border-gray-300 p-2 text-center">Aksi</th>
                  </tr>
                </thead>
                <tbody>
                  {rabItems.map((item, index) => (
                    <tr key={item.id}>
                      <td className="border border-gray-300 p-2">{index + 1}</td>
                      <td className="border border-gray-300 p-2">{item.kategori}</td>
                      <td className="border border-gray-300 p-2">{item.subKategori}</td>
                      <td className="border border-gray-300 p-2">{item.item}</td>
                      <td className="border border-gray-300 p-2">{item.satuan}</td>
                      <td className="border border-gray-300 p-2 text-right">{item.volume}</td>
                      <td className="border border-gray-300 p-2 text-right">Rp {item.hargaSatuan.toLocaleString('id-ID')}</td>
                      <td className="border border-gray-300 p-2 text-right">Rp {item.total.toLocaleString('id-ID')}</td>
                      <td className="border border-gray-300 p-2 text-center">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeRABItem(item.id)}
                        >
                          Hapus
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="mt-6 space-y-2 max-w-md ml-auto">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>Rp {totalRAB.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Overhead (10%):</span>
                <span>Rp {overhead.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between">
                <span>Profit (15%):</span>
                <span>Rp {profit.toLocaleString('id-ID')}</span>
              </div>
              <div className="flex justify-between font-bold text-lg border-t pt-2">
                <span>Total RAB:</span>
                <span>Rp {grandTotal.toLocaleString('id-ID')}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default SimulasiRAB