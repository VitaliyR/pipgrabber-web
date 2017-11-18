const router = require('koa-router')();
const log = require('./lib/log')('FeaturesController');

function serializeFeature(feature, ctx) {
  const votes = ctx.storage.data.votes[feature.id] || [];
  const isVoted = votes.indexOf(ctx.realIP) >= 0;
  return {
    name: feature.name,
    votes: feature.votes,
    id: feature.id,
    done: feature.done,
    isVoted
  };
}

function getFeatures(ctx) {
  const features = [];
  const doneFeatures = [];

  Object.keys(ctx.storage.data.features)
    .forEach((featureId) => {
      const feature = ctx.storage.data.features[featureId];
      const arr = feature.done ? doneFeatures : features;

      arr.push(serializeFeature(feature, ctx));
    });

  const sort = (a, b) => a.votes < b.votes;

  features.sort(sort);
  doneFeatures.sort(sort);

  return features.concat(doneFeatures);
}

async function getFeature(ctx, next) {
  const featureId = ctx.params.id;
  const feature = ctx.storage.data.features[featureId];

  if (!feature) {
    log.warn(`${ctx.realIP} tried to vote for unexisting feature ${featureId}`);
    return ctx.respond(ctx, 'err', false);
  }

  let votes = ctx.storage.data.votes[feature.id];
  if (!votes) {
    votes = [];
    ctx.storage.data.votes[feature.id] = votes;
  }

  ctx.feature = feature;
  ctx.votes = votes;
  ctx.isVoted = votes.indexOf(ctx.realIP) >= 0;

  return next();
}

async function voteFeature(ctx) {
  if (ctx.isVoted) {
    log.warn(`${ctx.realIP} tried to vote again for feature ${ctx.feature.id}: ${ctx.feature.name}`);
    return ctx.respond(ctx, 'err', true);
  }

  ctx.feature.votes += 1;
  ctx.votes.push(ctx.realIP);

  log.info(`${ctx.realIP} voted for ${ctx.feature.id}: ${ctx.feature.name}`);

  await ctx.storage.persist();

  return ctx.respond(ctx, 'ok', true, { feature: serializeFeature(ctx.feature, ctx) });
}

async function unvoteFeature(ctx) {
  if (ctx.isVoted) {
    ctx.feature.votes -= 1;
    ctx.votes.splice(ctx.votes.indexOf(ctx.realIP), 1);

    log.info(`${ctx.realIP} removed vote from ${ctx.feature.id}: ${ctx.feature.name}`);

    await ctx.storage.persist();

    return ctx.respond(ctx, 'ok', false, { feature: serializeFeature(ctx.feature, ctx) });
  }

  log.warn(`${ctx.realIP} tried to unvote for feature which he not voted ${ctx.feature.id}: ${ctx.feature.name}`);
  return ctx.respond(ctx, 'err', false);
}

/**
* Presents main page
* @param {Object} ctx context
* @return {Promise}
*/
async function presentMainPage(ctx) {
  const features = getFeatures(ctx);
  return ctx.render('index.hbs', { features });
}

async function getIP(ctx, next) {
  ctx.realIP = ctx.req.headers['x-real-ip'] || ctx.ip;
  await next();
}

/**
 * Router
 */
router.use(getIP);
router.get('/', presentMainPage);
router.post('/features/:id', getFeature, voteFeature);
router.del('/features/:id', getFeature, unvoteFeature);

/**
* Exports
*/
module.exports = router;
