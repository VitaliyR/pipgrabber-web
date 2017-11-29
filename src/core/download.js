const router = require('koa-router')();
const log = require('./lib/log')('DownloadController');
const fs = require('fs-fs');
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

/**
 * Increments counter of downloads and initiates download
 * @param {Object} ctx context
 * @return {Promise}
 */
async function downloadVersion(ctx) {
  const { version } = ctx.params;
  let { downloads } = ctx.storage.data;

  if (!downloads) {
    downloads = {
      total: 0
    };
    ctx.storage.data.downloads = downloads;
  }

  if (version) {
    let downloadsForVersion = downloads[version] || 0;
    downloadsForVersion += 1;
    downloads[version] = downloadsForVersion;
  } else {
    downloads.total += 1;
  }

  await ctx.storage.persist();

  log.info(`New download, now we have ${downloads.total}`);

  ctx.attachment(path.basename(ctx.versionFileName));
  ctx.body = fs.native.createReadStream(ctx.versionFileName);
}

/**
 * Checks if there are provided version
 * @param {Object} ctx context
 * @param {Function} [next=] next middleware function
 */
async function checkVersion(ctx, next) {
  const { version } = ctx.params;
  const fileName = getFileName(ctx, version);
  const isVersionExists = await fs.exists(fileName);

  if (isVersionExists) {
    ctx.versionFileName = fileName;
    await next();
  } else {
    log.info(`Tried to request ${version || 'latest'} but didn't found`);
    ctx.throw(404);
  }
}

/**
 * Routes
 */
router.get('/download', checkVersion, downloadVersion);
router.get('/download/:version', checkVersion, downloadVersion);

/**
 * Exports
 */
module.exports = router;
