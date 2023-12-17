const loadNotifications = require('./loadNotifications')

module.exports = async (ctx, next) => {
  ctx.state.notifications = await loadNotifications(ctx)
  return next()
}
