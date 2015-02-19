/**
 * Dragging routines for circle
 */

"use strict";

L.Edit.Circle.include( /** @lends L.Edit.Circle.prototype */ {

  /**
   * @override
   */
  addHooks: function () {
    if (this._shape._map) {
      this._map = this._shape._map;
      if (!this._markerGroup) {
        this._enableDragging();
        this._initMarkers();
      }
      this._shape._map.addLayer(this._markerGroup);
    }
  },

  /**
   * @override
   */
  removeHooks: function () {
    if (this._shape._map) {
      for (var i = 0, l = this._resizeMarkers.length; i < l; i++) {
        this._unbindMarker(this._resizeMarkers[i]);
      }
      
      this._disableDragging();
      this._resizeMarkers = null;
      this._map.removeLayer(this._markerGroup);
      delete this._markerGroup;
    }

    this._map = null;
  },

  /**
   * @override
   */
  _createMoveMarker: function () {
    // noop
  },


  _resize: function (latlng) {
    var center = this._shape.getLatLng();
    var radius = center.distanceTo(latlng);

    this._shape.setRadius(radius);
  },

  /**
   * Adds drag start listeners
   */
  _enableDragging: function () {
    if (!this._shape.dragging) {
      this._shape.dragging = new L.Handler.PathDrag(this._shape);
    }
    this._shape.dragging.enable();
    this._shape
      .on('dragstart', this._onStartDragFeature, this)
      .on('dragend', this._onStopDragFeature, this);
  },

  /**
   * Removes drag start listeners
   */
  _disableDragging: function () {
    this._shape.dragging.disable();
    this._shape
      .off('dragstart', this._onStartDragFeature, this)
      .off('dragend', this._onStopDragFeature, this);
  },

  /**
   * Start drag
   * @param  {L.MouseEvent} evt
   */
  _onStartDragFeature: function() {
    this._shape._map.removeLayer(this._markerGroup);
  },

  /**
   * Dragging stopped, apply
   * @param  {L.MouseEvent} evt
   */
  _onStopDragFeature: function () {
    var circle = this._shape;

    // update marker
    var marker = this._resizeMarkers[0];
    var center = circle.getLatLng();
    var resizemarkerPoint = this._getResizeMarkerPoint(center);

    marker.setLatLng(resizemarkerPoint);

    // this one's needed to update the path
    // marker._origLatLng = circle._latlng;

    // show resize marker
    this._shape._map.addLayer(this._markerGroup);
    this._fireEdit();
  }
});