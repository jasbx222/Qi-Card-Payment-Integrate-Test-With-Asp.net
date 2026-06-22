import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': { target: 'http://localhost:5229', changeOrigin: true },
      '/register': { target: 'http://localhost:5229', changeOrigin: true },
      '/Login': { target: 'http://localhost:5229', changeOrigin: true },
    },
  },
})
