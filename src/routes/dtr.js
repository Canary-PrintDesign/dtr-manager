const Agent = require('../components/agent')
const RecordNote = require('../components/record-note')
const TimeRecord = require('../components/time-record')
const { getDepartmentsForSelect, getDepartment } = require('./route-helpers')

module.exports = async (fastify) => {
  fastify.post('/dtr', async (req, reply) => {
    const project = req.data.project
    const formBody = req.body

    const {
      department,
      date,
      entries = [],
      notes = '',
    } = handleFormValues(formBody)

    req.session.set('time-report', {
      department,
      date,
      entries,
      notes,
      project,
    })

    return reply.view('time-record-review', {
      title: 'Review Time Sheet',
      date,
      notes,
      department,
      entries,
      project,
    })
  })

  fastify.get('/dtr/submit', async (req, reply) => {
    const { department, date, entries, notes, project } =
      req.session.get('time-report')

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

    req.session.delete('time-report')

    return reply.view('time-record-receipt', {
      title: 'Receipt of Time Sheet',
      date,
      recordNote,
      department: reportDepartment,
      records: timeRecords,
      project,
    })
  })

  fastify.get('/dtr', async (req, reply) => {
    const project = req.data.project

    const { department, date, entries, notes } = req.session.get('time-report')

    const departments = await getDepartmentsForSelect(project.id)

    return reply.view('time-record', {
      title: 'New Time Sheet',
      departments,
      project,

      department,
      date,
      entries,
      notes,
    })
  })
}

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
  return Object.entries(data)
    .flatMap(([key, value]) => ({ key, value }))
    .reduce((acc, item) => Object.assign(acc, { [item.key]: item.value }), {})
}
