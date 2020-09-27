const { db, findById, store } = require('lib/database')

const table = 'agents'

module.exports = {
  findAll: findAll(table),
  findById: findById(table),
  findByProp: findByProp(table),
  store: store(table)
}

function findAll (table) {
  return async function findAll ({ projectId }) {
    return await db
      .select()
      .table(table)
      .where('project', '=', projectId)
  }
}

function findByProp (table) {
  return async function findByProp (props) {
    return await db
      .select()
      .table(table)
      .where(builder =>
        Object.entries(props)
          .forEach(([key, value]) => builder.where(key, value))
      )
      .limit(1)
      .then(results => results[0])
  }
}
