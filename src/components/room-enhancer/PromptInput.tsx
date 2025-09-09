import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { PromptInputProps } from '@/types/roomEnhancer';
import { STYLE_PRESETS } from '@/types/roomEnhancer';

const PromptInput: React.FC<PromptInputProps> = ({
  prompt,
  onPromptChange,
  selectedStyle,
  onStyleChange,
  isLoading = false
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>Deskripsi Renovasi</span>
          <Badge variant="secondary">AI-Powered</Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Style Preset Selection */}
        <div className="space-y-2">
          <Label htmlFor="style-select">Pilih Gaya Desain</Label>
          <Select 
            value={selectedStyle} 
            onValueChange={onStyleChange}
            disabled={isLoading}
          >
            <SelectTrigger id="style-select">
              <SelectValue placeholder="Pilih gaya desain..." />
            </SelectTrigger>
            <SelectContent>
              {STYLE_PRESETS.map((style) => (
                <SelectItem key={style.id} value={style.id}>
                  <div className="flex items-center gap-2">
                    <span>{style.name}</span>
                    <Badge variant="outline" className="text-xs">
                      {style.category}
                    </Badge>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {selectedStyle && (
            <div className="space-y-3 p-4 bg-muted/30 rounded-lg border">
              <div>
                <h4 className="font-medium text-sm mb-1">Deskripsi:</h4>
                <p className="text-sm text-muted-foreground">
                  {STYLE_PRESETS.find(s => s.id === selectedStyle)?.description}
                </p>
              </div>
              <div>
                <h4 className="font-medium text-sm mb-1">Ciri Utama:</h4>
                <p className="text-sm text-foreground font-medium">
                  {STYLE_PRESETS.find(s => s.id === selectedStyle)?.mainFeatures}
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Custom Prompt */}
        <div className="space-y-2">
          <Label htmlFor="prompt-textarea">Deskripsi Detail (Opsional)</Label>
          <Textarea
            id="prompt-textarea"
            placeholder="Contoh: Ubah warna dinding menjadi putih bersih, tambahkan tanaman hias di sudut ruangan, ganti furniture dengan yang lebih modern..."
            value={prompt}
            onChange={(e) => onPromptChange(e.target.value)}
            className="min-h-[120px] resize-none"
            disabled={isLoading}
          />
          <p className="text-xs text-muted-foreground">
            Berikan deskripsi detail tentang perubahan yang Anda inginkan untuk hasil yang lebih akurat.
          </p>
        </div>

        {/* Style Preview */}
        {selectedStyle && (
          <div className="p-4 bg-muted/50 rounded-lg">
            <h4 className="font-medium mb-2">Preview Gaya Terpilih:</h4>
            <div className="flex flex-wrap gap-2">
              {STYLE_PRESETS.find(s => s.id === selectedStyle)?.tags.map((tag) => (
                <Badge key={tag} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default PromptInput;