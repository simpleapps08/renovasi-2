import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/enhanced-button';
import { Sparkles, Wand2, Upload } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import FileUpload from '@/components/room-enhancer/FileUpload';
import PromptInput from '@/components/room-enhancer/PromptInput';
import BeforeAfterViewer from '@/components/room-enhancer/BeforeAfterViewer';
import { RoomEnhancerState, STYLE_PRESETS } from '@/types/roomEnhancer';
import { aiService } from '@/services/aiService';

const RoomEnhancer = () => {
  const [state, setState] = useState<RoomEnhancerState>({
    selectedFile: null,
    prompt: '',
    selectedStyle: '',
    isLoading: false,
    generatedImage: null,
    error: null,
    generationHistory: []
  });
  
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');

  // Validate API key on component mount
  useEffect(() => {
    const validateApi = async () => {
      try {
        const isValid = await aiService.validateApiKey();
        setApiStatus(isValid ? 'connected' : 'error');
        if (!isValid) {
          setState(prev => ({ ...prev, error: 'Google AI Studio API key tidak valid atau tidak ditemukan.' }));
        }
      } catch (error) {
        setApiStatus('error');
        setState(prev => ({ ...prev, error: 'Gagal memvalidasi API key.' }));
      }
    };
    
    validateApi();
  }, []);

  const handleFileSelect = (file: File) => {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      setState(prev => ({ ...prev, error: 'File terlalu besar. Maksimal 10MB.' }));
      return;
    }
    setState(prev => ({ 
      ...prev, 
      selectedFile: file, 
      error: null,
      generatedImage: null 
    }));
  };

  const handleFileRemove = () => {
    setState(prev => ({ 
      ...prev, 
      selectedFile: null, 
      generatedImage: null 
    }));
  };

  const handleGenerate = async () => {
    if (!state.selectedFile) {
      setState(prev => ({ ...prev, error: 'Silakan pilih file gambar terlebih dahulu.' }));
      return;
    }

    if (!state.selectedStyle && !state.prompt.trim()) {
      setState(prev => ({ ...prev, error: 'Silakan pilih gaya desain atau berikan deskripsi.' }));
      return;
    }

    if (apiStatus !== 'connected') {
      setState(prev => ({ ...prev, error: 'Google AI Studio tidak terhubung. Periksa API key Anda.' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));

    try {
      // Use Google AI Studio API through aiService
      const result = await aiService.generateEnhancedRoom({
        imageFile: state.selectedFile,
        prompt: state.prompt,
        stylePreset: state.selectedStyle
      });

      if (result.success && result.enhancedImageUrl) {
        setState(prev => ({ 
          ...prev, 
          generatedImage: result.enhancedImageUrl!,
          generationHistory: [...prev.generationHistory, {
            id: Date.now().toString(),
            originalImage: prev.selectedFile!,
            generatedImage: result.enhancedImageUrl!,
            prompt: prev.prompt,
            style: prev.selectedStyle,
            timestamp: new Date()
          }]
        }));
        
        toast.success(`Renovasi berhasil dibuat! (${result.processingTime}ms)`);
      } else {
        throw new Error(result.error || 'Gagal menghasilkan gambar');
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat memproses gambar.';
      setState(prev => ({ ...prev, error: errorMessage }));
      toast.error('Gagal memproses gambar: ' + errorMessage);
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleRegenerate = () => {
    handleGenerate();
  };

  const handleDownload = () => {
    if (state.generatedImage) {
      const link = document.createElement('a');
      link.href = state.generatedImage;
      link.download = `room-renovation-${Date.now()}.jpg`;
      link.click();
      toast.success('Gambar berhasil didownload!');
    }
  };

  const handleShare = async () => {
    if (state.generatedImage && navigator.share) {
      try {
        await navigator.share({
          title: 'Hasil Renovasi Room Enhancer',
          text: 'Lihat hasil renovasi ruangan saya menggunakan AI!',
          url: state.generatedImage
        });
      } catch (error) {
        // Fallback to copy URL
        navigator.clipboard.writeText(state.generatedImage);
        toast.success('Link gambar berhasil disalin!');
      }
    } else if (state.generatedImage) {
      navigator.clipboard.writeText(state.generatedImage);
      toast.success('Link gambar berhasil disalin!');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card shadow-sm border-b border-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="p-2 bg-accent/10 rounded-lg">
                <Wand2 className="h-6 w-6 text-accent" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-foreground">Room Enhancer</h1>
                <p className="text-muted-foreground">Transform ruangan Anda dengan AI</p>
              </div>
            </div>
            
            {/* API Status Indicator */}
            <div className="flex items-center space-x-2">
              <div className={`w-2 h-2 rounded-full ${
                apiStatus === 'connected' ? 'bg-green-500' :
                apiStatus === 'error' ? 'bg-red-500' : 'bg-yellow-500'
              }`} />
              <span className="text-sm text-muted-foreground">
                {apiStatus === 'connected' ? 'Google AI Connected' :
                 apiStatus === 'error' ? 'AI Disconnected' : 'Checking AI...'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back to Dashboard Button */}
        <div className="mb-6">
          <Button asChild variant="outline" className="border-accent/30 text-accent hover:bg-accent/10">
            <Link to="/dashboard">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Kembali ke Dashboard
            </Link>
          </Button>
        </div>

        <div className="bg-gradient-to-br from-accent/5 to-accent/10 rounded-2xl p-8 mb-8 border border-accent/20">
          <div className="flex items-center gap-3 mb-4">
            <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20">
              <Sparkles className="w-3 h-3 mr-1" />
              Powered by AI Technology
            </Badge>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            <span className="bg-gradient-to-r from-accent to-accent-dark bg-clip-text text-transparent">
              Room Enhancer AI
            </span>
          </h1>
          <p className="text-foreground/80 text-lg mb-6 max-w-2xl">
            Transform ruangan Anda dengan teknologi AI terdepan. Upload foto ruangan, 
            pilih gaya desain, dan dapatkan visualisasi renovasi yang menakjubkan dalam hitungan detik.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-card rounded-lg p-4 shadow-sm border border-accent/10">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                <Upload className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Upload Foto</h3>
              <p className="text-sm text-muted-foreground">Unggah foto ruangan yang ingin direnovasi</p>
            </div>
            
            <div className="bg-card rounded-lg p-4 shadow-sm border border-accent/10">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                <Wand2 className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Pilih Gaya</h3>
              <p className="text-sm text-muted-foreground">Tentukan gaya desain sesuai preferensi</p>
            </div>
            
            <div className="bg-card rounded-lg p-4 shadow-sm border border-accent/10">
              <div className="w-10 h-10 bg-accent/10 rounded-lg flex items-center justify-center mb-3">
                <Sparkles className="w-5 h-5 text-accent" />
              </div>
              <h3 className="font-semibold text-foreground mb-1">Hasil AI</h3>
              <p className="text-sm text-muted-foreground">Dapatkan visualisasi renovasi yang realistis</p>
            </div>
          </div>
        </div>

        {state.error && (
          <div className="bg-destructive/15 border border-destructive/20 rounded-lg p-4 mb-6">
            <p className="text-destructive text-sm">{state.error}</p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Upload Section */}
          <FileUpload
            onFileSelect={handleFileSelect}
            selectedFile={state.selectedFile}
            onFileRemove={handleFileRemove}
            isLoading={state.isLoading}
          />

          {/* Prompt Section */}
          <PromptInput
            prompt={state.prompt}
            onPromptChange={(prompt) => setState(prev => ({ ...prev, prompt }))}
            selectedStyle={state.selectedStyle}
            onStyleChange={(style) => setState(prev => ({ ...prev, selectedStyle: style }))}
            isLoading={state.isLoading}
          />
        </div>

        {/* Generate Button */}
        <div className="flex justify-center">
          <Button 
            onClick={handleGenerate} 
            className="px-12 py-4 text-lg font-semibold bg-gradient-to-r from-accent to-accent-dark hover:from-accent/90 hover:to-accent-dark/90 shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105" 
            size="lg"
            disabled={state.isLoading || !state.selectedFile}
          >
            {state.isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                <span>Memproses Renovasi...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-5 w-5 mr-3" />
                <span>Generate Renovasi AI</span>
              </>
            )}
          </Button>
        </div>

        {/* Results Section */}
        <BeforeAfterViewer
          beforeImage={state.selectedFile}
          afterImage={state.generatedImage}
          isLoading={state.isLoading}
          onRegenerate={handleRegenerate}
          onDownload={handleDownload}
          onShare={handleShare}
        />
      </div>
    </div>
  );
};

export default RoomEnhancer;