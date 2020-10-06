const { findById, findByProp, store } = require('lib/database')

const table = 'projects'

module.exports = {
  findById: findById(table),
  findByProp: findByProp(table),
  store: store(table)
}
