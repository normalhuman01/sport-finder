const KoaRouter = require('koa-router')

const router = new KoaRouter()

router.get('users', '/users', async ctx => {
  const users = await ctx.orm.users.findAll({
    attributes: { exclude: ['password'] },
    where: { id: { not: ctx.state.currentUser.id } },
  })
  return ctx.render('admin/users', {
    users,
    promoteUsersUrl: user => ctx.router.url('promoteUsers', { id: user.id }),
  })
})

router.post('promoteUsers', '/users/:id', async ctx => {
  const user = await ctx.orm.users.findById(ctx.params.id)
  await user.update({ role: 0 })
  return ctx.redirect(ctx.router.url('users'))
})

router.delete('deleteUsers', '/users/:id', async ctx => {
  const user = await ctx.orm.users.findById(ctx.params.id)
  await user.destroy()
  ctx.flashMessage.notice = 'El usuario ha sido eliminado correctamente.'
  return ctx.redirect(ctx.router.url('users'))
})

module.exports = router
