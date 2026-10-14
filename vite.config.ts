import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig(({ mode }) => ({
  plugins: [react()],
  // 相对基准路径：同一构建产物可同时用于 GitHub Pages 子路径
  // (/english-kaoyan-web/)、Netlify/Vercel 根域名和本地静态服务器。
  base: loadEnv(mode, '.', 'VITE_').VITE_BASE_PATH || './',
  server: {
    port: 5173,
    open: false,
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:3003',
        changeOrigin: true,
      },
    },
  },
}))
