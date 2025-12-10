import { GoogleGenAI } from '@google/genai';

/**
 * Gemini Room Enhancer Service
 * Implements the "Full Free" strategy using:
 * 1. Gemini 1.5 Flash (Vision) - For Analysis
 * 2. Gemini 1.5 Flash (Text) - For Prompt Refinement
 * 3. Canvas Fallback - For Image Generation Preview
 */

class GeminiFlashService {
  private client: GoogleGenAI | null = null;
  private apiKey: string;

  // Model Constants - Full Free Strategy
  private readonly MODEL_ANALYSIS = 'gemini-1.5-flash';           // Step 1: Vision analysis
  private readonly MODEL_REFINEMENT = 'gemini-1.5-flash';         // Step 2: Text refinement
  private readonly MODEL_IMAGE_GEN = 'gemini-2.0-flash-exp';      // Step 3: Image editing (experimental)

  constructor() {
    // Use standard AI Studio key as primary
    this.apiKey = import.meta.env.VITE_GOOGLE_AI_STUDIO_API_KEY || '';

    console.log('🔧 Initializing Gemini service...');
    console.log('📝 API Key present:', !!this.apiKey);
    console.log('📝 API Key length:', this.apiKey.length);
    console.log('📝 API Key prefix:', this.apiKey.substring(0, 10) + '...');

    if (this.apiKey) {
      try {
        this.client = new GoogleGenAI({ apiKey: this.apiKey });
        console.log('✅ Gemini client initialized successfully');
      } catch (error) {
        console.error('❌ Failed to initialize Gemini service:', error);
      }
    } else {
      console.warn('⚠️ Google AI API key not found in environment variables.');
    }
  }

  /**
   * Helper to convert File to Base64 string for API calls
   */
  private async fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const result = reader.result as string;
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Step 1: Analyze Room
   */
  async analyzeRoomImage(file: File): Promise<string> {
    console.log('🖼️ Starting room image analysis...');
    console.log('📄 File:', file.name, 'Size:', file.size, 'Type:', file.type);

    if (!this.client) {
      console.error('❌ No Gemini client available');
      throw new Error('API Key tidak ditemukan. Cek .env Anda.');
    }

    try {
      console.log('🔄 Converting image to base64...');
      const base64Image = await this.fileToBase64(file);
      console.log('✅ Image converted, length:', base64Image.length);

      const analysisPrompt = `
        Analyze this room image for a renovation app. Describe concisely:
        1. Lighting Source & Direction
        2. Key Colors & Materials currently present
        3. Structural Elements (windows, style of room)
        4. Furniture layout
        Output plain text description only.
      `;

      console.log('🚀 Sending request to Gemini API...');
      console.log('📌 Using model:', this.MODEL_ANALYSIS);

      const response = await this.client.models.generateContent({
        model: this.MODEL_ANALYSIS,
        contents: [
          {
            parts: [
              { inlineData: { mimeType: file.type, data: base64Image } },
              { text: analysisPrompt }
            ]
          }
        ]
      });

      console.log('📥 Received response from Gemini');
      console.log('📊 Response:', JSON.stringify(response, null, 2));

      const analysis = response.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!analysis) {
        console.error('❌ No analysis text in response');
        throw new Error('No analysis generated');
      }

      console.log('✅ Analysis successful:', analysis.substring(0, 100) + '...');
      return analysis;

    } catch (error: any) {
      console.error('❌ Analysis failed:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText,
        stack: error.stack
      });

      // More user-friendly error message
      if (error.status === 403 || error.message?.includes('403') || error.message?.includes('blocked')) {
        throw new Error('API Key diblokir atau tidak valid. Silakan cek konfigurasi Google AI Studio Anda.');
      }
      throw new Error(`Gagal menganalisis gambar: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Step 2: Refine Prompt
   */
  async refinePrompt(userInstruction: string, analysisData: string): Promise<string> {
    if (!this.client) return userInstruction;

    try {
      const systemPrompt = `
        Role: Expert Interior Design AI.
        Task: Create a vivid, highly detailed description of a RENOVATED room based on requirements.
        
        Input:
        - Current Room: "${analysisData}"
        - Renovation Goal: "${userInstruction}"
        
        Output:
        A single detailed paragraph describing the NEW look of the room. Focus on the new colors, materials, lighting, and style requested. Do not describe the old room. Make it sound inviting and photorealistic.
      `;

      const response = await this.client.models.generateContent({
        model: this.MODEL_REFINEMENT,
        contents: [
          { parts: [{ text: systemPrompt }] }
        ]
      });

      const refinedPrompt = response.candidates?.[0]?.content?.parts?.[0]?.text;
      return refinedPrompt || userInstruction;

    } catch (error) {
      console.error('Prompt refinement failed:', error);
      return userInstruction;
    }
  }

  /**
   * Step 3: Generate Image using gemini-2.5-flash-image-preview
   * This is the actual image editing step using Generative Inpainting
   */
  async generateRoomImage(file: File, finalPrompt: string): Promise<string> {
    console.log('🎨 Starting image generation with Gemini Flash Image Preview...');
    console.log('📝 Final prompt:', finalPrompt);

    if (!this.client) {
      console.error('❌ No Gemini client available');
      throw new Error('API Key tidak ditemukan.');
    }

    try {
      console.log('🔄 Converting image to base64...');
      const base64Image = await this.fileToBase64(file);
      console.log('✅ Image converted for generation');

      console.log('🚀 Calling gemini-2.5-flash-image-preview...');

      // Use the Flash Image Preview model for low-cost image editing
      const response = await this.client.models.generateContent({
        model: this.MODEL_IMAGE_GEN,
        contents: [
          {
            parts: [
              { inlineData: { mimeType: file.type, data: base64Image } },
              { text: finalPrompt }
            ]
          }
        ]
      });

      console.log('📥 Received response from Gemini Image Preview');
      console.log('📊 Response structure:', JSON.stringify(response, null, 2));

      // Extract image from response
      const candidate = response.candidates?.[0];

      if (!candidate?.content?.parts) {
        console.error('❌ No content parts in response');
        throw new Error('No content returned from model');
      }

      // Check for inline image data
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          console.log('✅ Image data found in response');
          const mimeType = part.inlineData.mimeType || 'image/png';
          const base64Data = part.inlineData.data;

          // Convert base64 to Blob URL for display
          const binaryString = atob(base64Data);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          const blob = new Blob([bytes], { type: mimeType });
          const blobUrl = URL.createObjectURL(blob);

          console.log('✅ Image generation successful!');
          return blobUrl;
        }
      }

      // Check if model returned text instead (refusal or error)
      const textPart = candidate.content.parts.find(p => p.text)?.text;
      if (textPart) {
        console.warn('⚠️ Model returned text instead of image:', textPart);
        throw new Error(`Model tidak menghasilkan gambar. Response: "${textPart.substring(0, 200)}..."`);
      }

      throw new Error('Tidak ada gambar yang dihasilkan oleh model.');

    } catch (error: any) {
      console.error('❌ Image generation failed:', error);
      console.error('❌ Error details:', {
        message: error.message,
        status: error.status,
        statusText: error.statusText
      });

      // Handle specific error cases
      if (error.status === 404 || error.message?.includes('404') || error.message?.includes('not found')) {
        console.error('❌ Model gemini-2.5-flash-image-preview not found or not accessible');
        throw new Error('Model gemini-2.5-flash-image-preview tidak tersedia. Pastikan API key memiliki akses ke model ini.');
      }

      if (error.status === 403 || error.message?.includes('403') || error.message?.includes('blocked')) {
        throw new Error('API Key tidak memiliki akses ke model image generation. Periksa quota dan permissions di Google AI Studio.');
      }

      throw new Error(`Gagal generate gambar: ${error.message || 'Unknown error'}`);
    }
  }

  /**
   * Robust Canvas Fallback
   */
  private generateMockEnhancedImage(stylePrompt: string, title: string): string {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';

    canvas.width = 1024;
    canvas.height = 768;

    // Dynamic background based on prompt keywords
    let hue = 200;
    const p = stylePrompt.toLowerCase();
    if (p.includes('warm') || p.includes('wood') || p.includes('cream')) hue = 35;
    if (p.includes('green') || p.includes('nature') || p.includes('tropical')) hue = 100;
    if (p.includes('dark') || p.includes('industrial') || p.includes('grey')) hue = 220;
    if (p.includes('pink') || p.includes('pastel')) hue = 340;
    if (p.includes('white') || p.includes('minimal')) hue = 200; // very light blueish white

    // Draw Gradient Background
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, `hsl(${hue}, 30%, 93%)`);
    gradient.addColorStop(1, `hsl(${hue}, 40%, 85%)`);
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw abstract geometric shapes
    ctx.fillStyle = `hsla(${hue}, 50%, 60%, 0.1)`;
    ctx.beginPath();
    ctx.arc(canvas.width * 0.8, canvas.height * 0.2, 100, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = `hsla(${hue + 40}, 50%, 60%, 0.1)`;
    ctx.beginPath();
    ctx.rect(canvas.width * 0.1, canvas.height * 0.6, 200, 200);
    ctx.fill();

    // Text Overlay
    ctx.shadowColor = "rgba(0,0,0,0.1)";
    ctx.shadowBlur = 4;
    ctx.fillStyle = "#333";
    ctx.font = "bold 36px Inter, system-ui, sans-serif";
    ctx.textAlign = "center";
    ctx.fillText("AI Renovation Preview", canvas.width / 2, canvas.height / 2 - 30);

    ctx.font = "normal 18px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#666";
    ctx.fillText("(High-Definition rendering requires Imagen 3 Upgrade)", canvas.width / 2, canvas.height / 2 + 10);

    // Wrap text for prompt summary
    const words = stylePrompt.split(' ');
    let line = '';
    let y = canvas.height / 2 + 60;
    const maxWidth = 700;
    const lineHeight = 28;

    ctx.font = "italic 16px Inter, system-ui, sans-serif";
    ctx.fillStyle = "#555";

    // Simple truncation for preview
    let textToDraw = stylePrompt;
    if (textToDraw.length > 200) textToDraw = textToDraw.substring(0, 200) + "...";

    const lines = this.getLines(ctx, textToDraw, maxWidth);
    lines.forEach(l => {
      ctx.fillText(l, canvas.width / 2, y);
      y += lineHeight;
    });

    // Watermark
    ctx.font = "12px monospace";
    ctx.fillStyle = "#aaa";
    ctx.fillText("Generated by Renovasi AI • Gemini Flash Engine", canvas.width - 160, canvas.height - 20);

    return canvas.toDataURL('image/jpeg', 0.9);
  }

  private getLines(ctx: CanvasRenderingContext2D, text: string, maxWidth: number) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = words[0];

    for (let i = 1; i < words.length; i++) {
      const word = words[i];
      const width = ctx.measureText(currentLine + " " + word).width;
      if (width < maxWidth) {
        currentLine += " " + word;
      } else {
        lines.push(currentLine);
        currentLine = word;
      }
    }
    lines.push(currentLine);
    return lines;
  }
}

export const geminiFlashService = new GeminiFlashService();
export default geminiFlashService;