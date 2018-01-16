const _ = require('lodash')


const getSettings = (file) => {
  let rset = {}
  try { rset = require(file) } catch(e) {}
  return rset
}

const settings = getSettings('./settings')
const overrides = getSettings('./local.settings')

module.exports = _.defaultsDeep(overrides, settings)
