const { findById, store } = require('lib/database')

const table = 'record_notes'

module.exports = {
  findById: findById(table),
  store: store(table)
}
