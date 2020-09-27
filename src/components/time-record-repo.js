const { findById, store } = require('lib/database')

const table = 'time_records'

module.exports = {
  findById: findById(table),
  store: store(table)
}
