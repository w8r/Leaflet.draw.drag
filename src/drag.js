"use strict";

var L = global.L || require('leaflet');
require('leaflet-draw');

L.Edit.Poly.include({

  /**
   * @override
   */
  addHooks: function() {
    if (this._poly._map) {
      if (!this._markerGroup) {
        this._enableDragging();
        this._transformContainer = L.Util.limitExecByInterval(this._transformContainer, 200, this);

        this._initMarkers();
      }
      this._poly._map.addLayer(this._markerGroup);
    }
  },

  /**
   * @override
   */
  removeHooks: function() {
    if (this._poly._map) {
      this._poly._map.removeLayer(this._markerGroup);
      this._disableDragging();
      delete this._markerGroup;
      delete this._markers;
    }
  },

  /**
   * Adds drag start listeners
   */
  _enableDragging: function() {
    this._poly.on('mousedown', this._onStartDragFeature, this);
  },

  /**
   * Removes drag start listeners
   */
  _disableDragging: function() {
    this._poly.off('mousedown', this._onStartDragFeature, this);
  },

  /**
   * Start drag
   * @param  {L.MouseEvent} evt
   */
  _onStartDragFeature: function(evt) {
    // hide vertices
    this._poly._map.removeLayer(this._markerGroup);

    /**
     * @type {L.Point}
     */
    this._startPoint = L.point(evt.containerPoint);

    /**
     * @type {Array.<Number>}
     */
    this._matrix = [1, 0, 0, 1, 0, 0];

    this._poly._map
      .on('mousemove', this._onDragFeature, this)
      .on('mouseup', this._onStopDragFeature, this)
      .fire('editstart');
  },

  /**
   * Dragging
   * @param  {L.MouseEvent} evt
   */
  _onDragFeature: function(evt) {
    var x = evt.containerPoint.x;
    var y = evt.containerPoint.y;

    this._matrix[4] += x - this._startPoint.x;
    this._matrix[5] += y - this._startPoint.y;

    this._startPoint.x = x;
    this._startPoint.y = y;

    this._transformContainer();
    L.DomEvent.stop(evt.originalEvent);
  },

  /**
   * Dragging stopped, apply
   * @param  {L.MouseEvent} evt
   */
  _onStopDragFeature: function(evt) {
    // apply matrix
    this._transformPoints();

    // show vertices
    this._poly._map.addLayer(this._markerGroup);
    this._poly._map
      .off('mousemove', this._onDragFeature, this)
      .off('mouseup', this._onStopDragFeature, this);

    this._matrix = null;
    this._startPoint = null;

    this._fireEdit();
  },

  /**
   * Applies transformation, does it in one sweep for performance, so don't be
   * surprised of the code repetition.
   *
   * [ x ]   [ a  b  tx ] [ x ]   [ a * x + b * y + tx ]
   * [ y ] = [ c  d  ty ] [ y ] = [ c * x + d * y + ty ]
   *
   * @param  {L.Point}        pt
   * @param  {Array.<Number>} matrix
   * @return {L.Point}
   */
  _transformPoints: function(matrix) {
    var matrix = this._matrix;
    var map = this._poly._map;

    var a = matrix[0];
    var c = matrix[1];
    var b = matrix[2];
    var d = matrix[3];
    var tx = matrix[4];
    var ty = matrix[5];

    var x, y, point, marker;

    var polygon = this._poly;
    var latlngs = [];

    var i, j, len, len2;

    // we transformed in pixel space, let's stay there
    for (i = 0, len = polygon._originalPoints.length; i < len; i++) {
      point = polygon._originalPoints[i];
      x = point.x;
      y = point.y;

      point.x = a * x + b * y + tx;
      point.y = c * x + d * y + ty;

      // update point
      polygon._originalPoints[i] = point;
      polygon._latlngs[i] = map.layerPointToLatLng(point);

      // update marker
      marker = this._markers[i];
      marker.setLatLng(polygon._latlngs[i]);
      marker._origLatLng = polygon._latlngs[i];
      if (marker._middleLeft) {
        marker._middleLeft.setLatLng(this._getMiddleLatLng(marker._prev, marker));
      }
      if (marker._middleRight) {
        marker._middleRight.setLatLng(this._getMiddleLatLng(marker, marker._next));
      }
    }

    // holes operations
    if (polygon._holes) {
      for (i = 0, len = polygon._holes.length; i < len; i++) {
        polygon._holes[i] = [];

        for (j = 0, len2 = this._holes[i].length; j < len2; j++) {
          point = polygon._holePoints[i][j];
          x = point.x;
          y = point.y;

          point.x = a * x + b * y + tx;
          point.y = c * x + d * y + ty;

          // update hole point
          polygon._holePoints[i][j] = point;
          polygon._holes[i][j] = map.layerPointToLatLng(point);
        }
      }
    }

    // undo container transform
    this._resetTransformContainer();
    polygon._updatePath();
  },

  /**
   * Reset transform matrix
   */
  _resetTransformContainer: L.Browser.svg ? function() {
    this._poly._container.setAttributeNS(null, 'transform', '');
  } : function() {
    this._poly._container.setAttribute('matrix', '');
  },

  /**
   * Applies matrix transformation to SVG/VML
   */
  _transformContainer: L.Browser.svg ? function() {
    this._poly._container.setAttributeNS(null, "transform",
      'matrix(' + this._matrix.join(' ') + ')');
  } : function() {

    var m = this._matrix;
    console.log("progid:DXImageTransform.Microsoft.Matrix(M11=" + m[0] +
      ", M12=" + m[1] + ", M21=" + m[2] + ", M22=" + m[3] +
      ", Dx=" + m[4] + ", Dy=" + m[5] + ", sizingmethod='auto expand', filtertype='bilinear')");

    this._poly._path.style.filter = "progid:DXImageTransform.Microsoft.Matrix(M11=" + m[0] +
      ", M12=" + m[1] + ", M21=" + m[2] + ", M22=" + m[3] +
      ", Dx=" + m[4] + ", Dy=" + m[5] + ", sizingmethod='auto expand', filtertype='bilinear')";

    //this._poly._path.matrix = this._matrix.join(', ');
    // this._poly._path.v = this._poly._path.v;
    //this._poly._path.offset = this._matrix[4] + ',' + this._matrix[5];
  }

});

module.exports = L.Control.Draw;
