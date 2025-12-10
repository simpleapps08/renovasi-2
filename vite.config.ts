import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  base: './',
  server: {
    host: "::",
    port: 8081,
    historyApiFallback: true,
  },
  preview: {
    port: 8080,
    historyApiFallback: true,
  },
  build: {
    chunkSizeWarningLimit: 1600,
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            // Recharts is very large, keep it separate
            if (id.includes('recharts')) {
              return 'recharts';
            }
            // Keep everything else in a single vendor chunk to prevent circular dependency issues
            // causing "Cannot access 'R' before initialization" errors
            return 'vendor';
          }
        },
      },
    },
  },
  plugins: [
    react(),
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean),
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
