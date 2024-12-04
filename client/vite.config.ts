import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/todos': {
        target: 'http://localhost:3000', // Адреса твого бекенду
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/todos/, '') // Якщо потрібно переписувати шляхи
      }
    }
  }
});
