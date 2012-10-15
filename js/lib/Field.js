/*global define*/


define(['lib/Vector'],function(Vector){
  "use strict";

  function Field(point, mass) {
    this.position   = point;
    this.size       = 15;
    this.mass       = 0;
    this.drawColor  = '#b00';
    this.setMass(mass);
  }

  Field.drawColor = "rgb(0,0,255)";
  Field.drawColor2 = "hsl(0,0%,0%)";

  Field.prototype.setMass = function(mass) {
    this.mass = mass;
    this.drawColor = mass < 0 ? "#f00" : "#0f0";
    return this;
  };
  Field.prototype.moveTo = function(point) {
    this.position = point;
  };

  Field.prototype.toString = function() {
    var coreAttributes = [
      this.position.toString(),
      this.mass
    ];
    return 'F' + coreAttributes.join(':');
  };
  Field.fromString = function(string) {
    var parts = string.substr(1).split(':');
    var field = new Field(Vector.fromString(parts.shift()),parseInt(parts.shift(),10));
    return field;
  };

  return Field;

});

