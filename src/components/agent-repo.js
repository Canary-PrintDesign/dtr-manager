const { findAll, findById, findByProp, store } = require('lib/database')

const table = 'agents'

module.exports = {
  findAll: findAll(table),
  findById: findById(table),
  findByProp: findByProp(table),
  store: store(table)
}
