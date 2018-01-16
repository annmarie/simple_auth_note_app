// - routes - //
const path = require('path')

const tools = { cleanInt, hasAuth, checkCredentials }

module.exports = (app, passport, express) => {
  app.use( "/locked",
    [hasAuth, express.static(path.join(__dirname, "../../locked"))])

  // routes
  require('./auth')(app, tools, passport)
  require('./users')(app, tools)
  require('./views')(app, tools)
}

function cleanInt(int, init) { return parseInt(int) || init }

function hasAuth(req, res, next) {
  if (req.isAuthenticated()) return next()
  res.redirect('/login?ret='+req.originalUrl)
}

function checkCredentials(req, res, next) {
  if (!req.body.email || (!req.body.password)) {
    req.flash(this.messageKey, 'Credentials not valid.')
  }
  next()
}
