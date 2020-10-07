const { findById, findByProp, store } = require('lib/database')

const table = 'projects'

module.exports = {
  findByProp: findByProp(table),
  store: store(table)
}
