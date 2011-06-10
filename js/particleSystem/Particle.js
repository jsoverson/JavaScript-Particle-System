function Particle(point,velocity){
	this.position     = point;
   this.velocity     = velocity;
	this.acceleration = new Vector(0,0);
	this.size         = 3;
	this.ttl          = -1;
	this.lived        = 0;
}

Particle.prototype.submitToFields = function(fields) {
//   var totalAcceleration = new Vector(0,0);
   var totalAccelerationX = 0;
   var totalAccelerationY = 0;
   
   for (var i = 0; i < fields.length; i++) {
      var field = fields[i];

//      var vector = this.position.vectorTo(field.position);
//      var magnitude = vector.getMagnitude();
//      var force = field.mass / (magnitude*magnitude*magnitude); // Gravitational pull * ratio of pull to distance f=(m1m2/r^2) & ratio=(f/r)
//      var acceleration = new Vector(
//         vector.x * force,
//         vector.y * force
//      );

      // inlining for performance
      var vectorX = field.position.x - this.position.x;
      var vectorY = field.position.y - this.position.y;
      var force = field.mass / Math.pow(vectorX*vectorX+vectorY*vectorY,1.5); 
      totalAccelerationX += vectorX * force;
      totalAccelerationY += vectorY * force;
   }
   this.acceleration = new Vector(totalAccelerationX,totalAccelerationY);
};
//Particle.globalDrawColor = "rgba(166,67,0,.7)";
Particle.globalDrawColor = "#437EDE";

Particle.prototype.move = function() {
   this.velocity.x += this.acceleration.x;
   this.velocity.y += this.acceleration.y;
   this.position.x += this.velocity.x;
   this.position.y += this.velocity.y;
//   this.velocity.add(this.acceleration);
//   this.position.add(this.velocity);
};

Particle.prototype.drawSize = function(display) {
   var halfSize = this.size / 2;
   display.context.fillRect(this.position.x - halfSize,this.position.y - halfSize,this.size,this.size);
}

Particle.prototype.drawQuick = function(display) {
   display.context.moveTo(this.position.x, this.position.y);
   display.context.lineTo(this.position.x+.8, this.position.y+.8);
}

Particle.prototype.draw = Particle.prototype.drawQuick;
