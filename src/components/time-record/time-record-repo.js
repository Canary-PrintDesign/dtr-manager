const { findByProp, store } = require('lib/database')

const table = 'time_records'

module.exports = {
  findByProp: findByProp(table),
  store: store(table)
}
