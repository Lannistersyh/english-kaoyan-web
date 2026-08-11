import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // GitHub Pages 部署时需要子路径；本地开发时用 '/' 不动
  base: process.env.BASE_URL ?? '/',
  server: {
    port: 5173,
    open: false,
  },
})
