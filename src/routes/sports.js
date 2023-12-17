const KoaRouter = require('koa-router')

const router = new KoaRouter()

// JSON error handling
router.use(async (ctx, next) => {
  try {
    await next()
  } catch (error) {
    if (error.status) {
      switch (ctx.accepts('html', 'json')) {
        case 'html':
          throw error
        case 'json':
          ctx.status = error.status
          ctx.body = error
          break
        default:
      }
    }
  }
})

router.get('sports', '/', async ctx => {
  const sports = await ctx.orm.sport.findAll()
  await ctx.render('sports/index', {
    sports,
    isAdmin: ctx.state.currentUser.isAdmin(),
    sportUrl: sport => ctx.router.url('sport', { id: sport.id }),
    newSportUrl: ctx.router.url('newSport'),
  })
})

router.delete('deleteSport', '/:id', async ctx => {
  const isAdmin = ctx.state.currentUser.isAdmin()
  if (!isAdmin) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect(ctx.router.url('sports'))
  }
  const sport = await ctx.orm.sport.findById(ctx.params.id)
  await sport.destroy()
  ctx.flashMessage.notice = 'El deporte fue eliminado exitosamente.'
  return ctx.redirect(ctx.router.url('sports'))
})

router.get('newSport', '/new', async ctx => {
  const sport = ctx.orm.sport.build()
  await ctx.render('/sports/new', {
    sport,
    createSportUrl: ctx.router.url('createSport'),
    indexUrl: ctx.router.url('sports'),
  })
})

router.post('createSport', '/', async ctx => {
  const isAdmin = ctx.state.currentUser.isAdmin()
  if (!isAdmin) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect(ctx.router.url('sports'))
  }
  try {
    const sport = await ctx.orm.sport.create(ctx.request.body)
    return ctx.redirect(ctx.router.url('sport', { id: sport.id }))
  } catch (validationError) {
    return ctx.render('/sports/new', {
      sport: ctx.orm.sport.build(ctx.request.body),
      errors: validationError.errors,
      createSportUrl: ctx.router.url('createSport'),
      indexUrl: ctx.router.url('sports'),
    })
  }
})

router.get('editSport', '/:id/edit', async ctx => {
  const sport = await ctx.orm.sport.findById(ctx.params.id)
  await ctx.render('sports/edit', {
    sport,
    updateSportUrl: ctx.router.url('updateSport', sport.id),
    showUrl: ctx.router.url('sport', sport.id),
  })
})

router.patch('updateSport', '/:id', async ctx => {
  const isAdmin = ctx.state.currentUser.isAdmin()
  if (!isAdmin) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect(ctx.router.url('sports'))
  }
  const sport = await ctx.orm.sport.findById(ctx.params.id)
  try {
    await sport.update(ctx.request.body)
    ctx.flashMessage.notice = 'El deporte ha sido actualizado.'
    return ctx.redirect(ctx.router.url('sport', { id: sport.id }))
  } catch (validationError) {
    return ctx.render('sports/edit', {
      sport,
      errors: validationError.errors,
      updateSportUrl: ctx.router.url('updateSport', sport.id),
      showUrl: ctx.router.url('sport', sport.id),
    })
  }
})

router.post('addPosition', '/:id', async ctx => {
  const sportId = ctx.params.id
  if (!ctx.state.currentUser.isAdmin()) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect(ctx.router.url('sport', sportId))
  }
  const sport = await ctx.orm.sport.findById(sportId, {
    include: [ctx.orm.position],
  })
  try {
    await sport.createPosition(ctx.request.body)
    return ctx.redirect(ctx.router.url('sport', sport.id))
  } catch (validationError) {
    return ctx.render('sports/show', {
      sport,
      errors: validationError.errors,
      isAdmin: ctx.state.currentUser.isAdmin(),
      addPositionUrl: ctx.router.url('addPosition', sport.id),
      removePositionUrl: position =>
        ctx.router.url('removePosition', {
          sportId: sport.id,
          id: position.id,
        }),
      editSportUrl: ctx.router.url('editSport', sport.id),
      deleteSportUrl: ctx.router.url('deleteSport', sport.id),
      indexUrl: ctx.router.url('sports'),
    })
  }
})

router.delete('removePosition', '/:sportId/positions/:id', async ctx => {
  const sportId = ctx.params.sportId
  const position = await ctx.orm.position.findById(ctx.params.id)
  if (!ctx.state.currentUser.isAdmin()) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect(ctx.router.url('sport', sportId))
  }
  await position.destroy()
  ctx.flashMessage.notice = 'La posición fue eliminada correctamente.'
  return ctx.redirect(ctx.router.url('sport', sportId))
})

router.get('sport', '/:id', async ctx => {
  const sport = await ctx.orm.sport.findById(ctx.params.id, {
    include: [ctx.orm.position],
  })
  await ctx.render('sports/show', {
    sport,
    isAdmin: ctx.state.currentUser.isAdmin(),
    addPositionUrl: ctx.router.url('addPosition', sport.id),
    removePositionUrl: position =>
      ctx.router.url('removePosition', {
        sportId: sport.id,
        id: position.id,
      }),
    editSportUrl: ctx.router.url('editSport', sport.id),
    deleteSportUrl: ctx.router.url('deleteSport', sport.id),
    indexUrl: ctx.router.url('sports'),
  })
})

module.exports = router
