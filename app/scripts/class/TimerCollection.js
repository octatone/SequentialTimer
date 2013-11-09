/* global $, _, LZString, Timer */

'use strict';

var Storage = chrome.storage.sync;

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