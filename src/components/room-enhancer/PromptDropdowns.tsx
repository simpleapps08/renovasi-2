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
    { value: 'kayu-oak-terang', label: 'Kayu oak terang' },
    { value: 'marmer-putih', label: 'Marmer putih' },
    { value: 'granit-gelap', label: 'Granit gelap' },
    { value: 'keramik-polos', label: 'Keramik polos' },
    { value: 'beton-ekspos', label: 'Beton ekspos' }
  ];

  const furniturOptions = [
    { value: 'sofa-minimalis-abu-abu', label: 'Sofa minimalis abu-abu' },
    { value: 'meja-kayu-modern', label: 'Meja kayu modern' },
    { value: 'kursi-bergaya-retro', label: 'Kursi bergaya retro' },
    { value: 'rak-buku-terbuka', label: 'Rak buku terbuka' },
    { value: 'tempat-tidur-sederhana', label: 'Tempat tidur sederhana' }
  ];

  const aksesorisOptions = [
    { value: 'tanaman-indoor', label: 'Tanaman indoor' },
    { value: 'lampu-gantung', label: 'Lampu gantung' },
    { value: 'karpet-motif-geometris', label: 'Karpet motif geometris' },
    { value: 'lukisan-dinding', label: 'Lukisan dinding' },
    { value: 'cermin-besar', label: 'Cermin besar' }
  ];

  const pencahayaanOptions = [
    { value: 'led-hangat-tepi-plafon', label: 'LED hangat di tepi plafon' },
    { value: 'lampu-gantung-modern', label: 'Lampu gantung modern' },
    { value: 'lampu-sorot-minimalis', label: 'Lampu sorot minimalis' },
    { value: 'cahaya-alami-jendela-besar', label: 'Cahaya alami dari jendela besar' }
  ];

  const efekVisualOptions = [
    { value: 'bersih-dan-luas', label: 'Bersih dan luas' },
    { value: 'hangat-dan-nyaman', label: 'Hangat dan nyaman' },
    { value: 'elegan-dan-mewah', label: 'Elegan dan mewah' },
    { value: 'natural-dan-sejuk', label: 'Natural dan sejuk' }
  ];

  // Color options for wall colors with hex codes
  const warnaColors = [
    { value: '#FFFFFF', label: 'Putih', color: '#FFFFFF' },
    { value: '#F5F5F5', label: 'Off White', color: '#F5F5F5' },
    { value: '#E8E8E8', label: 'Abu Terang', color: '#E8E8E8' },
    { value: '#D3D3D3', label: 'Abu Sedang', color: '#D3D3D3' },
    { value: '#A9A9A9', label: 'Abu Gelap', color: '#A9A9A9' },
    { value: '#F0E68C', label: 'Krem', color: '#F0E68C' },
    { value: '#DEB887', label: 'Beige', color: '#DEB887' },
    { value: '#8FBC8F', label: 'Hijau Sage', color: '#8FBC8F' },
    { value: '#B0C4DE', label: 'Biru Muda', color: '#B0C4DE' },
    { value: '#F5DEB3', label: 'Wheat', color: '#F5DEB3' },
    { value: '#FFE4E1', label: 'Pink Muda', color: '#FFE4E1' },
    { value: '#E6E6FA', label: 'Lavender', color: '#E6E6FA' }
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

        {/* Warna Dinding - Color Picker */}
        <div className="space-y-2">
          <Label>Warna Dinding</Label>
          <div className="grid grid-cols-6 gap-2">
            {warnaColors.map((color) => (
              <button
                key={color.value}
                type="button"
                onClick={() => onSelectionChange('warnaDinding', color.value)}
                disabled={isLoading}
                className={`
                  w-12 h-12 rounded-lg border-2 transition-all duration-200 hover:scale-105
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
          {selections.warnaDinding && (
            <p className="text-sm text-muted-foreground">
              Warna terpilih: {warnaColors.find(c => c.value === selections.warnaDinding)?.label} ({selections.warnaDinding})
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