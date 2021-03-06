var BaseObject = require('components/base_object/BaseObject');

var AppPreview = BaseObject.extend({
  defaults: {
    selectors: {
      component: '.c-app-preview',
      footer: '.c-app-preview--footer'
    },
    classNames: {
      hidden: 'u-v-hidden'
    },
    events: {
      'scroll document': 'scrollHandler'
    }
  },

  scrollHandler: function () {
    this.elements.footer.classList.toggle(this.settings.classNames.hidden, window.scrollY !== 0);
  }
});

document.addEventListener('DOMContentLoaded', function domLoaded() {
  document.querySelectorAll(AppPreview.prototype.defaults.selectors.component).forEach(function eachNode(node) {
    new AppPreview(node);
  });
});

module.exports = AppPreview;
