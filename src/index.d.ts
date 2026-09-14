import 'leaflet';
import 'leaflet-draw';

declare module 'leaflet' {
  namespace Edit {
    /**
     * Options merged onto the `L.Edit.SimpleShape` / `L.Edit.PolyVerticesEdit`
     * handlers by leaflet-draw-drag.
     */
    interface SimpleShapeOptions {
      /** Show a draggable centroid marker while editing. Default: `false`. */
      moveMarker?: boolean;
      moveIcon?: DivIcon;
    }
  }

  namespace EditToolbar {
    class Edit {
      /**
       * Global flag toggled from `selectedPathOptions.moveMarkers`, read by
       * every shape's edit handler to decide whether to render the
       * draggable centroid marker.
       */
      static MOVE_MARKERS: boolean;
    }
  }

  interface EditHandlerOptions {
    selectedPathOptions?: PathOptions & { moveMarkers?: boolean };
  }
}

export {};
