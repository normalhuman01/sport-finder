const KoaRouter = require('koa-router')
const getStats = require('../helpers/getStats')

const router = new KoaRouter()

router.get('user', '/:id', async ctx => {
  const user = await ctx.orm.users.findById(ctx.params.id, {
    attributes: { exclude: ['password'] },
  })
  const stats = await getStats(ctx, ctx.params.id)
  return ctx.render('users/profile', {
    user,
    stats,
  })
})

module.exports = router
