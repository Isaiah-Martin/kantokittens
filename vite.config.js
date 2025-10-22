import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [ react(), 
    tsconfigPaths()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './'),
      '@react-native-async-storage/async-storage': 'react',
      'react-native': 'react-native-web',
      entries: [
            { find: '@expo/vector-icons', replacement: 'react' },
      ],
    }
  }
});