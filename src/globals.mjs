import L from 'leaflet';

// Leaflet.draw and Leaflet.Path.Drag are old-style Leaflet plugins that
// expect a global `L` to already exist (they were written for `<script>`
// tag usage). Bundlers give us Leaflet's own mutable UMD object here as the
// default export - publish it as a global before loading either plugin, so
// their global `L.Something = ...` assignments land on the same object our
// own modules import.
if (typeof globalThis !== 'undefined' && !globalThis.L) {
  globalThis.L = L;
}
