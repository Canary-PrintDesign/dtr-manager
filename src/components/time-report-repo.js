const { db } = require('lib/database')

const table = 'time_records'

module.exports = {
  findAll: findAll(table)
}

function findAll (table) {
  return async function findAll (props) {
    return await db
      .column([
        'time_records.date',
        { department: 'departments.name' },
        { workStart: 'time_records.work_start' },
        { workStop: 'time_records.work_stop' },
        { lunchStart: 'time_records.lunch_start' },
        { lunchStop: 'time_records.lunch_stop' },
        { name: 'agents.name' },
        { position: 'agents.position' }
      ])
      .select()
      .table(table)
      .join('departments', 'time_records.department', '=', 'departments.id')
      .join('agents', 'time_records.agent', '=', 'agents.id')
      .where(builder => {
        Object.entries(props)
          .forEach(([key, value]) => {
            if (value) builder.where(`time_records.${key}`, value)
          })
      })
      .groupBy('date', 'departments.name', 'work_start', 'work_stop', 'lunch_start', 'lunch_stop', 'agents.name', 'position')
      .orderBy([{ column: 'date', order: 'desc' }, { column: 'department', order: 'asc' }, { column: 'name', order: 'asc' }])
  }
}
