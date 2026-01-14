import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: './', // ⭐ Pages 필수
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  }
})
