const KoaRouter = require('koa-router')

const api = require('./routes/api')
const welcome = require('./routes/welcome')
const hello = require('./routes/hello')
const sports = require('./routes/sports')
const clubs = require('./routes/clubs')
const teams = require('./routes/teams')
const matches = require('./routes/matches')
const users = require('./routes/users')
const admin = require('./routes/admin')
const invitations = require('./routes/invitations')
const news = require('./routes/news')

const checkLogin = require('./helpers/checkLogin')
const checkAccountConfirmation = require('./helpers/checkAccountConfirmation')
const notificationManager = require('./helpers/notificationManager')
const checkRole = require('./helpers/checkRole')

const router = new KoaRouter()

//api
router.use('/api', api.routes())

// public
router.use('/', welcome.routes())
router.use('/hello', hello.routes())
// check login
router.use(checkLogin)

// check account confirmation
router.use(checkAccountConfirmation)

// load notifications
router.use(notificationManager)

// private

router.use('/sports', sports.routes())
router.use('/clubs', clubs.routes())
router.use('/teams', teams.routes())
router.use('/play', matches.routes())
router.use('/users', users.routes())
router.use('/invitations', invitations.routes())
router.use('/news', news.routes())

// check role
router.use(checkRole)

// admin
router.use('/admin', admin.routes())

module.exports = router
