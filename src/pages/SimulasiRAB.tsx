import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { toast } from '@/hooks/use-toast'
import { useIsMobile } from '@/hooks/use-mobile'
import { Download, Save, ArrowLeft, Calculator, Info, HelpCircle, Trash2, Plus } from 'lucide-react'

interface RABItem {
  id: string
  item: string
  kategori: string
  subKategori: string
  satuan: string
  volume: number
  hargaSatuan: number
  jumlah: number
}

interface Material {
  id: string
  nama: string
  kategori: string
  satuan: string
  harga: number
  supplier?: string
  deskripsi?: string
  status: 'aktif' | 'nonaktif'
}

interface Upah {
  id: string
  jenis_pekerjaan: string
  kategori: string
  satuan: string
  upah_per_satuan: number
  tingkat_keahlian: 'pemula' | 'menengah' | 'ahli' | 'master'
  lokasi?: string
  deskripsi?: string
  status: 'aktif' | 'nonaktif'
}

const SimulasiRAB = () => {
  const navigate = useNavigate()
  const isMobile = useIsMobile()
  
  // State variables
  const [projectName, setProjectName] = useState('')
  const [projectType, setProjectType] = useState('')
  const [projectArea, setProjectArea] = useState('')
  const [description, setDescription] = useState('')
  const [rabItems, setRabItems] = useState<RABItem[]>([
    {
      id: '1',
      item: 'Pekerjaan Pondasi Batu Kali',
      kategori: 'Struktur',
      subKategori: 'Pondasi',
      satuan: 'm³',
      volume: 15,
      hargaSatuan: 850000,
      jumlah: 12750000
    }
  ])
  
  const [newItem, setNewItem] = useState({
    item: '',
    kategori: '',
    subKategori: '',
    satuan: '',
    volume: 0,
    hargaSatuan: 0
  })

  // State untuk menampilkan breakdown harga
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false)

  // Auto-fill harga satuan ketika sub kategori berubah
  useEffect(() => {
    if (newItem.subKategori) {
      const autoPrice = getAutoPrice(newItem.subKategori)
      setNewItem(prev => ({ ...prev, hargaSatuan: autoPrice }))
    }
  }, [newItem.subKategori])

  // Function untuk mendapatkan breakdown harga
  const getPriceBreakdown = (subKategori: string) => {
    const breakdown = { materials: [], labor: [], total: 0 }
    
    // Contoh breakdown untuk beberapa sub kategori
    switch (subKategori) {
      case 'Pasangan bata merah (m²)':
        const bataM = getMaterialByName('Bata Merah')
        const semenBata = getMaterialByName('Semen')
        const upahBataM = getUpahByJenis('Tukang Batu')
        breakdown.materials = [
          { nama: 'Bata Merah', qty: '70 buah', harga: bataM?.harga || 800, subtotal: (bataM?.harga || 800) * 70 },
          { nama: 'Semen', qty: '0.2 sak', harga: semenBata?.harga || 65000, subtotal: (semenBata?.harga || 65000) * 0.2 }
        ]
        breakdown.labor = [
          { jenis: 'Tukang Batu', qty: '0.3 hari', upah: upahBataM?.upah_per_satuan || 150000, subtotal: (upahBataM?.upah_per_satuan || 150000) * 0.3 }
        ]
        break
      case 'Atap genteng beton (m²)':
        const gentengB = getMaterialByName('Genteng Beton')
        const upahGenteng = getUpahByJenis('Tukang Genteng')
        breakdown.materials = [
          { nama: 'Genteng Beton', qty: '25 buah', harga: gentengB?.harga || 8500, subtotal: (gentengB?.harga || 8500) * 25 }
        ]
        breakdown.labor = [
          { jenis: 'Tukang Genteng', qty: '1 hari', upah: upahGenteng?.upah_per_satuan || 35000, subtotal: upahGenteng?.upah_per_satuan || 35000 }
        ]
        break
      case 'Atap spandek (m²)':
        const spandek = getMaterialByName('Spandek')
        const upahSpandek = getUpahByJenis('Tukang')
        breakdown.materials = [
          { nama: 'Spandek', qty: '1 lembar', harga: spandek?.harga || 85000, subtotal: spandek?.harga || 85000 }
        ]
        breakdown.labor = [
          { jenis: 'Tukang', qty: '0.1 hari', upah: upahSpandek?.upah_per_satuan || 150000, subtotal: (upahSpandek?.upah_per_satuan || 150000) * 0.1 }
        ]
        break
    }
    
    breakdown.total = [...breakdown.materials, ...breakdown.labor].reduce((sum, item) => sum + item.subtotal, 0)
    return breakdown
  }

  // Category options
  const kategoriOptions = [
    'Pekerjaan Persiapan',
    'Pekerjaan Tanah', 
    'Pekerjaan Pondasi & Struktur',
    'Pekerjaan Dinding',
    'Pekerjaan Lantai',
    'Pekerjaan Atap',
    'Pekerjaan Pintu & Jendela',
    'Pekerjaan Finishing',
    'Pekerjaan Mekanikal, Elektrikal, & Plumbing (MEP)',
    'Pekerjaan Eksterior & Outdoor',
    'Pekerjaan Tambahan (Opsional)'
  ]

  const subKategoriOptions: { [key: string]: string[] } = {
    'Pekerjaan Persiapan': [
      'Pembersihan lahan (m²)',
      'Pengukuran & pemasangan bowplank (m¹)',
      'Pengadaan dan bongkar pasang direksi keet/pos sementara (unit)',
      'Pagar pengaman sementara (m¹)'
    ],
    'Pekerjaan Tanah': [
      'Galian pondasi (m³)',
      'Urugan pasir (m³)',
      'Urugan tanah kembali (m³)',
      'Pemadatan lantai kerja (m²)'
    ],
    'Pekerjaan Pondasi & Struktur': [
      'Pasangan batu kali pondasi (m³)',
      'Lantai kerja (m²)',
      'Beton bertulang sloof (m³)',
      'Beton kolom praktis (m³)',
      'Beton balok & pelat lantai (m³)'
    ],
    'Pekerjaan Dinding': [
      'Pasangan bata merah (m²)',
      'Pasangan bata ringan (m²)',
      'Plesteran + acian dinding (m²)',
      'Sekat gypsum (m²)'
    ],
    'Pekerjaan Lantai': [
      'Keramik lantai (m²)',
      'Granit/marmer (m²)',
      'Plesteran lantai (m²)'
    ],
    'Pekerjaan Atap': [
      'Rangka atap baja ringan (m²)',
      'Rangka atap kayu (m²)',
      'Atap genteng beton (m²)',
      'Atap genteng keramik (m²)',
      'Atap spandek (m²)',
      'Plafon gypsum/GRC (m²)'
    ],
    'Pekerjaan Pintu & Jendela': [
      'Pintu kayu/engineering door (unit)',
      'Pintu PVC/kamar mandi (unit)',
      'Jendela aluminium/kayu (m²)',
      'Kaca (m²)'
    ],
    'Pekerjaan Finishing': [
      'Cat dinding interior (m²)',
      'Cat dinding eksterior (m²)',
      'Cat kusen, pintu, jendela (m²)',
      'List profil/gipsum (m¹)'
    ],
    'Pekerjaan Mekanikal, Elektrikal, & Plumbing (MEP)': [
      'Instalasi listrik (titik)',
      'Instalasi air bersih (titik)',
      'Instalasi air kotor/limbah (titik)',
      'Septic tank + resapan (unit)',
      'Pompa air & toren (unit)'
    ],
    'Pekerjaan Eksterior & Outdoor': [
      'Pagar tembok (m¹)',
      'Kanopi/carport (m²)',
      'Paving/konblok halaman (m²)',
      'Taman/lansekap sederhana (m²)'
    ],
    'Pekerjaan Tambahan (Opsional)': [
      'Kitchen set (m¹)',
      'Meja beton dapur (m¹)',
      'Lemari built-in (m¹)',
      'Kolam ikan/kolam renang kecil (unit)'
    ]
  }

  const satuanOptions = ['m²', 'm³', 'm¹', 'unit', 'titik', 'ls', 'kg', 'buah', 'sak', 'kaleng', 'batang', 'lembar', 'roll', 'hari', 'jam', 'paket', 'borongan']

  // Data material dari admin (dummy data)
  const materialsData: Material[] = [
    { id: '1', nama: 'Semen Portland', kategori: 'Semen', satuan: 'sak', harga: 65000, status: 'aktif' },
    { id: '2', nama: 'Bata Merah', kategori: 'Bata', satuan: 'buah', harga: 800, status: 'aktif' },
    { id: '3', nama: 'Bata Ringan', kategori: 'Bata', satuan: 'buah', harga: 2500, status: 'aktif' },
    { id: '4', nama: 'Pasir Cor', kategori: 'Pasir', satuan: 'm3', harga: 350000, status: 'aktif' },
    { id: '5', nama: 'Pasir Pasang', kategori: 'Pasir', satuan: 'm3', harga: 280000, status: 'aktif' },
    { id: '6', nama: 'Keramik 40x40', kategori: 'Keramik', satuan: 'm2', harga: 85000, status: 'aktif' },
    { id: '7', nama: 'Cat Tembok', kategori: 'Cat', satuan: 'kaleng', harga: 125000, status: 'aktif' },
    { id: '8', nama: 'Besi Beton', kategori: 'Besi', satuan: 'kg', harga: 15000, status: 'aktif' },
    { id: '9', nama: 'Genteng Beton', kategori: 'Genteng', satuan: 'buah', harga: 8500, status: 'aktif' },
    { id: '10', nama: 'Genteng Keramik', kategori: 'Genteng', satuan: 'buah', harga: 12000, status: 'aktif' },
    { id: '11', nama: 'Spandek', kategori: 'Atap', satuan: 'lembar', harga: 85000, status: 'aktif' },
    { id: '12', nama: 'Pintu Kayu', kategori: 'Pintu', satuan: 'unit', harga: 850000, status: 'aktif' },
    { id: '13', nama: 'Kaca 5mm', kategori: 'Kaca', satuan: 'm2', harga: 75000, status: 'aktif' },
    { id: '14', nama: 'Pipa PVC 3"', kategori: 'Pipa', satuan: 'batang', harga: 45000, status: 'aktif' },
    { id: '15', nama: 'Baja Ringan', kategori: 'Baja', satuan: 'kg', harga: 18000, status: 'aktif' },
    { id: '16', nama: 'Kayu Meranti', kategori: 'Kayu', satuan: 'm3', harga: 4500000, status: 'aktif' },
    { id: '17', nama: 'Batu Kali', kategori: 'Batu', satuan: 'm3', harga: 450000, status: 'aktif' },
    { id: '18', nama: 'Gypsum Board', kategori: 'Gypsum', satuan: 'lembar', harga: 85000, status: 'aktif' }
  ]

  // Data upah dari admin (dummy data)
  const upahData: Upah[] = [
    { id: '1', jenis_pekerjaan: 'Tukang Batu', kategori: 'Struktur', satuan: 'hari', upah_per_satuan: 150000, tingkat_keahlian: 'ahli', status: 'aktif' },
    { id: '2', jenis_pekerjaan: 'Tukang Kayu', kategori: 'Finishing', satuan: 'hari', upah_per_satuan: 140000, tingkat_keahlian: 'ahli', status: 'aktif' },
    { id: '3', jenis_pekerjaan: 'Tukang Cat', kategori: 'Finishing', satuan: 'm2', upah_per_satuan: 25000, tingkat_keahlian: 'menengah', status: 'aktif' },
    { id: '4', jenis_pekerjaan: 'Tukang Listrik', kategori: 'MEP', satuan: 'titik', upah_per_satuan: 75000, tingkat_keahlian: 'ahli', status: 'aktif' },
    { id: '5', jenis_pekerjaan: 'Tukang Plumbing', kategori: 'MEP', satuan: 'titik', upah_per_satuan: 85000, tingkat_keahlian: 'ahli', status: 'aktif' },
    { id: '6', jenis_pekerjaan: 'Tukang Keramik', kategori: 'Finishing', satuan: 'm2', upah_per_satuan: 45000, tingkat_keahlian: 'menengah', status: 'aktif' },
    { id: '7', jenis_pekerjaan: 'Tukang Genteng', kategori: 'Atap', satuan: 'm2', upah_per_satuan: 35000, tingkat_keahlian: 'menengah', status: 'aktif' },
    { id: '8', jenis_pekerjaan: 'Mandor', kategori: 'Supervisi', satuan: 'hari', upah_per_satuan: 200000, tingkat_keahlian: 'master', status: 'aktif' }
  ]

  // Helper functions untuk mencari material dan upah
  const getMaterialByName = (nama: string): Material | undefined => {
    return materialsData.find(material =>
      material.nama.toLowerCase().includes(nama.toLowerCase()) && material.status === 'aktif'
    )
  }

  const getUpahByJenis = (jenis: string): Upah | undefined => {
    return upahData.find(upah =>
      upah.jenis_pekerjaan.toLowerCase().includes(jenis.toLowerCase()) && upah.status === 'aktif'
    )
  }

  // Function untuk mendapatkan harga otomatis berdasarkan sub kategori
  const getAutoPrice = (subKategori: string): number => {
    // Mapping sub kategori ke kombinasi material + upah
    switch (subKategori) {
      // Pekerjaan Persiapan
      case 'Pembersihan lahan (m²)':
        const upahBersih = getUpahByJenis('Tukang')
        return upahBersih ? upahBersih.upah_per_satuan * 0.1 : 15000 // 0.1 hari per m2
      
      case 'Pengukuran & pemasangan bowplank (m¹)':
        const kayu = getMaterialByName('Kayu')
        const upahKayu = getUpahByJenis('Tukang Kayu')
        return (kayu?.harga || 8000) + (upahKayu ? upahKayu.upah_per_satuan * 0.05 : 7000)
      
      case 'Pengadaan dan bongkar pasang direksi keet/pos sementara (unit)':
        return 2500000
      
      case 'Pagar pengaman sementara (m¹)':
        return 75000
      
      // Pekerjaan Tanah
      case 'Galian pondasi (m³)':
        const upahGalian = getUpahByJenis('Tukang Galian')
        return upahGalian ? upahGalian.upah_per_satuan * 2.5 : 85000 // 2.5 hari per m3
      
      case 'Urugan pasir (m³)':
        const pasir = getMaterialByName('Pasir')
        const upahUrugan = getUpahByJenis('Tukang')
        return (pasir?.harga || 280000) + (upahUrugan ? upahUrugan.upah_per_satuan * 0.3 : 45000)
      
      case 'Urugan tanah kembali (m³)':
        return 45000
      
      case 'Pemadatan lantai kerja (m²)':
        return 25000
      
      // Pekerjaan Pondasi & Struktur
      case 'Pasangan batu kali pondasi (m³)':
        const batu = getMaterialByName('Batu Kali')
        const semen = getMaterialByName('Semen')
        const pasirPasang = getMaterialByName('Pasir')
        const upahBatu = getUpahByJenis('Tukang Batu')
        return (batu?.harga || 450000) + (semen?.harga || 65000) * 7 + (pasirPasang?.harga || 280000) * 0.5 + (upahBatu ? upahBatu.upah_per_satuan * 1.5 : 225000)
      
      case 'Lantai kerja (m²)':
        return 85000
      
      case 'Beton bertulang sloof (m³)':
        const semenSloof = getMaterialByName('Semen')
        const pasirCor = getMaterialByName('Pasir')
        const besi = getMaterialByName('Besi')
        const upahSloof = getUpahByJenis('Tukang Batu')
        return (semenSloof?.harga || 65000) * 8 + (pasirCor?.harga || 350000) * 0.5 + (besi?.harga || 15000) * 120 + (upahSloof ? upahSloof.upah_per_satuan * 2 : 300000)
      
      case 'Beton kolom praktis (m³)':
        return 3200000
      
      case 'Beton balok & pelat lantai (m³)':
        return 3500000
      
      // Pekerjaan Dinding
      case 'Pasangan bata merah (m²)':
        const bataM = getMaterialByName('Bata Merah')
        const semenBata = getMaterialByName('Semen')
        const pasirBata = getMaterialByName('Pasir')
        const upahBataM = getUpahByJenis('Tukang Batu')
        return (bataM?.harga || 800) * 70 + (semenBata?.harga || 65000) * 0.2 + (pasirBata?.harga || 280000) * 0.05 + (upahBataM ? upahBataM.upah_per_satuan * 0.3 : 45000)
      
      case 'Pasangan bata ringan (m²)':
        const bataR = getMaterialByName('Bata Ringan')
        const semenBataR = getMaterialByName('Semen')
        const upahBataR = getUpahByJenis('Tukang Batu')
        return (bataR?.harga || 2500) * 12.5 + (semenBataR?.harga || 65000) * 0.15 + (upahBataR ? upahBataR.upah_per_satuan * 0.25 : 37500)
      
      case 'Plesteran + acian dinding (m²)':
        return 65000
      
      case 'Sekat gypsum (m²)':
        const gypsum = getMaterialByName('Gypsum')
        const upahGypsum = getUpahByJenis('Tukang')
        return (gypsum?.harga || 85000) * 1.1 + (upahGypsum ? upahGypsum.upah_per_satuan * 0.2 : 28000)
      
      // Pekerjaan Lantai
      case 'Keramik lantai (m²)':
        const keramik = getMaterialByName('Keramik')
        const upahKeramik = getUpahByJenis('Tukang Keramik')
        return (keramik?.harga || 85000) + (upahKeramik ? upahKeramik.upah_per_satuan : 45000)
      
      case 'Granit/marmer (m²)':
        return 450000
      
      case 'Plesteran lantai (m²)':
        return 45000
      
      // Pekerjaan Atap
      case 'Rangka atap baja ringan (m²)':
        const baja = getMaterialByName('Baja Ringan')
        const upahBaja = getUpahByJenis('Tukang Kayu')
        return (baja?.harga || 18000) * 6 + (upahBaja ? upahBaja.upah_per_satuan * 0.15 : 21000)
      
      case 'Rangka atap kayu (m²)':
        const kayuAtap = getMaterialByName('Kayu')
        const upahKayuAtap = getUpahByJenis('Tukang Kayu')
        return (kayuAtap?.harga || 4500000) * 0.05 + (upahKayuAtap ? upahKayuAtap.upah_per_satuan * 0.2 : 28000)
      
      case 'Atap genteng beton (m²)':
        const gentengB = getMaterialByName('Genteng Beton')
        const upahGenteng = getUpahByJenis('Tukang Genteng')
        return (gentengB?.harga || 8500) * 25 + (upahGenteng ? upahGenteng.upah_per_satuan : 35000)
      
      case 'Atap genteng keramik (m²)':
        const gentengK = getMaterialByName('Genteng Keramik')
        const upahGentengK = getUpahByJenis('Tukang Genteng')
        return (gentengK?.harga || 12000) * 25 + (upahGentengK ? upahGentengK.upah_per_satuan : 35000)
      
      case 'Atap spandek (m²)':
        const spandek = getMaterialByName('Spandek')
        const upahSpandek = getUpahByJenis('Tukang')
        return (spandek?.harga || 85000) + (upahSpandek ? upahSpandek.upah_per_satuan * 0.1 : 15000)
      
      case 'Plafon gypsum/GRC (m²)':
        return 95000
      
      // Pekerjaan Pintu & Jendela
      case 'Pintu kayu/engineering door (unit)':
        const pintu = getMaterialByName('Pintu')
        const upahPintu = getUpahByJenis('Tukang Kayu')
        return (pintu?.harga || 850000) + (upahPintu ? upahPintu.upah_per_satuan * 2 : 280000)
      
      case 'Pintu PVC/kamar mandi (unit)':
        return 850000
      
      case 'Jendela aluminium/kayu (m²)':
        return 650000
      
      case 'Kaca (m²)':
        const kaca = getMaterialByName('Kaca')
        return (kaca?.harga || 75000) * 1.2
      
      // Pekerjaan Finishing
      case 'Cat dinding interior (m²)':
        const cat = getMaterialByName('Cat')
        const upahCat = getUpahByJenis('Tukang Cat')
        return (cat?.harga || 125000) * 0.15 + (upahCat ? upahCat.upah_per_satuan : 25000)
      
      case 'Cat dinding eksterior (m²)':
        return 45000
      
      case 'Cat kusen, pintu, jendela (m²)':
        return 55000
      
      case 'List profil/gipsum (m¹)':
        return 25000
      
      // Pekerjaan MEP
      case 'Instalasi listrik (titik)':
        const upahListrik = getUpahByJenis('Tukang Listrik')
        return upahListrik ? upahListrik.upah_per_satuan + 50000 : 125000 // material + upah
      
      case 'Instalasi air bersih (titik)':
        const pipa = getMaterialByName('Pipa')
        const upahPlumbing = getUpahByJenis('Tukang Plumbing')
        return (pipa?.harga || 45000) * 2 + (upahPlumbing ? upahPlumbing.upah_per_satuan : 85000)
      
      case 'Instalasi air kotor/limbah (titik)':
        return 225000
      
      case 'Septic tank + resapan (unit)':
        return 8500000
      
      case 'Pompa air & toren (unit)':
        return 3500000
      
      // Pekerjaan Eksterior & Outdoor
      case 'Pagar tembok (m¹)':
        return 385000
      
      case 'Kanopi/carport (m²)':
        return 650000
      
      case 'Paving/konblok halaman (m²)':
        const paving = getMaterialByName('Paving')
        const upahPaving = getUpahByJenis('Tukang')
        return (paving?.harga || 65000) + (upahPaving ? upahPaving.upah_per_satuan * 0.2 : 30000)
      
      case 'Taman/lansekap sederhana (m²)':
        return 85000
      
      // Pekerjaan Tambahan
      case 'Kitchen set (m¹)':
        return 2500000
      
      case 'Meja beton dapur (m¹)':
        return 850000
      
      case 'Lemari built-in (m¹)':
        return 1850000
      
      case 'Kolam ikan/kolam renang kecil (unit)':
        return 25000000
      
      default:
        return 0
    }
  }

  // Calculations
  const subtotal = rabItems.reduce((sum, item) => sum + item.jumlah, 0)
  const overhead = subtotal * 0.10 // 10%
  const profit = subtotal * 0.15 // 15%
  const ppn = (subtotal + overhead + profit) * 0.11 // 11%
  const totalRAB = subtotal + overhead + profit + ppn

  // Functions
  const addRABItem = () => {
    if (!newItem.item || !newItem.kategori || !newItem.satuan || newItem.volume <= 0) {
      toast({
        title: "Error",
        description: "Mohon lengkapi item, kategori, satuan, dan volume",
        variant: "destructive"
      })
      return
    }

    // Auto set harga satuan jika belum diisi
    const autoPrice = getAutoPrice(newItem.subKategori)
    const finalHargaSatuan = newItem.hargaSatuan > 0 ? newItem.hargaSatuan : autoPrice

    const item: RABItem = {
      id: Date.now().toString(),
      item: newItem.item,
      kategori: newItem.kategori,
      subKategori: newItem.subKategori,
      satuan: newItem.satuan,
      volume: newItem.volume,
      hargaSatuan: finalHargaSatuan,
      jumlah: newItem.volume * finalHargaSatuan
    }

    setRabItems([...rabItems, item])
    setNewItem({
      item: '',
      kategori: '',
      subKategori: '',
      satuan: '',
      volume: 0,
      hargaSatuan: 0
    })

    toast({
      title: "Berhasil",
      description: "Item RAB berhasil ditambahkan dengan harga otomatis"
    })
  }

  const removeRABItem = (id: string) => {
    setRabItems(rabItems.filter(item => item.id !== id))
    toast({
      title: "Berhasil",
      description: "Item RAB berhasil dihapus"
    })
  }

  const saveRAB = () => {
    toast.success('RAB berhasil disimpan')
  }

  const exportToPDF = () => {
    toast.info('Fitur export PDF akan segera tersedia')
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4 md:p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header Section - Mobile First */}
        <div className="bg-white rounded-xl shadow-sm border p-4 md:p-6">
          <div className="flex items-center gap-3 mb-4">
            <Button 
              onClick={() => navigate('/dashboard')} 
              variant="outline" 
              size={isMobile ? "sm" : "default"}
              className="shrink-0"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              {isMobile ? "" : "Kembali"}
            </Button>
            <div className="flex-1">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900">Kalkulator RAB</h1>
              <p className="text-sm text-gray-600 mt-1">Hitung estimasi biaya proyek renovasi Anda</p>
            </div>
          </div>
          
          {/* Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
              <div className="text-sm text-blue-800">
                <p className="font-medium mb-1">Perhitungan RAB mencakup:</p>
                <ul className="space-y-1 text-xs">
                  <li>• Overhead 10% untuk biaya operasional</li>
                  <li>• Profit 15% untuk keuntungan kontraktor</li>
                  <li>• PPN 11% sesuai peraturan pajak</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Button 
            onClick={saveRAB}
            className={`${isMobile ? 'w-full h-12' : 'w-auto h-10'} bg-green-600 hover:bg-green-700`}
          >
            <Save className="h-4 w-4 mr-2" />
            Simpan RAB
          </Button>
          <Button 
            onClick={exportToPDF}
            variant="outline"
            className={`${isMobile ? 'w-full h-12' : 'w-auto h-10'}`}
          >
            <Download className="h-4 w-4 mr-2" />
            Export PDF
          </Button>
        </div>

        {/* Project Information */}
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl">Informasi Proyek</CardTitle>
            <CardDescription>Masukkan detail proyek renovasi Anda</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
              <div className="space-y-2">
                <Label htmlFor="projectName">Nama Proyek</Label>
                <Input
                  id="projectName"
                  placeholder="Contoh: Renovasi Rumah Tinggal"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  className={isMobile ? 'h-12' : 'h-10'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectType">Jenis Proyek</Label>
                <Select value={projectType} onValueChange={setProjectType}>
                  <SelectTrigger className={isMobile ? 'h-12' : 'h-10'}>
                    <SelectValue placeholder="Pilih jenis proyek" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="rumah-tinggal">Rumah Tinggal</SelectItem>
                    <SelectItem value="ruko">Ruko</SelectItem>
                    <SelectItem value="kantor">Kantor</SelectItem>
                    <SelectItem value="gudang">Gudang</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="projectArea">Luas Bangunan (m²)</Label>
                <Input
                  id="projectArea"
                  type="number"
                  placeholder="Contoh: 120"
                  value={projectArea}
                  onChange={(e) => setProjectArea(e.target.value)}
                  className={isMobile ? 'h-12' : 'h-10'}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi Proyek</Label>
              <Textarea
                id="description"
                placeholder="Jelaskan detail pekerjaan yang akan dilakukan..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="min-h-[100px] resize-none"
              />
            </div>
          </CardContent>
        </Card>

        {/* Add RAB Item */}
        <Card className="bg-white shadow-sm border-0 rounded-xl">
          <CardHeader className="pb-4">
            <CardTitle className="text-lg md:text-xl">Tambah Item RAB</CardTitle>
            <CardDescription>Masukkan detail pekerjaan dan biaya</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2 lg:grid-cols-3'}`}>
              <div className="space-y-2">
                <Label htmlFor="item">Nama Pekerjaan</Label>
                <Input
                  id="item"
                  placeholder="Contoh: Pekerjaan Pondasi"
                  value={newItem.item}
                  onChange={(e) => setNewItem({...newItem, item: e.target.value})}
                  className={isMobile ? 'h-12' : 'h-10'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="kategori">Kategori</Label>
                <Select value={newItem.kategori} onValueChange={(value) => setNewItem({...newItem, kategori: value, subKategori: ''})}>
                  <SelectTrigger className={isMobile ? 'h-12' : 'h-10'}>
                    <SelectValue placeholder="Pilih kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {kategoriOptions.map(kategori => (
                      <SelectItem key={kategori} value={kategori}>{kategori}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="subKategori">Sub Kategori</Label>
                <Select 
                  value={newItem.subKategori} 
                  onValueChange={(value) => {
                    const autoPrice = getAutoPrice(value)
                    // Extract satuan dari sub kategori (dalam kurung)
                    const satuanMatch = value.match(/\(([^)]+)\)$/)
                    const extractedSatuan = satuanMatch ? satuanMatch[1] : 'unit'
                    
                    setNewItem({
                      ...newItem, 
                      subKategori: value,
                      satuan: extractedSatuan,
                      hargaSatuan: autoPrice
                    })
                  }}
                  disabled={!newItem.kategori}
                >
                  <SelectTrigger className={isMobile ? 'h-12' : 'h-10'}>
                    <SelectValue placeholder="Pilih sub kategori" />
                  </SelectTrigger>
                  <SelectContent>
                    {newItem.kategori && subKategoriOptions[newItem.kategori]?.map(subKategori => (
                      <SelectItem key={subKategori} value={subKategori}>{subKategori}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="satuan">Satuan</Label>
                <Select value={newItem.satuan} onValueChange={(value) => setNewItem({...newItem, satuan: value})}>
                  <SelectTrigger className={isMobile ? 'h-12' : 'h-10'}>
                    <SelectValue placeholder="Pilih satuan" />
                  </SelectTrigger>
                  <SelectContent>
                    {satuanOptions.map(satuan => (
                      <SelectItem key={satuan} value={satuan}>{satuan}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="volume">Volume</Label>
                <Input
                  id="volume"
                  type="number"
                  placeholder="0"
                  value={newItem.volume || ''}
                  onChange={(e) => setNewItem({...newItem, volume: parseFloat(e.target.value) || 0})}
                  className={isMobile ? 'h-12' : 'h-10'}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="hargaSatuan">Harga Satuan (Rp) - Otomatis</Label>
                <Input
                  id="hargaSatuan"
                  type="number"
                  placeholder="Harga akan terisi otomatis"
                  value={newItem.hargaSatuan || ''}
                  onChange={(e) => setNewItem({...newItem, hargaSatuan: parseFloat(e.target.value) || 0})}
                  className={`${isMobile ? 'h-12' : 'h-10'} bg-gray-50`}
                />
                {newItem.subKategori && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <p className="text-sm text-green-600 font-medium">
                        💰 Harga otomatis: Rp {getAutoPrice(newItem.subKategori).toLocaleString('id-ID')}
                      </p>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setShowPriceBreakdown(!showPriceBreakdown)}
                        className="text-xs h-6 px-2"
                      >
                        {showPriceBreakdown ? '🔼 Sembunyikan' : '🔽 Detail'}
                      </Button>
                    </div>
                    <p className="text-xs text-gray-500">
                      📊 Berdasarkan data material & upah tenaga kerja terkini
                    </p>
                    
                    {showPriceBreakdown && (
                      <div className="mt-3 p-3 bg-gray-50 rounded-lg border">
                        <h4 className="text-sm font-semibold mb-2">Breakdown Harga:</h4>
                        {(() => {
                          const breakdown = getPriceBreakdown(newItem.subKategori)
                          return (
                            <div className="space-y-2">
                              {breakdown.materials.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-blue-600 mb-1">🧱 Material:</p>
                                  {breakdown.materials.map((item, idx) => (
                                    <div key={idx} className="text-xs flex justify-between pl-2">
                                      <span>{item.nama} ({item.qty})</span>
                                      <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              {breakdown.labor.length > 0 && (
                                <div>
                                  <p className="text-xs font-medium text-orange-600 mb-1">👷 Upah:</p>
                                  {breakdown.labor.map((item, idx) => (
                                    <div key={idx} className="text-xs flex justify-between pl-2">
                                      <span>{item.jenis} ({item.qty})</span>
                                      <span>Rp {item.subtotal.toLocaleString('id-ID')}</span>
                                    </div>
                                  ))}
                                </div>
                              )}
                              <div className="border-t pt-1 mt-2">
                                <div className="text-xs font-semibold flex justify-between">
                                  <span>Total:</span>
                                  <span>Rp {breakdown.total.toLocaleString('id-ID')}</span>
                                </div>
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="pt-4">
              <Button 
                onClick={addRABItem}
                className={`${isMobile ? 'w-full h-12' : 'w-auto h-10'} bg-green-600 hover:bg-green-700`}
              >
                <Plus className="h-4 w-4 mr-2" />
                Tambah Item ke RAB
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* RAB Items List - Enhanced Mobile UI */}
        {rabItems.length > 0 && (
          <Card className="bg-white shadow-sm border-0 rounded-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <Calculator className="h-4 w-4 text-purple-600" />
                  </div>
                  <div>
                    <CardTitle className="text-lg md:text-xl">Daftar Item RAB</CardTitle>
                    <CardDescription className="text-sm">{rabItems.length} item pekerjaan</CardDescription>
                  </div>
                </div>
                <div className="text-sm text-gray-500">
                  Total: Rp {totalRAB.toLocaleString('id-ID')}
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {rabItems.map((item, index) => (
                  <div key={item.id} className="bg-gray-50 rounded-lg p-4 border">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded">
                            {item.kategori}
                          </span>
                          {item.subKategori && (
                            <span className="bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded">
                              {item.subKategori}
                            </span>
                          )}
                        </div>
                        <h4 className="font-medium text-gray-900 mb-1 truncate">{item.item}</h4>
                        <div className={`grid gap-2 text-sm text-gray-600 ${isMobile ? 'grid-cols-2' : 'grid-cols-4'}`}>
                          <div>
                            <span className="font-medium">Volume:</span> {item.volume} {item.satuan}
                          </div>
                          <div>
                            <span className="font-medium">Harga:</span> Rp {item.hargaSatuan.toLocaleString('id-ID')}
                          </div>
                          <div className={isMobile ? 'col-span-2' : 'col-span-2'}>
                            <span className="font-medium">Jumlah:</span> 
                            <span className="text-green-600 font-semibold ml-1">
                              Rp {item.jumlah.toLocaleString('id-ID')}
                            </span>
                          </div>
                        </div>
                      </div>
                      <Button
                        onClick={() => removeRABItem(item.id)}
                        variant="outline"
                        size="sm"
                        className="text-red-600 hover:text-red-700 hover:bg-red-50 shrink-0"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Summary */}
        {rabItems.length > 0 && (
          <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 shadow-sm border-0 rounded-xl">
            <CardHeader className="pb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calculator className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-blue-900">Ringkasan Biaya</CardTitle>
                  <p className="text-sm text-blue-700">Estimasi total biaya proyek</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className={`grid gap-4 ${isMobile ? 'grid-cols-1' : 'grid-cols-2'}`}>
                <div className="space-y-3">
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-blue-800">Subtotal Material & Upah</span>
                    <span className="font-semibold text-blue-900">Rp {subtotal.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-blue-800">Overhead (10%)</span>
                    <span className="font-semibold text-blue-900">Rp {overhead.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-blue-800">Profit (15%)</span>
                    <span className="font-semibold text-blue-900">Rp {profit.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-blue-200">
                    <span className="text-blue-800">PPN (11%)</span>
                    <span className="font-semibold text-blue-900">Rp {ppn.toLocaleString('id-ID')}</span>
                  </div>
                  <div className="flex justify-between items-center py-3 bg-blue-100 rounded-lg px-4">
                    <span className="text-lg font-bold text-blue-900">Grand Total</span>
                    <span className="text-xl font-bold text-blue-900">Rp {totalRAB.toLocaleString('id-ID')}</span>
                  </div>
                </div>
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <div className="flex items-start gap-2 mb-3">
                    <HelpCircle className="h-5 w-5 text-blue-600 mt-0.5 shrink-0" />
                    <div>
                      <h4 className="font-medium text-blue-900 mb-2">Informasi Perhitungan</h4>
                      <ul className="text-sm text-blue-800 space-y-1">
                        <li>• Overhead 10% untuk biaya operasional</li>
                        <li>• Profit 15% untuk keuntungan kontraktor</li>
                        <li>• PPN 11% sesuai peraturan pajak</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  )
}

export default SimulasiRAB