/*global define*/

define(['vendor/stats.min'], function () {
  "use strict";

  var stats = new Stats();
  stats.setMode(0); // 0: fps, 1: ms

  // Align top-left
  stats.domElement.style.position = 'absolute';
  stats.domElement.style.left = '0px';
  stats.domElement.style.bottom = '0px';

  document.body.appendChild( stats.domElement );
  return stats;

});
