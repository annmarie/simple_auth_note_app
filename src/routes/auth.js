// - authentication routes - //

module.exports = (app, tools, passport) => {

  app.get('/api/login', (req, res) => {
    let status = false
    let message = "You are not logged in."
    if (req.user) {
      status = true
      message = "You are logged in."
      flashMsg = req.flash('loginMessage').join(' ')
      if (flashMsg)
        message = flashMsg
    } else {
      status = false
      flashMsg = req.flash('loginMessage').join(' ')
      if (flashMsg)
        message = flashMsg
    }
    res.json({ status, message })
  })

  app.post('/api/login',
    tools.checkCredentials.bind({ messageKey: "loginMessage" }),
    passport.authenticate('site-login', {
      successRedirect : '/api/login',
      failureRedirect : '/api/login',
      failureFlash : true
  }))

  app.get('/api/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
  })

  app.get('/api/me', (req, res) => {
    const me = req.user || {error: "no user"}
    const status = (req.user) ? true : false
    res.json({ me, status })
  })
}
