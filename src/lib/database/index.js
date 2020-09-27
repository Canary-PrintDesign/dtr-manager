const debug = require('lib/debug')('database', { enable: 'dtr:*' })
const knex = require('knex')
const connection = require('../../../knexfile')
const { v4: uuid } = require('uuid')

const Knex = knex(connection)

module.exports = {
  db: Knex,
}
