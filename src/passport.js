const LocalStrategy = require('passport-local').Strategy
const Users = require('./collections/users')
const User = require('./models/user')

module.exports = (passport) => {

  // serialize the user for the session
  passport.serializeUser((user, next) => {
    next(null, user.id)
  })

  // deserialize the user's session
  passport.deserializeUser((id, next) => {
    new Users({id}).findOne()
    .then(user => next(null, user))
    .catch(err => next(err))
  })

  passport.use('site-login', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, (req, email, password, next) => {
    process.nextTick(() => { // asynchronous

      // lowercase email
      email = email.toLowerCase()

      // find user
      new Users({email}).findOne()
      .then(user => {
        if (!user)
          return next(null, false, req.flash('loginMessage', 'User not found.'))

        if (!user.hasValidPassword(password))
          return next(null, false, req.flash('loginMessage', 'Wrong password.'))

        next(null, user, req.flash('loginMessage', 'Login Successful.'))
      })
      .catch(err => {
        next(null, false, req.flash('loginMessage', 'User not found.'))
      })
    })
  }))

  passport.use('site-signup', new LocalStrategy({
    usernameField : 'email',
    passwordField : 'password',
    passReqToCallback : true
  }, (req, email, password, next) => {
    process.nextTick(() => { // asynchronous
      // if the user is logged in log them out
      if (req.user) req.logout()

      // lowercase email
      email = email.toLowerCase()

      // is there already a user with that email?
      new Users({email}).findOne()

      // user found
      .then(() => {

        next(null, false, req.flash('signupMessage', 'That email is already taken.'))
      })

      // user not found
      .catch(() => {

        // create new user
        const newuser = new User()
        newuser.email = email
        newuser.password = password

        newuser.save()
        .then(user => {
          next(null, user, req.flash('signupMessage', 'Thank You For Signing Up!'))
        })
        .catch(err => {
          next(null, false, req.flash('signupMessage', 'Something went wrong.'))
        })
      })
    })
  }))
}
