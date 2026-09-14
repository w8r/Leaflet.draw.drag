import L from 'leaflet';
import '../src/index.mjs';
import data from './data.json';

////////////////////////////////////////////////////////////////////////////////
const map = (window.map = new L.Map('map', {}).setView(
  [22.42658, 114.1452],
  11
));

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution:
    '&copy; <a href="https://osm.org/copyright">OpenStreetMap</a> contributors',
}).addTo(map);

const circle = L.circle([22.36721, 114.14486], 4000);

// Initialise the FeatureGroup to store editable layers
const drawnItems = (window.drawnItems = L.geoJSON(data).addTo(map));
drawnItems.addLayer(circle);

// Initialise the draw control and pass it the FeatureGroup of editable layers
const drawControl = (window.drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems,
    edit: {
      selectedPathOptions: {
        maintainColor: true,
        moveMarkers: true,
      },
    },
  },
}));
map.addControl(drawControl);

map.on('draw:created', (e) => {
  const { layerType, layer } = e;

  if (layerType === 'marker') {
    layer.bindPopup('A popup!');
  }

  drawnItems.addLayer(layer);
});

////////////////////////////////////////////////////////////////////////////////
const toolbar = (window.toolbar = (() => {
  for (const type in drawControl._toolbars) {
    if (drawControl._toolbars[type] instanceof L.EditToolbar) {
      return drawControl._toolbars[type];
    }
  }
})());

toolbar._modes.edit.handler.enable();

document.querySelector('.centroids').addEventListener('change', (e) => {
  setTimeout(() => {
    L.EditToolbar.Edit.MOVE_MARKERS = e.target.checked;
    toolbar._modes.edit.handler.disable();
    toolbar._modes.edit.handler.enable();
  }, 50);
});
