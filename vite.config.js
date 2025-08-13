import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'path';
import { readFileSync } from 'fs';
import { join } from 'path';

// Vite configuration for Vercel deployment
// Vite configuration
const config = defineConfig({
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
    // Don't include source maps in production
    sourcemap: process.env.NODE_ENV !== 'production',
    // Minify the output
    minify: 'terser',
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
        // Ensure proper module type for modern browsers
        format: 'esm',
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

// Add _headers file to the build output
config.build.rollupOptions.output.assetFileNames = (assetInfo) => {
  if (assetInfo.name === '_headers') {
    return '_headers';
  }
  return 'assets/[name]-[hash][extname]';
};

// Copy _headers file to the dist directory during build
config.build.rollupOptions.plugins = [
  {
    name: 'copy-headers',
    generateBundle() {
      const headersPath = join(__dirname, 'public', '_headers');
      try {
        const headersContent = readFileSync(headersPath, 'utf-8');
        this.emitFile({
          type: 'asset',
          fileName: '_headers',
          source: headersContent
        });
      } catch (error) {
        console.warn('_headers file not found in public directory');
      }
    }
  }
];

export default config;
