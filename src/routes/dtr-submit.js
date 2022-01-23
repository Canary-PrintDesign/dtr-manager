const Agent = require('../components/agent.js')
const RecordNote = require('../components/record-note.js')
const TimeRecord = require('../components/time-record.js')
const { requireCrew } = require('../lib/helper-auth.js')

module.exports = async (fastify) => {
  fastify.get('/dtr/submit', async (req, reply) => {
    requireCrew(req.user)

    try {
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
    } catch (err) {
      fastify.log.error(err)
      return reply.redirect('/dtr')
    }
  })
}

async function findOrCreateAgent ({ entry, department, project }) {
  const { name, position } = entry

  const agent = await Agent.findWith({ name, project, department })
  if (agent.length && agent[0].id) return agent[0]

  return await Agent.save({ name, position, department, project })
}

async function createRecordNote ({ date, department, notes, project }) {
  return await RecordNote.save({
    date,
    department,
    project,
    note: notes,
  })
}

async function createTimeRecords ({ date, entries, department, project }) {
  const records = []

  for (const entry of entries) {
    const agent = await findOrCreateAgent({ entry, department, project })
    const storedTimeRecord = await TimeRecord.save({
      ...entry,
      date,
      department,
      project,
      agent: agent.id,
      order: parseInt(entry.order),
    })

    records.push({ ...storedTimeRecord, agent })
  }

  return records
}
