var L = global.L || require('leaflet');
var data = require('../data.json');
var drawControl = require('../../index');
// require('./L.TouchExtend');

L.Icon.Default.imagePath = "http://cdn.leafletjs.com/leaflet-0.7/images";

////////////////////////////////////////////////////////////////////////////////
var map = global.map = new L.Map('map', {}).setView([22.42658, 114.1452], 11);

L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
  attribution: '&copy; ' +
    '<a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);
var c = new L.LatLng(22.36721, 114.14486);
var circle = L.circle(c, 4000);

// Initialise the FeatureGroup to store editable layers
var drawnItems = global.drawnItems = L.geoJson(data).addTo(map);
drawnItems.addLayer(circle);
map.addLayer(drawnItems);

// Initialise the draw control and pass it the FeatureGroup of editable layers
var drawControl = global.drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
    edit: {
      selectedPathOptions: {
        maintainColor: true,
        moveMarkers: true
      }
    }
  }
});
map.addControl(drawControl);

map.on('draw:created', function(e) {
  var type = e.layerType,
    layer = e.layer;

  if (type === 'marker') {
    layer.bindPopup('A popup!');
  }

  drawnItems.addLayer(layer);
});

////////////////////////////////////////////////////////////////////////////////
var toolbar = global.toolbar = (function() {
  for (var type in drawControl._toolbars) {
    if (drawControl._toolbars[type] instanceof L.EditToolbar) {
      return drawControl._toolbars[type];
    }
  }
})();

toolbar._modes.edit.handler.enable();

L.DomEvent.on(document.querySelector('.centroids'), 'change', function(e) {
  setTimeout(function() {
    //if (e.target.checked) {
    L.EditToolbar.Edit.MOVE_MARKERS = e.target.checked;
    toolbar._modes.edit.handler.disable();
    toolbar._modes.edit.handler.enable();
    //}
  }, 50);
});
