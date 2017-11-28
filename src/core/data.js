const router = require('koa-router')();
const log = require('./lib/log')('DataController');
const fs = require('./lib/fs');

/**
 * Retrieve links
 * @param {Object} ctx context
 */
async function getLinks(ctx) {
  log.info('Requested links');

  try {
    ctx.body = await fs.readFile(ctx.config.videoLinks, 'utf-8');
  } catch (e) {
    log.warn('Links file not found');
    ctx.body = '[]';
  }
}

/**
 * Routes
 */
router.get('/links', getLinks);

/**
 * Exports
 */
module.exports = router;
