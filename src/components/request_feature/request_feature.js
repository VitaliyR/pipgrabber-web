var BaseObject = require('components/base_object/BaseObject');
var featureTemplate = require('app/templates/feature.hbs');

var RequestFeature = BaseObject.extend({
  defaults: {
    selectors: {
      component: '.c-request-feature',
      featureItem: '.c-request-feature--item',
      featureName: '.c-request-feature--name',
      voteButton: '.c-request-feature--vote'
    },
    classNames: {
      buttonDisabled: 'c-button__disabled',
      buttonBordered: 'c-button__bordered'
    },
    events: {
      'click voteButton component': 'toggleVote'
    }
  },

  requests: [],

  toggleVote: function (event) {
    var button = event.target;
    var container = this.parentsUntil(button, this.settings.selectors.featureItem);
    var feature = this.getCurrentStatus(container);

    if (this.requests.indexOf(feature.id) >= 0) {
      return;
    }

    this.requests.push(feature.id);

    button.classList.toggle(this.settings.classNames.buttonBordered, feature.isVoted);
    button.classList.add(this.settings.classNames.buttonDisabled);

    this.request({
      url: '/features/' + feature.id,
      method: feature.isVoted ? 'DELETE' : 'POST',
      ctx: this,
      success: function (res) {
        if (res.status === 'ok') {
          this.toggleFeature(container, res.feature);
        }
      },
      error: function () {
        this.toggleFeature(container, feature);
      },
      complete: function () {
        var index = this.requests.indexOf(feature.id);
        if (index >= 0) {
          this.requests.splice(index, 1);
        }
      }
    });
  },

  getCurrentStatus: function (container) {
    return {
      name: container.querySelector(this.settings.selectors.featureName).textContent,
      votes: container.getAttribute('data-votes'),
      id: container.getAttribute('data-id'),
      done: container.getAttribute('data-done') === 'true',
      isVoted: container.getAttribute('data-voted') === 'true'
    };
  },

  toggleFeature: function (container, data) {
    container.outerHTML = featureTemplate(data);
  }
});

document.addEventListener('DOMContentLoaded', function domLoaded() {
  document
    .querySelectorAll(RequestFeature.prototype.defaults.selectors.component)
    .forEach(function eachNode(node) {
      new RequestFeature(node);
    });
});

module.exports = RequestFeature;
