module.exports = function sendWelcomeEmail(
  ctx,
  { user, confirmateAccountUrl }
) {
  return ctx.sendMail(
    'welcome',
    { to: user.mail, subject: 'Bienvenido a Sportfinder!' },
    {
      user,
      confirmateAccountUrl,
    }
  )
}
