
/**
 * Drag feature functionality for Leaflet.draw
 * @preserve
 * @license MIT
 * @author Alexander Milevski <info@w8r.name>
 */


/**
 * Static flag for move markers
 * @type {Boolean}
 */
L.EditToolbar.Edit.MOVE_MARKERS = false;

L.EditToolbar.Edit.include( /** @lends L.EditToolbar.Edit.prototype */ {

  /**
   * @override
   */
  initialize: function(map, options) {
    if(options && options.selectedPathOptions) {
      L.EditToolbar.Edit.MOVE_MARKERS = !!options.selectedPathOptions.moveMarkers;
    }
    this._initialize(map, options);
  },

  /**
   * @param  {L.Map}  map
   * @param  {Object} options
   */
  _initialize: L.EditToolbar.Edit.prototype.initialize

});
