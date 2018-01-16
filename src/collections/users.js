// - Users Collection - //
const userdb = require('../dbconn').user
const User = require('../models/user')
const Q = require('q')
const _ = require('lodash')
const hashids = require('../hashids')


class Users {

  constructor(data) {
    this.id = _.get(data, 'id', "")
    this.email = _.get(data, 'email', "")
    this.limit = _.get(data, 'limit', 10)
    this.offset = _.get(data, 'offset', 0)
  }

  findOne() {
    const q = Q.defer()
    const key = (this.id) ? 'id' : (this.email) ? 'email' : null
    if (!key) {
      q.reject("request not valid")
      return q.promise
    }

    const data = this
    data.id = hashids.decode(data.id)
    const qtmpl = "SELECT * FROM user WHERE {key}=? LIMIT ?"
    const query = _.replace(qtmpl, "{key}", key)
    const qargs = [data[key], 1]
    return this._queryOne(query, qargs)
  }

  findMany() {
    const q = Q.defer()
    const key = (this.id) ? 'id' : (this.email) ? 'email' : null
    if (!key)
      return q.reject("request not valid")

    const data = this
    data.id = _.map(data.id, (id) => hashids.decode(id))
    const qtmpl = "SELECT * FROM user WHERE {key} IN (?) LIMIT ? OFFSET ?"
    const query = _.replace(qtmpl, "{key}", key)
    const qargs = [data[key], this.limit, this.offset]

    return this._queryMany(query, qargs)
  }

  findAll() {
    const query = "SELECT * FROM user LIMIT ? OFFSET ?"
    const qargs = [this.limit, this.offset]

    return this._queryMany(query, qargs)
  }

  _queryMany(query, qargs) {
    const q = Q.defer()
    userdb.query(query, qargs).then(rows => {
      if (!rows.length) {
        q.reject("no records found")
      } else {
        const users = _.map(rows, (row) => new User(row))
        q.resolve(users)
      }
    }).catch(err => q.reject(err))
    return q.promise
  }

  _queryOne(query, qargs) {
    const q = Q.defer()
    userdb.query(query, qargs).then(rows => {
      const data = _.head(rows)
      if (!data)
        q.reject("record not found")
      else
        q.resolve(new User(data))
    }).catch(err => q.reject(err))
    return q.promise
  }
}

module.exports = Users
