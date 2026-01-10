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
    proxy: {
      // ML API calls are automatically forwarded to port 5000
      "/extract": {
        target: "http://localhost:5000",
        changeOrigin: true,
      },
    },
  },

  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  plugins: [react(), mode === "development" && componentTagger()].filter(Boolean),
}));
