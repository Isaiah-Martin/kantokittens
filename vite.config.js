import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  // This is the key change
  build: {
    rollupOptions: {
      external: ['react-native', 'react-native-vector-icons', '../../components/parallax-scroll-view'],
    },
  },
});