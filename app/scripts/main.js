/* global $, _, Handlebars, Backbone, LZString */

'use strict';

var Storage = chrome.storage.sync;

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

// collection can be initialized with an array of timer objects
var TimerCollection = function () {

  var self = this;
  self.timers = {};
  self.lastId =  0;
};
var TimerCollectionProto = TimerCollection.prototype;

TimerCollectionProto.reset = function () {

  var self = this;
  self.timers = {};
  self.lastId = 0;
};

// add new timers to the collection
TimerCollectionProto.add = function (data) {

  var self = this;

  var timer = new Timer(data);

  ++self.lastId;
  timer.id = self.lastId;
  self.timers[timer.id] = timer;

  return timer;
};

TimerCollectionProto.toJSON = function () {

  var self = this;
  var timersArray = [];

  if (_.size(self.timers)) {

    timersArray = _.map(self.timers, function (timer) {

      return timer.toJSON();
    });
  }

  return timersArray;
};

TimerCollectionProto.fetch = function () {

  var self = this;
  var deferred = new $.Deferred();
  var timersString, timerObject;

  Storage.get('timers', function (response) {

    if (response.timers) {

      self.reset();

      timersString = LZString.decompressFromUTF16(response.timers);
      try {
        timerObject = JSON.parse(timersString);
      }
      catch (e) {
        console.warn('unable to parse synced timers');
      }

      _.each(timerObject, function (timer) {

        var timerClass = new Timer(timer);
        self.timers[timerClass.id] = timerClass;
      });

      self.lastId = _.size(self.timers);
    }

    deferred.resolveWith(self.timers);
  });

  return deferred.promise();
};

TimerCollectionProto._sync = function () {

  var self = this;

  Storage.set({

    'timers': LZString.compressToUTF16(JSON.stringify(self.toJSON()))
  
  }, function () {

    console.log('timers synced');
  });
};
TimerCollectionProto.sync = _.debounce(TimerCollectionProto._sync, 1000);


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

/**
  * Start some magic
  */

var timers = new TimerCollection();
timers.fetch();

// example data
// timers.add({

//   'label': 'A timer.',
//   'duration': 10000
// });

var stopwatch = new Clock();
stopwatch.tick(function () {

  console.log('tick');
});

chrome.runtime.onMessage.addListener(function (message, sender, callback) {

  switch (message.event) {

  case 'timer:add':
    callback(timers.add(message.data).toJSON());
    break;
  default:
    console.warn('message event not handled or missing');
  }

  console.log('message', arguments);
});

chrome.storage.onChanged.addListener(function (changes, area) {

  if (area === 'sync' && 'timers' in changes) {
  
    console.log('timers changed in storage, refetching ...');
    timers.fetch();
  }
});


/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/trunk/apps/experimental.app.html
 * @see http://developer.chrome.com/trunk/apps/app.window.html
 */

var lastWindow;
chrome.app.runtime.onLaunched.addListener(function() {

  if (lastWindow) {
    lastWindow.close();
  }

  chrome.app.window.create('index.html', {
      
      'width': 500,
      'height': 309
    },
    function (win) {

      lastWindow = win;
    }
  );
});



