import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';

function netlifyRedirectsPlugin() {
  return {
    name: 'generate-netlify-redirects',
    closeBundle() {
      const backendUrl = process.env.BACKEND_URL || process.env.VITE_BACKEND_URL;
      const distDir = path.resolve(__dirname, 'dist');
      if (!fs.existsSync(distDir)) return;

      let content = '';
      if (backendUrl) {
        const cleanUrl = backendUrl.replace(/\/+$/, '');
        content += `/api/*  ${cleanUrl}/api/:splat  200!\n`;
      }
      content += '/*  /index.html  200\n';

      fs.writeFileSync(path.join(distDir, '_redirects'), content, 'utf-8');
    },
  };
}

export default defineConfig({
  plugins: [react(), netlifyRedirectsPlugin()],
  server: {
    port: 3000,
    host: true,
    proxy: {
      '/api': {
        target: process.env.VITE_BACKEND_URL || process.env.BACKEND_URL || 'http://127.0.0.1:5001',
        changeOrigin: true,
      },
    },
  },
});
