const { TimeRecord } = require('./time-record.js')

exports.findAll = findAll
async function findAll({ project, date, department }) {
  try {
    return await TimeRecord.query()
      .select(
        'departments.id as department',
        'departments.name as departmentName',
        'timeRecords.date as date',
        'timeRecords.workStart as workStart',
        'timeRecords.workStop as workStop',
        'timeRecords.lunchStart as lunchStart',
        'timeRecords.lunchStop as lunchStop',
        'agents.name as name',
        'agents.position as position'
      )
      .leftJoin('departments', 'departments.id', 'timeRecords.department')
      .leftJoin('agents', 'agents.id', 'timeRecords.agent')
      .where((builder) => {
        if (project) builder.where('timeRecords.project', project)
        if (date) builder.where({ date })
        if (department) builder.where('timeRecords.department', department)
      })
      .groupBy(
        'departments.id',
        'timeRecords.date',
        'departments.name',
        'timeRecords.workStart',
        'timeRecords.workStop',
        'timeRecords.lunchStart',
        'timeRecords.lunchStop',
        'agents.name',
        'agents.position'
      )
      .orderBy('timeRecords.date', 'DESC')
      .orderBy('departments.name', 'ASC')
      .orderBy('agents.name', 'ASC')
  } catch (err) {
    throw new Error(err)
  }
}
