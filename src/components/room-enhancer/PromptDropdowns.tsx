import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';

interface PromptDropdownsProps {
  selections: {
    warnaDinding: string;
    finishingCat: string;
    gayaInterior: string;
    aksesoris1: string;
    aksesoris2: string;
    aksesoris3: string;
    jenisPencahayaan: string;
    suasana: string;
  };
  onSelectionChange: (key: string, value: string) => void;
  isLoading?: boolean;
}

const PromptDropdowns: React.FC<PromptDropdownsProps> = ({
  selections,
  onSelectionChange,
  isLoading = false
}) => {
  const finishingCatOptions = [
    { value: 'matte lembut', label: 'Matte Lembut' },
    { value: 'semi-gloss', label: 'Semi-Gloss' },
    { value: 'tekstur semen halus', label: 'Tekstur Semen Halus' },
    { value: 'metallic accent', label: 'Metallic Accent' }
  ];

  const gayaInteriorOptions = [
    { value: 'minimalis Skandinavia', label: 'Minimalis Skandinavia' },
    { value: 'modern luxury', label: 'Modern Luxury' },
    { value: 'bohemian natural', label: 'Bohemian Natural' },
    { value: 'industrial urban', label: 'Industrial Urban' },
    { value: 'Japandi clean', label: 'Japandi Clean' }
  ];

  const aksesoris1Options = [
    { value: 'lukisan abstrak berbingkai kayu terang', label: 'Lukisan abstrak berbingkai kayu terang' },
    { value: 'poster monokrom', label: 'Poster monokrom' },
    { value: 'cermin bundar besar', label: 'Cermin bundar besar' },
    { value: 'pajangan logam minimal', label: 'Pajangan logam minimal' }
  ];

  const aksesoris2Options = [
    { value: 'vas putih dengan tanaman hijau kecil', label: 'Vas putih dengan tanaman hijau kecil' },
    { value: 'tanaman monstera dalam pot rotan', label: 'Tanaman monstera dalam pot rotan' },
    { value: 'patung dekoratif batu', label: 'Patung dekoratif batu' },
    { value: 'lampu meja geometris', label: 'Lampu meja geometris' }
  ];

  const aksesoris3Options = [
    { value: 'bantal linen netral di sofa', label: 'Bantal linen netral di sofa' },
    { value: 'karpet rajut tebal warna krem', label: 'Karpet rajut tebal warna krem' },
    { value: 'throw blanket wol abu muda', label: 'Throw blanket wol abu muda' },
    { value: 'kursi aksen rotan', label: 'Kursi aksen rotan' }
  ];

  const jenisPencahayaanOptions = [
    { value: 'pencahayaan alami dari jendela', label: 'Pencahayaan alami dari jendela' },
    { value: 'lampu gantung hangat 3000K', label: 'Lampu gantung hangat 3000K' },
    { value: 'cahaya lembut sore hari', label: 'Cahaya lembut sore hari' },
    { value: 'soft LED putih netral', label: 'Soft LED putih netral' }
  ];

  const suasanaOptions = [
    { value: 'tenang dan bersih', label: 'Tenang dan bersih' },
    { value: 'hangat dan nyaman', label: 'Hangat dan nyaman' },
    { value: 'elegan dan kontemporer', label: 'Elegan dan kontemporer' },
    { value: 'alami dan segar', label: 'Alami dan segar' }
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

        {/* Finishing Cat Selection */}
        <div className="space-y-2">
          <Label>Finishing Cat</Label>
          <Select 
            value={selections.finishingCat} 
            onValueChange={(value) => onSelectionChange('finishingCat', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih finishing cat..." />
            </SelectTrigger>
            <SelectContent>
              {finishingCatOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Gaya Interior Selection */}
        <div className="space-y-2">
          <Label>Gaya Interior</Label>
          <Select 
            value={selections.gayaInterior} 
            onValueChange={(value) => onSelectionChange('gayaInterior', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih gaya interior..." />
            </SelectTrigger>
            <SelectContent>
              {gayaInteriorOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Aksesoris 1 Selection */}
        <div className="space-y-2">
          <Label>Aksesori 1</Label>
          <Select 
            value={selections.aksesoris1} 
            onValueChange={(value) => onSelectionChange('aksesoris1', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih aksesori 1..." />
            </SelectTrigger>
            <SelectContent>
              {aksesoris1Options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Aksesoris 2 Selection */}
        <div className="space-y-2">
          <Label>Aksesori 2</Label>
          <Select 
            value={selections.aksesoris2} 
            onValueChange={(value) => onSelectionChange('aksesoris2', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih aksesori 2..." />
            </SelectTrigger>
            <SelectContent>
              {aksesoris2Options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Aksesoris 3 Selection */}
        <div className="space-y-2">
          <Label>Aksesori 3</Label>
          <Select 
            value={selections.aksesoris3} 
            onValueChange={(value) => onSelectionChange('aksesoris3', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih aksesori 3..." />
            </SelectTrigger>
            <SelectContent>
              {aksesoris3Options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Jenis Pencahayaan Selection */}
        <div className="space-y-2">
          <Label>Jenis Pencahayaan</Label>
          <Select 
            value={selections.jenisPencahayaan} 
            onValueChange={(value) => onSelectionChange('jenisPencahayaan', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih jenis pencahayaan..." />
            </SelectTrigger>
            <SelectContent>
              {jenisPencahayaanOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Suasana Selection */}
        <div className="space-y-2">
          <Label>Suasana</Label>
          <Select 
            value={selections.suasana} 
            onValueChange={(value) => onSelectionChange('suasana', value)}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Pilih suasana..." />
            </SelectTrigger>
            <SelectContent>
              {suasanaOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default PromptDropdowns;