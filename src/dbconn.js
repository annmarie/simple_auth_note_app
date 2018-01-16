const Q = require('q')
const dbs = require('../databases')

module.exports = {

  user: {
    // a query with a promise
    query: (query, qargs) => {
      const q = Q.defer()
      dbs.userdb.query(query, qargs, (err, res) => {
        if (err)
          q.reject(err)
        else
          q.resolve(res)
      })
      return q.promise
    },

    escape: (i) => dbs.userdb.escape(i),
  }
}
