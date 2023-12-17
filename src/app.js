const path = require('path')
const Koa = require('koa')
const koaBody = require('koa-body')
const koaLogger = require('koa-logger')
const koaFlashMessage = require('koa-flash-message').default
const koaStatic = require('koa-static')
const render = require('koa-ejs')
const session = require('koa-session')
const override = require('koa-override-method')
const mailer = require('./mailers')
const routes = require('./routes')
const orm = require('./models')

// App constructor
const app = new Koa()

const developmentMode = app.env === 'development'

app.keys = [
  'these secret keys are used to sign HTTP cookies',
  'to make sure only this app can generate a valid one',
  'and thus preventing someone just writing a cookie',
  "saying he is logged in when it's really not",
]

// expose ORM through context's prototype
app.context.orm = orm

/**
 * Middlewares
 */

// expose running mode in ctx.state
app.use((ctx, next) => {
  ctx.state.env = ctx.app.env
  return next()
})

// log requests
app.use(koaLogger())

// webpack middleware for dev mode only
if (developmentMode) {
  app.use(
    require('koa-webpack')({
      dev: {
        index: 'index.html',
        stats: {
          colors: true,
        },
      },
      hot: false,
    })
  )
}

app.use(koaStatic(path.join(__dirname, '..', 'build'), {}))

// expose a session hash to store information across requests from same client
app.use(
  session(
    {
      maxAge: 14 * 24 * 60 * 60 * 1000, // 2 weeks
    },
    app
  )
)

// flash messages support
app.use(koaFlashMessage)
app.use((ctx, next) => {
  ctx.state.notice = ctx.flashMessage.notice
  ctx.state.warning = ctx.flashMessage.warning
  return next()
})

// parse request body
app.use(
  koaBody({
    multipart: true,
    keepExtensions: true,
  })
)

// override method
app.use((ctx, next) => {
  ctx.request.method = override.call(ctx, ctx.request.body)
  return next()
})

// Configure EJS views
render(app, {
  root: path.join(__dirname, 'views'),
  layout: 'layout',
  viewExt: 'html.ejs',
  cache: !developmentMode,
})

mailer(app)

// Routing middleware
app.use(routes.routes())

module.exports = app
