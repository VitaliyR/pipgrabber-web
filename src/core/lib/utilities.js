const utilities = {
  async respond(ctx, status, voteStatus, additionalData) {
    ctx.body = Object.assign({
      status,
      voteStatus
    }, additionalData);
  }
};

module.exports = function Utilities(ctx, next) {
  Object.assign(ctx, utilities);
  return next();
};
