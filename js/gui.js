/*global define,_,dat*/

define(['examples','lib/Vector','lib/Particle','lib/Field','lib/Emitter'], function (examples,Vector,Particle,Field,Emitter) {
  "use strict";

  function GUI(particleSystem, display) {
    this.particleSystem = particleSystem;
    this.display = display;
    this.options = {
      example : '',
      clickBehavior : 'repel',
      'add emitter' : function(){
        particleSystem.addEmitter(new Vector(display.width / 2, display.height / 2),new Vector(2,0));
      },
      'add field' : function(){
        particleSystem.addField(new Vector(display.width / 2, display.height / 2),-140);
      },
      'save' : this.saveState.bind(this),
      'load' : this.loadState.bind(this)
    };

    var main = new dat.GUI();

    main.add(particleSystem, 'maxParticles', 100,100000).step(100);
    var particleSize = main.add(Particle, 'size', 1,5).step(1);
    main.add(this.options, 'clickBehavior', ['repel','attract']).onChange(function(val){particleSystem.mouseFieldStrength = val === 'repel' ? -140 : 140;});
    main.add(this.options, 'add emitter');
    main.add(this.options, 'add field');
    main.add(this.options, 'load');
    main.add(this.options, 'save');
    var drawOptions = main.addFolder('draw options');
    drawOptions.add(particleSystem.draw, 'objects');
    drawOptions.add(particleSystem.draw, 'particles');
    drawOptions.add(particleSystem.draw, 'accelerations');
    drawOptions.add(particleSystem.draw, 'velocities');
    drawOptions.add(display.draw, 'info');
    var drawColor = drawOptions.addColor(Particle,'color').onChange(function(val){Particle.color = _(val).map(function(c,i){return i < 3 ? ~~c : c;});});
    //var drawStyle = drawOptions.add({draw:'Basic'},'draw', Particle.drawFunctions).onChange(function(val){Particle.prototype.draw = Particle.prototype['draw' + val]});
    //drawOptions.open();
    main.add(this.options, 'example', examples).onChange(this.loadState.bind(this));

    this.ui = {
      main : main,
      secondary : null,
      drawOptions : drawOptions
    };
    this.controllers = {
      drawColor : drawColor,
      particleSize : particleSize
    };

    function objectMouseIn(evt) {
      focusObject(evt.particleTarget);
      display.canvas.style.cursor = 'pointer';
    }
    function objectMouseOut(evt) {
      focusObject(evt.particleTarget,true);
      display.canvas.style.cursor = null;
    }

    particleSystem.on('objectBlur',this.removeSecondaryControls, this);
    particleSystem.on('objectClick',this.onObjectClick, this);
    particleSystem.on('objectMouseIn',objectMouseIn, this);
    particleSystem.on('objectMouseOut',objectMouseOut, this);

    window.addEventListener('keypress',function(evt){
      var stop = false;
      switch (evt.which) {
        case 32  :
          display.togglePause();
          stop = true;
          break;
        case 115 :
          display.step();
          stop = true;
          break;
        case 99  :
          display.clear();
          particleSystem.particles=[];
          stop = true;
      }
      if (stop) {
        evt.stopPropagation();
        evt.preventDefault();
        return false;
      }
    });

  }

  _.extend(GUI.prototype, {
    onObjectClick : function(evt) {
      this.removeSecondaryControls();
      var object = evt.particleTarget;
      var secondary = this.ui.secondary = new dat.GUI({autoPlace : true});
      var options = {
        remove : function() {
          if (object.constructor === Field) {
            this.particleSystem.removeField(object);
          } else if (object.constructor === Emitter) {
            this.particleSystem.removeEmitter(object);
          }
          this.removeSecondaryControls();
        }.bind(this)
      };
      if (object.constructor === Emitter) {

        options.angle = object.velocity.getAngleDegrees() * Math.PI / 180;
        options.speed = object.velocity.getMagnitude();
        options.spread = object.spread / Math.PI * 180;
        secondary.add(options, 'angle', -180,180).step(1).onChange(function(val){updateAngle(object,val);});
        secondary.add(options, 'speed', 0.1,3.0).step(0.1).onChange(function(val){updateVelocity(object,val);});
        secondary.add(options, 'spread',0,180).onChange(function(val){updateSpread(object,val);});
      } else {
        options.strength = object.mass;
        secondary.add(options, 'strength', -1000,1000).step(1).onChange(function(val){updateMass(object,val);});
      }
      secondary.add(options, 'remove');
    },
    removeSecondaryControls : function(){
      if (this.ui.secondary) {
        this.ui.secondary.destroy();
        this.ui.secondary = null;
      }
    },
    loadState : function(stateString) {
      stateString = stateString || localStorage.getItem('systemState') || this.loadState(examples[0]);
      var separatorPos = stateString.indexOf(':');
      this.loadCustomState(stateString.substr(0,separatorPos));
      stateString = stateString.substr(separatorPos+1);
      this.particleSystem.fromString(stateString);
      this.display.clear();
      this.display.start();
      this.updateGui();
    },
    getState : function() {
      var stateString = this.getCustomState() + ':' + this.particleSystem.toString();
      return stateString;
    },
    saveState : function() {
      localStorage.setItem('systemState',this.getState());
    },
    updateGui : function() {
      var controllers = [].concat(this.ui.main.__controllers,this.ui.drawOptions.__controllers);
      _(controllers).each(function(c){c.updateDisplay();});
    },
    loadCustomState : function(string) {
      var parts = string.split(',');
      this.display.draw.continuous = parts[0] === '1' ? true : false;
      //drawStyle.setValue(parts[1]);
      if (parts[2]) this.controllers.drawColor.setValue(parts[2].split('|'));
      this.controllers.particleSize.setValue(parts[3] || 2);
    },
    getCustomState : function() {
      var parts = [
        (this.display.draw.continuous ? '1' : '0'),
        '',
        Particle.color.join('|'),
        Particle.size
      ];
      return parts.join(',');
    }

  });


  function focusObject(object,unfocus) {
    if (unfocus) {
      object.drawColor = object.cacheColor || object.constructor.drawColor;
      object.size = object.cacheSize;
    } else {
      object.cacheSize = object.cacheSize || object.size;
      object.cacheColor = object.cacheColor || object.drawColor;
      object.drawColor = "#0FF";
      object.size = 20;
    }
  }

  function updateAngle(object,angle) {
    object.velocity = Vector.fromAngle(angle * Math.PI / 180,object.velocity.getMagnitude());
  }
  function updateSpread(object,angle) {
    object.spread = angle * Math.PI / 180;
  }
  function updateVelocity(object, magnitude) {
    magnitude = magnitude || 0.1;
    object.velocity = Vector.fromAngle(object.velocity.getAngle(),magnitude);
  }
  function updateMass(object, mass) {
    object.setMass(mass);
    object.cacheColor = object.drawColor;
  }

  return GUI;

});
