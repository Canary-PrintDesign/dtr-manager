const Agent = require('../components/agent')
const RecordNote = require('../components/record-note')
const TimeRecord = require('../components/time-record')
const { getDepartmentsForSelect, getDepartment } = require('./helpers')

module.exports = {
  index,
  create,
}

async function index({ project }) {
  return await getDepartmentsForSelect(project.id)
}

async function create({ project, formBody }) {
  const {
    department,
    date,
    entries = [],
    notes = '',
  } = handleFormValues(formBody)
  const reportDepartment = await getDepartment(department)

  const timeRecords = await createTimeRecords({
    date,
    department,
    entries,
    project: project.id,
  })
  const recordNote = await createRecordNote({
    date,
    department,
    notes,
    project: project.id,
  })

  return {
    project,
    date,
    recordNote,
    department: reportDepartment,
    records: timeRecords,
  }
}

// Private

async function findOrCreateAgent({ entry, department, project }) {
  const { name, position } = entry

  const agent = await Agent.findWith({ name, project, department })

  if (agent.id) return agent

  return await Agent.save({ name, position, department, project })
}

async function createRecordNote({ date, department, notes, project }) {
  const newRecordNote = await RecordNote.create({
    date,
    department,
    project,
    note: notes,
  })

  return await RecordNote.save(newRecordNote)
}

async function createTimeRecords({ date, entries, department, project }) {
  const records = entries.map(async (entry) => {
    const agent = await findOrCreateAgent({ entry, department, project })

    const timeRecord = await TimeRecord.create({
      ...entry,
      date,
      department,
      project,
      agent: agent.id,
    })

    const storedTimeRecord = await TimeRecord.save(timeRecord)

    return { ...storedTimeRecord, agent }
  })

  return Promise.all(records)
}

function handleFormValues(data) {
  console.log(data)
  return Object.entries(data)
    .flatMap(([key, value]) => ({ key, value }))
    .reduce((acc, item) => Object.assign(acc, { [item.key]: item.value }), {})
}
