// - databases - //
const mysql = require('mysql')
const conf = require('../config')

const dbs = conf.dbs

const connections = {
  // create mysql connection to the userdb
  userdb: mysql.createPool({
    host: dbs.userdb.host,
    user: dbs.userdb.user,
    password: dbs.userdb.password,
    database: dbs.userdb.dbname,
    multipleStatements: true
  })
}

// connect to userdb
connections.userdb.getConnection((err) => {
  if (err) {
    console.log("mysql userdb error")
    console.log(err.code);
    console.log(err.fatal);
  }
})

module.exports = connections
