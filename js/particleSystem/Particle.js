function Particle(point,velocity){
	this.position     = point;
   this.velocity     = velocity;
	this.acceleration = new Vector(0,0);
	this.size         = 3;
	this.ttl          = -1;
	this.lived        = 0;
}

Particle.globalDrawColor = "#437EDE";

Particle.prototype.submitToFields = function(fields) {
   var totalAccelerationX = 0;
   var totalAccelerationY = 0;
   
   for (var i = 0; i < fields.length; i++) {
      var field = fields[i];

      // inlining what should be Vector object methods for performance reasons
      var vectorX = field.position.x - this.position.x;
      var vectorY = field.position.y - this.position.y;
      var force = field.mass / Math.pow((vectorX*vectorX+field.mass/2+vectorY*vectorY+field.mass/2),1.5); 
      totalAccelerationX += vectorX * force;
      totalAccelerationY += vectorY * force;
   }
   this.acceleration = new Vector(totalAccelerationX,totalAccelerationY);
};

Particle.prototype.move = function() {
   this.velocity.x += this.acceleration.x;
   this.velocity.y += this.acceleration.y;
   this.position.x += this.velocity.x;
   this.position.y += this.velocity.y;
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
