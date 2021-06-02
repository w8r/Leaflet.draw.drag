/**
 * Dragging routines for poly handler
 */

L.Edit.PolyVerticesEdit.include( /** @lends L.Edit.PolyVerticesEdit.prototype */ {

  // store methods to call them in overrides
  __createMarker: L.Edit.PolyVerticesEdit.prototype._createMarker,
  __removeMarker: L.Edit.PolyVerticesEdit.prototype._removeMarker,

  /**
   * @override
   */
  addHooks: function() {
    var poly = this._poly;

    if (!(poly instanceof L.Polygon)) {
      poly.options.fill = false;
      if (poly.options.editing) {
        poly.options.editing.fill = false;
      }
    }

    poly.setStyle(poly.options.editing);
    if (this._poly._map) {
      this._map = this._poly._map; // Set map
      if (!this._markerGroup) {
        this._enableDragging();
        this._initMarkers();
        // Create center marker
        this._createMoveMarker();
      }
      this._poly._map.addLayer(this._markerGroup);
    }
  },

  /**
   * @override
   */
  _createMoveMarker: function() {
    if (L.EditToolbar.Edit.MOVE_MARKERS && (this._poly instanceof L.Polygon)) {
      this._moveMarker = new L.Marker(this._getShapeCenter(), {
        icon: this.options.moveIcon
      });
      this._moveMarker.on('mousedown', this._delegateToShape, this);
      this._markerGroup.addLayer(this._moveMarker);
    }
  },

  /**
   * Start dragging through the marker
   * @param  {L.MouseEvent} evt
   */
  _delegateToShape: function(evt) {
    var poly = this._shape || this._poly;
    var marker = evt.target;
    poly.fire('mousedown', L.Util.extend(evt, {
      containerPoint: L.DomUtil.getPosition(marker._icon)
        .add(poly._map._getMapPanePos())
    }));
  },

  /**
   * Polygon centroid
   * @return {L.LatLng}
   */
  _getShapeCenter: function() {
    return this._poly.getCenter();
  },

  /**
   * @override
   */
  removeHooks: function() {
    var poly = this._poly;

    if (poly.options.original) {
      poly.setStyle(poly.options.original);
    }

    if (this._poly._map) {
      this._poly._map.removeLayer(this._markerGroup);
      this._disableDragging();
      delete this._markerGroup;
      delete this._markers;
    }
		this._map = null;
  },

  /**
   * Adds drag start listeners
   */
  _enableDragging: function() {
    if (!this._poly.dragging) {
      this._poly.dragging = new L.Handler.PathDrag(this._poly);
    }
    this._poly.dragging.enable();
    this._poly
      .on('dragstart', this._onStartDragFeature, this)
      .on('dragend', this._onStopDragFeature, this);
  },

  /**
   * Removes drag start listeners
   */
  _disableDragging: function() {
    this._poly.dragging.disable();
    this._poly
      .off('dragstart', this._onStartDragFeature, this)
      .off('dragend', this._onStopDragFeature, this);
  },

  /**
   * Start drag
   * @param  {L.MouseEvent} evt
   */
  _onStartDragFeature: function(evt) {
    this._poly._map.removeLayer(this._markerGroup);
    this._poly.fire('editstart');
  },

  /**
   * Dragging stopped, apply
   * @param  {L.MouseEvent} evt
   */
  _onStopDragFeature: function(evt) {
    var polygon = this._poly;
    var latlngs = polygon._latlngs;

    if (!L.Util.isArray(latlngs[0])) {
      latlngs = [latlngs];
    }

    for (var j = 0, jj = latlngs.length; j < jj; j++) {
      for (var i = 0, len = latlngs[j].length; i < len; i++) {
        // update marker
        var marker = this._markers[i];
        marker.setLatLng(latlngs[j][i]);

        // this one's needed to update the path
        marker._origLatLng = latlngs[j][i];
        if (marker._middleLeft) {
          marker._middleLeft.setLatLng(this._getMiddleLatLng(marker._prev, marker));
        }
        if (marker._middleRight) {
          marker._middleRight.setLatLng(this._getMiddleLatLng(marker, marker._next));
        }
      }
    }

    // show vertices
    this._poly._map.addLayer(this._markerGroup);
    L.Edit.SimpleShape.prototype._updateMoveMarker.call(this);
    this._fireEdit();
  },

  /**
   * Copy from simple shape
   */
  _updateMoveMarker: L.Edit.SimpleShape.prototype._updateMoveMarker,

  /**
   * @override
   */
  _createMarker: function(latlng, index) {
    var marker = this.__createMarker(latlng, index);
    marker
      .on('dragstart', this._hideMoveMarker, this)
      .on('dragend', this._showUpdateMoveMarker, this);
    return marker;
  },

  /**
   * @override
   */
  _removeMarker: function(marker) {
    this.__removeMarker(marker);
    marker
      .off('dragstart', this._hideMoveMarker, this)
      .off('dragend', this._showUpdateMoveMarker, this);
  },

  /**
   * Hide move marker while dragging a vertex
   */
  _hideMoveMarker: function() {
    if (this._moveMarker) {
      this._markerGroup.removeLayer(this._moveMarker);
    }
  },

  /**
   * Show and update move marker
   */
  _showUpdateMoveMarker: function() {
    if (this._moveMarker) {
      this._markerGroup.addLayer(this._moveMarker);
      this._updateMoveMarker();
    }
  }

});

/**
 * @type {L.DivIcon}
 */
L.Edit.PolyVerticesEdit.prototype.options.moveIcon = new L.DivIcon({
  iconSize: new L.Point(8, 8),
  className: 'leaflet-div-icon leaflet-editing-icon leaflet-edit-move'
});

/**
 * Override this if you don't want the central marker
 * @type {Boolean}
 */
L.Edit.PolyVerticesEdit.mergeOptions({
  moveMarker: false
});
