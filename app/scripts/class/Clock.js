'use strict';

var Clock = function () {

  this.callbacks = [];
};
var ClockProto = Clock.prototype;

ClockProto.run = function () {

  var self = this;
  for (var i=0, len = self.callbacks.length; i < len; i++) {
    self.callbacks[i]();
  }
};

ClockProto.tick = function (callback) {

  this.callbacks.push(callback);
};

ClockProto.start = function () {

  var self = this;
  self.interval = setInterval(self.run.bind(self), 1000);
};

ClockProto.stop = function () {

  var self = this;
  if (self.interval) {
    clearInterval(self.interval);
  }
};