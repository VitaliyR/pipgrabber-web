const fs = require('fs-fs');
const path = require('path');
const process = require('process');
const log = require('./log')('Storage');

let storageFile;

const storage = {
  getFilePath() {
    return path.join(process.cwd(), storageFile);
  },

  async retrieve() {
    let isEmpty = false;
    let data;

    try {
      data = await fs.readFile(this.getFilePath(), 'utf-8');
      data = JSON.parse(data);
      log.info('Retrieved');
    } catch (e) {
      log.error('Could not find data file.', e);
      data = {
        features: {},
        votes: {}
      };
      isEmpty = true;
    }

    this.data = data;

    if (isEmpty) {
      await this.persist();
    }

    return data;
  },

  /**
  * Persist data to storage
  */
  async persist() {
    if (this.data) {
      try {
        await fs.writeFile(this.getFilePath(), JSON.stringify(this.data), 'utf-8');
        log.info('Persisted');
      } catch (e) {
        log.error('Could not write data file. ', e);
        throw e;
      }
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

  return async function StorageWrapper(ctx, next) {
    if (!storage.data) {
      try {
        await storage.retrieve();
      } catch (e) {
        log.error(e);
      }
    }
    Object.assign(ctx, { storage });
    return next();
  };
};
