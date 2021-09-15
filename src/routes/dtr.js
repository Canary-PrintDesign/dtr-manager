const Agent = require('../components/agent.js')
const RecordNote = require('../components/record-note.js')
const TimeRecord = require('../components/time-record.js')
const { getDepartmentsForSelect, getDepartment } = require('./route-helpers')

module.exports = async (fastify) => {
  fastify.post('/dtr', async (req, reply) => {
    const project = req.data.project
    const formBody = req.body
    const {
      department: departmentId,
      date,
      entries = [],
      notes = '',
    } = handleFormValues(formBody)

    if (!departmentId) throw new Error('nope')
    const department = await getDepartment(departmentId)

    req.session.set('time-report', {
      department: department[0],
      date,
      entries,
      notes,
      project,
    })

    return reply.view('time-record-review', {
      title: 'Review Time Sheet',
      date,
      notes,
      department: department[0],
      entries,
      project,
    })
  })

  fastify.get('/dtr/submit', async (req, reply) => {
    const { department, date, entries, notes, project } =
      req.session.get('time-report')

    const reportDepartment = await getDepartment({
      department: department.id,
      project: project.id,
    })

    const timeRecords = await createTimeRecords({
      date,
      department: department.id,
      entries,
      project: project.id,
    })

    const recordNote = await createRecordNote({
      date,
      department: department.id,
      notes,
      project: project.id,
    })

    req.session.delete('time-report')

    return reply.view('time-record-receipt', {
      title: 'Receipt of Time Sheet',
      date,
      notes: [recordNote.note],
      department,
      records: timeRecords,
      project,
    })
  })

  fastify.get('/dtr', async (req, reply) => {
    const project = req.data.project

    const { department, date, entries, notes } =
      req.session.get('time-report') || {}

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
  if (agent.length && agent[0].id) return agent[0]

  const newAgent = await Agent.save({ name, position, department, project })
  return newAgent
}

async function createRecordNote({ date, department, notes, project }) {
  return await RecordNote.save({
    date,
    department,
    project,
    note: notes,
  })
}

async function createTimeRecords({ date, entries, department, project }) {
  const records = []

  for (const entry of entries) {
    const agent = await findOrCreateAgent({ entry, department, project })
    const storedTimeRecord = await TimeRecord.save({
      ...entry,
      date,
      department,
      project,
      agent: agent.id,
    })

    records.push({ ...storedTimeRecord, agent })
  }

  return records
}

function handleFormValues(data) {
  return Object.entries(data)
    .flatMap(([key, value]) => ({ key, value }))
    .reduce((acc, item) => Object.assign(acc, { [item.key]: item.value }), {})
}
