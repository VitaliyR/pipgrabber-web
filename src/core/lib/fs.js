const fs = require('fs');

const handler = methodName => (...params) => new Promise((res, rej) => {
  fs[methodName](...params, (e, d) => {
    if (typeof d === 'undefined') {
      return res(e);
    }
    if (e) {
      return rej(e);
    }
    return res(d);
  });
});

module.exports = new Proxy(fs, {
  get(_, method) {
    return fs[method] && handler(method);
  }
});
