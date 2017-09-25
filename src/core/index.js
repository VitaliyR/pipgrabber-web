const Koa = require('koa');
const serve = require('koa-static');
const renderer = require('koa-views');
const path = require('path');
const config = require('../../config');
const log = require('./lib/log')('App');
const storage = require('./lib/storage');
const featuresController = require('./features');
const utilities = require('./lib/utilities');

const app = new Koa();

if (process.env.NODE_ENV === 'production') {
  log.notifications = false;
}

app.use(utilities);
app.use(storage(config));

app.use(async (ctx, next) => {
  ctx.config = config;
  return next();
});

app.use(renderer(path.join(__dirname, '../templates'), {
  map: {
    hbs: 'handlebars'
  },
  options: {
    partials: {
      feature: './feature'
    }
  }
}));

app.use(featuresController.routes());
app.use(serve(path.join(__dirname, '../../dist')));

if (!module.parent) {
  app.listen(config.port, () => {
    log.info(`Listening on ${config.port}`);
  });
}

module.exports = app;
