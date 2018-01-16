const User = require('../src/models/user')
const Q = require('q')

const prompt = require('prompt');

const properties = [
  { name: 'email', type: 'string', },
  { name: 'password', type: 'string', hidden: true, replace: "*", },
  { name: 'admin', type: 'boolean', message: 'true or false', default: false, },
]

prompt.start();

prompt.get(properties, (err, result) => {
  const exit = (err) => {
    if (err) console.log(err)
    process.exit()
    return 1
  }

  if (err) exit(err)

  const newuser = new User()
  newuser.email = result.email
  newuser.password = result.password
  newuser.admin = result.admin

  return newuser.save()
  .then(usr => console.log(usr))
  .catch(err => console.log(err))
  .finally(() => process.exit())
})
