const sendWelcomeEmail = require('../mailers/welcome')
const KoaRouter = require('koa-router')
const fileStorage = require('../services/file-storage')
const uuid = require('uuid/v4')
const loadNotifications = require('../helpers/loadNotifications')
const pkg = require('../../package.json')

const router = new KoaRouter()

router.get('home', '/', async ctx => {
  if (ctx.session.user) {
    const user = await ctx.orm.users.findById(ctx.session.user.id)
    if (user) {
      return ctx.redirect('play')
    }
  }
  ctx.session = null
  return ctx.render('welcome/home', {
    appVersion: pkg.version,
    signupUrl: ctx.router.url('signup'),
  })
})

router.post('login', 'login', async ctx => {
  const username = ctx.request.body.fields.username
  const password = ctx.request.body.fields.password
  const user = await ctx.orm.users.findOne({ where: { username } })
  if (user) {
    const isPasswordCorrect = await user.checkPassword(password)
    if (isPasswordCorrect) {
      ctx.session.user = { id: user.id }
      return ctx.redirect('play')
    }
  }
  ctx.flashMessage.warning = 'Has ingresado datos incorrectos.'
  return ctx.redirect('/')
})

router.get('signup', 'signup', async ctx => {
  if (ctx.session.user) {
    ctx.redirect('profile')
  }
  const user = ctx.orm.users.build()
  await ctx.render('welcome/signup', {
    homeUrl: '/',
    user,
  })
})

router.post('createUser', 'signup', async ctx => {
  const developmentMode = ctx.state.env === 'development'
  if (developmentMode) {
    ctx.request.body.fields.confirmed = true
  } else {
    ctx.request.body.fields.confirmed = false
  }
  const token = uuid()
  const fileLink =
    ctx.request.body.files.upload.name.length != 0
      ? `https://storage.googleapis.com/sportfinder/${
          ctx.request.body.files.upload.name
        }`
      : ''
  const user = ctx.orm.users.build({
    ...ctx.request.body.fields,
    photoId: fileLink,
    token,
  })

  try {
    if (fileLink) {
      await fileStorage.upload(ctx.request.body.files.upload)
    }
    await user.save({
      fields: [
        'username',
        'password',
        'name',
        'surname',
        'mail',
        'pid',
        'photoId',
        'token',
        'confirmed',
      ],
    })
    ctx.session.user = { id: user.id }
    const id = user.id
    const key = user.token
    if (!developmentMode) {
      sendWelcomeEmail(ctx, {
        user,
        confirmateAccountUrl: `https://sportfinder-app.herokuapp.com/users/${
          id
        }/${key}`,
      })
      ctx.flashMessage.notice = 'Revisa tu mail para confirmar tu cuenta.'
    }
    ctx.redirect('profile')
  } catch (validationError) {
    await ctx.render('welcome/signup', {
      homeUrl: '/',
      user: ctx.orm.users.build(ctx.request.body.fields),
      errors: validationError.errors,
    })
  }
})

router.delete('deleteUser', 'profile', async ctx => {
  if (ctx.session.user) {
    const user = await ctx.orm.users.findById(ctx.session.user.id)
    await user.destroy()
    ctx.session = null
  }
  return ctx.redirect('/')
})

router.post('updateUser', 'profile', async ctx => {
  const user = await ctx.orm.users.findById(ctx.session.user.id)
  try {
    await fileStorage.upload(ctx.request.body.files.upload)
    await user.update({
      username: ctx.request.body.fields.username,
      mail: ctx.request.body.fields.mail,
      name: ctx.request.body.fields.name,
      surname: ctx.request.body.fields.surname,
      pid: ctx.request.body.fields.pid,
      photoId: `https://storage.googleapis.com/sportfinder/${
        ctx.request.body.files.upload.name
      }`,
    })
    ctx.flashMessage.notice = 'Tu perfil ha sido actualizado.'
    return ctx.redirect('profile')
  } catch (validationError) {
    return ctx.render('welcome/editProfile', {
      user,
      errors: validationError.errors,
      updateUrl: ctx.router.url('updateUser'),
      deleteUrl: ctx.router.url('deleteUser'),
      profileUrl: ctx.router.url('showUser'),
    })
  }
})

router.get('editUser', 'profile/edit', async ctx => {
  const user = await ctx.orm.users.findById(ctx.session.user.id)
  if (user) {
    ctx.state.currentUser = user
    await ctx.render('welcome/editProfile', {
      user,
      updateUrl: ctx.router.url('updateUser'),
      deleteUrl: ctx.router.url('deleteUser'),
      profileUrl: ctx.router.url('showUser'),
    })
  } else {
    ctx.session = null
    ctx.redirect('/')
  }
})

router.get('confirmateAccount', 'users/:id/:key', async ctx => {
  const user = await ctx.orm.users.findById(ctx.params.id)
  if (user && ctx.params.key === user.token) {
    await user.update({ confirmed: true })
    ctx.flashMessage.notice = '¡Estás listo para jugar!'
    return ctx.redirect(ctx.router.url('matches'))
  }
  return ctx.throw(403)
})

router.get('sendEmail', 'sendConfirmationEmail', async ctx => {
  const id = ctx.session.user.id
  const user = await ctx.orm.users.findById(id)
  if (!user) {
    ctx.session = null
    ctx.flashMessage.warning = 'No tienes los permisos.'
    return ctx.redirect('/')
  }
  const key = user.token
  await sendWelcomeEmail(ctx, {
    user,
    confirmateAccountUrl: `https://sportfinder-app.herokuapp.com/users/${id}/${
      key
    }`,
  })
  ctx.flashMessage.notice = `Se ha enviado nuevamente el mail de confirmación a ${
    user.mail
  }.`
  return ctx.redirect(ctx.router.url('profile'))
})

router.get('showUser', 'profile', async ctx => {
  const user = await ctx.orm.users.findById(ctx.session.user.id)
  if (user) {
    ctx.state.currentUser = user
    const notifications = await loadNotifications(ctx)
    switch (ctx.accepts('html', 'json')) {
      case 'html':
        await ctx.render('welcome/profile', {
          user,
          notifications,
          editUrl: ctx.router.url('editUser'),
          logoutUrl: ctx.router.url('logout'),
          startUrl: '/play',
          sendEmailUrl: ctx.router.url('sendEmail'),
        })
        break
      case 'json':
        ctx.body = { notifications, user }
        break
      default:
    }
  } else {
    ctx.session = null
    ctx.redirect('/')
  }
})

router.get('profile.file', '/file', ctx => {
  ctx.body = fileStorage.download(ctx.query.file)
  ctx.response.type = 'image/png'
})

router.get('logout', 'logout', async ctx => {
  ctx.session = null
  ctx.redirect('/')
})

module.exports = router
