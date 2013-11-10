/*global $, _, Handlebars, Backbone*/

(function (global) {
  
  'use strict';

  // cache compilied templates
  var templates = {};
  var getTemplate = function (selector) {

    var template = templates[selector];

    if (!template) {
      var source   = $(selector).html();
      template = templates[selector] = Handlebars.compile(source);
    }

    return template;
  };

  var _super = Backbone.View.prototype;
  global.BaseView = Backbone.View.extend({

    // selector for template
    'templateSelector': undefined,

    'initialze': function () {

      var self = this;
      
      _.bindAll(self);
      
      self.compileTemplate();
      
      _super.initialze.apply(self, arguments);
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

})(this);