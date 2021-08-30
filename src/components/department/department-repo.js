const { findAll, findWith, store } = require('../../lib/database')

const table = 'departments'

module.exports = {
  findAll: findAll(table),
  findWith: findWith(table),
  store: store(table),
}
