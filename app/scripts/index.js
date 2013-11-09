/* global $, _, Handlebars, Backbone */

'use strict';

function sendMessage (eventName, data, callback) {

  chrome.runtime.sendMessage({

      'event': eventName,
      'data': data
    },
    callback
  );
}

// example usage
// sendMessage('timer:add', {

//   'label': 'Another timer',
//   'duration': 15000
// }, function (timer) {

//   console.log('returned timer', timer);
// });

var templates = {};
var getTemplate = function (selector) {

  var template = templates[selector];

  if (!template) {
    var source   = $(selector).html();
    template = templates[selector] = Handlebars.compile(source);
  }

  return template;
};

var View = Backbone.View.extend({

  // selector for template
  'templateSelector': undefined,

  'initialze': function () {

    var self = this;
    _.bindAll(self);
    self.compileTemplate();
  },

  'render': function (data) {
    
    var self = this;
    data = data || {};
  
    self.$el.html(self.template(data));

    return self;
  },

  'compileTemplate': function () {

    var self = this;
    self.template = getTemplate(self.templateSelector);
  }
});

console.log(Backbone);