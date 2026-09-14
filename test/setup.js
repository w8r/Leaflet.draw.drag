// jsdom does not perform layout, so every element reports a 0x0 size.
// Leaflet reads clientWidth/clientHeight and getBoundingClientRect to size
// the map pane - give every element a fixed, non-zero size so L.Map can
// compute real pixel projections while running under vitest.
Object.defineProperties(window.HTMLElement.prototype, {
  clientWidth: { value: 400, configurable: true },
  clientHeight: { value: 400, configurable: true },
});

window.HTMLElement.prototype.getBoundingClientRect = () => ({
  width: 400,
  height: 400,
  top: 0,
  left: 0,
  bottom: 400,
  right: 400,
  x: 0,
  y: 0,
  toJSON() {},
});

// Leaflet feature-detects SVG support via `SVGElement.prototype.createSVGRect`,
// which jsdom does not implement, even though it otherwise supports the SVG
// DOM well enough for Leaflet's own renderer. Force it on so the default
// (SVG) vector renderer is used instead of Leaflet failing to pick a renderer
// at all.
import L from 'leaflet';
L.Browser.svg = true;
