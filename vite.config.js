import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [ react(), 
    tsconfigPaths(),
    alias({
      '@': path.resolve(__dirname, './'),
      '@react-native-async-storage/async-storage': 'react',
      entries: [
            { find: '@expo/vector-icons', replacement: 'react' },
      ],
    }),
  ]
});