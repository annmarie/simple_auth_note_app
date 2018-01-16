// - server - //
const express = require('express')
const session = require('express-session')
const passport = require('passport')
const RedisStore = require('connect-redis')(session)
const flash = require('connect-flash')
const favicon = require('serve-favicon')
const morgan = require('morgan')
const rfs = require('rotating-file-stream')
const fs = require('fs')
const cookieParser = require('cookie-parser')
const bodyParser = require('body-parser')
const path = require('path')

const app = express()
const port = process.env.PORT || 3500

app.use(cookieParser())
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))

// set logging
const logDir = path.join(__dirname, 'log')
fs.existsSync(logDir) || fs.mkdirSync(logDir)
app.use(morgan('combined', {
  stream: rfs('access.log', { interval: '1d', path: logDir })
}))
app.use(morgan('dev'))

// views
app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'src/views'))

// authentication setup
require('./src/passport')(passport)
app.use(session({
    secret: process.env.SESSIONSECRET || 'x1tgUSY',
    cookie: { maxAge: (360000 * 24) * 3 },
    rolling: true,
    resave: true,
    saveUninitialized: true,
    store: new RedisStore({
      url: process.env.REDISURL || 'redis://localhost:6379'
    }),
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

// favicon.ico
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')))

// set routes
app.use('/', express.static(path.join(__dirname, '/public')))
app.use('/gen', express.static(path.join(__dirname, '/gen')))
require('./src/routes')(app, passport, express)

// listen
app.listen(port)
console.log('Listening on port ' + port)
