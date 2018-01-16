// - api routes - //
const Users = require('../collections/users')

module.exports = (app, tools) => {

  app.get('/api/user/:id', tools.hasAuth, (req, res) => {
    const id = req.params.id
    new Users({ id }).findOne()
    .then(user => res.json(user))
    .catch(err => res.status(500).send('500 error'))
  })

  app.get('/api/user', tools.hasAuth, (req, res) => {
    const limit = tools.cleanInt(req.query.limit, 10)
    const offset = tools.cleanInt(req.query.offset, 0)
    new Users({ limit, offset }).findAll()
    .then(users => res.json(users))
    .catch(err => res.status(500).send('500 error'))
  })
}
