/* global Timers, Clock */
(function (global) {
  
  'use strict';

  /**
    * Start some magic
    */

  var timers, clock;

  function sendMessage (eventName, data, callback) {

    console.log('background sendMessage', arguments);

    chrome.runtime.sendMessage({

        'event': eventName,
        'data': data
      },
      callback
    );
  }

  function sendUpdate () {

    sendMessage('update:timers', timers.toJSON(), function () {

      console.log('window has updated its timers');
    });
  }

  timers = new Timers();

  clock = new Clock();
  clock.tick(function () {

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
  });

  chrome.storage.onChanged.addListener(function (changes, area) {

    if (area === 'sync' && 'timers' in changes) {
    
      console.log('timers changed in storage, refetching ...');
      timers.fetch().done(sendUpdate);
    }
  });

  function init () {

    timers.fetch().done(sendUpdate);
  }

  // "bootstrap"
  var lastWindow;
  chrome.app.runtime.onLaunched.addListener(function () {

    if (lastWindow) {
      lastWindow.close();
    }

    chrome.app.window.create(
      
      'index.html',
      
      {
        'width': 500,
        'height': 309
      },

      function (win) {

        lastWindow = win;
        init();
      }
    );
  });

})(this);