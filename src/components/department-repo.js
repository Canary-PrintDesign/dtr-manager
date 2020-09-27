const { findById, store } = require('lib/database')

const table = 'departments'

module.exports = {
  findById: findById(table),
  store: store(table)
}
