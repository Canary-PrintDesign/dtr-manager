const knex = require('knex')
const connection = require('../../knexfile')
const { randomUUID } = require('crypto')

const Knex = knex(connection)

exports.db = Knex

exports.uuid = randomUUID

exports.findAll = (table, db = Knex) => {
  return async (props) => {
    return await db
      .select()
      .table(table)
      .where((builder) =>
        Object.entries(props).forEach(([key, value]) =>
          builder.where(key, value)
        )
      )
  }
}

exports.findWith = (table, db = Knex) => {
  return async (props) =>
    await db
      .select()
      .table(table)
      .where((builder) =>
        Object.entries(props).forEach(([key, value]) =>
          builder.where(key, value)
        )
      )
      .limit(1)
      .then((results) => results[0])
}

exports.store = (table, db = Knex) => {
  return async (data) => {
    return data.id
      ? await update(table, data, db)
      : await create(table, data, db)
  }
}

// Private

async function create(table, data, db) {
  data.id = randomUUID()
  data.created_at = new Date()
  data.updated_at = new Date()

  return await db(table)
    .insert({ ...data })
    .returning('*')
    .then((results) => results[0])
}

async function update(table, data, db) {
  data.updated_at = new Date()

  return await db(table)
    .where('id', data.id)
    .update({ ...data })
    .returning('*')
    .then((results) => results[0])
}
