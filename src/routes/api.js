const KoaRouter = require('koa-router')

const router = new KoaRouter()

const tokens = ['tokensillo', 'telegramtoken']

router.get('matchesAPI', '/matches', async ctx => {
  let error
  const authUsername = ctx.request.headers.authorization
  const token = ctx.request.headers.token
  const user = await ctx.orm.users.findOne({
    where: { apiUsername: authUsername },
  })
  if (user && tokens.includes(token)) {
    const matches = await ctx.orm.match.findAll({
      include: [ctx.orm.sport, ctx.orm.club, ctx.orm.userMatch],
      order: [['date', 'ASC']],
    })
    matches.forEach(match => {
      Object.assign(match, { playersAmount: match.playersCount() })
    })
    switch (ctx.accepts('html', 'json')) {
      case 'html':
        return
      case 'json':
        ctx.body = { matches, error }
        return
      default:
    }
  }
  error = 'Error en la autentificación'
  switch (ctx.accepts('html', 'json')) {
    case 'html':
      return
    case 'json':
      ctx.status = 503
      ctx.body = { matches: {}, error }
      return
    default:
  }
})

router.post('joinMatchAPI', '/matches/:id/players', async ctx => {
  let error = ''
  const authUsername = ctx.request.headers.authorization
  const token = ctx.request.headers.token
  const user = await ctx.orm.users.findOne({
    where: { apiUsername: authUsername },
  })

  if (!(tokens.includes(token) && user)) {
    error = 'Error en la autentificación'
    switch (ctx.accepts('html', 'json')) {
      case 'html':
        return
      case 'json':
        ctx.body = { success: false, error }
        return
      default:
    }
  }

  const match = await ctx.orm.match.findById(ctx.params.id, {
    include: [
      {
        model: ctx.orm.sport,
      },
      {
        model: ctx.orm.userMatch,
        include: [ctx.orm.users],
      },
    ],
  })
  if (match) {
    if (match.isPlayer(user.id)) {
      error = 'Ya eres miembro de la partida.'
      switch (ctx.accepts('html', 'json')) {
        case 'html':
          return
        case 'json':
          ctx.body = { success: false, error }
          return
        default:
      }
    }
    const canJoin = match.canJoin(user)
    if (!canJoin.success) {
      error =
        canJoin.reason === 'requireId'
          ? 'Debes tener tu foto actualizada para unirte.'
          : 'Esta partida es privada.'
      switch (ctx.accepts('html', 'json')) {
        case 'html':
          return
        case 'json':
          ctx.body = { success: false, error }
          return
        default:
      }
    }
    await ctx.orm.userMatch.create({
      matchId: match.id,
      userId: user.id,
    })
    switch (ctx.accepts('html', 'json')) {
      case 'html':
        return
      case 'json':
        ctx.body = { success: true, error: '' }
        return
      default:
    }
  } else {
    switch (ctx.accepts('html', 'json')) {
      case 'html':
        return
      case 'json':
        ctx.body = { success: false, error: 'La partida no existe' }
        return
      default:
    }
  }
})

module.exports = router
