const { findAll, findWith, store } = require('lib/database')

const table = 'agents'

module.exports = {
  findAll: findAll(table),
  findWith: findWith(table),
  store: store(table)
}
