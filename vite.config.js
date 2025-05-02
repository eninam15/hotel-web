import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'

export default defineConfig({
  plugins: [vue()],
  resolve: {
    alias: {
      // Alias '@' apuntando a 'src'
      '@': path.resolve(__dirname, './src'),
    }
  }
})
