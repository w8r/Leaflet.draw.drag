import { defineConfig } from 'vite';

export default defineConfig(({ command }) => ({
  root: 'example',
  // Relative asset URLs so the built demo works from a GH Pages project
  // subpath (w8r.github.io/Leaflet.draw.drag/). Only valid for `build` -
  // the dev server needs an absolute base to route requests at all.
  base: command === 'build' ? './' : '/',
  build: {
    outDir: '../dist/docs',
    emptyOutDir: true,
  },
}));
