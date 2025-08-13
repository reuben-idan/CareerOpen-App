import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { fileURLToPath, URL } from 'node:url';

export default defineConfig({
  plugins: [
    react({
      jsxImportSource: '@emotion/react',
      babel: {
        plugins: ['@emotion/babel-plugin'],
      },
    }),
  ],
  optimizeDeps: {
    include: [
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
    ],
  },
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // Ensure MUI components are properly resolved
      '@mui/material': '@mui/material',
      '@mui/icons-material': '@mui/icons-material',
      '@emotion/react': '@emotion/react',
      '@emotion/styled': '@emotion/styled',
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
