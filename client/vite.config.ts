import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'
import path from 'path'
import svgr from '@svgr/rollup'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [TanStackRouterVite({}), react(), svgr()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, "./src/"),
      '@lib': path.resolve(__dirname, "./src/lib")
    }
  },
})
