import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 5173,  // Frontend on 5173
    historyApiFallback: true,
    // For local development, proxy ML requests to local ML server
    // In production, ML API is called directly from browser using VITE_ML_API_URL
    proxy: mode === "development" ? {
      "/extract": {
        target: "http://localhost:7860",
        changeOrigin: true,
      },
    } : undefined,
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
}));
