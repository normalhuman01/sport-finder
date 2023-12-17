module.exports = async (ctx, next) => {
  if (ctx.state.currentUser.confirmed) {
    return next()
  }
  return ctx.render('welcome/confirmationError', {
    profileUrl: '/profile',
  })
}
