import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: '../../NodeProjects/diraleashkaa-backend/public',	// public folder in backend project
    emptyOutDir: true			// remove previous files
  }

})
