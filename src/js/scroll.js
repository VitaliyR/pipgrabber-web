require('smoothscroll-polyfill').polyfill();

document.addEventListener('DOMContentLoaded', function domReady() {
  document.querySelectorAll('.js-button-anchor').forEach(function eachButtonAnchor(node) {
    node.addEventListener('click', function clickButtonAnchor(e) {
      var selector = this.getAttribute('href');
      var scrollIntoNode = document.querySelector(selector);
      scrollIntoNode.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
      e.preventDefault();
    });
  });
});
