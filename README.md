# Leaflet.Draw.Drag

[![npm version](https://badge.fury.io/js/leaflet-draw-drag.svg)](https://badge.fury.io/js/leaflet-draw-drag)

Drag feature functionality for [Leaflet.draw](https://github.com/Leaflet/Leaflet.draw).

Uses [Leaflet.Path.Drag](https://github.com/w8r/Leaflet.Path.Drag)

#### Backwards compatibility

If you want `leaflet@0.7.x` + `leaflet.draw@0.2.x` support, use `leaflet-0.7` branch or
npm versions `leaflet-draw-drag@^0.1.7`

## [Demo](https://w8r.github.io/Leaflet.draw.drag/example/index.html)

## Usage

```javascript
<script src="path/to/leaflet/"></script>
<script src="path/to/leaflet.draw.js"></script>
<script src="path/to/Edit.Poly.Drag.js"></script>
...
var drawnItems = new L.FeatureGroup().addTo(map);
// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems
    edit: {
      moveMarkers: false // centroids, default: false
    }
  }
});
map.addControl(drawControl);
// aaand you are good to go, all vector paths are draggable in edit mode

```

with browserify

```
npm install leaflet-draw-drag
...

require('leaflet');
var drawControl = require('leaflet-draw-drag'); // requires leaflet-draw
```

## Info

Uses and includes [Leaflet.Path.Drag](https://github.com/w8r/Leaflet.Path.Drag)
to extend vector features with drag functionality, so you can create draggable
polygons and polylines programmatically if you have this one included in your
app.

```javascript
var polygon = new L.Polygon([...], { draggable: true }).addTo(map);
polygon
    .on('dragstart', onDragStart)
    .on('drag',      onDrag)
    .on('dragend',   onDragEnd);
```

## Development

```
npm install && npm start
```
Build
```
npm run build
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
