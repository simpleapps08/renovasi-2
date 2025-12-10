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

  // Model Constants
  private readonly MODEL_ANALYSIS = 'gemini-2.0-flash-exp';
  private readonly MODEL_REFINEMENT = 'gemini-2.0-flash-exp';
  private readonly MODEL_IMAGE_GEN = 'gemini-2.5-flash-image';  // Supports actual image generation

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
    console.log('🖼️ Starting room analysis (Simple Script)...');

    if (!this.client) {
      throw new Error('API Key tidak ditemukan.');
    }

    try {
      const base64Image = await this.fileToBase64(file);

      const contents = [
        {
          inlineData: {
            mimeType: file.type,
            data: base64Image,
          },
        },
        { text: "Analyze this room image for renovation purposes. Describe lighting, colors, and structure." },
      ];

      console.log('🚀 Sending simple analysis request...');

      const response = await this.client.models.generateContent({
        model: this.MODEL_ANALYSIS,
        contents: contents,
      });

      console.log('✅ Analysis response received');
      const text = response.text; // Simple access helper in newer SDK

      if (!text) {
        // Fallback if helper not available
        const candidateText = response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!candidateText) throw new Error('No text generated');
        return candidateText;
      }

      return text;

    } catch (error: any) {
      console.error('❌ Analysis failed:', error);
      throw new Error(`Gagal menganalisis gambar: ${error.message}`);
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
   * Step 3: Generate Image using Gemini Image Model (Image-to-Image)
   * Adapted from user provided script using 'gemini-native-image' logic
   */
  async generateRoomImage(file: File, finalPrompt: string): Promise<string> {
    console.log('🎨 Starting specific image generation task...');
    console.log('📝 Prompt:', finalPrompt);

    if (!this.client) {
      console.error('❌ No Gemini client available');
      throw new Error('API Key tidak ditemukan.');
    }

    try {
      console.log('🔄 Converting input image to base64...');
      const base64Image = await this.fileToBase64(file);
      console.log('✅ Image converted');

      // Construct prompt content exactly as requested
      const promptContent = [
        { text: finalPrompt },
        {
          inlineData: {
            mimeType: file.type,
            data: base64Image
          }
        }
      ];

      console.log('🚀 Calling generateContent with model:', this.MODEL_IMAGE_GEN);

      const response = await this.client.models.generateContent({
        model: this.MODEL_IMAGE_GEN, // using gemini-2.0-flash-exp (closest to requested 2.5-flash-image)
        contents: promptContent,
      });

      console.log('📥 Received response from Gemini');
      console.log('🔍 Response has candidates:', !!response.candidates);
      console.log('🔍 Usage metadata:', response.usageMetadata);

      const candidate = response.candidates?.[0];

      if (!candidate?.content?.parts) {
        console.warn('⚠️ Model did not return image content');
        console.warn('ℹ️ This is expected - Gemini 2.0 Flash does not support image generation via generateContent');
        console.warn('ℹ️ Falling back to visual preview generation...');

        // Fallback to mock preview since Gemini models don't support image output via this API
        return this.generateMockEnhancedImage(finalPrompt, "AI Preview");
      }

      // Iterate through parts to find the image (as per script logic)
      for (const part of candidate.content.parts) {
        if (part.text) {
          console.log('ℹ️ Model output text:', part.text);
        } else if (part.inlineData) {
          console.log('✅ Image data found in response');

          const imageData = part.inlineData.data;
          // Browser adaptation: Convert Base64 to Blob URL
          const binaryString = atob(imageData);
          const len = binaryString.length;
          const bytes = new Uint8Array(len);
          for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }

          const mimeType = part.inlineData.mimeType || 'image/png';
          const blob = new Blob([bytes], { type: mimeType });
          const blobUrl = URL.createObjectURL(blob); // "saved" as a URL

          console.log('✅ Image saved/created as Blob URL');
          return blobUrl;
        }
      }

      // If no image part found in logic loop, use fallback
      console.warn('⚠️ No image found in response parts, using preview fallback');
      return this.generateMockEnhancedImage(finalPrompt, "AI Preview");

    } catch (error: any) {
      console.error('❌ Image generation failed:', error);

      if (error.status === 404) {
        throw new Error(`Model ${this.MODEL_IMAGE_GEN} tidak ditemukan. Cek ejaan model.`);
      }

      throw new Error(`Gagal generate gambar: ${error.message}`);
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