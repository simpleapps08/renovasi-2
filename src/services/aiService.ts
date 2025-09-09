/**
 * AI Service for Room Enhancement using Google AI Studio
 */

interface GenerateImageRequest {
  imageFile: File;
  prompt: string;
  stylePreset: string;
}

interface GenerateImageResponse {
  success: boolean;
  enhancedImageUrl?: string;
  error?: string;
  processingTime?: number;
  aiAnalysis?: string;
}

class AIService {
  private apiKey: string;
  private baseUrl = 'https://generativelanguage.googleapis.com/v1beta';

  constructor() {
    this.apiKey = import.meta.env.VITE_GOOGLE_AI_STUDIO_API_KEY || '';
    console.log('AI Service initialized. API Key available:', this.hasApiKey());
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
   * Generate enhanced room image using Google AI Studio
   */
  async generateEnhancedRoom(request: GenerateImageRequest): Promise<GenerateImageResponse> {
    const startTime = Date.now();

    // Check if API key is available
    if (!this.hasApiKey()) {
      return {
        success: false,
        error: 'Google AI Studio API key tidak ditemukan. Periksa file .env Anda.',
        processingTime: Date.now() - startTime
      };
    }

    try {
      // Convert image to base64
      const base64Image = await this.fileToBase64(request.imageFile);

      // Create enhanced prompt based on style preset
      const enhancedPrompt = this.createEnhancedPrompt(request.prompt, request.stylePreset);

      console.log('Sending request to Google AI Studio...');

      // Prepare the request payload for Google AI Studio
      const payload = {
        contents: [{
          parts: [
            {
              text: enhancedPrompt
            },
            {
              inline_data: {
                mime_type: request.imageFile.type,
                data: base64Image
              }
            }
          ]
        }],
        generationConfig: {
          temperature: 0.7,
          topK: 32,
          topP: 1,
          maxOutputTokens: 4096,
        }
      };

      // Make API call to Google AI Studio
      const response = await fetch(
        `${this.baseUrl}/models/gemini-1.5-flash:generateContent?key=${this.apiKey}`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(payload)
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        console.error('Google AI Studio API Error:', errorData);
        throw new Error(`API Error: ${errorData.error?.message || 'Unknown error'}`);
      }

      const result = await response.json();
      console.log('Google AI Studio Response:', result);
      
      const processingTime = Date.now() - startTime;
      
      // Since Google AI Studio doesn't generate images directly, we'll use the analysis
      // and return a mock enhanced image URL for now
      const enhancedImageUrl = this.generateMockEnhancedImage(request.stylePreset);

      return {
        success: true,
        enhancedImageUrl,
        processingTime,
        aiAnalysis: result.candidates?.[0]?.content?.parts?.[0]?.text || 'No analysis available'
      };

    } catch (error) {
      console.error('AI Service Error:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred',
        processingTime: Date.now() - startTime
      };
    }
  }

  /**
   * Create enhanced prompt based on style preset and user input
   */
  private createEnhancedPrompt(userPrompt: string, stylePreset: string): string {
    const stylePrompts = {
      'modern-minimalis': 'Transform this room into a modern minimalist design with clean lines, neutral colors (white, gray, black), minimal decorations, and functional furniture.',
      'skandinavia': 'Transform this room into Scandinavian style with warm, natural elements, light wood materials, bright atmosphere, and cozy Nordic aesthetics.',
      'industrial': 'Transform this room into industrial style with raw materials, exposed elements, unfinished look, and urban loft aesthetics.',
      'modern-tropis': 'Transform this room into modern tropical design suitable for hot and humid climate, with natural ventilation, natural materials, and tropical elements.',
      'japandi': 'Transform this room into Japandi style combining Japanese and Scandinavian elements, functional, natural, minimalist with warm atmosphere.',
      'klasik-eropa': 'Transform this room into classic European style with elegant, grand, symmetrical design elements and luxurious details.',
      'kontemporer': 'Transform this room into contemporary style that is flexible, follows current trends, and prioritizes comfort and adaptability.',
      'rustic': 'Transform this room into rustic style with natural, warm elements, abundant use of wood and stone materials, and countryside aesthetics.',
      'mediterranean': 'Transform this room into Mediterranean style inspired by Italian, Spanish, and Greek homes with coastal elements and warm colors.',
      'futuristik': 'Transform this room into futuristic design with modern, high-tech elements, unique design, and smart home features.'
    };

    const basePrompt = stylePrompts[stylePreset as keyof typeof stylePrompts] || 'Transform this room with modern design elements.';
    
    let fullPrompt = `Analyze this room image and provide detailed renovation suggestions. ${basePrompt}`;
    
    if (userPrompt.trim()) {
      fullPrompt += ` Additional requirements: ${userPrompt}`;
    }
    
    fullPrompt += ' Please provide specific recommendations for colors, furniture, lighting, materials, and layout improvements that would achieve this style transformation.';
    
    return fullPrompt;
  }

  /**
   * Generate mock enhanced image for demonstration
   * Creates a canvas-based mock image that can be downloaded
   */
  private generateMockEnhancedImage(stylePreset: string): string {
    // Create a canvas to generate a mock enhanced image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    
    if (!ctx) {
      // Fallback to a simple data URL
      return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iODAwIiBoZWlnaHQ9IjYwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjBmMGYwIi8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIyNCIgZmlsbD0iIzMzMyIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVuaGFuY2VkIFJvb20gKE1vY2spPC90ZXh0Pjwvc3ZnPg==';
    }
    
    canvas.width = 800;
    canvas.height = 600;
    
    // Style-specific colors and patterns
    const styleColors = {
      'modern-minimalis': { bg: '#f8f9fa', accent: '#6c757d', text: '#212529' },
      'skandinavia': { bg: '#ffffff', accent: '#d4a574', text: '#2c3e50' },
      'industrial': { bg: '#2c3e50', accent: '#e74c3c', text: '#ecf0f1' },
      'modern-tropis': { bg: '#27ae60', accent: '#f39c12', text: '#ffffff' },
      'japandi': { bg: '#f5f5dc', accent: '#8b4513', text: '#2f4f4f' },
      'klasik-eropa': { bg: '#daa520', accent: '#8b0000', text: '#ffffff' },
      'kontemporer': { bg: '#34495e', accent: '#3498db', text: '#ffffff' },
      'rustic': { bg: '#8b4513', accent: '#daa520', text: '#ffffff' },
      'mediterranean': { bg: '#4682b4', accent: '#ffd700', text: '#ffffff' },
      'futuristik': { bg: '#000000', accent: '#00ffff', text: '#ffffff' }
    };
    
    const colors = styleColors[stylePreset as keyof typeof styleColors] || styleColors['modern-minimalis'];
    
    // Draw background
    ctx.fillStyle = colors.bg;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Draw some geometric shapes to simulate room elements
    ctx.fillStyle = colors.accent;
    
    // Floor
    ctx.fillRect(0, canvas.height - 100, canvas.width, 100);
    
    // Wall accent
    ctx.fillRect(50, 50, canvas.width - 100, 20);
    
    // Furniture shapes
    ctx.fillRect(100, 300, 200, 150); // Sofa
    ctx.fillRect(500, 350, 100, 100); // Table
    
    // Add text
    ctx.fillStyle = colors.text;
    ctx.font = 'bold 32px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Enhanced Room (AI Generated)', canvas.width / 2, 200);
    
    ctx.font = '24px Arial';
    ctx.fillText(`Style: ${stylePreset}`, canvas.width / 2, 250);
    
    ctx.font = '16px Arial';
    ctx.fillText('This is a mock enhanced image for demonstration', canvas.width / 2, canvas.height - 30);
    
    return canvas.toDataURL('image/png');
  }

  /**
   * Validate API key
   */
  async validateApiKey(): Promise<boolean> {
    if (!this.hasApiKey()) {
      console.warn('API key not found in environment variables');
      return false;
    }

    try {
      const response = await fetch(
        `${this.baseUrl}/models?key=${this.apiKey}`,
        {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          }
        }
      );
      return response.ok;
    } catch (error) {
      console.error('API Key validation failed:', error);
      return false;
    }
  }
}

// Export singleton instance
export const aiService = new AIService();
export type { GenerateImageRequest, GenerateImageResponse };