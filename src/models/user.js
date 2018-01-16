// - User Model - //
const bcrypt = require('bcrypt-nodejs')
const userdb = require('../dbconn').user
const Q = require('q')
const _ = require('lodash')
const hashids = require('../hashids')


class User {

  constructor(data) {
    this.id = hashids.encode(_.get(data, 'id', ""))
    this.email = _.get(data, 'email', "")
    this.password = _.get(data, 'password', "")
    this.password_digest = _.get(data, 'password_digest', "")
    this.admin = (_.get(data, 'admin', 0)) ? 1 : 0
    this.updated_at = _.get(data, 'updated_at', "")
    this.created_at = _.get(data, 'created_at', "")

    this.processPassword()
  }

  processPassword() {
    if (this.password) {
      this.password_digest = bcrypt.hashSync(this.password, bcrypt.genSaltSync(8), null)
      this.password = null
    }
  }

  hasValidPassword(password) {
    return bcrypt.compareSync(password, this.password_digest)
  }

  save() {
    const select = () => {
      const q = Q.defer()
      if (!this.id) {
        q.resolve({})
        return q.promise
      }

      const query = "SELECT * FROM user WHERE id=?"
      const qargs = [hashids.decode(this.id)]

      userdb.query(query, qargs).then(rows => {
        const rset = _.head(rows)
        if (!rset)
          q.reject("record not found")
        else
          q.resolve(new User(rset))
      })
      .catch(err => q.reject(err))
      return q.promise
    }

    const insert = () => {
      const q = Q.defer()
      if (!this.email) {
        q.reject("email is not found")
        return q.promise
      } else if (!this.password_digest) {
        q.reject("password not found")
        return q.promise
      }

      const query = "INSERT INTO user (email, password_digest, admin) VALUES (?, ?, ?)"
      const qargs = [this.email, this.password_digest, this.admin, hashids.decode(this.id)]

      return userdb.query(query, qargs).then(rows => {
        this.id = hashids.encode(_.get(rows, "insertId"))
        return select()
      })
    }

    const update = (user) => {
      const email = (this.email) ? this.email : user.email
      const admin = (this.admin) ? this.admin : user.admin
      const pswd = (this.password_digest) ?
        this.password_digest : user.password_digest

      const q = Q.defer()
      if ((email == user.email) &&
          (admin == user.admin) &&
          (pswd == user.password_digest)) {
        q.reject("nothing to update")
        return q.promise
      }

      const query = "UPDATE user " +
        " SET email=?, admin=?, password_digest=? " +
        " WHERE id=? "
      const qargs = [email, admin, pswd, hashids.decode(this.id)]

      return userdb.query(query, qargs).then(() => select())
    }

    this.processPassword()

    return select().then(user => _.isEmpty(user) ? insert() : update(user))
  }
}

module.exports = User
