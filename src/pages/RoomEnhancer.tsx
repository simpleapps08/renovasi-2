import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/enhanced-button';
import { Sparkles, Wand2, Upload, Download, RefreshCw, Clock, AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Link } from 'react-router-dom';
import FileUpload from '@/components/room-enhancer/FileUpload';
import PromptInput from '@/components/room-enhancer/PromptInput';
import BeforeAfterViewer from '@/components/room-enhancer/BeforeAfterViewer';
import { RoomEnhancerState, STYLE_PRESETS, GenerationHistoryItem } from '@/types/roomEnhancer';
import { realAiService } from '../services/realAiService';
import { storageService } from '../services/storageService';
import ErrorBoundary, { useErrorHandler } from '../components/ErrorBoundary';
import StorageManager from '../components/StorageManager';

const RoomEnhancer = () => {
  const { handleError } = useErrorHandler();
  
  const [state, setState] = useState<RoomEnhancerState>({
    selectedFile: null,
    prompt: '',
    selectedStyle: 'modern-minimalis',
    generatedImage: null,
    isLoading: false,
    error: null,
    generationHistory: [],
    aiAnalysis: null
  });
  
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [processingTime, setProcessingTime] = useState<number>(0);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Validate services on component mount
  useEffect(() => {
    const validateServices = async () => {
      try {
        // Check AI service health
        const healthCheck = await realAiService.checkHealth();
        
        // Initialize storage service
        await storageService.initializeBucket();
        
        setApiStatus(healthCheck.healthy ? 'connected' : 'error');
        
        if (!healthCheck.healthy) {
          console.warn('AI Service issues:', healthCheck.errors);
          toast('Beberapa layanan AI tidak tersedia, menggunakan mode demo');
        }
      } catch (error) {
        console.error('Service validation error:', error);
        handleError(error as Error, 'service initialization');
        setApiStatus('error');
        setState(prev => ({ ...prev, error: 'Gagal menginisialisasi layanan' }));
      }
    };
    
    validateServices();
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
    console.log('Generate button clicked');
    console.log('Selected file:', state.selectedFile);
    console.log('Prompt:', state.prompt);
    console.log('Style:', state.selectedStyle);
    
    if (!state.selectedFile) {
      console.log('No file selected, returning');
      setState(prev => ({ ...prev, error: 'Silakan pilih file gambar terlebih dahulu.' }));
      return;
    }

    if (!state.selectedStyle && !state.prompt.trim()) {
      setState(prev => ({ ...prev, error: 'Silakan pilih gaya desain atau berikan deskripsi.' }));
      return;
    }

    setState(prev => ({ ...prev, isLoading: true, error: null }));
    setAiAnalysis('');
    setProcessingTime(0);

    try {
        console.log('Starting AI enhancement with real AI service...');
        toast.loading('Memproses gambar dengan AI...', { id: 'ai-processing' });

        const result = await realAiService.generateEnhancedRoom({
          imageFile: state.selectedFile,
          prompt: state.prompt,
          stylePreset: state.selectedStyle,
          userId: 'demo-user' // In production, use actual user ID
        });

        console.log('AI Enhancement result:', result);
        toast.dismiss('ai-processing');

        if (result.success && result.enhancedImageUrl) {
          setState(prev => ({ 
            ...prev, 
            generatedImage: result.enhancedImageUrl,
            aiAnalysis: result.aiAnalysis || null,
            generationHistory: [...prev.generationHistory, {
              id: Date.now().toString(),
              originalImage: prev.selectedFile!,
              generatedImage: result.enhancedImageUrl,
              prompt: prev.prompt,
              style: prev.selectedStyle,
              timestamp: new Date()
            }]
          }));
          
          // Set additional data
          if (result.aiAnalysis) setAiAnalysis(result.aiAnalysis);
          if (result.processingTime) setProcessingTime(result.processingTime);
          
          toast.success(`Renovasi berhasil dibuat! (${result.processingTime || 0}ms)`);
        } else {
          throw new Error(result.error || 'Gagal menghasilkan gambar yang ditingkatkan');
        }
    } catch (error) {
      console.error('AI Enhancement error:', error);
      toast.dismiss('ai-processing');
      handleError(error as Error, 'AI image generation');
      
      const errorMessage = error instanceof Error ? error.message : 'Terjadi kesalahan saat memproses gambar.';
      setState(prev => ({ ...prev, error: errorMessage }));
      
      // Handle specific bucket error with detailed instructions
      if (errorMessage.includes('Storage bucket tidak ditemukan') || errorMessage.includes('Bucket not found')) {
        toast.error('❌ Setup Storage Diperlukan', {
          duration: 8000,
          description: 'Buka SUPABASE_STORAGE_SETUP_GUIDE.md untuk panduan lengkap'
        });
        setRetryCount(0);
        return;
      }
      
      // Retry logic for transient errors
      if (retryCount < 2 && (errorMessage.includes('network') || errorMessage.includes('timeout'))) {
        setRetryCount(prev => prev + 1);
        toast.error(`Gagal memproses gambar, mencoba lagi... (${retryCount + 1}/3)`);
        setTimeout(() => handleGenerate(), 2000);
      } else {
        toast.error('Gagal memproses gambar: ' + errorMessage);
        setRetryCount(0);
      }
    } finally {
      setState(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleRegenerate = async () => {
    if (!state.selectedFile || !state.selectedStyle) return;
    
    setState(prev => ({ ...prev, generatedImage: null }));
    setAiAnalysis('');
    setProcessingTime(0);
    await handleGenerate();
  };

  const handleDownload = async () => {
    if (state.generatedImage) {
      try {
        toast.loading('Mempersiapkan download...', { id: 'download' });
        
        const response = await fetch(state.generatedImage);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const blob = await response.blob();
        const url = window.URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.style.display = 'none';
        link.href = url;
        
        // Create descriptive filename
        const styleName = state.selectedStyle.replace('-', '_');
        const timestamp = new Date().toISOString().slice(0, 19).replace(/[:.]/g, '-');
        link.download = `room_renovation_${styleName}_${timestamp}.png`;
        
        // Append to body, click, and remove
        document.body.appendChild(link);
        link.click();
        
        // Cleanup
        setTimeout(() => {
          window.URL.revokeObjectURL(url);
          document.body.removeChild(link);
        }, 100);
        
        toast.dismiss('download');
        toast.success('Gambar berhasil didownload!');
      } catch (error) {
        console.error('Download error:', error);
        toast.dismiss('download');
        handleError(error as Error, 'image download');
        toast.error('Gagal mendownload gambar. Silakan coba lagi.');
      }
    } else {
      toast.error('Tidak ada gambar untuk didownload.');
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
    <ErrorBoundary>
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
            <div className="flex items-start space-x-3">
              <div className="flex-shrink-0">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
              </div>
              <div className="flex-1">
                <h4 className="text-destructive font-medium mb-1">Error</h4>
                <div className="text-destructive text-sm whitespace-pre-line">{state.error}</div>
                {(state.error.includes('Storage bucket tidak ditemukan') || state.error.includes('Bucket not found')) && (
                  <div className="mt-3 p-3 bg-card rounded border border-border">
                    <p className="text-sm font-medium text-foreground mb-2">🔧 Cara Mengatasi:</p>
                    <ol className="text-sm text-muted-foreground space-y-1 list-decimal list-inside">
                      <li>Buka Supabase Dashboard → Storage</li>
                      <li>Buat bucket baru: <code className="bg-muted px-1 rounded">room-enhancer-images</code></li>
                      <li>Set sebagai Public bucket</li>
                      <li>Atau jalankan file: <code className="bg-muted px-1 rounded">setup_storage_bucket.sql</code></li>
                    </ol>
                    <p className="text-xs text-muted-foreground mt-2">
                      📖 Panduan lengkap: <code className="bg-muted px-1 rounded">SUPABASE_STORAGE_SETUP_GUIDE.md</code>
                    </p>
                  </div>
                )}
              </div>
            </div>
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
        {(state.selectedFile || state.generatedImage) && (
          <BeforeAfterViewer
            beforeImage={state.selectedFile}
            afterImage={state.generatedImage}
            isLoading={state.isLoading}
            aiAnalysis={state.aiAnalysis}
            onRegenerate={handleRegenerate}
            onDownload={handleDownload}
            onShare={handleShare}
          />
        )}

        {/* Storage Management Section */}
        <StorageManager />
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default RoomEnhancer;