var Class = require('class.extend');
var _ = require('lodash/core');
var utilities = require('app/js/lib/utilities');

var BaseObject = Class.extend({
  defaults: {},

  init: function (container, config) {
    this.settings = _.extend({}, this.defaults, config);
    var setts = this.settings;
    this.container = container;

    this.elements = {};
    Object.keys(setts.selectors).forEach(function eachSelector(selName) {
      var el = this.container.querySelectorAll(setts.selectors[selName]);
      if (!el || !el.length) {
        el = this.container.matches(setts.selectors[selName]) ? [this.container] : [null];
      }
      this.elements[selName] = el.length === 1 ? el[0] : Array.prototype.slice.call(el);
    }, this);

    Object.keys(setts.events).forEach(function eachEvent(eventDesc) {
      var event = eventDesc.split(' ');
      var eventName = event[0];
      var eventObj = event[1];
      var eventObjSelector = this.settings.selectors[eventObj];
      var eventDelegate = event[2];
      var eventHandler = setts.events[eventDesc];

      if (typeof eventHandler === 'string') {
        eventHandler = this[eventHandler];
      }

      if (eventName === 'init') {
        eventHandler.apply(this);
      } else {
        if (eventDelegate) {
          eventObj = window[eventDelegate] || this.elements[eventDelegate];
        } else {
          eventObj = window[eventObj] || this.elements[eventObj];
        }

        if (eventObj) {
          if (typeof eventObj === 'object' && !eventObj.length) {
            eventObj = [eventObj];
          }
          var eventDecl = eventHandler.bind(this);

          eventObj.forEach(function eachEventObject(obj) {
            obj.addEventListener(eventName, function eventOnObject(e) {
              if (eventDelegate) {
                e.target.matches(eventObjSelector) && eventDecl(e);
              } else {
                eventDecl(e);
              }
            });
          }, this);
        }
      }
    }, this);
  },

  parentsUntil: function (node, selector) {
    while (node = node.parentElement) {
      if (node.matches(selector)) {
        return node;
      }
    }
    return null;
  }
}).extend(utilities);

module.exports = BaseObject;
