/*global Backbone*/

(function (global) {

  'use strict';

  global.TimerModel = Backbone.Model.extend({

    'defaults': {

      'label': undefined,
      'duration': undefined,
      'running': false,
      'active': false
    }

  });

})(this);
