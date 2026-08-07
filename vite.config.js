import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      external: [/^SAXI-OS\/.*/],
    },
  },
  server: {
    watch: {
      ignored: ['**/SAXI-OS/**', '**/backend/**'],
    },
    proxy: {
      '/api/saxi': {
        target: 'http://localhost:3001',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/saxi/, ''),
      },
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
})
