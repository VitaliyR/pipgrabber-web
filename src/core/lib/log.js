const log = require('loggy');

module.exports = function Logger(name) {
  return new Proxy(log, {
    get(logObject, method) {
      return function logWrapper(...args) {
        args[0] = `${name}: ${args[0]}`;
        return log[method].apply(this, args);
      };
    }
  });
};
