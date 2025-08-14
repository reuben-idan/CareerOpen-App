// vite.config.js
import { defineConfig } from "file:///C:/Users/reube/CareerOpen-App/node_modules/vite/dist/node/index.js";
import react from "@vitejs/plugin-react";
import { fileURLToPath } from "node:url";
import { resolve } from "path";
var __vite_injected_original_dirname = "C:\\Users\\reube\\CareerOpen-App";
var __vite_injected_original_import_meta_url = "file:///C:/Users/reube/CareerOpen-App/vite.config.js";
var vite_config_default = defineConfig({
  // Base public path when served in production
  base: "/",
  // Plugins
  plugins: [react()],
  // Resolve configuration
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", __vite_injected_original_import_meta_url))
    }
  },
  // Development server configuration
  server: {
    port: 3e3,
    open: true,
    host: true,
    strictPort: true,
    // Ensure proper MIME types in development
    headers: {
      "Content-Type": "application/javascript; charset=utf-8"
    }
  },
  // Build configuration
  build: {
    outDir: "dist",
    sourcemap: true,
    // Ensure proper module format
    target: "esnext",
    // Don't minify for easier debugging
    minify: false,
    // Rollup options
    rollupOptions: {
      // Main entry point
      input: {
        main: resolve(__vite_injected_original_dirname, "index.html")
      },
      // Output configuration
      output: {
        // Use hashed filenames for better caching
        entryFileNames: "assets/[name]-[hash].js",
        chunkFileNames: "assets/[name]-[hash].js",
        assetFileNames: "assets/[name]-[hash][extname]",
        // Ensure proper module format
        format: "esm",
        // Preserve module structure for better tree-shaking
        preserveModules: false,
        // Manual chunks for better caching
        manualChunks: (id) => {
          if (id.includes("node_modules")) {
            return "vendor";
          }
        }
      }
    }
  },
  // Optimize dependencies
  optimizeDeps: {
    include: ["react", "react-dom", "react-router-dom"],
    esbuildOptions: {
      // Specify target environment
      target: "es2020"
    }
  },
  // ESBuild options
  esbuild: {
    // Ensure JSX is handled correctly
    jsx: "automatic",
    // Minify in production
    minify: process.env.NODE_ENV === "production"
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcuanMiXSwKICAic291cmNlc0NvbnRlbnQiOiBbImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJDOlxcXFxVc2Vyc1xcXFxyZXViZVxcXFxDYXJlZXJPcGVuLUFwcFwiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiQzpcXFxcVXNlcnNcXFxccmV1YmVcXFxcQ2FyZWVyT3Blbi1BcHBcXFxcdml0ZS5jb25maWcuanNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0M6L1VzZXJzL3JldWJlL0NhcmVlck9wZW4tQXBwL3ZpdGUuY29uZmlnLmpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCB7IGZpbGVVUkxUb1BhdGggfSBmcm9tICdub2RlOnVybCc7XHJcbmltcG9ydCB7IHJlc29sdmUgfSBmcm9tICdwYXRoJztcclxuXHJcbi8vIGh0dHBzOi8vdml0ZWpzLmRldi9jb25maWcvXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgLy8gQmFzZSBwdWJsaWMgcGF0aCB3aGVuIHNlcnZlZCBpbiBwcm9kdWN0aW9uXHJcbiAgYmFzZTogJy8nLFxyXG4gIFxyXG4gIC8vIFBsdWdpbnNcclxuICBwbHVnaW5zOiBbcmVhY3QoKV0sXHJcbiAgXHJcbiAgLy8gUmVzb2x2ZSBjb25maWd1cmF0aW9uXHJcbiAgcmVzb2x2ZToge1xyXG4gICAgYWxpYXM6IHtcclxuICAgICAgJ0AnOiBmaWxlVVJMVG9QYXRoKG5ldyBVUkwoJy4vc3JjJywgaW1wb3J0Lm1ldGEudXJsKSlcclxuICAgIH1cclxuICB9LFxyXG4gIFxyXG4gIC8vIERldmVsb3BtZW50IHNlcnZlciBjb25maWd1cmF0aW9uXHJcbiAgc2VydmVyOiB7XHJcbiAgICBwb3J0OiAzMDAwLFxyXG4gICAgb3BlbjogdHJ1ZSxcclxuICAgIGhvc3Q6IHRydWUsXHJcbiAgICBzdHJpY3RQb3J0OiB0cnVlLFxyXG4gICAgLy8gRW5zdXJlIHByb3BlciBNSU1FIHR5cGVzIGluIGRldmVsb3BtZW50XHJcbiAgICBoZWFkZXJzOiB7XHJcbiAgICAgICdDb250ZW50LVR5cGUnOiAnYXBwbGljYXRpb24vamF2YXNjcmlwdDsgY2hhcnNldD11dGYtOCcsXHJcbiAgICB9LFxyXG4gIH0sXHJcbiAgXHJcbiAgLy8gQnVpbGQgY29uZmlndXJhdGlvblxyXG4gIGJ1aWxkOiB7XHJcbiAgICBvdXREaXI6ICdkaXN0JyxcclxuICAgIHNvdXJjZW1hcDogdHJ1ZSxcclxuICAgIC8vIEVuc3VyZSBwcm9wZXIgbW9kdWxlIGZvcm1hdFxyXG4gICAgdGFyZ2V0OiAnZXNuZXh0JyxcclxuICAgIC8vIERvbid0IG1pbmlmeSBmb3IgZWFzaWVyIGRlYnVnZ2luZ1xyXG4gICAgbWluaWZ5OiBmYWxzZSxcclxuICAgIFxyXG4gICAgLy8gUm9sbHVwIG9wdGlvbnNcclxuICAgIHJvbGx1cE9wdGlvbnM6IHtcclxuICAgICAgLy8gTWFpbiBlbnRyeSBwb2ludFxyXG4gICAgICBpbnB1dDoge1xyXG4gICAgICAgIG1haW46IHJlc29sdmUoX19kaXJuYW1lLCAnaW5kZXguaHRtbCcpXHJcbiAgICAgIH0sXHJcbiAgICAgIFxyXG4gICAgICAvLyBPdXRwdXQgY29uZmlndXJhdGlvblxyXG4gICAgICBvdXRwdXQ6IHtcclxuICAgICAgICAvLyBVc2UgaGFzaGVkIGZpbGVuYW1lcyBmb3IgYmV0dGVyIGNhY2hpbmdcclxuICAgICAgICBlbnRyeUZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICBjaHVua0ZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdLmpzJyxcclxuICAgICAgICBhc3NldEZpbGVOYW1lczogJ2Fzc2V0cy9bbmFtZV0tW2hhc2hdW2V4dG5hbWVdJyxcclxuICAgICAgICBcclxuICAgICAgICAvLyBFbnN1cmUgcHJvcGVyIG1vZHVsZSBmb3JtYXRcclxuICAgICAgICBmb3JtYXQ6ICdlc20nLFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIFByZXNlcnZlIG1vZHVsZSBzdHJ1Y3R1cmUgZm9yIGJldHRlciB0cmVlLXNoYWtpbmdcclxuICAgICAgICBwcmVzZXJ2ZU1vZHVsZXM6IGZhbHNlLFxyXG4gICAgICAgIFxyXG4gICAgICAgIC8vIE1hbnVhbCBjaHVua3MgZm9yIGJldHRlciBjYWNoaW5nXHJcbiAgICAgICAgbWFudWFsQ2h1bmtzOiAoaWQpID0+IHtcclxuICAgICAgICAgIGlmIChpZC5pbmNsdWRlcygnbm9kZV9tb2R1bGVzJykpIHtcclxuICAgICAgICAgICAgcmV0dXJuICd2ZW5kb3InO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH0sXHJcbiAgXHJcbiAgLy8gT3B0aW1pemUgZGVwZW5kZW5jaWVzXHJcbiAgb3B0aW1pemVEZXBzOiB7XHJcbiAgICBpbmNsdWRlOiBbJ3JlYWN0JywgJ3JlYWN0LWRvbScsICdyZWFjdC1yb3V0ZXItZG9tJ10sXHJcbiAgICBlc2J1aWxkT3B0aW9uczoge1xyXG4gICAgICAvLyBTcGVjaWZ5IHRhcmdldCBlbnZpcm9ubWVudFxyXG4gICAgICB0YXJnZXQ6ICdlczIwMjAnLFxyXG4gICAgfSxcclxuICB9LFxyXG4gIFxyXG4gIC8vIEVTQnVpbGQgb3B0aW9uc1xyXG4gIGVzYnVpbGQ6IHtcclxuICAgIC8vIEVuc3VyZSBKU1ggaXMgaGFuZGxlZCBjb3JyZWN0bHlcclxuICAgIGpzeDogJ2F1dG9tYXRpYycsXHJcbiAgICAvLyBNaW5pZnkgaW4gcHJvZHVjdGlvblxyXG4gICAgbWluaWZ5OiBwcm9jZXNzLmVudi5OT0RFX0VOViA9PT0gJ3Byb2R1Y3Rpb24nLFxyXG4gIH0sXHJcbn0pO1xyXG4iXSwKICAibWFwcGluZ3MiOiAiO0FBQWlSLFNBQVMsb0JBQW9CO0FBQzlTLE9BQU8sV0FBVztBQUNsQixTQUFTLHFCQUFxQjtBQUM5QixTQUFTLGVBQWU7QUFIeEIsSUFBTSxtQ0FBbUM7QUFBZ0ksSUFBTSwyQ0FBMkM7QUFNMU4sSUFBTyxzQkFBUSxhQUFhO0FBQUE7QUFBQSxFQUUxQixNQUFNO0FBQUE7QUFBQSxFQUdOLFNBQVMsQ0FBQyxNQUFNLENBQUM7QUFBQTtBQUFBLEVBR2pCLFNBQVM7QUFBQSxJQUNQLE9BQU87QUFBQSxNQUNMLEtBQUssY0FBYyxJQUFJLElBQUksU0FBUyx3Q0FBZSxDQUFDO0FBQUEsSUFDdEQ7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUdBLFFBQVE7QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLE1BQU07QUFBQSxJQUNOLFlBQVk7QUFBQTtBQUFBLElBRVosU0FBUztBQUFBLE1BQ1AsZ0JBQWdCO0FBQUEsSUFDbEI7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUdBLE9BQU87QUFBQSxJQUNMLFFBQVE7QUFBQSxJQUNSLFdBQVc7QUFBQTtBQUFBLElBRVgsUUFBUTtBQUFBO0FBQUEsSUFFUixRQUFRO0FBQUE7QUFBQSxJQUdSLGVBQWU7QUFBQTtBQUFBLE1BRWIsT0FBTztBQUFBLFFBQ0wsTUFBTSxRQUFRLGtDQUFXLFlBQVk7QUFBQSxNQUN2QztBQUFBO0FBQUEsTUFHQSxRQUFRO0FBQUE7QUFBQSxRQUVOLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBLFFBQ2hCLGdCQUFnQjtBQUFBO0FBQUEsUUFHaEIsUUFBUTtBQUFBO0FBQUEsUUFHUixpQkFBaUI7QUFBQTtBQUFBLFFBR2pCLGNBQWMsQ0FBQyxPQUFPO0FBQ3BCLGNBQUksR0FBRyxTQUFTLGNBQWMsR0FBRztBQUMvQixtQkFBTztBQUFBLFVBQ1Q7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUE7QUFBQSxFQUdBLGNBQWM7QUFBQSxJQUNaLFNBQVMsQ0FBQyxTQUFTLGFBQWEsa0JBQWtCO0FBQUEsSUFDbEQsZ0JBQWdCO0FBQUE7QUFBQSxNQUVkLFFBQVE7QUFBQSxJQUNWO0FBQUEsRUFDRjtBQUFBO0FBQUEsRUFHQSxTQUFTO0FBQUE7QUFBQSxJQUVQLEtBQUs7QUFBQTtBQUFBLElBRUwsUUFBUSxRQUFRLElBQUksYUFBYTtBQUFBLEVBQ25DO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
