import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    // Configuração de proxy para desenvolvimento (opcional)
    proxy: {
      // Se necessário, pode configurar proxy para evitar CORS
      // '/api': {
      //   target: 'https://localhost:7051',
      //   changeOrigin: true,
      //   secure: false,
      // }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
  },
});