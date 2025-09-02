import React, { createContext, useContext, useState, useEffect } from 'react'

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

interface RABContextType {
  materials: Material[]
  upahData: Upah[]
  getMaterialByName: (nama: string) => Material | undefined
  getUpahByJenis: (jenis: string) => Upah | undefined
  getAutoPriceBySubKategori: (subKategori: string) => number
  updateMaterial: (material: Material) => void
  updateUpah: (upah: Upah) => void
  addMaterial: (material: Material) => void
  addUpah: (upah: Upah) => void
}

const RABContext = createContext<RABContextType | undefined>(undefined)

export const useRAB = () => {
  const context = useContext(RABContext)
  if (!context) {
    throw new Error('useRAB must be used within a RABProvider')
  }
  return context
}

export const RABProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Data material dari admin (dummy data - dalam implementasi nyata akan dari API/database)
  const [materials, setMaterials] = useState<Material[]>([
    { id: '1', nama: 'Semen Portland', kategori: 'Semen', satuan: 'sak', harga: 65000, status: 'aktif' },
    { id: '2', nama: 'Bata Merah', kategori: 'Bata', satuan: 'buah', harga: 800, status: 'aktif' },
    { id: '3', nama: 'Pasir Cor', kategori: 'Pasir', satuan: 'm3', harga: 350000, status: 'aktif' },
    { id: '4', nama: 'Keramik 40x40', kategori: 'Keramik', satuan: 'm2', harga: 85000, status: 'aktif' },
    { id: '5', nama: 'Cat Tembok', kategori: 'Cat', satuan: 'kaleng', harga: 125000, status: 'aktif' },
    { id: '6', nama: 'Besi Beton', kategori: 'Besi', satuan: 'kg', harga: 15000, status: 'aktif' },
    { id: '7', nama: 'Genteng Beton', kategori: 'Genteng', satuan: 'buah', harga: 8500, status: 'aktif' },
    { id: '8', nama: 'Pintu Kayu', kategori: 'Pintu', satuan: 'unit', harga: 850000, status: 'aktif' },
    { id: '9', nama: 'Kaca 5mm', kategori: 'Kaca', satuan: 'm2', harga: 75000, status: 'aktif' },
    { id: '10', nama: 'Pipa PVC 3"', kategori: 'Pipa', satuan: 'batang', harga: 45000, status: 'aktif' },
    { id: '11', nama: 'Batu Kali', kategori: 'Batu', satuan: 'm3', harga: 450000, status: 'aktif' },
    { id: '12', nama: 'Pasir Pasang', kategori: 'Pasir', satuan: 'm3', harga: 280000, status: 'aktif' },
    { id: '13', nama: 'Baja Ringan', kategori: 'Baja', satuan: 'kg', harga: 18000, status: 'aktif' },
    { id: '14', nama: 'Gypsum Board', kategori: 'Gypsum', satuan: 'lembar', harga: 85000, status: 'aktif' },
    { id: '15', nama: 'Paving Block', kategori: 'Paving', satuan: 'm2', harga: 65000, status: 'aktif' }
  ])

  // Data upah dari admin (dummy data - dalam implementasi nyata akan dari API/database)
  const [upahData, setUpahData] = useState<Upah[]>([
    { id: '1', jenis_pekerjaan: 'Tukang Batu', kategori: 'Struktur', satuan: 'hari', upah_per_satuan: 150000, tingkat_keahlian: 'ahli', status: 'aktif' },
    { id: '2', jenis_pekerjaan: 'Tukang Kayu', kategori: 'Finishing', satuan: 'hari', upah_per_satuan: 140000, tingkat_keahlian: 'ahli', status: 'aktif' },
    { id: '3', jenis_pekerjaan: 'Tukang Cat', kategori: 'Finishing', satuan: 'm2', upah_per_satuan: 25000, tingkat_keahlian: 'menengah', status: 'aktif' },
    { id: '4', jenis_pekerjaan: 'Tukang Listrik', kategori: 'MEP', satuan: 'titik', upah_per_satuan: 75000, tingkat_keahlian: 'ahli', status: 'aktif' },
    { id: '5', jenis_pekerjaan: 'Tukang Plumbing', kategori: 'MEP', satuan: 'titik', upah_per_satuan: 85000, tingkat_keahlian: 'ahli', status: 'aktif' },
    { id: '6', jenis_pekerjaan: 'Tukang Keramik', kategori: 'Finishing', satuan: 'm2', upah_per_satuan: 45000, tingkat_keahlian: 'menengah', status: 'aktif' },
    { id: '7', jenis_pekerjaan: 'Tukang Genteng', kategori: 'Atap', satuan: 'm2', upah_per_satuan: 35000, tingkat_keahlian: 'menengah', status: 'aktif' },
    { id: '8', jenis_pekerjaan: 'Mandor', kategori: 'Supervisi', satuan: 'hari', upah_per_satuan: 200000, tingkat_keahlian: 'master', status: 'aktif' },
    { id: '9', jenis_pekerjaan: 'Tukang Galian', kategori: 'Tanah', satuan: 'm3', upah_per_satuan: 35000, tingkat_keahlian: 'menengah', status: 'aktif' },
    { id: '10', jenis_pekerjaan: 'Tukang Besi', kategori: 'Struktur', satuan: 'kg', upah_per_satuan: 8000, tingkat_keahlian: 'ahli', status: 'aktif' }
  ])

  // Function untuk mendapatkan material berdasarkan nama
  const getMaterialByName = (nama: string): Material | undefined => {
    return materials.find(material => 
      material.nama.toLowerCase().includes(nama.toLowerCase()) && material.status === 'aktif'
    )
  }

  // Function untuk mendapatkan upah berdasarkan jenis pekerjaan
  const getUpahByJenis = (jenis: string): Upah | undefined => {
    return upahData.find(upah => 
      upah.jenis_pekerjaan.toLowerCase().includes(jenis.toLowerCase()) && upah.status === 'aktif'
    )
  }

  // Function untuk mendapatkan harga otomatis berdasarkan sub kategori
  const getAutoPriceBySubKategori = (subKategori: string): number => {
    // Mapping sub kategori ke kombinasi material + upah
    const priceMapping: { [key: string]: () => number } = {
      // Pekerjaan Persiapan
      'Pembersihan lahan (m²)': () => {
        const upah = getUpahByJenis('Tukang')
        return upah ? upah.upah_per_satuan * 0.1 : 15000 // 0.1 hari per m2
      },
      'Pengukuran & pemasangan bowplank (m¹)': () => {
        const kayu = getMaterialByName('Kayu')
        const upah = getUpahByJenis('Tukang Kayu')
        return (kayu?.harga || 8000) + (upah ? upah.upah_per_satuan * 0.05 : 7000)
      },
      'Pengadaan dan bongkar pasang direksi keet/pos sementara (unit)': () => 2500000,
      'Pagar pengaman sementara (m¹)': () => 75000,
      
      // Pekerjaan Tanah
      'Galian pondasi (m³)': () => {
        const upah = getUpahByJenis('Tukang Galian')
        return upah ? upah.upah_per_satuan * 2.5 : 85000 // 2.5 hari per m3
      },
      'Urugan pasir (m³)': () => {
        const pasir = getMaterialByName('Pasir')
        const upah = getUpahByJenis('Tukang')
        return (pasir?.harga || 280000) + (upah ? upah.upah_per_satuan * 0.3 : 45000)
      },
      'Urugan tanah kembali (m³)': () => 45000,
      'Pemadatan lantai kerja (m²)': () => 25000,
      
      // Pekerjaan Pondasi & Struktur
      'Pasangan batu kali pondasi (m³)': () => {
        const batu = getMaterialByName('Batu Kali')
        const semen = getMaterialByName('Semen')
        const pasir = getMaterialByName('Pasir')
        const upah = getUpahByJenis('Tukang Batu')
        return (batu?.harga || 450000) + (semen?.harga || 65000) * 7 + (pasir?.harga || 280000) * 0.5 + (upah ? upah.upah_per_satuan * 1.5 : 225000)
      },
      'Lantai kerja (m²)': () => 85000,
      'Beton bertulang sloof (m³)': () => {
        const semen = getMaterialByName('Semen')
        const pasir = getMaterialByName('Pasir')
        const besi = getMaterialByName('Besi')
        const upah = getUpahByJenis('Tukang Batu')
        return (semen?.harga || 65000) * 8 + (pasir?.harga || 350000) * 0.5 + (besi?.harga || 15000) * 120 + (upah ? upah.upah_per_satuan * 2 : 300000)
      },
      'Beton kolom praktis (m³)': () => 3200000,
      'Beton balok & pelat lantai (m³)': () => 3500000,
      
      // Pekerjaan Dinding
      'Pasangan bata merah/batako ringan (m²)': () => {
        const bata = getMaterialByName('Bata')
        const semen = getMaterialByName('Semen')
        const pasir = getMaterialByName('Pasir')
        const upah = getUpahByJenis('Tukang Batu')
        return (bata?.harga || 800) * 70 + (semen?.harga || 65000) * 0.2 + (pasir?.harga || 280000) * 0.05 + (upah ? upah.upah_per_satuan * 0.3 : 45000)
      },
      'Plesteran + acian dinding (m²)': () => 65000,
      'Sekat gypsum (m²)': () => {
        const gypsum = getMaterialByName('Gypsum')
        const upah = getUpahByJenis('Tukang')
        return (gypsum?.harga || 85000) * 1.1 + (upah ? upah.upah_per_satuan * 0.2 : 28000)
      },
      
      // Pekerjaan Lantai
      'Keramik lantai (m²)': () => {
        const keramik = getMaterialByName('Keramik')
        const upah = getUpahByJenis('Tukang Keramik')
        return (keramik?.harga || 85000) + (upah ? upah.upah_per_satuan : 45000)
      },
      'Granit/marmer (m²)': () => 450000,
      'Plesteran lantai (m²)': () => 45000,
      
      // Pekerjaan Atap
      'Rangka atap baja ringan/kayu (m²)': () => {
        const baja = getMaterialByName('Baja Ringan')
        const upah = getUpahByJenis('Tukang Kayu')
        return (baja?.harga || 18000) * 6 + (upah ? upah.upah_per_satuan * 0.15 : 21000)
      },
      'Penutup atap (genteng, spandek, dll) (m²)': () => {
        const genteng = getMaterialByName('Genteng')
        const upah = getUpahByJenis('Tukang Genteng')
        return (genteng?.harga || 8500) * 25 + (upah ? upah.upah_per_satuan : 35000)
      },
      'Plafon gypsum/GRC (m²)': () => 95000,
      
      // Pekerjaan Pintu & Jendela
      'Pintu kayu/engineering door (unit)': () => {
        const pintu = getMaterialByName('Pintu')
        const upah = getUpahByJenis('Tukang Kayu')
        return (pintu?.harga || 850000) + (upah ? upah.upah_per_satuan * 2 : 280000)
      },
      'Pintu PVC/kamar mandi (unit)': () => 850000,
      'Jendela aluminium/kayu (m²)': () => 650000,
      'Kaca (m²)': () => {
        const kaca = getMaterialByName('Kaca')
        return (kaca?.harga || 75000) * 1.2
      },
      
      // Pekerjaan Finishing
      'Cat dinding interior (m²)': () => {
        const cat = getMaterialByName('Cat')
        const upah = getUpahByJenis('Tukang Cat')
        return (cat?.harga || 125000) * 0.15 + (upah ? upah.upah_per_satuan : 25000)
      },
      'Cat dinding eksterior (m²)': () => 45000,
      'Cat kusen, pintu, jendela (m²)': () => 55000,
      'List profil/gipsum (m¹)': () => 25000,
      
      // Pekerjaan MEP
      'Instalasi listrik (titik)': () => {
        const upah = getUpahByJenis('Tukang Listrik')
        return upah ? upah.upah_per_satuan + 50000 : 125000 // material + upah
      },
      'Instalasi air bersih (titik)': () => {
        const pipa = getMaterialByName('Pipa')
        const upah = getUpahByJenis('Tukang Plumbing')
        return (pipa?.harga || 45000) * 2 + (upah ? upah.upah_per_satuan : 85000)
      },
      'Instalasi air kotor/limbah (titik)': () => 225000,
      'Septic tank + resapan (unit)': () => 8500000,
      'Pompa air & toren (unit)': () => 3500000,
      
      // Pekerjaan Eksterior & Outdoor
      'Pagar tembok (m¹)': () => 385000,
      'Kanopi/carport (m²)': () => 650000,
      'Paving/konblok halaman (m²)': () => {
        const paving = getMaterialByName('Paving')
        const upah = getUpahByJenis('Tukang')
        return (paving?.harga || 65000) + (upah ? upah.upah_per_satuan * 0.2 : 30000)
      },
      'Taman/lansekap sederhana (m²)': () => 85000,
      
      // Pekerjaan Tambahan
      'Kitchen set (m¹)': () => 2500000,
      'Meja beton dapur (m¹)': () => 850000,
      'Lemari built-in (m¹)': () => 1850000,
      'Kolam ikan/kolam renang kecil (unit)': () => 25000000
    }
    
    const priceFunction = priceMapping[subKategori]
    return priceFunction ? priceFunction() : 0
  }

  // Functions untuk update data
  const updateMaterial = (material: Material) => {
    setMaterials(prev => prev.map(m => m.id === material.id ? material : m))
  }

  const updateUpah = (upah: Upah) => {
    setUpahData(prev => prev.map(u => u.id === upah.id ? upah : u))
  }

  const addMaterial = (material: Material) => {
    setMaterials(prev => [...prev, material])
  }

  const addUpah = (upah: Upah) => {
    setUpahData(prev => [...prev, upah])
  }

  const value: RABContextType = {
    materials,
    upahData,
    getMaterialByName,
    getUpahByJenis,
    getAutoPriceBySubKategori,
    updateMaterial,
    updateUpah,
    addMaterial,
    addUpah
  }

  return (
    <RABContext.Provider value={value}>
      {children}
    </RABContext.Provider>
  )
}