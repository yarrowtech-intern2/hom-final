import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@dimforge/rapier3d': '@dimforge/rapier3d-compat',
    },
  },
})
