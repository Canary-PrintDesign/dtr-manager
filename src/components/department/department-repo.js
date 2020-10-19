const { findAll, findByProp, store } = require('lib/database')

const table = 'departments'

module.exports = {
  findAll: findAll(table),
  findByProp: findByProp(table),
  store: store(table)
}
