import commonjs from '@rollup/plugin-commonjs'; // Import the plugin
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react(),
    commonjs()
  ]
});