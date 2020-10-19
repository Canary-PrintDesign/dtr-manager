const debug = require('lib/debug')('database')
const knex = require('knex')
const connection = require('../../../knexfile')
const { v4: uuid } = require('uuid')

const Knex = knex(connection)

exports.db = Knex

exports.uuid = uuid

exports.findAll = (table) =>
  async (props) => {
    debug('findAll', table, props)

    return await Knex
      .select()
      .table(table)
      .where(builder =>
        Object.entries(props)
          .forEach(([key, value]) => builder.where(key, value))
      )
  }

exports.findByProp = (table) =>
  async (props) =>
    await Knex
      .select()
      .table(table)
      .where(builder =>
        Object.entries(props).forEach(([key, value]) => builder.where(key, value))
      )
      .limit(1)
      .then(results => results[0])

exports.store = (table) =>
  async (data) => {
    debug('store', table, data)

    return (data.id)
      ? await update(table, data)
      : await create(table, data)
  }

// Private

async function create (table, data) {
  debug('create', table, data)

  data.id = uuid()
  data.created_at = new Date()
  data.updated_at = new Date()

  return await Knex(table)
    .insert({ ...data })
    .returning('*')
    .then(results => results[0])
}

async function update (table, data) {
  debug('update', table, data)

  data.updated_at = new Date()

  return await Knex(table)
    .where('id', data.id)
    .update({ ...data })
    .returning('*')
    .then(results => results[0])
}
