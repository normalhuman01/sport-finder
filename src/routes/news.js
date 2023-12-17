const KoaRouter = require('koa-router')
const {
  getFutsal,
  getSoccer,
  getTennis,
} = require('../helpers/sportradarFetcher')

const router = new KoaRouter()

router.get('news', '/', async ctx => {
  await ctx.render('news/home', {
    // badmintonUrl: ctx.router.url('badminton'),
    futsalUrl: ctx.router.url('futsal'),
    soccerUrl: ctx.router.url('soccer'),
    tennisUrl: ctx.router.url('tennis'),
  })
})

router.get('soccer', '/soccer', async ctx => {
  const { tournaments } = await getSoccer.tournaments()
  return ctx.render('news/soccer/index', {
    tournaments: tournaments.sort(
      (a, b) =>
        a.current_season.end_date >= b.current_season.end_date ? -1 : 1
    ),
    tournamentUrl: ({ id }) => ctx.router.url('soccerTournament', { id }),
    backButtonUrl: ctx.router.url('news'),
  })
})

router.get('soccerTournament', '/soccer/:id', async ctx => {
  const { tournament, groups } = await getSoccer.tournament(ctx.params.id)
  return ctx.render('news/soccer/show', {
    tournament: { groups, tournament },
    backButtonUrl: ctx.router.url('soccer'),
  })
})

router.get('futsal', '/futsal', async ctx => {
  const { tournaments } = await getFutsal.tournaments()
  return ctx.render('news/futsal/index', {
    tournaments: tournaments.sort(
      (a, b) =>
        a.current_season.end_date >= b.current_season.end_date ? -1 : 1
    ),
    tournamentUrl: ({ id }) => ctx.router.url('futsalTournament', { id }),
    backButtonUrl: ctx.router.url('news'),
  })
})

router.get('futsalTournament', '/futsal/:id', async ctx => {
  const { tournament, groups } = await getFutsal.tournament(ctx.params.id)
  return ctx.render('news/futsal/show', {
    tournament: { groups, tournament },
    backButtonUrl: ctx.router.url('futsal'),
  })
})

router.get('tennis', '/tennis', async ctx => {
  const { tournaments } = await getTennis.tournaments()
  return ctx.render('news/tennis/index', {
    tournaments: tournaments.sort(
      (a, b) =>
        a.current_season.end_date >= b.current_season.end_date ? -1 : 1
    ),
    tournamentUrl: ({ id }) => ctx.router.url('tennisTournament', { id }),
    backButtonUrl: ctx.router.url('news'),
  })
})

router.get('tennisTournament', '/tennis/:id', async ctx => {
  const { tournament, competitors } = await getTennis.tournament(ctx.params.id)
  return ctx.render('news/tennis/show', {
    tournament: { groups: competitors, tournament },
    backButtonUrl: ctx.router.url('tennis'),
  })
})

module.exports = router
