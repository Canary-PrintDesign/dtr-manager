const { findById, store } = require('lib/database')

const table = 'agents'

module.exports = {
  findById: findById(table),
  store: store(table)
}
