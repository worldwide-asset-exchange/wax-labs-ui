import eslintPlugin from '@nabla/vite-plugin-eslint';
import react from '@vitejs/plugin-react-swc';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import viteSvgr from 'vite-plugin-svgr';
import tsconfigPaths from 'vite-tsconfig-paths';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    eslintPlugin({
      eslintOptions: {
        fix: true,
      },
    }),
    viteSvgr(),
    tsconfigPaths(),
  ],
  resolve: {
    alias: {
      '@': resolve(__dirname, './src'),
    },
  },
  define: {
    global: 'window',
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: id => {
          if (id.includes('node_modules')) {
            if (id.includes('react') || id.includes('scheduler') || id.includes('use-') || id.includes('usehooks')) {
              return 'react';
            } else if (
              id.includes('tiptap') ||
              id.includes('popper') ||
              id.includes('tippy') ||
              id.includes('marked')
            ) {
              return 'editor';
            } else if (id.includes('date-fns')) {
              return 'date-fns';
            }

            return 'vendor';
          }
        },
      },
    },
  },
});
