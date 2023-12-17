const KoaRouter = require('koa-router')
const checkCaptain = require('../helpers/checkCaptain')
const router = new KoaRouter()

router.get('teams', '/', async ctx => {
  const teams = await ctx.orm.team.findAll()
  await ctx.render('teams/index', {
    teams,
    teamUrl: team => ctx.router.url('team', { id: team.id }),
    newTeamUrl: ctx.router.url('newTeam'),
  })
})

router.delete('removeMember', '/:id/memberDelete', async ctx => {
  const user = await ctx.orm.users.findById(ctx.request.body.userid)
  const team = await ctx.orm.team.findById(ctx.params.id, {
    include: [
      {
        model: ctx.orm.userTeam,
        include: ctx.orm.users,
      },
    ],
  })
  const sport = await ctx.orm.sport.findById(team.sportId)
  const members = team.userTeams
  if (user) {
    try {
      if (!checkCaptain(members, user)) {
        const joinTuple = await ctx.orm.userTeam.findOne({
          where: { userId: user.id, teamId: team.id },
        })
        await joinTuple.destroy()
        ctx.flashMessage.notice = 'El miembro ha sido eliminado del equipo.'
        ctx.redirect(ctx.router.url('team', { id: team.id }))
      } else {
        members.forEach(member => {
          member.destroy()
        })
        await team.destroy()
        ctx.flashMessage.notice =
          'Se ha eliminado el equipo debido a que el capitán lo abandonó'
        await ctx.redirect(ctx.router.url('teams'))
      }
    } catch (typeError) {
      await ctx.render('teams/show', {
        errors: typeError.errors,
        team,
        sport,
        members,
        editTeamUrl: ctx.router.url('editTeam', team.id),
        deleteTeamUrl: ctx.router.url('deleteTeam', team.id),
        indexUrl: ctx.router.url('teams'),
        addMemberUrl: ctx.router.url('addMember', team.id),
        removeMemberUrl: ctx.router.url('removeMember', team.id),
      })
    }
  } else {
    ctx.redirect(ctx.router.url('team', { id: team.id }))
  }
})

router.delete('deleteTeam', '/:id', async ctx => {
  const team = await ctx.orm.team.findById(ctx.params.id)
  await team.destroy()
  ctx.flashMessage.notice = 'El equipo fue eliminado exitosamente.'
  await ctx.redirect(ctx.router.url('teams'))
})

router.get('newTeam', '/new', async ctx => {
  const team = ctx.orm.team.build()
  const sports = await ctx.orm.sport.findAll()
  await ctx.render('/teams/new', {
    team,
    sports,
    createTeamUrl: ctx.router.url('createTeam'),
    indexUrl: ctx.router.url('teams'),
  })
})

router.post('createTeam', '/', async ctx => {
  const sports = await ctx.orm.sport.findAll()
  try {
    const sport = await ctx.orm.sport.findOne({
      where: { name: ctx.request.body.sportname },
    })
    const team = await ctx.orm.team.create({
      name: ctx.request.body.name,
      sportId: sport.id,
    })
    await ctx.orm.userTeam.create({
      teamId: team.id,
      userId: ctx.state.currentUser.id,
      captain: true,
    })
    ctx.redirect(ctx.router.url('team', { id: team.id }))
  } catch (validationError) {
    await ctx.render('/teams/new', {
      sports,
      team: ctx.orm.team.build(ctx.request.body),
      errors: validationError.errors,
      createTeamUrl: ctx.router.url('createTeam'),
      indexUrl: ctx.router.url('teams'),
    })
  }
})

router.post('addMember', '/:id', async ctx => {
  const user = await ctx.orm.users.findOne({
    where: { username: ctx.request.body.name },
  })
  const team = await ctx.orm.team.findById(ctx.params.id, {
    include: [
      {
        model: ctx.orm.userTeam,
        include: ctx.orm.users,
      },
    ],
  })
  const sport = await ctx.orm.sport.findById(team.sportId)
  const members = team.userTeams

  if (user) {
    // Si es que existe el usuario
    const invitation = await ctx.orm.teamInvitation.findOne({
      where: { userId: user.id, teamId: team.id },
    })
    if (invitation) {
      invitation.destroy()
    }

    try {
      // Intentamos crear la tupla en la tabla de userTeam
      await ctx.orm.userTeam.create({ teamId: team.id, userId: user.id })
      switch (ctx.accepts('html', 'json')) {
        case 'html':
          return ctx.redirect(ctx.router.url('team', { id: team.id }))
        case 'json':
          ctx.body = { success: true, error: '' }
          break
        default:
      }
    } catch (validationError) {
      // En caso de que el par usuario-equipo ya exista (se intentó agregar nuevamente un miembro)
      switch (ctx.accepts('html', 'json')) {
        case 'html':
          await ctx.render('teams/show', {
            errors: validationError.errors,
            team,
            sport,
            members,
            editTeamUrl: ctx.router.url('editTeam', team.id),
            deleteTeamUrl: ctx.router.url('deleteTeam', team.id),
            indexUrl: ctx.router.url('teams'),
            addMemberUrl: ctx.router.url('addMember', team.id),
            removeMemberUrl: ctx.router.url('removeMember', team.id),
          })
          break
        case 'json':
          ctx.body = { success: false, error: 'Ya eres parte de este equipo.' }
          break
        default:
      }
    }
  } else {
    // En caso de que no exista el usuario ingresado
    ctx.redirect(ctx.router.url('team', { id: team.id }))
  }
})

router.get('editTeam', '/:id/edit', async ctx => {
  const team = await ctx.orm.team.findById(ctx.params.id)
  const sports = await ctx.orm.sport.findAll()
  await ctx.render('teams/edit', {
    team,
    sports,
    updateTeamUrl: ctx.router.url('updateTeam', team.id),
    showTeamUrl: ctx.router.url('team', team.id),
  })
})

router.patch('promoteMember', '/:id/:userid', async ctx => {
  const team = await ctx.orm.team.findById(ctx.params.id, {
    include: [
      {
        model: ctx.orm.userTeam,
      },
    ],
  })
  const joinTuple = await ctx.orm.userTeam.find({
    where: {
      teamId: ctx.params.id,
      userId: ctx.params.userid,
    },
  })
  const captainId = team.getCaptainId()
  const captainJoinTuple = await ctx.orm.userTeam.find({
    where: {
      teamId: ctx.params.id,
      userId: captainId,
    },
  })
  await joinTuple.update({ captain: true })
  await captainJoinTuple.update({ captain: false })

  ctx.flashMessage.notice = 'El usuario ha sido promovido.'
  ctx.redirect(ctx.router.url('team', { id: ctx.params.id }))
})

router.patch('updateTeam', '/:id', async ctx => {
  const team = await ctx.orm.team.findById(ctx.params.id)
  try {
    await team.update({
      name: ctx.request.body.name,
      sportId: ctx.request.body.sportid,
    })
    ctx.flashMessage.notice = 'El equipo ha sido actualizado.'
    ctx.redirect(ctx.router.url('team', { id: team.id }))
  } catch (validationError) {
    await ctx.render('teams/edit', {
      team,
      errors: validationError.errors,
      updateTeamUrl: ctx.router.url('updateTeam', { id: team.id }),
      showTeamUrl: ctx.router.url('team', team.id),
    })
  }
})

router.get('team', '/:id', async ctx => {
  const team = await ctx.orm.team.findById(ctx.params.id, {
    include: [
      {
        model: ctx.orm.userTeam,
        include: ctx.orm.users,
      },
    ],
  })
  const sport = await ctx.orm.sport.findById(team.sportId)
  const members = team.userTeams
  await ctx.render('teams/show', {
    team,
    sport,
    members,
    isAdmin: ctx.state.currentUser.isAdmin(),
    isCaptain: checkCaptain(members, ctx.state.currentUser),
    editTeamUrl: ctx.router.url('editTeam', team.id),
    deleteTeamUrl: ctx.router.url('deleteTeam', team.id),
    indexUrl: ctx.router.url('teams'),
    addMemberUrl: ctx.router.url('addMember', team.id),
    removeMemberUrl: ctx.router.url('removeMember', team.id),
    promoteMemberUrl: `/teams/${team.id}/`,
    inviteMemberUrl: ctx.router.url('teamInvitation', team.id),
  })
})

module.exports = router
