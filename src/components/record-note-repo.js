const { db, findById, store } = require('lib/database')

const table = 'record_notes'

module.exports = {
  findAll: findAll(table),
  findById: findById(table),
  store: store(table)
}

function findAll (table) {
  return async function findAll (props) {
    return await db
      .column([
        'record_notes.date',
        { note: db.raw('CONCAT_WS(\'\n\', record_notes.note)') },
        { department: 'departments.name' }
      ])
      .select()
      .table(table)
      .join('departments', 'record_notes.department', '=', 'departments.id')
      .where(builder => {
        Object.entries(props)
          .forEach(([key, value]) => {
            if (value) builder.where(`record_notes.${key}`, value)
          })
      })
      .groupBy('record_notes.date')
      .groupBy('departments.name')
      .groupBy('record_notes.note')
      .orderBy([
        { column: 'date', order: 'asc' },
        { column: 'department', order: 'asc' }
      ])
  }
}
