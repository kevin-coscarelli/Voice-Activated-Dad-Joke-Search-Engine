import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'https://api.goodtape.io', // Target API URL
        changeOrigin: true,               // Ensures the origin header is updated to match the target
        rewrite: (path) => path.replace(/^\/api/, ''), // Strips `/api` from the beginning
      },
      '/callback': {
        target: 'https://webhook.site', // Target API URL
        changeOrigin: true,               // Ensures the origin header is updated to match the target
        rewrite: (path) => path.replace(/^\/callback/, ''), // Strips `/api` from the beginning
      },
      '/dadjokes': {
        target: 'https://icanhazdadjoke.com', // Target API URL
        changeOrigin: true,               // Ensures the origin header is updated to match the target
        rewrite: (path) => path.replace(/^\/dadjokes/, ''), // Strips `/api` from the beginning
      },
    },
  },
  plugins: [react()],
})
