const KoaRouter = require('koa-router')

const router = new KoaRouter()

router.get('clubs', '/', async ctx => {
  const clubs = await ctx.orm.club.findAll()
  return ctx.render('clubs/index', {
    clubs,
    isAdmin: ctx.state.currentUser.isAdmin(),
    clubUrl: club => ctx.router.url('club', { id: club.id }),
    newClubUrl: ctx.router.url('newClub'),
  })
})

router.delete('deleteClub', '/:id', async ctx => {
  const isAdmin = ctx.state.currentUser.isAdmin()
  if (!isAdmin) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect(ctx.router.url('clubs'))
  }
  const club = await ctx.orm.club.findById(ctx.params.id)
  await club.destroy()
  ctx.flashMessage.notice = 'El club fue eliminado exitosamente.'
  return ctx.redirect(ctx.router.url('clubs'))
})

router.delete('removeSport', '/:id/sports/:sportid', async ctx => {
  const club = await ctx.orm.club.findById(ctx.params.id)
  const joinTuple = await ctx.orm.clubSport.findOne({
    where: {
      sportId: ctx.params.sportid,
      clubId: club.id,
    },
  })
  await joinTuple.destroy()
  switch (ctx.accepts('html', 'json')) {
    case 'html':
      ctx.flashMessage.notice = 'El deporte fue eliminado exitosamente.'
      return ctx.redirect(ctx.router.url('club', club.id))
    case 'json':
      ctx.body = { success: true, error: '' }
      break
    default:
  }
})

router.get('newClub', '/new', async ctx => {
  const sports = await ctx.orm.sport.findAll()
  const club = ctx.orm.club.build()
  await ctx.render('/clubs/new', {
    club,
    sports,
    createClubUrl: ctx.router.url('createClub'),
    indexUrl: ctx.router.url('clubs'),
  })
})

router.post('createClub', '/', async ctx => {
  const isAdmin = ctx.state.currentUser.isAdmin()
  if (!isAdmin) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect(ctx.router.url('clubs'))
  }
  try {
    const club = await ctx.orm.club.create(ctx.request.body)
    return ctx.redirect(ctx.router.url('club', { id: club.id }))
  } catch (validationError) {
    return ctx.render('/clubs/new', {
      club: ctx.orm.club.build(ctx.request.body),
      errors: validationError.errors,
      createClubUrl: ctx.router.url('createClub'),
      indexUrl: ctx.router.url('clubs'),
    })
  }
})

router.post('addSport', '/:id', async ctx => {
  const clubId = ctx.params.id
  if (!ctx.state.currentUser.isAdmin()) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect(ctx.router.url('sport', clubId))
  }
  const sport = await ctx.orm.sport.findById(ctx.request.body.sportId)
  if (sport) {
    try {
      const clubSport = await ctx.orm.clubSport.create({
        clubId,
        sportId: sport.id,
        price: ctx.request.body.price,
        timeUnit: ctx.request.body.timeUnit,
      })
      switch (ctx.accepts('html', 'json')) {
        case 'html':
          return ctx.redirect(ctx.router.url('club', clubId))
        case 'json':
          ctx.body = { success: true, error: '', sport, clubSport }
          break
        default:
      }
    } catch (validationError) {
      switch (ctx.accepts('html', 'json')) {
        case 'html':
          return ctx.redirect(ctx.router.url('club', clubId))
        case 'json':
          ctx.body = {
            success: false,
            error: 'El deporte ya existe o hay un error en los datos',
          }
          break
        default:
      }
    }
  } else {
    switch (ctx.accepts('html', 'json')) {
      case 'html':
        ctx.flashMessage.notice = 'El deporte ingresado no existe.'
        return ctx.redirect(ctx.router.url('club', clubId))
      case 'json':
        ctx.body = { success: false, error: 'El deporte ingresado no existe.' }
        break
      default:
    }
  }
})

router.get('editClub', '/:id/edit', async ctx => {
  const club = await ctx.orm.club.findById(ctx.params.id)
  return ctx.render('clubs/edit', {
    club,
    updateClubUrl: ctx.router.url('updateClub', club.id),
    showClubUrl: ctx.router.url('club', club.id),
  })
})

router.patch('updateClub', '/:id', async ctx => {
  const isAdmin = ctx.state.currentUser.isAdmin()
  if (!isAdmin) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect(ctx.router.url('clubs'))
  }
  const club = await ctx.orm.club.findById(ctx.params.id)
  try {
    await club.update(ctx.request.body)
    ctx.flashMessage.notice = 'El club ha sido actualizado.'
    return ctx.redirect(ctx.router.url('club', { id: club.id }))
  } catch (validationError) {
    return ctx.render('clubs/edit', {
      club,
      errors: validationError.errors,
      updateClubUrl: ctx.router.url('updateClub', { id: club.id }),
      showClubUrl: ctx.router.url('club', club.id),
    })
  }
})

router.get('club', '/:id', async ctx => {
  const sports = await ctx.orm.sport.findAll()
  const club = await ctx.orm.club.findById(ctx.params.id, {
    include: [
      {
        model: ctx.orm.clubSport,
        include: ctx.orm.sport,
      },
    ],
  })
  const clubSports = club.clubSports
  switch (ctx.accepts('html', 'json')) {
    case 'html':
      await ctx.render('clubs/show', {
        club,
        sports,
        clubSports,
        isAdmin: ctx.state.currentUser.isAdmin(),
        deleteClubUrl: ctx.router.url('deleteClub', club.id),
        indexUrl: ctx.router.url('clubs'),
        editClubUrl: ctx.router.url('editClub', club.id),
        warning: ctx.flashMessage.warning,
        notice: ctx.flashMessage.notice,
        addSportUrl: ctx.router.url('addSport', club.id),
      })
      break
    case 'json':
      ctx.body = { sports, clubSports }
      break
    default:
  }
})

module.exports = router
