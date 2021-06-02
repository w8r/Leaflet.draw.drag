(function (factory, window) {
  /*globals define, module, require*/
  // define an AMD module that relies on 'leaflet'
  if (typeof define === 'function' && define.amd) {
    define(['leaflet'], factory);
    // define a Common JS module that relies on 'leaflet'
  } else if (typeof exports === 'object') {
    module.exports = factory(require('leaflet'));
  }
  // attach your plugin to the global 'L' variable
  if (typeof window !== 'undefined' && window.L) {
    factory(window.L);
  }
}(function (L) {
