var Class = require('class.extend');
var _ = require('lodash/core');

var BaseObject = Class.extend({
	defaults: {},
	
	init: function(container, config) {
		var setts = this.settings = _.extend({}, this.defaults, config);
		this.container = container;
		
		this.elements = {};
		for (var selName in setts.selectors) {
			 var el = this.container.querySelectorAll(setts.selectors[selName]);
			 this.elements[selName] = el.length === 1 ? el[0] : Array.prototype.slice.call(el);
		}
		
		for (var eventDesc in setts.events) {
			var event = eventDesc.split(' ');
      var eventName = event[0];
			var eventObj = event[1];
      var eventHandler = setts.events[eventDesc];

      if (typeof eventHandler === 'string') {
        eventHandler = this[eventHandler];
      }

      if (eventName === 'init') {
        eventHandler.apply(this);
      } else {
        eventObj = window[eventObj] || this.elements[eventObj];

        if (eventObj) {
          if (typeof eventObj === 'object' && !eventObj.length) {
            eventObj = [eventObj];
          }
          var eventDecl = eventHandler.bind(this);
          eventObj.forEach(function(obj) {
            obj.addEventListener(eventName, eventDecl);
          }, this);
        }
      }
		}
	}
});

module.exports = BaseObject;
