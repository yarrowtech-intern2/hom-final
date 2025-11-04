import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@dimforge/rapier3d': '@dimforge/rapier3d-compat',
    },
  },
  server: {
    port: 5173,
    proxy: {
      // Forward any /api request to backend
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})
