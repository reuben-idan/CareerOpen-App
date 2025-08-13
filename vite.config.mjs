import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import { fileURLToPath, URL } from 'node:url';

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react({
      jsxImportSource: "@emotion/react",
      babel: {
        plugins: ["@emotion/babel-plugin"],
      },
    }),
  ],
  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: ["./src/test/setup.js"],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL('./src', import.meta.url)),
      '@mui/material': '@mui/material',
      '@mui/icons-material': '@mui/icons-material',
      '@emotion/react': '@emotion/react',
      '@emotion/styled': '@emotion/styled',
    },
    extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
  },
  build: {
    outDir: "dist",
    sourcemap: true,
    rollupOptions: {
      // Externalize peer dependencies
      external: ['react', 'react-dom', '@mui/material', '@emotion/react', '@emotion/styled'],
      output: {
        // Ensure proper module resolution
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          '@mui/material': 'MaterialUI',
          '@emotion/react': 'EmotionReact',
          '@emotion/styled': 'EmotionStyled',
        },
        // Enable code splitting
        manualChunks: {
          'vendor': ['react', 'react-dom', 'react-router-dom'],
          'mui': ['@mui/material', '@mui/icons-material', '@emotion/react', '@emotion/styled'],
        },
      },
    },
    minify: "terser",
    terserOptions: {
      compress: {
        drop_console: false,
        drop_debugger: true,
        pure_funcs: [],
      },
      format: {
        comments: false,
      },
    },
    rollupOptions: {
      output: {
        manualChunks: {
          "react-vendor": ["react", "react-dom"],
          router: ["react-router-dom"],
          "ui-components": ["@fortawesome/react-fontawesome", "react-icons"],
          utils: ["axios", "react-toastify"],
        },
        chunkFileNames: "assets/[name]-[hash].js",
        entryFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash].[ext]",
      },
    },
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@fortawesome/react-fontawesome',
      'react-icons',
      'axios',
      'react-toastify',
      'react-helmet-async',
      '@mui/material',
      '@mui/icons-material',
      '@emotion/react',
      '@emotion/styled',
      '@mui/material/styles',
      '@mui/material/Box',
      '@mui/material/Button',
      '@mui/material/Container',
      '@mui/material/Typography',
      '@mui/material/AppBar',
      '@mui/material/Toolbar',
      '@mui/material/IconButton',
      '@mui/material/Menu',
      '@mui/material/MenuItem',
      '@mui/icons-material/Menu',
      '@mui/icons-material/AccountCircle',
    ],
    esbuildOptions: {
      // Enable esbuild's tree shaking
      treeShaking: true,
      // Define global constants
      define: {
        global: 'globalThis',
      },
      // Target browsers
      target: 'es2020',
    },
    exclude: [
      "@fortawesome/fontawesome-svg-core",
      "@fortawesome/free-brands-svg-icons",
    ],
  },
  server: {
    port: 3000,
    open: true,
    hmr: {
      overlay: true,
    },
  },
  resolve: {
    extensions: [".js", ".jsx", ".json"],
    alias: {
      "@": "/src",
      "@components": "/src/components",
      "@pages": "/src/pages",
      "@services": "/src/services",
      "@context": "/src/context",
      "@assets": "/src/assets",
      "@config": "/src/config",
    },
  },
  css: {
    devSourcemap: true,
  },
});
