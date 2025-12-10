import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/enhanced-button';
import { Badge } from '@/components/ui/badge';
import {
  Sparkles,
  Wand2,
  Home,
  ArrowRight,
  RefreshCw,
  Upload,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { geminiFlashService } from '@/services/geminiFlashService';
import FileUpload from '@/components/room-enhancer/FileUpload';
import BeforeAfterViewer from '@/components/room-enhancer/BeforeAfterViewer';
import { toast } from 'sonner';
import ErrorBoundary from '@/components/ErrorBoundary';

const STEPS = [
  { id: 1, title: 'Upload', desc: 'Foto Ruangan' },
  { id: 2, title: 'Analisis', desc: 'AI Vision' },
  { id: 3, title: 'Prompt', desc: 'Refinement' },
  { id: 4, title: 'Proses', desc: 'Generating' },
  { id: 5, title: 'Hasil', desc: 'Selesai' }
];

const RoomEnhancer = () => {
  const { user, loading: authLoading } = useAuth();

  // State Machine
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Data State
  const [file, setFile] = useState<File | null>(null);
  const [instruction, setInstruction] = useState('');
  const [analysis, setAnalysis] = useState('');
  const [refinedPrompt, setRefinedPrompt] = useState('');
  const [resultImage, setResultImage] = useState<string | null>(null);

  const handleReset = () => {
    setStep(1);
    setFile(null);
    setInstruction('');
    setAnalysis('');
    setRefinedPrompt('');
    setResultImage(null);
    setError(null);
  };

  const startRenovation = async () => {
    if (!file) {
      toast.error('Silakan upload foto terlebih dahulu');
      return;
    }
    if (!instruction.trim()) {
      toast.error('Mohon berikan instruksi renovasi (contoh: Ganti dinding jadi biru)');
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      // Step 2: Analyze
      setStep(2);
      const analysisResult = await geminiFlashService.analyzeRoomImage(file);
      setAnalysis(analysisResult);

      // Step 3: Refine
      setStep(3);
      const promptResult = await geminiFlashService.refinePrompt(instruction, analysisResult);
      setRefinedPrompt(promptResult);

      // Step 4: Generate
      setStep(4);
      const imageUrl = await geminiFlashService.generateRoomImage(file, promptResult);
      setResultImage(imageUrl);

      // Done
      setStep(5);
      toast.success('Renovasi selesai!');

    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Terjadi kesalahan saat memproses.');
      toast.error('Gagal memproses permintaan.');
      // Stay on current step or move specific step?
      // Staying allows retry.
    } finally {
      setIsLoading(false);
    }
  };

  if (authLoading) return <div className="flex h-screen items-center justify-center"><RefreshCw className="animate-spin text-green-600" /></div>;
  if (!user) return <Navigate to="/auth" replace />;

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50 pb-20">

        {/* Header */}
        <div className="bg-white sticky top-0 z-40 border-b shadow-sm">
          <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Button variant="ghost" size="icon" asChild>
                <Link to="/dashboard"><Home className="w-5 h-5" /></Link>
              </Button>
              <div>
                <h1 className="font-bold text-gray-900 text-lg">AI Room Renovator</h1>
                <p className="text-xs text-gray-500">Free Tier Optimized</p>
              </div>
            </div>

            {/* Steps Indicator */}
            <div className="hidden md:flex items-center gap-2">
              {STEPS.map((s) => (
                <div key={s.id} className="flex items-center gap-2">
                  <div className={`
                    w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border
                    ${step >= s.id ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-50 text-gray-400 border-gray-200'}
                  `}>
                    {step > s.id ? <CheckCircle2 className="w-3.5 h-3.5" /> : s.id}
                  </div>
                  <span className={`text-xs ${step >= s.id ? 'text-gray-900 font-medium' : 'text-gray-400'}`}>{s.title}</span>
                  {s.id < 5 && <div className="w-4 h-[1px] bg-gray-200 mx-1" />}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">

          {error && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-xl flex items-start gap-3 text-red-700 animate-in fade-in slide-in-from-top-2">
              <AlertCircle className="w-5 h-5 mt-0.5" />
              <div className="flex-1 text-sm">{error}</div>
              <Button variant="ghost" size="sm" onClick={() => setError(null)} className="h-auto p-0 text-red-700 hover:text-red-800">Dismiss</Button>
            </div>
          )}

          {/* Main Workspace */}
          <div className="grid grid-cols-1 gap-6">

            {/* Step 1: Input (Always visible until processed, then collapsed or hidden? We'll keep it visible but disabled during loading) */}
            {step < 5 && (
              <Card className="border-gray-200 shadow-sm overflow-hidden">
                <CardHeader className="bg-gray-50/50 border-b border-gray-100 pb-4">
                  <CardTitle className="text-base font-semibold flex items-center gap-2">
                    <Upload className="w-4 h-4 text-green-600" />
                    Upload & Instruksi
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-6 space-y-6">
                  {/* File Upload */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700">1. Foto Ruangan</label>
                    <FileUpload
                      selectedFile={file}
                      onFileSelect={(f) => setFile(f)}
                      isLoading={isLoading}
                      onFileRemove={() => setFile(null)}
                    />
                  </div>

                  {/* Instruction Input */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-gray-700 flex justify-between">
                      <span>2. Instruksi Renovasi</span>
                      <span className="text-xs text-gray-400 font-normal">Contoh: "Cat dinding warna sage green"</span>
                    </label>
                    <textarea
                      placeholder="Apa yang ingin Anda ubah? Jelaskan warna, material, atau gaya yang diinginkan..."
                      className="w-full min-h-[100px] p-4 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none text-sm"
                      value={instruction}
                      onChange={(e) => setInstruction(e.target.value)}
                      disabled={isLoading}
                    />
                    <div className="flex gap-2 text-xs overflow-x-auto pb-2">
                      {['Modern Minimalis', 'Dinding Krem', 'Lantai Kayu', 'Gaya Industrial'].map(tag => (
                        <button
                          key={tag}
                          onClick={() => setInstruction(prev => prev ? `${prev}, ${tag}` : tag)}
                          className="px-3 py-1.5 bg-gray-100 hover:bg-gray-200 rounded-full text-gray-600 transition-colors whitespace-nowrap"
                        >
                          + {tag}
                        </button>
                      ))}
                    </div>
                  </div>

                  {/* Action Button */}
                  <Button
                    onClick={startRenovation}
                    className="w-full h-12 text-base font-semibold bg-green-600 hover:bg-green-700 shadow-lg hover:shadow-xl transition-all rounded-xl"
                    disabled={isLoading || !file || !instruction}
                  >
                    {isLoading ? (
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>
                          {step === 2 && 'Menganalisis Ruangan...'}
                          {step === 3 && 'Menyempurnakan Prompt...'}
                          {step === 4 && 'Merender Desain Baru...'}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <Wand2 className="w-4 h-4" />
                        <span>Mulai Renovasi Ajaib</span>
                      </div>
                    )}
                  </Button>
                </CardContent>
              </Card>
            )}

            {/* Process Logs (Collapsible or just visible) */}
            {(step > 2 || analysis) && (
              <Card className={`border-gray-200 shadow-sm transition-all duration-300 ${step === 5 ? 'opacity-70 hover:opacity-100' : ''}`}>
                <CardHeader className="py-3 px-4 bg-blue-50/50">
                  <CardTitle className="text-sm font-medium text-blue-800 flex items-center gap-2">
                    <Sparkles className="w-4 h-4" />
                    AI Process Log
                  </CardTitle>
                </CardHeader>
                <CardContent className="p-4 space-y-4 text-xs font-mono">
                  {analysis && (
                    <div className="space-y-1 animate-in slide-in-from-left-2">
                      <div className="font-bold text-gray-700 flex items-center gap-2">
                        <Badge variant="outline" className="bg-white text-[10px] h-5">Gemini 1.5 Analysis</Badge>
                      </div>
                      <p className="p-3 bg-gray-50 rounded-lg border border-gray-100 text-gray-600 leading-relaxed">
                        {analysis}
                      </p>
                    </div>
                  )}
                  {refinedPrompt && (
                    <div className="space-y-1 animate-in slide-in-from-left-2 delay-150">
                      <div className="font-bold text-gray-700 flex items-center gap-2">
                        <Badge variant="outline" className="bg-white text-[10px] h-5">Optimized Prompt</Badge>
                      </div>
                      <p className="p-3 bg-green-50 rounded-lg border border-green-100 text-gray-600 leading-relaxed">
                        {refinedPrompt}
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}

            {/* Result Section */}
            {step === 5 && (
              <div className="animate-in zoom-in-50 duration-500">
                <div className="bg-white rounded-2xl shadow-lg border border-gray-200 overflow-hidden">
                  <div className="p-4 bg-green-50 border-b border-green-100 flex justify-between items-center">
                    <h2 className="font-bold text-green-900 flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-green-600" />
                      Hasil Renovasi
                    </h2>
                    <Button variant="outline" size="sm" onClick={handleReset} className="h-8 text-xs border-green-200 text-green-700 hover:bg-green-100">
                      <RefreshCw className="w-3 h-3 mr-1" /> Buat Baru
                    </Button>
                  </div>
                  <div className="p-6">
                    <BeforeAfterViewer
                      beforeImage={file}
                      afterImage={resultImage}
                      isLoading={false}
                      aiAnalysis={refinedPrompt}
                    />
                    <div className="mt-4 text-center">
                      <p className="text-xs text-gray-400">
                        Disclaimer: Gambar dihasilkan oleh AI (Gemini 2.5 Flash). Hasil mungkin bervariasi.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default RoomEnhancer;