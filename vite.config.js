import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { fileURLToPath } from 'node:url';
import { resolve } from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  // Base public path when served in production
  base: '/',
  
  // Plugins
  plugins: [react()],
  
  // Resolve configuration
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  },
  
  // Development server configuration
  server: {
    port: 3000,
    open: true,
    host: true,
    strictPort: true,
    // Ensure proper MIME types in development
    headers: {
      'Content-Type': 'application/javascript; charset=utf-8',
    },
  },
  
  // Build configuration
  build: {
    outDir: 'dist',
    sourcemap: true,
    // Ensure proper module format
    target: 'esnext',
    // Don't minify for easier debugging
    minify: false,
    
    // Rollup options
    rollupOptions: {
      // Main entry point
      input: {
        main: resolve(__dirname, 'index.html')
      },
      
      // Output configuration
      output: {
        // Use hashed filenames for better caching
        entryFileNames: 'assets/[name]-[hash].js',
        chunkFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        
        // Ensure proper module format
        format: 'esm',
        
        // Preserve module structure for better tree-shaking
        preserveModules: false,
        
        // Manual chunks for better caching
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        }
      }
    }
  },
  
  // Optimize dependencies
  optimizeDeps: {
    include: ['react', 'react-dom', 'react-router-dom'],
    esbuildOptions: {
      // Specify target environment
      target: 'es2020',
    },
  },
  
  // ESBuild options
  esbuild: {
    // Ensure JSX is handled correctly
    jsx: 'automatic',
    // Minify in production
    minify: process.env.NODE_ENV === 'production',
  },
});
