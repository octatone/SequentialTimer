/*global TimerModel, Backbone*/

(function (global) {
  
  'use strict';

  global.TimersCollection = Backbone.Collection.extend({

    'model': TimerModel
  });

})(this);
