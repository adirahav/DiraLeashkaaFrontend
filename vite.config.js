import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../NodeProjects/diraleashkaa-backend/public',	// public folder in backend project
    emptyOutDir: true,			// remove previous files
    rollupOptions: {
      output: {
        format: 'es', // ✅ MUST be 'es', not 'iife' or 'umd'
      },
    },
  },
  worker: {
    format: 'es', // ✅ Ensure workers are built as ES modules
  },

})
