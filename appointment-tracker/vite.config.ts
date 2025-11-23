import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // @ts-ignore - Vitest config is added via plugin
  test: {
    globals: true,
    environment: 'happy-dom',
    setupFiles: './src/tests/setup.ts',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor code into separate chunk
          'vendor': [
            'react',
            'react-dom',
          ],
          // Split optional features into separate chunks for code splitting
          'calendar': [
            './src/services/googleCalendarService.ts',
            './src/components/GoogleCalendarIntegration.tsx',
          ],
          'print': [
            './src/components/PrintableChecklist.tsx',
          ],
        },
      },
    },
    // Optimize chunk size
    chunkSizeWarningLimit: 500,
    // Enable minification with esbuild (faster than terser)
    minify: 'esbuild',
  },
})
