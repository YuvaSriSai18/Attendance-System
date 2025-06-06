import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [
    react({
      include: '**/*.{js,jsx,ts,tsx}',
    }),
  ],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    proxy: {
      '/api': 'https://rbnfh5ks-5200.inc1.devtunnels.ms/',  // <-- replace 5000 with your backend port
    },
  },
});
