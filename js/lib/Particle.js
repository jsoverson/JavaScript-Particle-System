/*jshint bitwise:false*/
/*global define:false,_*/

define(['lib/Vector'],function(Vector){
  "use strict";

  function Particle(point,velocity){
    this.position     = point;
    this.velocity     = velocity;
    this.acceleration = new Vector(0,0);
    this.ttl          = -1;
    this.lived        = 0;
  }

  Particle.size = 2;
  Particle.color = [66,167,222,255];
  //Particle.GLOBAL_DRAW_COLOR = [166,67,0,255];

  _.extend(Particle.prototype,{
    submitToFields : function(fields) {
      var totalAccelerationX = 0;
      var totalAccelerationY = 0;

      _(fields).each(function(field){
        // inlining what should be Vector object methods for performance reasons
        var vectorX = field.position.x - this.position.x;
        var vectorY = field.position.y - this.position.y;
        var force = field.mass / Math.pow((vectorX*vectorX+field.mass/2+vectorY*vectorY+field.mass/2),1.5);
        totalAccelerationX += vectorX * force;
        totalAccelerationY += vectorY * force;
      },this);

      this.acceleration = new Vector(totalAccelerationX,totalAccelerationY);
    },
    move : function() {
      this.velocity.x += this.acceleration.x;
      this.velocity.y += this.acceleration.y;
      this.position.x += this.velocity.x;
      this.position.y += this.velocity.y;
    },
    drawVariable : function(pixels,width,height) {
      var baseIndex = 4 * (~~this.position.y * width + ~~this.position.x);
      var velocity = this.velocity.getMagnitude();
      var r = Particle.color[0] * velocity;
      var g = Particle.color[1];
      var b = Particle.color[2] * 0.5/velocity;
      var a = Particle.color[3];
      pixels[baseIndex]      += r;
      pixels[baseIndex + 1]  += g;
      pixels[baseIndex + 2]  += b;
      pixels[baseIndex + 3]   = a;
    },
    drawBasic : function(pixels,width,height) {
      var baseIndex = 4 * (~~this.position.y * width + ~~this.position.x);
      var r = Particle.color[0];
      var g = Particle.color[1];
      var b = Particle.color[2];
      var a = Particle.color[3];
      pixels[baseIndex]      += r;
      pixels[baseIndex + 1]  += g;
      pixels[baseIndex + 2]  += b;
      pixels[baseIndex + 3]   = a;
    },
    drawSoft : function(pixels,width,height) {
      var baseIndex = 4 * (~~this.position.y * width + ~~this.position.x);
      var r = Particle.color[0];
      var g = Particle.color[1];
      var b = Particle.color[2];
      var a = Particle.color[3];
      pixels[baseIndex - 4]  += r*0.80;
      pixels[baseIndex - 3]  += g*0.80;
      pixels[baseIndex - 2]  += b*0.80;
      pixels[baseIndex - 1]   = a;
      pixels[baseIndex]      += r*0.80;
      pixels[baseIndex + 1]  += g*0.80;
      pixels[baseIndex + 2]  += b*0.80;
      pixels[baseIndex + 3]   = a;
      pixels[baseIndex + 4]  += r*0.80;
      pixels[baseIndex + 5]  += g*0.80;
      pixels[baseIndex + 6]  += b*0.80;
      pixels[baseIndex + 7]   = a;
      baseIndex += width * 4;
      pixels[baseIndex - 4]  += r*0.80;
      pixels[baseIndex - 3]  += g*0.80;
      pixels[baseIndex - 2]  += b*0.80;
      pixels[baseIndex - 1]   = a;
      pixels[baseIndex]      += r;
      pixels[baseIndex + 1]  += g;
      pixels[baseIndex + 2]  += b;
      pixels[baseIndex + 3]   = a;
      pixels[baseIndex + 4]  += r*0.80;
      pixels[baseIndex + 5]  += g*0.80;
      pixels[baseIndex + 6]  += b*0.80;
      pixels[baseIndex + 7]   = a;
      baseIndex += width * 4;
      pixels[baseIndex - 4]  += r*0.80;
      pixels[baseIndex - 3]  += g*0.80;
      pixels[baseIndex - 2]  += b*0.80;
      pixels[baseIndex - 1]   = a;
      pixels[baseIndex]      += r*0.80;
      pixels[baseIndex + 1]  += g*0.80;
      pixels[baseIndex + 2]  += b*0.80;
      pixels[baseIndex + 3]   = a;
      pixels[baseIndex + 4]  += r*0.80;
      pixels[baseIndex + 5]  += g*0.80;
      pixels[baseIndex + 6]  += b*0.80;
      pixels[baseIndex + 7]   = a;
    }
  });

  Particle.prototype.draw = Particle.prototype.drawBasic;
  Particle.drawFunctions = ['Basic','Soft','Variable'];

  return Particle;

});

