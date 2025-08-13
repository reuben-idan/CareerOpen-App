import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'path';

// Vite configuration for Vercel deployment
export default defineConfig({
  plugins: [
    react()
  ],
  
  // Optimize dependencies for better performance
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom'
    ],
    esbuildOptions: {
      target: 'es2020',
    },
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      // Base path alias
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
  },
  build: {
    // Output directory
    outDir: 'dist',
    // Ensure proper MIME types for assets
    assetsInlineLimit: 0,
    // Enable source maps for better debugging
    sourcemap: true,
    // CommonJS options
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    // Configure rollup options
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
      },
      external: ['react', 'react-dom'],
      output: {
        // Ensure proper MIME types for JS files
        chunkFileNames: 'assets/[name]-[hash].js',
        entryFileNames: 'assets/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash][extname]',
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
        manualChunks: (id) => {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) {
              return 'vendor-mui';
            }
            return 'vendor';
          }
        },
      },
    },
  },
  server: {
    port: 3000,
    open: true,
  },
});
