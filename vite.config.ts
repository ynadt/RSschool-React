import react from '@vitejs/plugin-react';
import path from 'path';
import { defineConfig } from 'vite';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      'next/router': path.resolve(__dirname, './node_modules/next/dist/client/router.js'),
      'next/link': path.resolve(__dirname, './node_modules/next/dist/client/link.js'),
      'next/dist/shared/lib/router-context': path.resolve(
        __dirname,
        './node_modules/next/dist/shared/lib/router-context.js',
      ),
    },
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './tests/setupTests.tsx',
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
    },
  },
});
