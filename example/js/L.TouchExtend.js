L.Map.mergeOptions({
  touchExtend: true
});

L.Map.TouchExtend = L.Handler.extend({

  initialize: function(map) {
    this._map = map;
    this._container = map._container;
    this._pane = map._panes.overlayPane;
  },

  addHooks: function() {
    L.DomEvent.on(this._container, 'touchstart', this._onTouchStart, this)
      .on(this._container, 'touchend', this._onTouchEnd, this)
      .on(this._container, 'touchmove', this._onTouchMove, this);
  },

  removeHooks: function() {
    L.DomEvent.off(this._container, 'touchstart', this._onTouchStart)
      .off(this._container, 'touchend', this._onTouchEnd)
      .off(this._container, 'touchmove', this._onTouchMove);
  },

  _onTouchEvent: function(e, type) {
    if (!this._map._loaded) {
      return;
    }

    var touch = e.touches[0];
    var containerPoint = L.point(touch.clientX, touch.clientY);
    var layerPoint = this._map.containerPointToLayerPoint(containerPoint);
    var latlng = this._map.layerPointToLatLng(layerPoint);

    this._map.fire(type, {
      latlng: latlng,
      layerPoint: layerPoint,
      containerPoint: containerPoint,
      originalEvent: e
    });
  },

  _onTouchStart: function(e) {
    this._onTouchEvent(e, 'touchstart');
  },

  _onTouchEnd: function(e) {
    if (!this._map._loaded) {
      return;
    }
    this._map.fire('touchend', {
      originalEvent: e
    });
  },

  _onTouchMove: function(e) {
    this._onTouchEvent(e, 'touchmove');
  }
});

L.Map.addInitHook('addHandler', 'touchExtend', L.Map.TouchExtend);
