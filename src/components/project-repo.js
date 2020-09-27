const { findById, store } = require('lib/database')

const table = 'projects'

module.exports = {
  findById: findById(table),
  store: store(table)
}
