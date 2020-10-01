const { db } = require('lib/database')

const table = 'time_records'

module.exports = {
  findAll: findAll(table)
}

function findAll (table) {
  return async function findAll ({ projectId }) {
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
      .where('time_records.project', '=', projectId)
      .orderBy([{ column: 'date', order: 'asc' }, { column: 'department', order: 'asc' }])
  }
}
