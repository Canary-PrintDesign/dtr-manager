const { findByProp, store } = require('lib/database')
const table = 'session_tokens'

module.exports = {
  findByProp: findByProp(table),
  store: store(table)
}
