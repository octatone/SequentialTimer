/* global TimerCollection, Clock */

'use strict';

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