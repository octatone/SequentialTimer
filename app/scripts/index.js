/* global $, _, Handlebars, Backbone */

'use strict';

chrome.runtime.sendMessage({
  'event': 'test',
  'data': {}
});

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