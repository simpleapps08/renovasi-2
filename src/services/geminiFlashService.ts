import { GoogleGenAI } from '@google/genai';

/**
 * Gemini Room Enhancer Service
 * Implements the "Full Free" strategy using:
 * 1. Gemini 1.5 Flash (Vision) - For Analysis
 * 2. Gemini 1.5 Flash (Text) - For Prompt Refinement
 * 3. Gemini 2.5 Flash Image Preview - For Image Generation/Editing
 */

class GeminiFlashService {
  private client: GoogleGenAI | null = null;
  private apiKey: string;

  // Model Constants
  private readonly MODEL_ANALYSIS = 'gemini-2.5-flash';
  private readonly MODEL_REFINEMENT = 'gemini-2.5-flash';
  // Switched to gemini-2.5-flash-image-preview as requested
  private readonly MODEL_EDITING = 'gemini-2.5-flash-image-preview';

  constructor() {
    // Use AI Studio key (valid format: AIza...) as primary
    // Vision key was OAuth token format, not compatible with this API
    this.apiKey = import.meta.env.VITE_GOOGLE_AI_STUDIO_API_KEY ||
      import.meta.env.VITE_GOOGLE_CLOUD_VISION_API_KEY || '';

    if (this.apiKey) {
      try {
        // Initialize the new @google/genai SDK
        this.client = new GoogleGenAI({ apiKey: this.apiKey });
        console.log('✅ Gemini Flash service initialized with key:', this.apiKey.substring(0, 10) + '...');
      } catch (error) {
        console.error('❌ Failed to initialize Gemini Flash service:', error);
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
        // Clean the base64 string (remove data URL prefix)
        const base64Data = result.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  }

  /**
   * Step 2: Analyze Room (Cost: Very Low)
   * Uses Gemini 1.5 Flash Vision to understand the room's structure and lighting.
   */
  async analyzeRoomImage(file: File): Promise<string> {
    if (!this.client) throw new Error('API Key tidak ditemukan. Cek konfigurasi .env Anda.');

    const startTime = Date.now();
    try {
      const base64Image = await this.fileToBase64(file);

      const analysisPrompt = `
        Analyze this room image for a renovation app. Describe the following concisely:
        1. Lighting Source & Direction (e.g., natural light from right window)
        2. Wall Texture & Material
        3. Key Structural Elements (windows, doors, ceiling type)
        4. Current Furniture layout to preserve
        Output plain text description only.
      `;

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

      const analysis = response.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!analysis) throw new Error('Gagal menganalisis gambar.');

      console.log(`Step 1 Analysis (${Date.now() - startTime}ms):`, analysis);
      return analysis;

    } catch (error: any) {
      console.error('Analysis failed:', error);
      throw new Error(error.message || 'Gagal melakukan analisis vision.');
    }
  }

  /**
   * Step 3: Refine Prompt (Cost: Near Zero)
   * Uses Gemini 1.5 Flash Text to create a perfect prompt for the image generator.
   */
  async refinePrompt(userInstruction: string, analysisData: string): Promise<string> {
    if (!this.client) throw new Error('API Key tidak ditemukan.');

    const startTime = Date.now();
    try {
      const systemPrompt = `
        Role: Expert AI Image Prompt Engineer.
        Task: Create a single, highly detailed photorealistic prompt for an inpainting AI (Gemini Image).
        
        Input:
        - User Goal: "${userInstruction}"
        - Room Analysis: "${analysisData}"
        
        Guidelines:
        1. Combine the User Goal with the physical constraints from Analysis (lighting, perspective).
        2. Explicitly state to MAINTAIN the furniture, floor, and ceiling if the user didn't ask to change them.
        3. Use descriptive keywords for materials (e.g., "matte finish", "velvet texture") and lighting (e.g., "soft diffused sunlight").
        4. Output ONLY the final prompt paragraph.
      `;

      const response = await this.client.models.generateContent({
        model: this.MODEL_REFINEMENT,
        contents: [
          { parts: [{ text: systemPrompt }] }
        ]
      });

      const refinedPrompt = response.candidates?.[0]?.content?.parts?.[0]?.text;

      if (!refinedPrompt) throw new Error('Gagal menyusun prompt.');

      console.log(`Step 2 Refinement (${Date.now() - startTime}ms):`, refinedPrompt);
      return refinedPrompt;

    } catch (error: any) {
      console.error('Prompt refinement failed:', error);
      throw new Error(error.message || 'Gagal menyempurnakan prompt.');
    }
  }

  /**
   * Step 4: Execute Image Generation (Cost: Low/Free Tier)
   * Uses Gemini 2.5 Flash Image Preview for the actual visual editing.
   */
  async generateRoomImage(file: File, finalPrompt: string): Promise<string> {
    if (!this.client) throw new Error('API Key tidak ditemukan.');

    const startTime = Date.now();
    try {
      const base64Image = await this.fileToBase64(file);

      console.log(`Step 3 Generating with ${this.MODEL_EDITING}...`);

      const response = await this.client.models.generateContent({
        model: this.MODEL_EDITING,
        contents: [
          {
            parts: [
              { inlineData: { mimeType: file.type, data: base64Image } },
              { text: finalPrompt }
            ]
          }
        ]
      });

      console.log('Generation response received');

      // Extract image from response
      const candidate = response.candidates?.[0];

      // Check for inline image data
      if (candidate?.content?.parts) {
        for (const part of candidate.content.parts) {
          if (part.inlineData) {
            const mimeType = part.inlineData.mimeType || 'image/png';
            const base64Data = part.inlineData.data;

            // Convert to Blob URL
            const binaryString = atob(base64Data);
            const bytes = new Uint8Array(binaryString.length);
            for (let i = 0; i < binaryString.length; i++) {
              bytes[i] = binaryString.charCodeAt(i);
            }
            const blob = new Blob([bytes], { type: mimeType });
            return URL.createObjectURL(blob);
          }
        }
      }

      // Check for refusal or text-only response (common error case)
      const textPart = candidate?.content?.parts?.find(p => p.text)?.text;
      if (textPart) {
        throw new Error(`Model menolak atau hanya merespons teks: "${textPart.substring(0, 100)}..."`);
      }

      throw new Error('Tidak ada gambar yang dihasilkan oleh model.');

    } catch (error: any) {
      console.error('Image generation failed:', error);
      const msg = error.message || 'Gagal generate gambar';
      if (msg.includes('404') || msg.includes('not found')) {
        throw new Error(`Model ${this.MODEL_EDITING} tidak ditemukan. Pastikan API permission atau region support.`);
      }
      throw new Error(msg);
    }
  }
}

export const geminiFlashService = new GeminiFlashService();
export default geminiFlashService;