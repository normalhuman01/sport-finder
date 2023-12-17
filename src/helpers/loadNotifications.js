module.exports = async ctx => {
  if (ctx.state.currentUser) {
    const matchInvitations = await ctx.orm.matchInvitation.findAll({
      where: { userId: ctx.state.currentUser.id },
    })
    const teamInvitations = await ctx.orm.teamInvitation.findAll({
      where: { userId: ctx.state.currentUser.id },
    })
    let notifications = matchInvitations.reduce(
      (cinv, invitation) => [
        ...cinv,
        {
          message: `${
            invitation.author
          } te ha invitado a unirte a una partida.`,
          showUrl: `/play/${invitation.matchId}`,
          declineUrl: `/invitations/match/${invitation.matchId}`,
          acceptUrl: `/play/${invitation.matchId}/players`,
        },
      ],
      []
    )
    notifications = notifications.concat(
      teamInvitations.reduce(
        (cinv, invitation) => [
          ...cinv,
          {
            message: `${
              invitation.author
            } te ha invitado a unirte a un equipo.`,
            showUrl: `/teams/${invitation.teamId}`,
            declineUrl: `/invitations/team/${invitation.teamId}`,
            acceptUrl: `/teams/${invitation.teamId}`,
          },
        ],
        []
      )
    )
    return notifications
  }
  return []
}
