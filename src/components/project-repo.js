const { db, findById, store } = require('lib/database')

const table = 'projects'

module.exports = {
  findById: findById(table),
  findByProp: findByProp(table),
  store: store(table)
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
