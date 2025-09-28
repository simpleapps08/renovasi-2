import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/enhanced-button';
import { Sparkles, Wand2, Upload, Download, RefreshCw, Clock, AlertCircle, Lock, Home } from 'lucide-react';
import { toast } from 'sonner';
import { Link, Navigate } from 'react-router-dom';
import FileUpload from '@/components/room-enhancer/FileUpload';
import PromptDropdowns from '@/components/room-enhancer/PromptDropdowns';
import BeforeAfterViewer from '@/components/room-enhancer/BeforeAfterViewer';
import { RoomEnhancerState, STYLE_PRESETS, GenerationHistoryItem } from '@/types/roomEnhancer';
import { realAiService } from '../services/realAiService';
import { storageService } from '../services/storageService';
import { geminiFlashService } from '../services/geminiFlashService';
import ErrorBoundary, { useErrorHandler } from '../components/ErrorBoundary';
import StorageManager from '../components/StorageManager';
import { useAuth } from '../contexts/AuthContext';

const RoomEnhancer = () => {
  const { handleError } = useErrorHandler();
  const { user, loading } = useAuth();
  
  // Redirect to login if not authenticated
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p>Memuat...</p>
        </div>
      </div>
    );
  }
  
  if (!user) {
    return <Navigate to="/auth" replace />;
  }
  
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
  
  // New state for dropdown selections
  const [promptSelections, setPromptSelections] = useState({
    gedungRuangan: '',
    tema: '',
    warnaDinding: '',
    materialLantai: '',
    furnitur: '',
    aksesoris: '',
    pencahayaan: '',
    efekVisual: ''
  });
  
  const [apiStatus, setApiStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [aiAnalysis, setAiAnalysis] = useState<string>('');
  const [selectedModel, setSelectedModel] = useState<'realai' | 'gemini-flash'>('gemini-flash');
  const [processingTime, setProcessingTime] = useState<number>(0);
  const [retryCount, setRetryCount] = useState<number>(0);

  // Function to generate prompt from selections
  const generatePromptFromSelections = () => {
    const mappings = {
      gedungRuangan: {
        'ruangan': 'ruangan',
        'gedung': 'gedung'
      },
      tema: {
        'modern-minimalis': 'Modern Minimalis',
        'skandinavia': 'Skandinavia',
        'industrial': 'Industrial',
        'tradisional': 'Tradisional',
        'kontemporer': 'Kontemporer'
      },
      materialLantai: {
        'kayu-oak-terang': 'Kayu oak terang',
        'marmer-putih': 'Marmer putih',
        'granit-gelap': 'Granit gelap',
        'keramik-polos': 'Keramik polos',
        'beton-ekspos': 'Beton ekspos'
      },
      furnitur: {
        'sofa-minimalis-abu-abu': 'Sofa minimalis abu-abu',
        'meja-kayu-modern': 'Meja kayu modern',
        'kursi-bergaya-retro': 'Kursi bergaya retro',
        'rak-buku-terbuka': 'Rak buku terbuka',
        'tempat-tidur-sederhana': 'Tempat tidur sederhana'
      },
      aksesoris: {
        'tanaman-indoor': 'Tanaman indoor',
        'lampu-gantung': 'Lampu gantung',
        'karpet-motif-geometris': 'Karpet motif geometris',
        'lukisan-dinding': 'Lukisan dinding',
        'cermin-besar': 'Cermin besar'
      },
      pencahayaan: {
        'led-hangat-tepi-plafon': 'LED hangat di tepi plafon',
        'lampu-gantung-modern': 'Lampu gantung modern',
        'lampu-sorot-minimalis': 'Lampu sorot minimalis',
        'cahaya-alami-jendela-besar': 'Cahaya alami dari jendela besar'
      },
      efekVisual: {
        'bersih-dan-luas': 'bersih dan luas',
        'hangat-dan-nyaman': 'hangat dan nyaman',
        'elegan-dan-mewah': 'elegan dan mewah',
        'natural-dan-sejuk': 'natural dan sejuk'
      }
    };

    let prompt = `Gunakan gambar ${mappings.gedungRuangan[promptSelections.gedungRuangan] || '[GEDUNG/RUANGAN]'} yang diupload sebagai referensi. `;
    prompt += `Ubah tampilannya menjadi desain ${mappings.tema[promptSelections.tema] || '[TEMA]'}. `;
    prompt += `Ganti warna/tekstur dinding menjadi ${promptSelections.warnaDinding || '[WARNA DINDING]'}. `;
    prompt += `Ubah lantai menjadi ${mappings.materialLantai[promptSelections.materialLantai] || '[MATERIAL LANTAI]'}. `;
    prompt += `Tambahkan furnitur: ${mappings.furnitur[promptSelections.furnitur] || '[FURNITUR]'}. `;
    prompt += `Tambahkan aksesoris: ${mappings.aksesoris[promptSelections.aksesoris] || '[AKSESORIS]'}. `;
    prompt += `Tambahkan pencahayaan ${mappings.pencahayaan[promptSelections.pencahayaan] || '[PENCAHAYAAN]'}. `;
    prompt += `Pertahankan tata letak dan proporsi asli ruangan/gedung, tetapi tingkatkan kesan agar terlihat ${mappings.efekVisual[promptSelections.efekVisual] || '[EFEK VISUAL]'}. `;
    prompt += `Pastikan pencahayaan dan perspektif tetap konsisten dengan foto asli. `;
    prompt += `Hindari distorsi, pantulan tidak wajar, atau permukaan yang terlalu mengkilap.`;

    return prompt;
  };

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

    // Generate prompt from selections
    const generatedPrompt = generatePromptFromSelections();
    
    setState(prev => ({ 
      ...prev, 
      isLoading: true, 
      error: null,
      prompt: generatedPrompt // Update the prompt with generated one
    }));
    setAiAnalysis('');
    setProcessingTime(0);

    try {
        const modelName = selectedModel === 'gemini-flash' ? 'Gemini Flash 2.5' : 'Real AI';
        console.log(`Starting AI enhancement with ${modelName} service...`);
        toast.loading(`Memproses gambar dengan ${modelName}...`, { id: 'ai-processing' });

        let result;
        if (selectedModel === 'gemini-flash') {
          // Use Gemini Flash service
          const enhancedResult = await geminiFlashService.generateContent({
            imageFile: state.selectedFile,
            prompt: state.prompt || `Enhance this room with ${state.selectedStyle} style`,
            model: 'gemini-2.5-flash-image-preview'
          });
          
          result = {
            success: enhancedResult.success,
            enhancedImageUrl: enhancedResult.imageUrl,
            aiAnalysis: enhancedResult.analysis,
            processingTime: enhancedResult.processingTime,
            error: enhancedResult.error
          };
        } else {
          // Use existing Real AI service
          result = await realAiService.generateEnhancedRoom({
            imageFile: state.selectedFile,
            prompt: state.prompt,
            stylePreset: state.selectedStyle,
            userId: 'demo-user' // In production, use actual user ID
          });
        }

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
          title: 'Hasil Renovasi Desain Cerdas',
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
          <div className="flex flex-col space-y-4">
            {/* Top row with home button, title, and AI status */}
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button asChild variant="outline" className="border-accent/30 text-accent hover:bg-accent/10 p-2">
                  <Link to="/">
                    <Home className="w-4 h-4" />
                  </Link>
                </Button>
                <div>
                  <h1 className="text-2xl font-bold text-foreground">Desain Cerdas</h1>
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
            
            {/* Full width description text */}
            <div className="w-full">
              <p className="text-muted-foreground text-center">Biarkan AI memberi inspirasi desain yang sesuai dengan gaya Anda</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          {/* Prompt Dropdowns Section */}
          <PromptDropdowns
            selections={promptSelections}
            onSelectionChange={(key, value) => 
              setPromptSelections(prev => ({ ...prev, [key]: value }))
            }
            isLoading={state.isLoading}
          />
        </div>

        {/* AI Model Selection */}
        <div className="flex justify-center mb-6">
          <Card className="w-full max-w-md">
            <CardHeader className="pb-3">
              <CardTitle className="text-lg flex items-center gap-2">
                <Wand2 className="h-5 w-5 text-accent" />
                Model AI
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="realai"
                    name="aiModel"
                    value="realai"
                    checked={selectedModel === 'realai'}
                    onChange={(e) => setSelectedModel(e.target.value as 'realai' | 'gemini-flash')}
                    className="w-4 h-4 text-accent border-gray-300 focus:ring-accent"
                  />
                  <label htmlFor="realai" className="text-sm font-medium text-foreground">
                    Real AI Service
                  </label>
                  <Badge variant="secondary" className="text-xs">
                    Default
                  </Badge>
                </div>
                <div className="flex items-center space-x-2">
                  <input
                    type="radio"
                    id="gemini-flash"
                    name="aiModel"
                    value="gemini-flash"
                    checked={selectedModel === 'gemini-flash'}
                    onChange={(e) => setSelectedModel(e.target.value as 'realai' | 'gemini-flash')}
                    className="w-4 h-4 text-accent border-gray-300 focus:ring-accent"
                  />
                  <label htmlFor="gemini-flash" className="text-sm font-medium text-foreground">
                    Gemini Flash 2.5 Image Preview
                  </label>
                  <Badge variant="outline" className="text-xs border-accent/30 text-accent">
                    New
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
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