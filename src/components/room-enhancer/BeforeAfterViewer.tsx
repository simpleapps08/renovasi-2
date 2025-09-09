import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Download, Share2, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { BeforeAfterViewerProps } from '@/types/roomEnhancer';

const BeforeAfterViewer: React.FC<BeforeAfterViewerProps> = ({
  beforeImage,
  afterImage,
  isLoading = false,
  aiAnalysis,
  onRegenerate,
  onDownload,
  onShare
}) => {
  const [showComparison, setShowComparison] = useState(true);
  const [sliderPosition, setSliderPosition] = useState(50);
  
  console.log('BeforeAfterViewer props:', { 
    beforeImage: beforeImage ? 'File object present' : 'null/undefined', 
    afterImage: afterImage ? afterImage : 'null/undefined', 
    afterImageType: typeof afterImage,
    isLoading 
  });

  if (!beforeImage && !afterImage) {
    return null;
  }

  const handleSliderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <span>Hasil Renovasi</span>
            {afterImage && (
              <Badge variant="default" className="bg-green-600">
                Selesai
              </Badge>
            )}
            {isLoading && (
              <Badge variant="secondary">
                Memproses...
              </Badge>
            )}
          </CardTitle>
          
          <div className="flex items-center gap-2">
            {beforeImage && afterImage && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowComparison(!showComparison)}
              >
                {showComparison ? (
                  <><EyeOff className="h-4 w-4 mr-2" /> Hide Comparison</>
                ) : (
                  <><Eye className="h-4 w-4 mr-2" /> Show Comparison</>
                )}
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
            <div className="text-center space-y-4">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
              <p className="text-muted-foreground">AI sedang memproses renovasi Anda...</p>
              <p className="text-sm text-muted-foreground">Ini mungkin memakan waktu beberapa menit</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Before/After Comparison */}
            {beforeImage && afterImage && showComparison ? (
              <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                {/* Before Image */}
                <div 
                  className="absolute inset-0"
                  style={{ clipPath: `inset(0 ${100 - sliderPosition}% 0 0)` }}
                >
                  <img 
                    src={URL.createObjectURL(beforeImage)} 
                    alt="Before renovation" 
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge variant="secondary">Sebelum</Badge>
                  </div>
                </div>
                
                {/* After Image */}
                <div 
                  className="absolute inset-0"
                  style={{ clipPath: `inset(0 0 0 ${sliderPosition}%)` }}
                >
                  <img 
                    src={afterImage} 
                    alt="After renovation" 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      console.error('Error loading after image:', afterImage);
                      console.error('Image error event:', e);
                    }}
                    onLoad={() => {
                      console.log('After image loaded successfully:', afterImage);
                    }}
                  />
                  <div className="absolute top-4 right-4">
                    <Badge variant="default" className="bg-green-600">Sesudah</Badge>
                  </div>
                </div>
                
                {/* Slider */}
                <div className="absolute inset-0 flex items-center">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={sliderPosition}
                    onChange={handleSliderChange}
                    className="w-full h-full opacity-0 cursor-col-resize"
                  />
                  <div 
                    className="absolute w-1 bg-white shadow-lg pointer-events-none"
                    style={{ 
                      left: `${sliderPosition}%`, 
                      height: '100%',
                      transform: 'translateX(-50%)'
                    }}
                  >
                    <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full shadow-lg flex items-center justify-center">
                      <div className="w-4 h-4 bg-primary rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              /* Single Image View */
              <div className="space-y-4">
                {/* Always show both images if available, even in single view */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {beforeImage && (
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={URL.createObjectURL(beforeImage)} 
                        alt="Before renovation" 
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="secondary">Sebelum</Badge>
                      </div>
                    </div>
                  )}
                  
                  {afterImage ? (
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden">
                      <img 
                        src={afterImage} 
                        alt="After renovation" 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          console.error('Error loading after image (single view):', afterImage);
                          console.error('Image error event:', e);
                        }}
                        onLoad={() => {
                          console.log('After image loaded successfully (single view):', afterImage);
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <Badge variant="default" className="bg-green-600">Sesudah</Badge>
                      </div>
                    </div>
                  ) : beforeImage && (
                    <div className="relative aspect-video bg-muted rounded-lg overflow-hidden flex items-center justify-center">
                      <div className="text-center space-y-2">
                        <div className="text-muted-foreground">Gambar hasil renovasi akan muncul di sini</div>
                        <div className="text-sm text-muted-foreground">Klik "Generate Renovasi AI" untuk memulai</div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            {/* AI Analysis */}
            {aiAnalysis && (
              <div className="bg-muted/50 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Analisis AI</h4>
                <p className="text-sm text-muted-foreground">{aiAnalysis}</p>
              </div>
            )}
            
            {/* Action Buttons */}
            {afterImage && (
              <div className="flex flex-wrap gap-2 justify-center">
                <Button variant="outline" onClick={onDownload}>
                  <Download className="h-4 w-4 mr-2" />
                  Download
                </Button>
                <Button variant="outline" onClick={onShare}>
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline" onClick={onRegenerate}>
                  <RotateCcw className="h-4 w-4 mr-2" />
                  Generate Ulang
                </Button>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default BeforeAfterViewer;