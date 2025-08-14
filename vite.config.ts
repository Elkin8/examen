// vite.config.ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/ika': {
        target: 'https://puce.estudioika.com',
        changeOrigin: true,
        secure: false,
        rewrite: (p) => p.replace(/^\/ika/, '/api'),
      },
    },
  },
  build: { outDir: 'dist' },
})
