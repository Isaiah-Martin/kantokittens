import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // This is the key change
  build: {
    rollupOptions: {
      external: ['react-native', 'react-native-vector-icons'],
    },
  },
});