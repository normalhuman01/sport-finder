module.exports = async (ctx, next) => {
  if (ctx.session.user) {
    const currentUser = await ctx.orm.users.findById(ctx.session.user.id, {
      attributes: [
        'id',
        'username',
        'role',
        'confirmed',
        'photoId',
        'hasPendingEvaluations',
      ],
    })
    if (!currentUser) {
      return ctx.render('welcome/loginError', {
        homeUrl: '/',
      })
    }
    ctx.state = { ...ctx.state, currentUser }
  } else {
    return ctx.render('welcome/loginError', {
      homeUrl: '/',
    })
  }
  return next()
}
