const { findWith, store } = require('lib/database')

const table = 'time_records'

module.exports = {
  findWith: findWith(table),
  store: store(table)
}
