import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';
import { resolve } from 'path';

// Vite configuration for Vercel deployment
// Explicitly handles MUI imports and ensures proper bundling

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  
  // Optimize dependencies for better performance
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
    ],
    esbuildOptions: {
      // Enable esbuild polyfill for Node.js modules
      target: 'es2020',
    },
  },
  
  // Resolve configuration
  resolve: {
    alias: {
      // Base path alias
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      
      // MUI aliases to ensure proper resolution
      '@mui/material': resolve(__dirname, 'node_modules/@mui/material'),
      '@mui/icons-material': resolve(__dirname, 'node_modules/@mui/icons-material'),
      '@emotion/react': resolve(__dirname, 'node_modules/@emotion/react'),
      '@emotion/styled': resolve(__dirname, 'node_modules/@emotion/styled'),
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    commonjsOptions: {
      include: [/node_modules/],
      transformMixedEsModules: true,
    },
    rollupOptions: {
      external: ['react', 'react-dom'],
      output: {
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
