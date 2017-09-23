const fs = require('await-fs');
const path = require('path');
const process = require('process');
const log = require('./log')('Storage');

let storageFile;

const storage = {
  getFilePath() {
    return path.join(process.cwd(), storageFile);
  },

  async retrieve() {
    let data;

    try {
      data = await fs.readFile(this.getFilePath(), 'utf-8');
      data = JSON.parse(data);
      log.info('Retrieved');
    } catch (e) {
      log.error('Could not find data file');
      data = {
        features: {},
        votes: {}
      };
    }

    this.data = data;

    return data;
  },

  /**
  * Persist data to storage
  */
  async persist() {
    if (this.data) {
      fs.writeFile(this.getFilePath(), JSON.stringify(this.data));
      log.info('Persisted');
    } else {
      log.warn('Nothing readed before - nothing persist now');
    }
  }
};

/**
* Exports. Reads config, returns koa context function
*/
module.exports = function Storage(config) {
  storageFile = config.storage;

  storage.retrieve();

  return function StorageWrapper(ctx, next) {
    Object.assign(ctx, { storage });
    return next();
  };
};
