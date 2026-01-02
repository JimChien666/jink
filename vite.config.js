import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
  plugins: [vue()],
  base: '/we-love-buddha/', // ← 改成你的 repo 名稱
})