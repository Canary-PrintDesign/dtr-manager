const { db, findById, store } = require('lib/database')

const table = 'agents'

module.exports = {
  findAll: findAll(table),
  findById: findById(table),
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
