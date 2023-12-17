const getStats = async (ctx, userId) => {
  const user = await ctx.orm.users.findById(userId, {
    attributes: { exclude: ['password'] },
  })
  const plays = await ctx.orm.userMatch.findAll({
    where: { userId: user.id },
  })
  const playsIds = plays.map(p => p.id)
  const evaluations = await ctx.orm.evaluation.findAll({
    include: [
      {
        model: ctx.orm.userMatch,
        as: 'player',
        include: [{ model: ctx.orm.position, include: [ctx.orm.sport] }],
      },
    ],
  })
  const evals = evaluations.filter(ev => playsIds.includes(ev.playerId))
  const stats = evals.reduce(
    (cs, ev) => ({
      ...cs,
      [ev.player.position ? ev.player.position.name : 'no definida']: [
        ...(cs[ev.player.position ? ev.player.position.name : 'no definida'] ||
          []),
        ev.stars,
      ],
    }),
    {}
  )
  return stats
}

module.exports = getStats
