
define(['lib/Vector','lib/Particle'],function(Vector,Particle){
  "use strict";

  function Emitter(point,velocity) {
    this.position     = point;
    this.velocity     = velocity;
    this.size         = 15;
    this.particleLife = -1;
    this.spread       = Math.PI / 32;
    this.emissionRate = 4;
  }

  Emitter.prototype.moveTo = function(point) {
    this.position = point;
  };

  Emitter.prototype.addParticle = function(){
    var particle = new Particle(
      this.position.copy(),
      Vector.fromAngle(this.velocity.getAngle() + this.spread - (Math.random() * this.spread * 2), this.velocity.getMagnitude())
    );
    particle.ttl = this.particleLife;
    return particle;
  };

  Emitter.prototype.toString = function() {
    var coreAttributes = [
      this.position.toString(),
      this.velocity.toString(),
      this.size,
      this.particleLife,
      this.spread.toFixed(2),
      this.emissionRate
    ];
    return 'E' + coreAttributes.join(':');
  };

  Emitter.drawColor  = "#999";
  Emitter.drawColor2 = "#000";
  Emitter.jitter     = 0.05;

  Emitter.fromString = function(string) {
    var parts = (string.substr(1).split(':'));
    var emitter = new Emitter();
    emitter.position     = Vector.fromString(parts.shift());
    emitter.velocity     = Vector.fromString(parts.shift());
    emitter.size         = parseInt(parts.shift(),10);
    emitter.particleLife = parseInt(parts.shift(),10);
    emitter.spread       = parseFloat(parts.shift(),10);
    emitter.emissionRate = parseInt(parts.shift().valueOf(),10);
    return emitter;
  };

  return Emitter;
});


