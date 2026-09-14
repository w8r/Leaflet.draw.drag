/// <reference types="vitest/config" />
import { defineConfig } from 'vite';

const extensions = {
  es: 'mjs',
  cjs: 'cjs',
  umd: 'js',
};

export default defineConfig({
  build: {
    lib: {
      entry: 'src/index.mjs',
      formats: ['es', 'umd', 'cjs'],
      name: require('./package.json').name,
      fileName: (format) => `index.${extensions[format]}`,
    },
    rollupOptions: {
      external: ['leaflet', 'leaflet-draw', 'leaflet-path-drag'],
      output: {
        globals: {
          leaflet: 'L',
          'leaflet-draw': 'L',
          'leaflet-path-drag': 'L',
        },
      },
    },
  },
  test: {
    environment: 'jsdom',
    setupFiles: ['./test/setup.js'],
  },
});
