// vite.config.ts
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';
import reactNativeWeb from 'vite-plugin-react-native-web';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [
    react(),
    reactNativeWeb(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      'react-native': 'react-native-web',
    },
},
  build: {
    rollupOptions: {
      // Ensure that problematic modules are externalized
      // This is a last resort if other methods fail
      external: ['react-native', 'react-native-vector-icons', '../../components/parallax-scroll-view', '@expo/vector-icons'],
       },
  },
});