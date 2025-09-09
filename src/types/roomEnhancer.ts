/**
 * Types for Room Enhancer functionality
 */

export interface RoomEnhancerFile {
  file: File;
  preview: string;
  id: string;
}

export interface RoomEnhancerState {
  selectedFile: File | null;
  prompt: string;
  selectedStyle: string;
  isLoading: boolean;
  generatedImage: string | null;
  error: string | null;
  generationHistory: GenerationHistoryItem[];
}

export interface GenerationHistoryItem {
  id: string;
  originalImage: File;
  generatedImage: string;
  prompt: string;
  style: string;
  timestamp: Date;
}

export type StylePreset = 
  | 'modern-minimalis'
  | 'skandinavia'
  | 'industrial'
  | 'modern-tropis'
  | 'japandi'
  | 'klasik-eropa'
  | 'kontemporer'
  | 'rustic'
  | 'mediterranean'
  | 'futuristik';

export interface StylePresetOption {
  id: string;
  name: string;
  category: string;
  description: string;
  mainFeatures: string;
  tags: string[];
}

export interface UploadCardProps {
  files: RoomEnhancerFile[];
  onFilesSelected: (files: File[]) => void;
  maxFiles?: number;
  maxSizeMB?: number;
  acceptedFormats?: string[];
  error?: string | null;
}

export interface PromptInputProps {
  prompt: string;
  selectedStyle: string;
  onPromptChange: (prompt: string) => void;
  onStyleChange: (style: string) => void;
  isLoading?: boolean;
}

export interface BeforeAfterViewerProps {
  originalUrl: string | null;
  enhancedUrl: string | null;
  generating: boolean;
  onDownload?: (type: 'original' | 'enhanced') => void;
  onFullscreen?: (type: 'original' | 'enhanced') => void;
}

export interface GenerateRequest {
  imageFile: File;
  prompt: string;
  stylePreset: StylePreset;
  options?: {
    strength?: number;
    guidance?: number;
    steps?: number;
  };
}

export interface GenerateResponse {
  success: boolean;
  enhancedImageUrl?: string;
  error?: string;
  processingTime?: number;
}

// API related types for future integration
export interface AIProviderConfig {
  provider: 'openai' | 'stability' | 'midjourney' | 'custom';
  apiKey: string;
  model?: string;
  baseUrl?: string;
}

export interface SupabaseStorageConfig {
  bucket: string;
  folder: string;
  publicUrl: string;
}

// Error types
export type RoomEnhancerError = 
  | 'FILE_TOO_LARGE'
  | 'INVALID_FILE_TYPE'
  | 'UPLOAD_FAILED'
  | 'GENERATION_FAILED'
  | 'NETWORK_ERROR'
  | 'QUOTA_EXCEEDED'
  | 'UNKNOWN_ERROR';

export interface RoomEnhancerErrorInfo {
  type: RoomEnhancerError;
  message: string;
  details?: any;
}

// Constants
export const STYLE_PRESETS: StylePresetOption[] = [
  {
    id: 'modern-minimalis',
    name: 'Modern Minimalis',
    category: 'Modern',
    description: 'Desain yang mengutamakan kesederhanaan dan fungsionalitas',
    mainFeatures: 'Simpel, fungsional, tanpa banyak dekorasi, dominan warna netral (putih, abu-abu, hitam).',
    tags: ['Simpel', 'Fungsional', 'Warna Netral', 'Tanpa Dekorasi']
  },
  {
    id: 'skandinavia',
    name: 'Skandinavia',
    category: 'Natural',
    description: 'Gaya Nordic yang hangat dan natural dengan material kayu',
    mainFeatures: 'Hangat, natural, cerah, mengutamakan kayu terang.',
    tags: ['Hangat', 'Natural', 'Kayu Terang', 'Cerah']
  },
  {
    id: 'industrial',
    name: 'Industrial',
    category: 'Urban',
    description: 'Tampilan raw dan unfinished dengan elemen ekspos',
    mainFeatures: 'Tampilannya mirip pabrik/loft, unfinished look.',
    tags: ['Raw Material', 'Ekspos', 'Loft Style', 'Urban']
  },
  {
    id: 'modern-tropis',
    name: 'Modern Tropis',
    category: 'Tropical',
    description: 'Desain yang disesuaikan dengan iklim tropis Indonesia',
    mainFeatures: 'Cocok iklim panas/lembap, banyak ventilasi dan material natural.',
    tags: ['Ventilasi', 'Material Natural', 'Iklim Tropis', 'Sejuk']
  },
  {
    id: 'japandi',
    name: 'Japandi',
    category: 'Fusion',
    description: 'Perpaduan Japanese dan Scandinavian yang minimalis hangat',
    mainFeatures: 'Fungsional, natural, minimalis dengan nuansa hangat.',
    tags: ['Fungsional', 'Natural', 'Minimalis', 'Hangat']
  },
  {
    id: 'klasik-eropa',
    name: 'Klasik Eropa',
    category: 'Classic',
    description: 'Gaya klasik Eropa yang elegan dan megah',
    mainFeatures: 'Elegan, megah, simetris.',
    tags: ['Elegan', 'Megah', 'Simetris', 'Mewah']
  },
  {
    id: 'kontemporer',
    name: 'Kontemporer',
    category: 'Modern',
    description: 'Gaya masa kini yang fleksibel dan mengikuti tren',
    mainFeatures: 'Fleksibel, mengikuti tren terbaru, mengutamakan kenyamanan.',
    tags: ['Fleksibel', 'Tren Terbaru', 'Nyaman', 'Adaptif']
  },
  {
    id: 'rustic',
    name: 'Rustic',
    category: 'Natural',
    description: 'Gaya pedesaan yang alamiah dengan material kayu dan batu',
    mainFeatures: 'Alamiah, hangat, serba kayu & batu.',
    tags: ['Alamiah', 'Kayu', 'Batu', 'Pedesaan']
  },
  {
    id: 'mediterranean',
    name: 'Mediterranean',
    category: 'Regional',
    description: 'Inspirasi dari rumah-rumah di kawasan Mediterania',
    mainFeatures: 'Inspirasi rumah di Italia, Spanyol, Yunani.',
    tags: ['Mediterania', 'Coastal', 'Terakota', 'Biru Putih']
  },
  {
    id: 'futuristik',
    name: 'Futuristik',
    category: 'Future',
    description: 'Desain masa depan dengan teknologi tinggi',
    mainFeatures: 'Modern, teknologi tinggi, desain unik.',
    tags: ['Teknologi Tinggi', 'Unik', 'Futuristik', 'Smart Home']
  }
];

export const FILE_CONSTRAINTS = {
  MAX_SIZE_MB: 5,
  MAX_FILES: 1,
  ACCEPTED_FORMATS: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  ACCEPTED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp']
} as const;

export const GENERATION_SETTINGS = {
  DEFAULT_STRENGTH: 0.8,
  DEFAULT_GUIDANCE: 7.5,
  DEFAULT_STEPS: 20,
  TIMEOUT_MS: 60000 // 1 minute
} as const;