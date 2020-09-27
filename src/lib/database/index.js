const debug = require('lib/debug')('database', { enable: 'dtr:*' })
const knex = require('knex')
const connection = require('../../../knexfile')
const { v4: uuid } = require('uuid')

const Knex = knex(connection)

module.exports = {
  db: Knex,
  uuid: uuid,

  findById,
  store
}

function findById (table) {
  return async function findById (id) {
    debug('findById', table, id)

    return await Knex
      .select()
      .table(table)
      .where({ id })
      .limit(1)
      .then(results => results[0])
  }
}

function store (table) {
  return async function store (data) {
    debug('store', table, data)

    return (data.id)
      ? await update(table, data)
      : await create(table, data)
  }
}

async function create (table, data) {
  debug('create', table, data)

  data.id = uuid()

  return await Knex(table)
    .insert({ ...data })
    .returning('*')
    .then(results => results[0])
}

async function update (table, data) {
  debug('update', table, data)

  return await Knex(table)
    .where('id', data.id)
    .update({ ...data })
    .returning('*')
    .then(results => results[0])
}
