import { GoogleGenAI } from '@google/genai';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, resolve } from 'path';

const __dirname = dirname(fileURLToPath(import.meta.url));
// Load .env from root
dotenv.config({ path: resolve(__dirname, '../.env') });

async function run() {
    const key = process.env.VITE_GOOGLE_AI_STUDIO_API_KEY || process.env.VITE_GOOGLE_CLOUD_VISION_API_KEY;

    if (!key) {
        console.error("ERROR: No API Key found in .env");
        return;
    }

    console.log("Using API Key:", key.substring(0, 10) + "...");

    const client = new GoogleGenAI({ apiKey: key });

    try {
        console.log("Attempting to list models...");
        const response = await client.models.list();

        console.log("--- AVAILABLE CONFIGURED MODELS ---");
        // Using for-await loop for async iterable response from SDK
        for await (const model of response) {
            console.log(`- ${model.name} (${model.displayName})`);
        }
        console.log("-----------------------------------");

    } catch (e) {
        console.error("List Models Failed:", e);
        console.log("\nAttempting basic generation test with 'gemini-1.5-flash-001' as fallback...");
        try {
            const resp = await client.models.generateContent({
                model: 'gemini-1.5-flash-001',
                contents: [{ parts: [{ text: "Hello" }] }]
            });
            console.log("SUCCESS: gemini-1.5-flash-001 works!");
        } catch (e2) {
            console.error("Fallback generation failed:", e2.message);
        }
    }
}

run();
