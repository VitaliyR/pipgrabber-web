const router = require('koa-router')();
const log = require('./lib/log')('DownloadController');

/**
 * Increments counter of downloads and initiates download
 * @param {Object} ctx context
 * @return {Promise}
 */
async function downloadLatestVersion(ctx) {
  let downloadCount = ctx.storage.data.downloads || 0;

  downloadCount += 1;
  ctx.storage.data.downloads = downloadCount;
  log.info(`New download, now we have ${downloadCount}`);

  await ctx.storage.persist();

  return ctx.attachment(ctx.config.appFile);
}

/**
 * Routes
 */
router.get('/download', downloadLatestVersion);

/**
 * Exports
 */
module.exports = router;
