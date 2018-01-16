const _ = require('lodash')
const Hashids = require('hashids')

const hashing = new Hashids('y2$Aw6', 6)

module.exports = {

  encode: (id) => (_.isNumber(id)) ? hashing.encode(id) : id,
  decode: (id) => (_.isNumber(id)) ? id : _.head(hashing.decode(id)),

}