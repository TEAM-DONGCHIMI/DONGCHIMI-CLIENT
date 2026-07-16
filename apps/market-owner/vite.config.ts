import react from '@vitejs/plugin-react';
import { vanillaExtractPlugin } from '@vanilla-extract/vite-plugin';
import { createRequire } from 'node:module';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

const dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const dotLottieWebDistDir = path.dirname(require.resolve('@lottiefiles/dotlottie-web'));
const dotLottieWasmPath = path.resolve(dotLottieWebDistDir, 'dotlottie-player.wasm');

export default defineConfig({
  plugins: [react(), vanillaExtractPlugin()],
  resolve: {
    alias: {
      '@': path.resolve(dirname, './src'),
      '@lottiefiles/dotlottie-web/dotlottie-player.wasm': dotLottieWasmPath,
    },
    extensions: ['.tsx', '.ts', '.jsx', '.js', '.json'],
  },
  server: {
    port: 5173,
    strictPort: true,
    proxy: {
      '/v1': {
        target: 'https://api.dongchiimi.com',
        changeOrigin: true,
        secure: true,
      },
    },
  },
});
