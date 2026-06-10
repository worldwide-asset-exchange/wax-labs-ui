import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { fileURLToPath } from 'url';
import { defineConfig } from 'vite';
import viteSvgr from 'vite-plugin-svgr';

const __dirname = fileURLToPath(new URL('.', import.meta.url));

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteSvgr(),
  ],
  resolve: {
    tsconfigPaths: true,
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
