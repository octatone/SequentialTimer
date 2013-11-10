/* global $, _, LZString, Timer */
'use strict';
(function (global) {

  var Storage = chrome.storage && chrome.storage.sync;

  // collection can be initialized with an array of timer objects
  var TimerCollection = function () {

    var self = this;
    self.timers = {};
    self.timersSorted = [];
    self.lastId =  0;
  };
  var TimerCollectionProto = TimerCollection.prototype;

  TimerCollectionProto.reset = function () {

    var self = this;
    self.timers = {};
    self.lastId = 0;
  };

  TimerCollectionProto.resetTimers = function () {

    var self = this;
    for (var key in self.timers) {
      self.timers[key].reset();
    }
  };

  // add new timers to the collection
  TimerCollectionProto.add = function (data) {

    var self = this;
    var timer = new Timer(data);

    ++self.lastId;
    timer.id = self.lastId;
    self.timers[timer.id] = timer;

    self.timersSorted.push(timer);
    self.sort();

    return timer;
  };

  TimerCollectionProto.remove = function (id) {

    var self = this;
    var timer = self.timers[id];
    
    if (timer) {
      delete self.timers[id];
      var index = _.findIndex(self.timersSorted, function (timer) {

        return timer.id === id;
      });

      if (~index) {
        self.timersSorted.splice(index, 1);
      }
    }
  };

  // get next timer (not dependent on running state)
  TimerCollectionProto.getNext = function () {

    var self = this;
    var currentIndex = self.getActiveIndex();
    var timer;

    if (~currentIndex) {
      timer = self.timersSorted[currentIndex + 1];
    }
    
    if (!timer) {
      timer = self.timersSorted[0];
    }

    return timer && timer;
  };

  // current timer (not dependent on running state)
  // if none active return first timer and set active
  TimerCollectionProto.getActive = function () {

    var self = this;
    var activeIndex = self.getActiveIndex();
    var timer;

    if (~activeIndex) {
      timer = self.timersSorted[activeIndex];
    }

    if (!timer) {
      timer = self.timersSorted[0];
      if (timer) {
        timer.setActive();
      }
    }

    return timer && timer;
  };

  TimerCollectionProto.getActiveIndex = function () {

    return _.findIndex(this.timersSorted, function (timer) {

      return timer.active === true;
    });
  };

  TimerCollectionProto.sort = function () {

    // keep array sorted by position
    this.timersSorted.sort(function (a, b) {

      var apos = a.position;
      var bpos = b.position;

      return apos < bpos ? -1 : apos > bpos ? 1 : 0;
    });

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

  global.Timers = TimerCollection;
})(this);