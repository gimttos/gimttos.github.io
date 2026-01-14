import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', // GitHub 개인 페이지
  build: {
    outDir: 'docs',
    emptyOutDir: true,
  }
})
