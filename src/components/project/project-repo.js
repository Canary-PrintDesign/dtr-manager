const { findWith, store } = require('../../lib/database')

const table = 'projects'

module.exports = {
  findWith: findWith(table),
  store: store(table)
}
