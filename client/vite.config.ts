// vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Les appels à '/api/users' seront redirigés vers 'http://localhost:3000/users'
      '/api': {
        target: 'http://localhost:3000', // ⚠️ Remplacer par l'URL de VOTRE backend Node.js
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
    },
  },
});