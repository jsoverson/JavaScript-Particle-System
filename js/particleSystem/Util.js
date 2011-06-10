function Vector(x,y) {
   this.x = x || 0;
   this.y = y || 0;
}

Vector.prototype.getMagnitude = function() {
   return Math.sqrt(this.x * this.x + this.y * this.y);
};
Vector.prototype.multiply = function( scaleFactor ){
	this.x *= scaleFactor; 
	this.y *= scaleFactor;
};
Vector.prototype.add = function( vector ){ 
	this.x += vector.x;  
	this.y += vector.y;
};
Vector.prototype.vectorTo = function (vector) {
   return new Vector(vector.x - this.x, vector.y - this.y);
};
Vector.prototype.withinBounds = function(point, size) {
   return this.x >= point.x - size/2 && this.x <= point.x + size/2 && this.y >= point.y - size/2 && this.y <= point.y+size/2;
};
Vector.prototype.getAngle = function() {
   var ratio = 0;
   var offset = 0;
   if (this.x > 0) {
      if (this.y > 0) {
         offset = 0;
         ratio = this.y / this.x;
      } else {
         offset = (3 * Math.PI)/2;
         ratio = this.x / this.y;
      }  
   } else {
      if (this.y > 0) {
         offset = Math.PI / 2;
         ratio = this.x / this.y;
      } else {
         offset = Math.PI;
         ratio = this.y / this.x;
      }
   }
   var angle = Math.atan(Math.abs(ratio)) + offset;
   return angle;
};
Vector.prototype.getAngleDegrees = function() {
   return this.getAngle() * 180 / Math.PI;
};
Vector.prototype.jitter = function(jitterAmount) {
   return new Vector(
      this.x + this.x * jitterAmount * Math.random(),
      this.y + this.y * jitterAmount * Math.random()
   );
};
Vector.prototype.copy = function() {
   return new Vector(this.x,this.y); 
};
Vector.prototype.toString = function() {
   return this.x.toFixed(3).replace(/\.?0+$/,'') +","+ this.y.toFixed(3).replace(/\.?0+$/,'');
}


Vector.fromAngle = function (angle, magnitude) {
   return new Vector(magnitude * Math.cos(angle), magnitude * Math.sin(angle));
}
// x,y
Vector.fromString = function (string) {
   var parts = string.split(',');
   return new Vector(parseFloat(parts[0]),parseFloat(parts[1]));
}

// Some sugar to make code somewhat more intuitive;
Point = Vector;


