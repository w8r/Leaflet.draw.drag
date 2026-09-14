# Leaflet.draw.drag

[![npm version](https://badge.fury.io/js/leaflet-draw-drag.svg)](https://badge.fury.io/js/leaflet-draw-drag)

Drag feature functionality for [Leaflet.draw](https://github.com/Leaflet/Leaflet.draw).

Uses [Leaflet.Path.Drag](https://github.com/w8r/Leaflet.Path.Drag) to make
every shape you edit with Leaflet.draw draggable, without extra markup.

#### Backwards compatibility

If you want `leaflet@0.7.x` + `leaflet.draw@0.2.x` support, use the
`leaflet-0.7` branch or npm version `leaflet-draw-drag@^0.1.7`. For
`leaflet@1.x` on the old CommonJS/browserify build, use
`leaflet-draw-drag@^0.4.8`.

## [Demo](https://w8r.github.io/Leaflet.draw.drag/)

## Install

```bash
npm install leaflet-draw-drag leaflet-draw leaflet
```

## Usage

```javascript
import L from 'leaflet';
// leaflet-draw and this plugin are old-style Leaflet plugins that read/write
// the global `L`, so publish it before loading either of them.
window.L = L;

import 'leaflet-draw';
import 'leaflet-draw-drag';

const drawnItems = new L.FeatureGroup().addTo(map);

// Initialise the draw control and pass it the FeatureGroup of editable layers
const drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
    edit: {
      selectedPathOptions: {
        moveMarkers: false, // centroids, default: false
      },
    },
  },
});
map.addControl(drawControl);
// aaand you are good to go, all vector paths are draggable in edit mode
```

Or straight from a CDN, after `leaflet` and `leaflet-draw`:

```html
<script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
<script src="https://unpkg.com/leaflet-draw/dist/leaflet.draw.js"></script>
<script src="https://unpkg.com/leaflet-draw-drag/dist/index.js"></script>
```

## Info

Uses and includes [Leaflet.Path.Drag](https://github.com/w8r/Leaflet.Path.Drag)
to extend vector features with drag functionality, so you can create draggable
polygons and polylines programmatically even without an active edit session:

```javascript
const polygon = new L.Polygon([...], { draggable: true }).addTo(map);
polygon
  .on('dragstart', onDragStart)
  .on('drag', onDrag)
  .on('dragend', onDragEnd);
```

## Development

```bash
npm install
npm start   # demo at http://localhost:5173
npm test    # vitest
npm run build   # lints, builds dist/{index.mjs,index.js,index.cjs,index.d.ts}
npm run docs    # builds the demo into dist/docs (used for gh-pages)
```

## License

The MIT License (MIT)

Copyright (c) 2015 Alexander Milevski

Permission is hereby granted, free of charge, to any person obtaining a copy of
this software and associated documentation files (the "Software"), to deal in
the Software without restriction, including without limitation the rights to use,
copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the
Software, and to permit persons to whom the Software is furnished to do so,
subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS
FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR
COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER
IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN
CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

Drag feature functionality for Leaflet.draw
