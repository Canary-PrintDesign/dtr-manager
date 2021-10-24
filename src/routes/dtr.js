const Agent = require('../components/agent.js')
const RecordNote = require('../components/record-note.js')
const TimeRecord = require('../components/time-record.js')
const { getDepartmentsForSelect, getDepartment } = require('./route-helpers')
const createError = require('http-errors')

module.exports = async (fastify) => {
  fastify.post('/dtr', async (req, reply) => {
    if (!req.user.isCrew) return createError(401)

    const project = req.data.project
    const formBody = req.body
    const {
      department: departmentId,
      date,
      entries = [],
      notes = '',
    } = handleFormValues(formBody)

    if (!departmentId) throw new Error('Department not found')
    const department = await getDepartment({
      department: departmentId,
      project: project.id,
    })

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
      user: req.user,
    })
  })

  fastify.get('/dtr/submit', async (req, reply) => {
    if (!req.user.isCrew) return createError(401)

    const { department, date, entries, notes, project } =
      req.session.get('time-report')

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

    req.session.set('time-report', null)

    return reply.view('time-record-receipt', {
      title: 'Receipt of Time Sheet',
      date,
      notes: [recordNote.note],
      department,
      records: timeRecords,
      project,
      user: req.user,
    })
  })

  fastify.get('/dtr', async (req, reply) => {
    if (!req.user.isCrew) return createError(401)

    const project = req.data.project

    let { department, isCrew, isAdmin, isProjectAdmin } = req.user
    const {
      department: reportDepartment,
      date,
      entries = [],
      notes,
    } = req.session.get('time-report') || {}

    if ((isAdmin || isProjectAdmin) && reportDepartment) {
      department = reportDepartment
    }

    const departments =
      isAdmin || isProjectAdmin ? await getDepartmentsForSelect(project.id) : []

    if (!entries.length) {
      const agents = await Agent.findAll({
        project: project.id,
        department,
      })

      if (isCrew && !isAdmin) {
        for (const agent of agents) {
          entries.push({
            name: agent.name,
            position: agent.position,
            department: agent.department,
          })
        }
      }
    }

    return reply.view('time-record', {
      title: 'New Time Sheet',
      departments,
      project,
      user: req.user,

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

  return await Agent.save({ name, position, department, project })
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
