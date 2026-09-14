import { beforeEach, describe, expect, it } from 'vitest';
import L from 'leaflet';
import '../src/index.mjs';

function createMap() {
  const container = document.createElement('div');
  document.body.appendChild(container);
  return new L.Map(container).setView([0, 0], 13);
}

describe('leaflet-draw-drag', () => {
  let map;

  beforeEach(() => {
    map = createMap();
  });

  it('mixes the drag hooks into every leaflet-draw edit handler', () => {
    for (const proto of [
      L.Edit.PolyVerticesEdit.prototype,
      L.Edit.Circle.prototype,
      L.Edit.Rectangle.prototype,
    ]) {
      expect(typeof proto._enableDragging).toBe('function');
      expect(typeof proto._disableDragging).toBe('function');
    }

    // SimpleShape only contributes the shared centroid-marker routines -
    // dragging itself is wired up per-shape above.
    expect(typeof L.Edit.SimpleShape.prototype._updateMoveMarker).toBe(
      'function'
    );
    expect(typeof L.Edit.SimpleShape.prototype._createMoveMarker).toBe(
      'function'
    );
  });

  it('makes an edited polygon draggable, then releases it', () => {
    const polygon = L.polygon([
      [0, 0],
      [0, 1],
      [1, 1],
    ]).addTo(map);

    polygon.editing.enable();
    expect(polygon.dragging).toBeInstanceOf(L.Handler.PathDrag);
    expect(polygon.dragging.enabled()).toBe(true);

    polygon.editing.disable();
    expect(polygon.dragging.enabled()).toBe(false);
  });

  it('makes an edited circle draggable, then releases it', () => {
    const circle = L.circle([0, 0], { radius: 100 }).addTo(map);

    circle.editing.enable();
    expect(circle.dragging).toBeInstanceOf(L.Handler.PathDrag);
    expect(circle.dragging.enabled()).toBe(true);

    circle.editing.disable();
    expect(circle.dragging.enabled()).toBe(false);
  });

  it('makes an edited rectangle draggable, then releases it', () => {
    const rectangle = L.rectangle([
      [0, 0],
      [1, 1],
    ]).addTo(map);

    rectangle.editing.enable();
    expect(rectangle.dragging).toBeInstanceOf(L.Handler.PathDrag);
    expect(rectangle.dragging.enabled()).toBe(true);

    rectangle.editing.disable();
    expect(rectangle.dragging.enabled()).toBe(false);
  });

  it('toggles the centroid move marker flag from selectedPathOptions.moveMarkers', () => {
    const polygon = L.polygon([
      [0, 0],
      [0, 1],
      [1, 1],
    ]).addTo(map);
    const featureGroup = new L.FeatureGroup([polygon]).addTo(map);

    L.EditToolbar.Edit.MOVE_MARKERS = false;

    const editToolbar = new L.EditToolbar.Edit(map, {
      featureGroup,
      selectedPathOptions: { moveMarkers: true },
    });

    expect(L.EditToolbar.Edit.MOVE_MARKERS).toBe(true);

    editToolbar.enable();
    editToolbar.disable();
  });
});
