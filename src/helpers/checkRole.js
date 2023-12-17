module.exports = async (ctx, next) => {
  if (ctx.session.user) {
    const currentUser = await ctx.orm.users.findById(ctx.session.user.id, {
      attributes: ['id', 'username', 'role'],
    })
    if (currentUser && currentUser.isAdmin()) {
      return next()
    } else if (currentUser) {
      ctx.flashMessage.warning = 'No tienes los permisos.'
      return ctx.redirect(ctx.router.url('profile'))
    }
  }
  ctx.flashMessage.warning = 'No tienes los permisos.'
  ctx.session = null
  return ctx.router.redirect('home')
}
