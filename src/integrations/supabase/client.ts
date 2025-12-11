// Enhanced Supabase client configuration with best practices for session management
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL || "https://tkqvozgorpapofejphyn.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = import.meta.env.VITE_SUPABASE_ANON_KEY || import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRrcXZvemdvcnBhcG9mZWpwaHluIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNzM2OTMsImV4cCI6MjA3MTY0OTY5M30.QYvC-M1aBSnGKChfnb49Di7EJCM7TGPMtChG7iMx_o8";

/**
 * Custom localStorage wrapper to handle errors gracefully
 * Prevents crashes when localStorage is unavailable (private browsing, etc)
 */
const safeLocalStorage = {
  getItem: (key: string) => {
    try {
      return localStorage.getItem(key);
    } catch (e) {
      console.warn(`[Supabase] Failed to get localStorage[${key}]`, e);
      return null;
    }
  },
  setItem: (key: string, value: string) => {
    try {
      localStorage.setItem(key, value);
    } catch (e) {
      console.warn(`[Supabase] Failed to set localStorage[${key}]`, e);
    }
  },
  removeItem: (key: string) => {
    try {
      localStorage.removeItem(key);
    } catch (e) {
      console.warn(`[Supabase] Failed to remove localStorage[${key}]`, e);
    }
  },
};

/**
 * Custom fetch wrapper with request timeout
 * Prevents infinite loading loops on slow or broken connections
 * Using 30s timeout to handle slow networks gracefully
 */
function createFetchWithTimeout(timeoutMs: number = 30000) {
  return (input: RequestInfo | URL, init?: RequestInit): Promise<Response> => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeoutMs);
    
    return fetch(input, {
      ...init,
      signal: controller.signal,
    })
      .finally(() => clearTimeout(timeoutId))
      .catch((err) => {
        if (err.name === 'AbortError') {
          console.warn(`[Supabase] Request timeout (${timeoutMs}ms):`, input);
          // Return timeout error response
          return new Response(
            JSON.stringify({ error: { message: 'Request timeout', status: 408 } }),
            {
              status: 408,
              statusText: 'Request Timeout',
              headers: { 'content-type': 'application/json' },
            }
          );
        }
        throw err;
      });
  };
}

// Initialize Supabase client with enhanced session management
export const supabase = createClient<Database>(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY,
  {
    auth: {
      // Use safe localStorage wrapper to prevent crashes
      storage: safeLocalStorage,
      
      // Enable automatic token refresh (handled by Supabase library)
      autoRefreshToken: true,
      
      // Persist session across page reloads
      persistSession: true,
      
      // Detect and handle auth callback from URLs (OAuth, password reset, etc.)
      detectSessionInUrl: true,
      
      // Use PKCE flow for enhanced security (prevents token exposure)
      flowType: 'pkce',
    },
    
    global: {
      headers: {
        'x-client-info': 'supabase-js/renovasi',
      },
      // Custom fetch with 30s timeout to handle slow networks
      fetch: createFetchWithTimeout(30000),
    },
  }
);

console.log('[Supabase] Client initialized with enhanced session management');
