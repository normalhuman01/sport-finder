const KoaRouter = require('koa-router')

const router = new KoaRouter()

router.get('matches', '/', async ctx => {
  const matches = await ctx.orm.match.findAll({
    include: [ctx.orm.sport, ctx.orm.club, ctx.orm.userMatch],
    order: [['date', 'ASC']],
    where: { private: false },
  })
  const userMatches = await ctx.orm.userMatch.findAll({
    include: [ctx.orm.users, ctx.orm.match],
  })
  const user = { id: ctx.state.currentUser.id }
  return ctx.render('matches/index', {
    matches,
    userMatches,
    user,
    matchUrl: match => ctx.router.url('match', { id: match.id }),
    newMatchUrl: ctx.router.url('newMatch'),
    profileUrl: '/profile',
    joinMatchUrl: match => ctx.router.url('joinMatch', match.id),
  })
})

router.get('myMatches', '/enrolled', async ctx => {
  const user = { id: ctx.state.currentUser.id }
  const userMatches = await ctx.orm.userMatch.findAll({
    include: [
      { model: ctx.orm.users },
      {
        model: ctx.orm.match,
        include: [ctx.orm.sport, ctx.orm.club, ctx.orm.userMatch],
        order: [['date', 'ASC']],
      },
    ],
    where: { userId: user.id },
  })
  const matches = userMatches.map(player => player.match)
  return ctx.render('matches/index', {
    matches,
    userMatches,
    user,
    matchUrl: match => ctx.router.url('match', { id: match.id }),
    newMatchUrl: ctx.router.url('newMatch'),
    profileUrl: '/profile',
    joinMatchUrl: match => ctx.router.url('joinMatch', match.id),
  })
})

router.delete('deleteMatch', '/:id', async ctx => {
  const match = await ctx.orm.match.findById(ctx.params.id)
  const currentPlayer = await ctx.orm.userMatch.findOne({
    where: {
      userId: ctx.state.currentUser.id,
      matchId: match.id,
    },
  })
  if (
    (!currentPlayer || !currentPlayer.isAdmin()) &&
    !ctx.state.currentUser.isAdmin()
  ) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect(ctx.router.url('match', match.id))
  }
  await match.destroy()
  ctx.flashMessage.notice = 'La partida fue eliminada exitosamente.'
  return ctx.redirect(ctx.router.url('matches'))
})

router.get('newMatch', '/new', async ctx => {
  const match = ctx.orm.match.build()
  const sports = await ctx.orm.sport.findAll()
  const clubs = await ctx.orm.club.findAll()
  return ctx.render('/matches/new', {
    match,
    sports,
    clubs,
    createMatchUrl: ctx.router.url('createMatch'),
    indexUrl: ctx.router.url('matches'),
  })
})

router.post('createMatch', '/', async ctx => {
  try {
    ctx.request.body.date = new Date(ctx.request.body.date)
    const clubSport = await ctx.orm.clubSport.findOne({
      where: {
        clubId: ctx.request.body.clubId,
        sportId: ctx.request.body.sportId,
      },
    })
    if (!clubSport) {
      ctx.flashMessage.warning = 'El club no tiene habilitado ese deporte.'
      return ctx.redirect(ctx.router.url('newMatch'))
    }
    const match = await ctx.orm.match.create(ctx.request.body)
    await ctx.orm.userMatch.create({
      matchId: match.id,
      userId: ctx.state.currentUser.id,
      admin: true,
    })
    return ctx.redirect(ctx.router.url('match', match.id))
  } catch (validationError) {
    const match = ctx.orm.match.build(ctx.request.body)
    const sports = await ctx.orm.sport.findAll()
    const clubs = await ctx.orm.club.findAll()
    return ctx.render('matches/new', {
      match,
      sports,
      clubs,
      errors: validationError.errors,
      createMatchUrl: ctx.router.url('createMatch'),
      indexUrl: ctx.router.url('matches'),
    })
  }
})

router.get('editMatch', '/:id/edit', async ctx => {
  const match = await ctx.orm.match.findById(ctx.params.id, {
    include: [ctx.orm.sport, ctx.orm.club],
  })
  const sports = await ctx.orm.sport.findAll()
  const clubs = await ctx.orm.club.findAll()
  return ctx.render('matches/edit', {
    match,
    sports,
    clubs,
    updateMatchUrl: ctx.router.url('updateMatch', match.id),
    showMatchUrl: ctx.router.url('match', match.id),
  })
})

router.patch('updateMatch', '/:id', async ctx => {
  const match = await ctx.orm.match.findById(ctx.params.id, {
    include: [ctx.orm.sport, ctx.orm.club],
  })
  const currentPlayer = await ctx.orm.userMatch.findOne({
    where: {
      userId: ctx.state.currentUser.id,
      matchId: match.id,
    },
  })
  if (
    (!currentPlayer || !currentPlayer.isAdmin()) &&
    !ctx.state.currentUser.isAdmin()
  ) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect(ctx.router.url('match', match.id))
  }
  try {
    const clubSport = await ctx.orm.clubSport.findOne({
      where: {
        clubId: ctx.request.body.clubId,
        sportId: ctx.request.body.sportId,
      },
    })
    if (!clubSport) {
      ctx.flashMessage.warning = 'El club no tiene habilitado ese deporte.'
      return ctx.redirect(ctx.router.url('editMatch', match.id))
    }
    await match.update(ctx.request.body)
    ctx.flashMessage.notice = 'La partida ha sido actualizada.'
    return ctx.redirect(ctx.router.url('match', { id: match.id }))
  } catch (validationError) {
    const sports = await ctx.orm.sport.findAll()
    const clubs = await ctx.orm.club.findAll()
    return ctx.render('matches/edit', {
      match,
      sports,
      clubs,
      errors: validationError.errors,
      updateMatchUrl: ctx.router.url('updateMatch', { id: match.id }),
      showMatchUrl: ctx.router.url('match', match.id),
    })
  }
})

router.post('sendEvaluations', '/:id/send', async ctx => {
  const match = await ctx.orm.match.findById(ctx.params.id)
  if (match.sentEvaluations) {
    ctx.flashMessage.warning = 'Ya has enviado las evaluaciones.'
    return ctx.redirect(ctx.router.url('match', ctx.params.id))
  }
  if (match.date.getTime() > new Date().getTime()) {
    ctx.flashMessage.warning =
      'No se pueden enviar las evaluaciones antes del término de la partida.'
    return ctx.redirect(ctx.router.url('match', ctx.params.id))
  }
  await match.update({ sentEvaluations: true })
  const players = await ctx.orm.userMatch.findAll({
    where: { matchId: ctx.params.id },
    include: [ctx.orm.users],
  })
  players.forEach(async author => {
    await author.user.update({ hasPendingEvaluations: true })
    players.forEach(async player => {
      if (author.user.id !== player.user.id) {
        await ctx.orm.evaluation.create({
          playerId: player.id,
          userId: author.user.id,
        })
      }
    })
  })
  ctx.flashMessage.notice = 'Se han enviado las notificaciones.'
  return ctx.redirect(ctx.router.url('match', ctx.params.id))
})

router.get('evaluations', '/evaluate', async ctx => {
  const evaluations = await ctx.orm.evaluation.findAll({
    where: { userId: ctx.state.currentUser.id },
  })
  const players = await ctx.orm.userMatch.findAll({ include: [ctx.orm.users] })
  const toEvaluate = evaluations.filter(ev => !ev.stars)
  return ctx.render('matches/evaluate', {
    evaluations: toEvaluate,
    evalUrl: ev => ctx.router.url('evaluatePlayer', { id: ev.id }),
    getPlayer: ev => players.filter(p => p.id === ev.playerId)[0],
  })
})

router.post('evaluatePlayer', '/evaluate/:id/', async ctx => {
  const evaluation = await ctx.orm.evaluation.findById(ctx.params.id)
  await evaluation.update({ stars: ctx.request.body.stars })
  const evaluations = await ctx.orm.evaluation.findAll({
    where: { userId: ctx.state.currentUser.id },
  })
  let stillRemainingEvaluations = false
  evaluations.forEach(ev => {
    if (!ev.stars) {
      stillRemainingEvaluations = true
    }
  })
  if (!stillRemainingEvaluations) {
    const user = await ctx.orm.users.findById(ctx.state.currentUser.id)
    await user.update({ hasPendingEvaluations: false })
  }
  ctx.flashMessage.notice =
    'Gracias por evaluar a los jugadores. En una próxima versión serás recompensado.'
  ctx.redirect(ctx.router.url('evaluations'))
})

router.post('joinMatch', '/:id/players', async ctx => {
  let error = ''
  const currentUser = ctx.state.currentUser
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

  if (match.isPlayer(currentUser.id)) {
    error = 'Ya eres miembro de la partida.'
    ctx.flashMessage.warning = error
    switch (ctx.accepts('html', 'json')) {
      case 'html':
        return ctx.redirect(ctx.router.url('match', match.id))
      case 'json':
        ctx.body = { success: false, error }
        break
      default:
    }
  }
  const canJoin = match.canJoin(currentUser)
  if (!canJoin.success) {
    error =
      canJoin.reason === 'requireId'
        ? 'Debes tener tu foto actualizada para unirte.'
        : 'Esta partida es privada.'
    ctx.flashMessage.warning = error
    switch (ctx.accepts('html', 'json')) {
      case 'html':
        return ctx.redirect(ctx.router.url('matches'))
      case 'json':
        ctx.body = { success: false, error }
        break
      default:
    }
  }
  await ctx.orm.userMatch.create({
    matchId: match.id,
    userId: currentUser.id,
  })
  const invitation = await ctx.orm.matchInvitation.findOne({
    where: { userId: currentUser.id, matchId: ctx.params.id },
  })
  if (invitation) {
    invitation.destroy()
  }
  switch (ctx.accepts('html', 'json')) {
    case 'html':
      return ctx.redirect(ctx.router.url('match', match.id))
    case 'json':
      ctx.body = { success: true, error: '' }
      break
    default:
  }
})

router.post('promotePlayer', '/:matchId/players/:id', async ctx => {
  const matchId = ctx.params.matchId
  const currentPlayer = await ctx.orm.userMatch.findOne({
    where: {
      userId: ctx.state.currentUser.id,
      matchId,
    },
  })
  if (!currentPlayer || !currentPlayer.isAdmin()) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect(ctx.router.url('match', matchId))
  }
  const userMatch = await ctx.orm.userMatch.findById(ctx.params.id)
  await userMatch.update({ admin: true })
  ctx.flashMessage.notice = 'El jugador ha sido promovido correctamente.'
  return ctx.redirect(ctx.router.url('match', matchId))
})

router.delete('removePlayer', '/:matchId/players/:id', async ctx => {
  const matchId = ctx.params.matchId
  const currentPlayer = await ctx.orm.userMatch.findOne({
    where: {
      userId: ctx.state.currentUser.id,
      matchId,
    },
    include: [ctx.orm.users],
  })
  const player = await ctx.orm.userMatch.findById(ctx.params.id, {
    include: [ctx.orm.users],
  })
  const isCurrentPlayer = player.user.id === currentPlayer.user.id
  if (!currentPlayer || (!isCurrentPlayer && !currentPlayer.isAdmin())) {
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect(ctx.router.url('match', matchId))
  } else if (!player) {
    ctx.flashMessage.warning = 'El jugador no es miembro de la partida.'
    return ctx.redirect(ctx.router.url('match', matchId))
  } else if (!isCurrentPlayer && player.isAdmin()) {
    ctx.flashMessage.warning =
      'No puedes eliminar a un administrador de la partida.'
    return ctx.redirect(ctx.router.url('match', matchId))
  } else if (isCurrentPlayer && currentPlayer.isAdmin()) {
    // Check if there's still admins
    await player.destroy()
    ctx.flashMessage.notice = 'Has dejado la partida.'
    return ctx.redirect(ctx.router.url('matches'))
  } else if (!isCurrentPlayer && currentPlayer.isAdmin()) {
    await player.destroy()
    ctx.flashMessage.notice = 'El jugador fue eliminado correctamente.'
    return ctx.redirect(ctx.router.url('match', matchId))
  }
  // isCurrentPlayer && !currentPlayer.isAdmin()
  await player.destroy()
  ctx.flashMessage.notice = 'Has dejado la partida.'
  return ctx.redirect(ctx.router.url('matches'))
})

router.patch('setPosition', '/:matchId/players/:id', async ctx => {
  const matchId = ctx.params.matchId
  const player = await ctx.orm.userMatch.findById(ctx.params.id)
  try {
    await player.update({ positionId: ctx.request.body.positionId })
    ctx.flashMessage.notice = 'Tu posición se ha actualizado correctamente.'
    return ctx.redirect(ctx.router.url('match', matchId))
  } catch (validationError) {
    ctx.flashMessage.warning =
      'Ha ocurrido un error mientras se actualizaba tu posición.'
    return ctx.redirect(ctx.router.url('match', matchId))
  }
})

router.get('match', '/:id', async ctx => {
  const match = await ctx.orm.match.findById(ctx.params.id, {
    include: [
      {
        model: ctx.orm.sport,
        include: [ctx.orm.position],
      },
      {
        model: ctx.orm.club,
        include: [ctx.orm.clubSport],
      },
      {
        model: ctx.orm.userMatch,
      },
    ],
  })
  const players = await ctx.orm.userMatch.findAll({
    where: { matchId: match.id },
    include: [ctx.orm.users, ctx.orm.position],
    order: [['createdAt', 'ASC']],
  })
  const currentPlayer = await ctx.orm.userMatch.findOne({
    where: {
      userId: ctx.state.currentUser.id,
      matchId: match.id,
    },
    include: [ctx.orm.users, ctx.orm.position],
  })
  const visitMode = currentPlayer === null
  return ctx.render('matches/show', {
    match,
    players,
    visitMode,
    currentPlayer,
    currentUser: ctx.state.currentUser,
    promotePlayerUrl: player =>
      ctx.router.url('promotePlayer', {
        matchId: match.id,
        id: player.id,
      }),
    removePlayerUrl: player =>
      ctx.router.url('removePlayer', {
        matchId: match.id,
        id: player.id,
      }),
    setPositionUrl: player =>
      ctx.router.url('setPosition', {
        matchId: match.id,
        id: player.id,
      }),
    editMatchUrl: ctx.router.url('editMatch', match.id),
    deleteMatchUrl: ctx.router.url('deleteMatch', match.id),
    indexUrl: ctx.router.url('matches'),
    matchInvitationUrl: ctx.router.url('matchInvitation', match.id),
  })
})

module.exports = router
