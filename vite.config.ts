import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";
// Assuming lovable-tagger is installed and configured correctly
import { componentTagger } from "lovable-tagger";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  // Server configuration
  server: {
    host: "::", // Listen on all network interfaces
    port: 8080, // Serve on port 8080
  },
  // Plugins used by Vite
  plugins: [
    // React plugin with SWC for faster builds
    react(),
    // Conditionally include componentTagger plugin only in development mode
    mode === 'development' &&
    componentTagger(),
  ].filter(Boolean), // Filter out falsey values (like `false` from the plugin condition)
  // Base URL for the application
  resolve: {
    alias: {
      
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
}));
