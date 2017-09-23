module.exports = {
  /**
  * Make ajax request
  * @param {Object} opts
  *  @param {Object} [opts.ctx=this]
  *  @param {string} [opts.method=GET]
  *  @param {string}isMobile opts.url
  *  @param {Function} [opts.success=Function.prototype]
  *  @param {Function} [opts.error=Function.prototype]
  *  @return {XMLHttpRequest}
  */
  request: function (opts) {
    var request = new XMLHttpRequest();
    var method = opts.method || 'GET';
    var ctx = opts.ctx;

    request.open(method, opts.url, true);

    request.onload = function requestLoad() {
      if (request.status >= 200 && request.status < 400) {
        var json;
        try {
          json = JSON.parse(request.responseText);
        } catch (e) {
          throw e;
        }

        opts.success && opts.success.apply(ctx || this, [json || request.responseText, request]);
      } else {
        opts.error && opts.error.apply(ctx || this, [request]);
      }

      opts.complete && opts.complete.apply(ctx || this, [request]);
    };

    request.onerror = opts.error || Function.prototype;

    request.send();

    return request;
  }
};
