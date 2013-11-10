/* global $, _, Handlebars, Backbone */

(function (global) {
  
  'use strict';

  function sendMessage (eventName, data, callback) {

    console.log('window sendMessage', arguments);

    chrome.runtime.sendMessage({

        'event': eventName,
        'data': data
      },
      callback
    );
  }

  chrome.runtime.onMessage.addListener(function (message, sender, sendResponse) {
      // Do something with the message
      console.log(arguments);
  });

  // example usage
  // sendMessage('timer:add', {

  //   'label': 'Another timer',
  //   'duration': 15000
  // }, function (timer) {

  //   console.log('returned timer', timer);
  // });

})(this);