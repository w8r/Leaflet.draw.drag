var L = global.L || require('leaflet');
require('leaflet-draw');
require('leaflet-path-drag');
require('./src/Edit.Poly.Drag');
require('./src/Edit.Circle.Drag');
require('./src/Edit.Rectangle.Drag');

module.exports = L.Edit.Poly;
