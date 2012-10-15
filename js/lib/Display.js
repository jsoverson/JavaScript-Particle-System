/*global define,_*/

var profile = false;

define(['requestAnimationFrame','stats'],function(requestAnimationFrame,stats){
  "use strict";
  
  function Display(canvas) {

    this.canvas = canvas;
    this.context = undefined;
    this.numFrames = 0;
    this.paused = true;
    this.scale = 1;
    this.draw = {
      continuous : false,
      info       : false
    };

  }

  _.extend(Display.prototype, Backbone.Events, {
    init : function () {
      this.context = this.canvas.getContext("2d");
      this.context.scale(this.scale, this.scale);

      this.width = this.canvas.width / this.scale;
      this.height = this.canvas.height / this.scale;

      this.canvas.onmousedown = function (evt) {
        this.trigger('mouseDown', evt);
        return false;
      }.bind(this);
      this.canvas.onmouseup = function (evt) {
        this.trigger('mouseUp', evt);
        return false;
      }.bind(this);
      this.canvas.onmouseover = function (evt) {this.trigger('mouseOver', evt);}.bind(this);
      this.canvas.onmousemove = function (evt) {this.trigger('mouseMove', evt);}.bind(this);

      profile && console.profile('Display');
      this.main();
    },
    main : function () {
      stats.begin();
      if (!this.paused) this.nextFrame();
      if (profile && this.numFrames > 1000) return console.profileEnd('Display');
      requestAnimationFrame(this.main.bind(this));
      stats.end();
    },
    nextFrame : function () {
      if (!this.draw.continuous) {
        this.clear();
      }
      this.trigger('newFrame');
      this.trigger('beforeUpdate');
      this.trigger('update');
      this.trigger('afterUpdate');
      this.trigger('beforeDraw');
      this.tick();
      this.trigger('draw');
      this.trigger('afterDraw');
    },
    drawLine : function (startPoint, endPoint) {
      this.context.beginPath();
      this.context.moveTo(startPoint.x, startPoint.y);
      this.context.lineTo(endPoint.x, endPoint.y);
      this.context.stroke();
    },
    drawText : function (txt, point, width) {
      this.context.fillText(txt, point.x, point.y, width);
    },
    drawCircle : function (point, radius) {
      this.context.beginPath();
      this.context.arc(point.x, point.y, radius, 0, Math.PI * 2);
      this.context.closePath();
      this.context.fill();
    },
    fillStyle : function (fill) { this.context.fillStyle = fill; },
    strokeStyle : function (fill) { this.context.strokeStyle = fill; },
    tick : function () {
      this.numFrames++;
    },
    clear : function () {
      this.context.clearRect(0, 0, this.width, this.height);
    },
    start : function () { this.paused = false; },
    stop : function () { this.paused = true; },
    togglePause : function () { this.paused = !this.paused;},
    step : function () {
      this.stop();
      this.nextFrame();
    }
  });
  return Display;
});

