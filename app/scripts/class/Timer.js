'use strict';

(function (global) {
  var Timer = function (data) {

    var self = this;

    data = data || {};

    // to be assigned by collection
    self.id = data.id || undefined;
    
    self.label = data.label || 'Untitled';
    self.duration = data.duration || 15 * 60 * 1000;

    self.startTime = undefined;
    self.running = false;
    self.active = false;
  };
  var TimerProto = Timer.prototype;

  TimerProto.updateDuration = function (duration) {
    this.duration = duration;
  };

  TimerProto.setActive = function () {
    this.active = true;
  };

  TimerProto.unsetActive = function () {
    this.active = false;
  };

  TimerProto.setRunning = function () {
    this.running = true;
  };

  TimerProto.unsetRunning = function () {
    this.running = false;
  };

  TimerProto.start = function () {

    var self = this;
    self.startTime = Date.now();
    self.setRunning();
    self.setActive();
  };

  TimerProto.stop = function () {
    this.unsetRunning();
  };

  TimerProto.checkHasEnded = function () {

    var self = this;
    if (self.startTime && self.running) {
      return Date.now() - self.startTime >= self.duration;
    }

    return undefined;
  };

  TimerProto.reset = function () {

    var self = this;
    self.unsetActive();
    self.unsetRunning();
    self.startTime = undefined;
  };

  // returns only attribute representation of the timer
  // e.g. for storage
  TimerProto.toJSON = function () {

    return {
      'id': this.id,
      'label': this.label,
      'duration': this.duration
    };
  };

  global.Timer = Timer;
})(this);