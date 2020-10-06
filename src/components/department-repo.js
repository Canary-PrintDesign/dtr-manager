const { findAll, findById, store } = require('lib/database')

const table = 'departments'

module.exports = {
  findAll: findAll(table),
  findById: findById(table),
  store: store(table)
}
