const router = require('koa-router')();
const log = require('./lib/log')('DownloadController');
const fs = require('./lib/fs');
const path = require('path');

/**
 * Get path to dmg
 * @param {Object} ctx context
 * @param {String} [version=] version. Optional. Default - latest
 * @returns {String} path to the file with file name and extension
 */
function getFileName(ctx, version) {
  const fileName = `pipgrabber${version || ''}.dmg`;
  return path.join(ctx.config.appDir, fileName);
}

async function download(ctx, version) {
  let downloads = ctx.storage.data.downloads;

  if (!downloads) {
    downloads = {
      total: 0
    };
    ctx.storage.data.downloads = downloads;
  }

  let downloadsForVersion = downloads[version]; // todo
}

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

  const fileName = getFileName(ctx);

  ctx.attachment(fileName);
  ctx.body = fs.createReadStream(fileName);
}

async function downloadVersion(ctx) {

}

async function checkVersion(ctx) {
  const version = ctx.params.version;
  ctx.isVersionExists = await fs.exists // todo
  return ctx.next();
}

/**
 * Routes
 */
router.get('/download', downloadLatestVersion);
router.get('/download/:version', checkVersion, downloadVersion);

/**
 * Exports
 */
module.exports = router;
