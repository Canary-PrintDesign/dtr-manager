const { findAll, findByProp, store } = require('lib/database')

const table = 'agents'

module.exports = {
  findAll: findAll(table),
  findByProp: findByProp(table),
  store: store(table)
}
