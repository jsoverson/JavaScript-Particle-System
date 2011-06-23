var display = null;
var particleSystem = null;
var examples = {
   example1 : '0,basic:Sv1(2000|1|0|0|1|E360,230:2,0:8:-1:0.10:4|F700,230:-140:8)',
//   example2 : '0,basic:Sv1(2000|1|0|0|1|E388,158:2,0:8:-1:0.10:4|F497,233:500|F442,240:-37)',
   example2 : '0,variable:Sv1(5000|1|0|0|1|E388,158:2,0:8:-1:0.10:4|F443,211:500)',
   example3 : '0,basic:Sv1(2000|0|0|0|1|E500,275:1.3,-0:8:-1:3.14:4|F650,275:-250|F350,275:-250|F500,125:-250|F500,425:-250|F606,381:-250|F606,169:-250|F397,381:-250|F397,169:-250)',
   example4 : '0,variable:Sv1(2000|1|0|0|1|E217,453:1.913,-0.585:8:-1:0.10:4|F337,472:-140|F533,327:500|F672,393:-140|F284,347:-140)',
   example5 : '1,basic:Sv1(2000|0|1|0|0|E500,275:2,0:8:-1:3.14:4|F650,275:-140:8|F350,275:-140:8|F500,125:-140:8|F500,425:-140:8|F606,381:-140:8|F606,169:-140:8|F397,381:-140:8|F397,169:-140:8)',
   '3alt'   : '0,basic:Sv1(2000|1|0|0|1|E500,250:4,0:8:-1:3.14:4|F500,250:80)',
   bonus : '0,fancy:Sv1(5000|0|0|0|1|E502,277:0.005,-0.3:15:130:3.14:4|F650,275:-250:8|F350,275:-250:8|F500,425:-250:8|F606,381:-250:8|F606,169:-250:8|F397,381:-250:8|F397,169:-250:8)'
};
var particleStyle = 'basic';
var programmaticUpdate = false;

$(function(){
   display = new Display(document.getElementById('display'));
	display.init();
	
	particleSystem = new ParticleSystem().init(display);
	var listeners = {
      onObjectBlur : hideFloatingControls,
      onObjectClick : objectClicked,
      onObjectMouseIn : objectMouseIn,
      onObjectMouseOut : objectMouseOut,
      onObjectFinishMove : updateHash,
      onError : onError
	}
   particleSystem.addListener('error',listeners);
   particleSystem.addListener('objectBlur',listeners);
   particleSystem.addListener('objectClick',listeners);
   particleSystem.addListener('objectMouseIn',listeners);
   particleSystem.addListener('objectMouseOut',listeners);
   particleSystem.addListener('objectFinishMove',listeners);

   display.start();
   
	bindKeys();
	registerButtons();
	try {
      loadFromHash();
   } catch(e) {
      particleSystem.addEmitter(new Point(360,230),Vector.fromAngle(0,2));
      particleSystem.addField(new Point(700,230), -140);
   }

   $(window).bind('hashchange',loadFromHash);
});

function loadFromHash() {
   if (!programmaticUpdate) {
      loadState(location.hash.substr(1));
   }
   programmaticUpdate = false;
}
function updateHash() {
   programmaticUpdate = true;
   location.hash = getState();
}
function bindKeys() {
	$(window).keypress(function(evt) {
	   switch (evt.which) {
	      case 32 : displayPause();return false /*prevents page scrolling*/; break;
	      case 115 : displayStep(); break;
	      case 101 : addEmitter(); break;
	      case 102 : addField(); break;
	      case 105 : toggleInfo(); break;
	      case 111 : toggleObjects(); break;
	      case 112 : toggleParticles(); break;
	      case 118 : toggleVelocities(); break;
	      case 97 : toggleAccelerations(); break;
	      case 99 : displayClear(); break;
	      
	   }
	});
}

function registerButtons() {
   $('button').button();
   $('.showHideControls').click(function(){$(this).siblings('.controls').slideToggle()});

   $('#clear').click(displayClear);

   $('#addEmitter').click(addEmitter);
   $('#addField').click(addField);

   $('#save').click(saveState);
   $('#load').click(function(){loadState()});
   
   $('.loadExample').click(function(){loadState(examples[$(this).attr('id')])});

   $('#closeFloatingControls').button({icons:{primary:"ui-icon-close"},text:false}).click(function(){$(this).closest('.closable').css('display','none');});
   $('#deleteObject').button(         {icons:{primary:'ui-icon-trash'},text:false});
   $('#clickBehavior').buttonset();
   $('#clickBehavior1').click(function(){particleSystem.mouseFieldStrength = -200});
   $('#clickBehavior2').click(function(){particleSystem.mouseFieldStrength = 200});
   $('#clickBehavior3').click(function(){particleSystem.mouseFieldStrength = 0});

   $('#strings').click(function(){
      display.draw.info = false;
      display.clear();
      display.draw.continuous = !display.draw.continuous
   });

   $('#startStop').click(displayPause);

   $('#step').click(displayStep);

   $('#objects').click(toggleObjects);
   $('#info').click(toggleInfo); 
   $('#accelerations').click(toggleAccelerations);
   $('#velocities').click(toggleVelocities);
   $('#particles').click(toggleParticles);
   $('#maxParticles > button').click(function(){particleSystem.maxParticles = $(this).val();updateHash();});
   $('#particleStyle > button').click(function(){changeParticleDrawStyle($(this).val());updateHash();});
   //http://www.facebook.com/share.php?u=<;url>
   $('#fbShare').click(function(){
         var url = location;
         var encodedUrl = encodeURI(url);
         console.log(encodedUrl);
         var shareUrl = "http://www.facebook.com/share.php?u=";
         window.open (shareUrl + encodedUrl, "fbShare","status=1,toolbar=0,location=1,menubar=0,directories=0,resizable=1,scrollbars=0,height=250,width=500");
   });
}
function addEmitter() {
   particleSystem.addEmitter(new Point(display.width / 2, display.height / 2),new Vector(2,0));
   updateHash();
}
function addField() {
   particleSystem.addField(new Point(display.width / 2, display.height / 2),-140)
   updateHash();
}
function toggleInfo(evt)         {toggleDrawable(display,"info")}
function toggleObjects(evt)      {toggleDrawable(particleSystem,"objects")}
function toggleParticles(evt)    {toggleDrawable(particleSystem,"particles")}
function toggleVelocities(evt)   {toggleDrawable(particleSystem,"velocities")}
function toggleAccelerations(evt){toggleDrawable(particleSystem,"accelerations")}

function toggleDrawable(obj,drawable) {
   obj.draw[drawable] = !obj.draw[drawable];
   updateLabels();
}

function updateLabels() {
   var i = -1, drawable = ['accelerations','objects','particles','velocities'];
   while(drawable[++i]) {
      $('#' + drawable[i]).button("option","label", (particleSystem.draw[drawable[i]] ? "Hide " : "Show ") + drawable[i]);
   }
   $('#info').button("option","label", display.draw.info ? "Hide info" : "Show info");
   $("#startStop").button("option","label", display.paused ? "Start" : "Stop");
   updateHash();
}
function displayPause() {
   display.togglePause();
   updateLabels();
}
function displayStep() {
   display.step()
   updateLabels();
}
function displayClear(){
   display.clear();
   particleSystem.particles=[];
}

function changeParticleDrawStyle(style) {
   particleStyle = style || 'basic';
   var styles = {
      basic : function() {
   		Particle.GLOBAL_DRAW_COLOR = [255,80,40,255];
         Particle.prototype.draw = Particle.prototype.drawBasic;
      },
      variable : function() {
//   		Particle.GLOBAL_DRAW_COLOR = [66,167,222,255];
   		Particle.GLOBAL_DRAW_COLOR = [66,167,180,255];
         Particle.prototype.draw = Particle.prototype.drawVariable;
      },
      fancy : function() {
   		Particle.GLOBAL_DRAW_COLOR = [166,67,0,255];
         Particle.prototype.draw = Particle.prototype.drawSoft;
      }
   };
   if (styles[particleStyle]) {
      styles[particleStyle]();
   } else {
      styles.basic();
   }
   updateHash();
}

function updateAngle(object,angle) {
   object.velocity = Vector.fromAngle(angle * Math.PI / 180,object.velocity.getMagnitude());
}
function updateSpread(object,angle) {
   object.spread = angle * Math.PI / 180;
}
function updateVelocity(object, magnitude) {
   magnitude = magnitude || .1;
   object.velocity = Vector.fromAngle(object.velocity.getAngle(),magnitude);
}
function updateMass(object, mass) {
   object.setMass(mass);
   object.cacheColor = object.drawColor;
}

function objectMouseIn(evt,thrower) {
   focusObject(evt.particleTarget);
   display.canvas.style.cursor = 'pointer !important';
}
function objectMouseOut(evt,thrower) {
   focusObject(evt.particleTarget,true);
   display.canvas.style.cursor = null;
}
function focusObject(object,unfocus) {
   if (unfocus) {
      object.drawColor = object.cacheColor || object.constructor.drawColor;
      $(object).animate({size : object.cacheSize},100,'linear');
      object.size = object.cacheSize;
   } else {
      if (!object.cacheSize) {
         object.cacheSize = object.size;
      }
      if (!object.cacheColor) {
         object.cacheColor = object.drawColor;
      }
      $(object).animate({size : 15},100,'linear');
      object.drawColor = "#990";
   }
}

function deleteObject(object) {
   if (object.constructor === Field) {
      particleSystem.removeField(object);
   } else if (object.constructor == ParticleEmitter) {
      particleSystem.removeEmitter(object);
   }
   updateHash();
}

function objectClicked(evt,thrower) {
   var object = evt.particleTarget;
   if (object.constructor === ParticleEmitter) {
      var html = ''+
         "<div>Angle</div>" +
         "<div class='angleSlider slider'></div>" +
         "<div>Speed</div>" +
         "<div class='velocitySlider slider'></div>" +
         "<div>Spread</div>" +
         "<div class='spreadSlider slider'></div>";
      $('#variableControl').html(html);
      $('.angleSlider').each(function(i,el) {
         var angle = object.velocity.getAngleDegrees().toFixed(0) * Math.PI / 180;
         console.log(angle);
         $(el).slider({
            value : angle.toFixed(0),
            min : -180,
            max : 180,
            stop : updateHash,
            slide : function(evt,ui){updateAngle(object,ui.value)}
         });
      });
      $('.velocitySlider').each(function(i,el) {
         var magnitude = object.velocity.getMagnitude().toFixed(0);
         $(el).slider({
            value : magnitude,
            min : .1,
            max : 3,
            step : .2,
            stop : updateHash,
            slide : function(evt,ui){updateVelocity(object,ui.value)}
         });
      });
      $('.spreadSlider').each(function(i,el) {
         var angle = object.spread / Math.PI * 180;
         $(el).slider({
            value : angle,
            min : 0,
            max : 180,
            stop : updateHash,
            slide : function(evt,ui){updateSpread(object,ui.value)}
         });
      });   } else if (object.constructor === Field) {
      var html = ''+
         "<div>Strength</div>" +
         "<div class='massSlider slider'></div>";
      $('#variableControl').html(html);
      $('.massSlider').each(function(i,el) {
         $(el).slider({
            value : object.mass,
            min : -1000,
            max : 1000,
            stop : updateHash,
            create : function(evt,ui){
               $(this)
                  .removeClass('fieldRepel fieldAttract')
                  .addClass(object.mass >= 0 ? 'fieldAttract' : 'fieldRepel');
            },
            slide : function(evt,ui){
               $(this)
                  .removeClass('fieldRepel fieldAttract')
                  .addClass(ui.value >= 0 ? 'fieldAttract' : 'fieldRepel');
               updateMass(object,ui.value);
            }
         });
      });
   }
   $('#floatingControls').css('left' ,display.canvas.offsetLeft + object.position.x+ object.size/2).css('top', display.canvas.offsetTop + object.position.y + object.size/2).show();
   $('#deleteObject').unbind().click(function(evt){deleteObject(object);hideFloatingControls();});
}

function hideFloatingControls() {
   $('#floatingControls').hide();
}

function saveState() {
   localStorage.setItem('systemState',getState());
}
function getState() {
   stateString = getCustomState() + ':' + particleSystem.toString();
   return stateString;
}
function loadState(stateString) {
   stateString = stateString || localStorage.getItem('systemState') || loadState(examples[0]);
   var separatorPos = stateString.indexOf(':');
   loadCustomState(stateString.substr(0,separatorPos));
   stateString = stateString.substr(separatorPos+1);
   particleSystem.fromString(stateString);
   displayClear();
   display.start();
   updateLabels();
}

function loadCustomState(string) {
   var parts = string.split(',');
   display.draw.continuous = parts[0] === '1' ? true : false;
   changeParticleDrawStyle(parts[1]);
}
function getCustomState() {
   var parts = [
      (display.draw.continuous ? '1' : '0'),
      particleStyle
   ];   
   return parts.join(',');
}
function onError() {
   $('#error').show();
}