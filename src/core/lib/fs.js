const fs = require('fs');

const handler = methodName => (...params) => new Promise((res, rej) => {
  fs[methodName](...params, (e, d) => {
    if (typeof d === 'undefined') {
      return e instanceof Error ? rej(e) : res(e);
    }
    if (e) {
      return rej(e);
    }
    return res(d);
  });
});

module.exports = new Proxy(fs, {
  get(_, method) {
    const methodName = method.split('Original')[0];
    const isOriginal = methodName !== method;
    return isOriginal ? fs[methodName] : (fs[method] && handler(method));
  }
});
