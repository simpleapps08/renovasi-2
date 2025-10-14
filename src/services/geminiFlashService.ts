import { GoogleGenAI, Modality } from '@google/genai';

/**
 * Gemini Flash 2.5 Image Preview Service
 * Integrates with Google's Gemini 2.5 Flash Image Preview model
 */

interface GeminiFlashRequest {
  imageFile: File;
  prompt: string;
  model?: string;
}

interface GeminiFlashResponse {
  success: boolean;
  imageUrl?: string;
  analysis?: string;
  processingTime?: number;
  error?: string;
}

class GeminiFlashService {
  private client: GoogleGenAI | null = null;
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor() {
    // Get API key from environment or storage (same as existing aiService)
    this.apiKey = import.meta.env.VITE_GOOGLE_AI_STUDIO_API_KEY || 
                  import.meta.env.VITE_GOOGLE_AI_API_KEY || 
                  localStorage.getItem('google_ai_api_key') || '';
    
    if (this.apiKey) {
      try {
        // Initialize GoogleGenAI with API key (browser environment requires API key)
        this.client = new GoogleGenAI({ apiKey: this.apiKey });
        console.log('Gemini Flash service initialized successfully');
      } catch (error) {
        console.error('Failed to initialize Gemini Flash service:', error);
      }
    } else {
      console.warn('Google AI API key not found. Please set VITE_GOOGLE_AI_STUDIO_API_KEY, VITE_GOOGLE_AI_API_KEY, or store in localStorage.');
    }
  }

  /**
   * Check if API key is available
   */
  private hasApiKey(): boolean {
    return !!this.apiKey && this.apiKey.trim() !== '';
  }

  /**
   * Convert file to base64 string
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove data:image/jpeg;base64, prefix
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Generate enhanced room image using Gemini Flash 2.5
   */
  async generateContent(request: GeminiFlashRequest): Promise<GeminiFlashResponse> {
    const startTime = Date.now();
    
    try {
      if (!this.hasApiKey() || !this.client) {
        throw new Error('Google AI API key tidak tersedia atau client tidak terinisialisasi. Silakan atur VITE_GOOGLE_AI_STUDIO_API_KEY atau VITE_GOOGLE_AI_API_KEY.');
      }

      // Convert image to base64
      const base64Image = await this.fileToBase64(request.imageFile);
      
      // Prepare the prompt for room enhancement using new documentation format
      const enhancementPrompt = [
        {
          inlineData: {
            mimeType: request.imageFile.type,
            data: base64Image,
          },
        },
        { 
          text: request.prompt
        }
      ];

      // Make API call to Gemini Flash 2.5 (following the provided documentation pattern)
       const response = await this.client.models.generateContent({
         model: request.model || 'gemini-2.5-flash-image',
         contents: enhancementPrompt,
       });

      const processingTime = Date.now() - startTime;
      
      // Process response (following the provided documentation pattern)
       if (response.candidates && response.candidates.length > 0) {
         const candidate = response.candidates[0];
         let imageUrl: string | undefined;
         let analysis: string | undefined;
         
         // Process each part of the response (following the provided documentation pattern)
         for (const part of candidate.content.parts) {
           if (part.text) {
             analysis = part.text;
             console.log(part.text);
           } else if (part.inlineData) {
             // Convert base64 back to blob and create URL (browser-compatible approach)
             const imageData = part.inlineData.data;
             // Convert base64 to Uint8Array without using Buffer (browser-compatible)
             const binaryString = atob(imageData);
             const bytes = new Uint8Array(binaryString.length);
             for (let i = 0; i < binaryString.length; i++) {
               bytes[i] = binaryString.charCodeAt(i);
             }
             const blob = new Blob([bytes], { type: part.inlineData.mimeType || 'image/png' });
             imageUrl = URL.createObjectURL(blob);
             console.log("Image saved as blob URL");
           }
         }
        
        return {
          success: true,
          imageUrl,
          analysis,
          processingTime
        };
      } else {
        throw new Error('Tidak ada respons yang dihasilkan dari Gemini Flash');
      }
      
    } catch (error) {
      console.error('Gemini Flash generation error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat menghasilkan gambar',
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * Convert base64 image data to blob URL for display
   */
  private base64ToImageUrl(base64Data: string, mimeType: string): string {
    try {
      // Convert base64 to binary
      const binaryString = atob(base64Data);
      const bytes = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      
      // Create blob and return URL
      const blob = new Blob([bytes], { type: mimeType });
      return URL.createObjectURL(blob);
    } catch (error) {
      console.error('Error converting base64 to image URL:', error);
      return '';
    }
  }

  /**
   * Download generated image
   */
  downloadGeneratedImage(imageUrl: string, filename: string = 'gemini-generated-image.png'): void {
    try {
      const link = document.createElement('a');
      link.href = imageUrl;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    } catch (error) {
      console.error('Error downloading image:', error);
    }
  }

  /**
   * Analyze image without generating new content
   */
  async analyzeImage(imageFile: File, analysisPrompt: string = 'Describe this image in detail'): Promise<GeminiFlashResponse> {
    return this.generateContent({
      imageFile,
      prompt: analysisPrompt
    });
  }

  /**
   * Generate image based on text prompt and reference image
   */
  async generateImageFromPrompt(
    referenceImage: File, 
    creativePrompt: string
  ): Promise<GeminiFlashResponse> {
    const enhancedPrompt = `Based on this reference image, create a new image: ${creativePrompt}`;
    
    return this.generateContent({
      imageFile: referenceImage,
      prompt: enhancedPrompt
    });
  }

  /**
   * Room enhancement with Gemini Flash
   */
  async enhanceRoom(
    roomImage: File,
    style: string,
    additionalRequirements: string = ''
  ): Promise<GeminiFlashResponse> {
    const prompt = `Create an enhanced version of this room with ${style} style. ${additionalRequirements ? `Additional requirements: ${additionalRequirements}` : ''} Generate a new image showing the transformed room.`;
    
    return this.generateContent({
      imageFile: roomImage,
      prompt
    });
  }
}

// Export singleton instance
export const geminiFlashService = new GeminiFlashService();
export default geminiFlashService;