import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface PromptDropdownsProps {
  selections: {
    gedungRuangan: string;
    tema: string;
    warnaDinding: string;
    materialLantai: string;
    furnitur: string;
    aksesoris: string;
    pencahayaan: string;
    efekVisual: string;
  };
  onSelectionChange: (key: string, value: string) => void;
  isLoading?: boolean;
}

const PromptDropdowns: React.FC<PromptDropdownsProps> = ({
  selections,
  onSelectionChange,
  isLoading = false
}) => {
  const gedungRuanganOptions = [
    { value: 'ruangan', label: 'Ruangan' },
    { value: 'gedung', label: 'Gedung' }
  ];

  const temaOptions = [
    { value: 'modern-minimalis', label: 'Modern Minimalis' },
    { value: 'skandinavia', label: 'Skandinavia' },
    { value: 'industrial', label: 'Industrial' },
    { value: 'tradisional', label: 'Tradisional' },
    { value: 'kontemporer', label: 'Kontemporer' }
  ];

  const materialLantaiOptions = [
    { value: 'pertahankan-sesuai-gambar-referensi', label: 'Pertahankan sesuai gambar referensi' },
    { value: 'kayu-oak-terang', label: 'Kayu oak terang' },
    { value: 'marmer-putih', label: 'Marmer putih' },
    { value: 'granit-gelap', label: 'Granit gelap' },
    { value: 'keramik-polos', label: 'Keramik polos' },
    { value: 'beton-ekspos', label: 'Beton ekspos' }
  ];

  const furniturOptions = [
    { value: 'pertahankan-sesuai-gambar-referensi', label: 'Pertahankan sesuai gambar referensi' },
    { value: 'sofa-minimalis-abu-abu', label: 'Sofa minimalis abu-abu' },
    { value: 'meja-kayu-modern', label: 'Meja kayu modern' },
    { value: 'kursi-bergaya-retro', label: 'Kursi bergaya retro' },
    { value: 'rak-buku-terbuka', label: 'Rak buku terbuka' },
    { value: 'tempat-tidur-sederhana', label: 'Tempat tidur sederhana' }
  ];

  const aksesorisOptions = [
    { value: 'pertahankan-sesuai-gambar-referensi', label: 'Pertahankan sesuai gambar referensi' },
    { value: 'tanaman-indoor', label: 'Tanaman indoor' },
    { value: 'lampu-gantung', label: 'Lampu gantung' },
    { value: 'karpet-motif-geometris', label: 'Karpet motif geometris' },
    { value: 'lukisan-dinding', label: 'Lukisan dinding' },
    { value: 'cermin-besar', label: 'Cermin besar' }
  ];

  const pencahayaanOptions = [
    { value: 'pertahankan-sesuai-gambar-referensi', label: 'Pertahankan sesuai gambar referensi' },
    { value: 'led-hangat-tepi-plafon', label: 'LED hangat di tepi plafon' },
    { value: 'lampu-gantung-modern', label: 'Lampu gantung modern' },
    { value: 'lampu-sorot-minimalis', label: 'Lampu sorot minimalis' },
    { value: 'cahaya-alami-jendela-besar', label: 'Cahaya alami dari jendela besar' }
  ];

  const efekVisualOptions = [
    { value: 'pertahankan-sesuai-gambar-referensi', label: 'Pertahankan sesuai gambar referensi' },
    { value: 'bersih-dan-luas', label: 'Bersih dan luas' },
    { value: 'hangat-dan-nyaman', label: 'Hangat dan nyaman' },
    { value: 'elegan-dan-mewah', label: 'Elegan dan mewah' },
    { value: 'natural-dan-sejuk', label: 'Natural dan sejuk' }
  ];

  // HTML Color Chart with comprehensive color options
  const warnaColors = [
    // Basic Colors
    { value: '#FFFFFF', label: 'White', color: '#FFFFFF' },
    { value: '#000000', label: 'Black', color: '#000000' },
    { value: '#FF0000', label: 'Red', color: '#FF0000' },
    { value: '#00FF00', label: 'Lime', color: '#00FF00' },
    { value: '#0000FF', label: 'Blue', color: '#0000FF' },
    { value: '#FFFF00', label: 'Yellow', color: '#FFFF00' },
    { value: '#FF00FF', label: 'Magenta', color: '#FF00FF' },
    { value: '#00FFFF', label: 'Cyan', color: '#00FFFF' },
    
    // Gray Scale
    { value: '#C0C0C0', label: 'Silver', color: '#C0C0C0' },
    { value: '#808080', label: 'Gray', color: '#808080' },
    { value: '#800000', label: 'Maroon', color: '#800000' },
    { value: '#808000', label: 'Olive', color: '#808000' },
    { value: '#008000', label: 'Green', color: '#008000' },
    { value: '#800080', label: 'Purple', color: '#800080' },
    { value: '#008080', label: 'Teal', color: '#008080' },
    { value: '#000080', label: 'Navy', color: '#000080' },
    
    // Extended Colors
    { value: '#FFA500', label: 'Orange', color: '#FFA500' },
    { value: '#FFC0CB', label: 'Pink', color: '#FFC0CB' },
    { value: '#A52A2A', label: 'Brown', color: '#A52A2A' },
    { value: '#FFD700', label: 'Gold', color: '#FFD700' },
    { value: '#E6E6FA', label: 'Lavender', color: '#E6E6FA' },
    { value: '#98FB98', label: 'Pale Green', color: '#98FB98' },
    { value: '#87CEEB', label: 'Sky Blue', color: '#87CEEB' },
    { value: '#DDA0DD', label: 'Plum', color: '#DDA0DD' },
    
    // Popular Interior Colors
    { value: '#F5F5DC', label: 'Beige', color: '#F5F5DC' },
    { value: '#F0E68C', label: 'Khaki', color: '#F0E68C' },
    { value: '#E0E0E0', label: 'Light Gray', color: '#E0E0E0' },
    { value: '#F8F8FF', label: 'Ghost White', color: '#F8F8FF' },
    { value: '#F5F5F5', label: 'White Smoke', color: '#F5F5F5' },
    { value: '#FFFAF0', label: 'Floral White', color: '#FFFAF0' },
    { value: '#FDF5E6', label: 'Old Lace', color: '#FDF5E6' },
    { value: '#FAF0E6', label: 'Linen', color: '#FAF0E6' },
    
    // Warm Colors
    { value: '#FFEFD5', label: 'Papaya Whip', color: '#FFEFD5' },
    { value: '#FFEBCD', label: 'Blanched Almond', color: '#FFEBCD' },
    { value: '#FFE4B5', label: 'Moccasin', color: '#FFE4B5' },
    { value: '#FFDEAD', label: 'Navajo White', color: '#FFDEAD' },
    { value: '#F5DEB3', label: 'Wheat', color: '#F5DEB3' },
    { value: '#DEB887', label: 'Burlywood', color: '#DEB887' },
    { value: '#D2B48C', label: 'Tan', color: '#D2B48C' },
    { value: '#BC8F8F', label: 'Rosy Brown', color: '#BC8F8F' },
    
    // Cool Colors
    { value: '#B0E0E6', label: 'Powder Blue', color: '#B0E0E6' },
    { value: '#ADD8E6', label: 'Light Blue', color: '#ADD8E6' },
    { value: '#87CEFA', label: 'Light Sky Blue', color: '#87CEFA' },
    { value: '#B0C4DE', label: 'Light Steel Blue', color: '#B0C4DE' },
    { value: '#F0F8FF', label: 'Alice Blue', color: '#F0F8FF' },
    { value: '#E0FFFF', label: 'Light Cyan', color: '#E0FFFF' },
    { value: '#AFEEEE', label: 'Pale Turquoise', color: '#AFEEEE' },
    { value: '#F0FFFF', label: 'Azure', color: '#F0FFFF' }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Pengaturan Desain</span>
          <Badge variant="secondary">AI-Powered</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Gedung/Ruangan Selection */}
        <div className="space-y-2">
          <Label>Tipe Bangunan</Label>
          <Select 
            value={selections.gedungRuangan} 
            onValueChange={(value) => onSelectionChange('gedungRuangan', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tipe bangunan..." />
            </SelectTrigger>
            <SelectContent>
              {gedungRuanganOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Tema Selection */}
        <div className="space-y-2">
          <Label>Tema Desain</Label>
          <Select 
            value={selections.tema} 
            onValueChange={(value) => onSelectionChange('tema', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih tema desain..." />
            </SelectTrigger>
            <SelectContent>
              {temaOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Wall Color Picker with HTML Color Chart */}
        <div className="space-y-2">
          <Label>Warna Dinding</Label>
          <div className="grid grid-cols-8 gap-2 p-4 border rounded-lg bg-muted/30 max-h-48 overflow-y-auto">
            {warnaColors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => onSelectionChange('warnaDinding', color.value)}
                disabled={isLoading}
                className={`
                  w-8 h-8 rounded border-2 transition-all duration-200 hover:scale-110
                  ${selections.warnaDinding === color.value 
                    ? 'border-accent shadow-lg ring-2 ring-accent/30' 
                    : 'border-border hover:border-accent/50'
                  }
                `}
                style={{ backgroundColor: color.color }}
                title={color.label}
              />
            ))}
          </div>
          {/* Custom Color Picker */}
          <div className="flex items-center space-x-2">
            <Label className="text-sm">Custom Color:</Label>
            <input
              type="color"
              value={selections.warnaDinding || '#FFFFFF'}
              onChange={(e) => onSelectionChange('warnaDinding', e.target.value)}
              disabled={isLoading}
              className="w-12 h-8 border rounded cursor-pointer"
            />
            <span className="text-sm text-muted-foreground">
              {selections.warnaDinding || '#FFFFFF'}
            </span>
          </div>
          {selections.warnaDinding && (
            <p className="text-sm text-muted-foreground">
              Warna terpilih: {warnaColors.find(c => c.value === selections.warnaDinding)?.label || 'Custom'} ({selections.warnaDinding})
            </p>
          )}
        </div>

        {/* Material Lantai Selection */}
        <div className="space-y-2">
          <Label>Material Lantai</Label>
          <Select 
            value={selections.materialLantai} 
            onValueChange={(value) => onSelectionChange('materialLantai', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih material lantai..." />
            </SelectTrigger>
            <SelectContent>
              {materialLantaiOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Furnitur Selection */}
        <div className="space-y-2">
          <Label>Furnitur</Label>
          <Select 
            value={selections.furnitur} 
            onValueChange={(value) => onSelectionChange('furnitur', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih furnitur..." />
            </SelectTrigger>
            <SelectContent>
              {furniturOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Aksesoris Selection */}
        <div className="space-y-2">
          <Label>Aksesoris</Label>
          <Select 
            value={selections.aksesoris} 
            onValueChange={(value) => onSelectionChange('aksesoris', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih aksesoris..." />
            </SelectTrigger>
            <SelectContent>
              {aksesorisOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Pencahayaan Selection */}
        <div className="space-y-2">
          <Label>Pencahayaan</Label>
          <Select 
            value={selections.pencahayaan} 
            onValueChange={(value) => onSelectionChange('pencahayaan', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih pencahayaan..." />
            </SelectTrigger>
            <SelectContent>
              {pencahayaanOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Efek Visual Selection */}
        <div className="space-y-2">
          <Label>Efek Visual</Label>
          <Select 
            value={selections.efekVisual} 
            onValueChange={(value) => onSelectionChange('efekVisual', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih efek visual..." />
            </SelectTrigger>
            <SelectContent>
              {efekVisualOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Preview of selections */}
        <div className="p-4 bg-muted/30 rounded-lg border">
          <h4 className="font-medium mb-2">Preview Pilihan:</h4>
          <div className="space-y-1 text-sm">
            {selections.gedungRuangan && (
              <p><span className="font-medium">Tipe:</span> {gedungRuanganOptions.find(o => o.value === selections.gedungRuangan)?.label}</p>
            )}
            {selections.tema && (
              <p><span className="font-medium">Tema:</span> {temaOptions.find(o => o.value === selections.tema)?.label}</p>
            )}
            {selections.warnaDinding && (
              <p><span className="font-medium">Warna Dinding:</span> {warnaColors.find(c => c.value === selections.warnaDinding)?.label}</p>
            )}
            {selections.materialLantai && (
              <p><span className="font-medium">Lantai:</span> {materialLantaiOptions.find(o => o.value === selections.materialLantai)?.label}</p>
            )}
            {selections.furnitur && (
              <p><span className="font-medium">Furnitur:</span> {furniturOptions.find(o => o.value === selections.furnitur)?.label}</p>
            )}
            {selections.aksesoris && (
              <p><span className="font-medium">Aksesoris:</span> {aksesorisOptions.find(o => o.value === selections.aksesoris)?.label}</p>
            )}
            {selections.pencahayaan && (
              <p><span className="font-medium">Pencahayaan:</span> {pencahayaanOptions.find(o => o.value === selections.pencahayaan)?.label}</p>
            )}
            {selections.efekVisual && (
              <p><span className="font-medium">Efek Visual:</span> {efekVisualOptions.find(o => o.value === selections.efekVisual)?.label}</p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptDropdowns;