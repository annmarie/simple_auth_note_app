// - root routes - //

module.exports = (app) => {

  app.get('/', (req, res) => {
    res.render('index.ejs', { me: req.user })
  })

  app.get('/login', (req, res) => {
    res.render('login.ejs', { me: req.user })
  })

  app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/login')
  })
}
