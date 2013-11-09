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
  };
  var TimerProto = Timer.prototype;

  TimerProto.updateDuration = function (duration) {

    this.duration = duration;
  };

  TimerProto.start = function () {

    var self = this;
    self.startTime = Date.now();
    self.running = true;
  };

  TimerProto.stop = function () {

    this.running = false;
  };

  TimerProto.ended = function () {

    var self = this;
    if (self.startTime && self.running) {
      return Date.now() - self.startTime >= self.duration;
    }

    return undefined;
  };

  TimerProto.reset = function () {

    var self = this;
    self.running = false;
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