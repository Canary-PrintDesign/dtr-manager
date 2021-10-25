const httpErrors = require('http-errors')
const groupBy = require('lodash.groupby')
const format = require('date-fns/format')
const TimeReport = require('../components/time-report.js')
const RecordNote = require('../components/record-note.js')

module.exports = async (fastify) => {
  fastify.get('/dtr/report', {}, async (req, reply) => {
    if (!req.user.isCrew) return httpErrors.NotAuthorized()

    try {
      const project = req.data.project
      const department = req.user.isAdmin ? undefined : req.user.department
      const recordNotes = await RecordNote.findAll({
        project: project.id,
        department,
      })
        .then((res) => res.filter((note) => note.date))
        .then((res) => res.filter((note) => note.note !== ''))
        .then((res) =>
          res.map((note) => ({ ...note, date: formatDate(note.date) }))
        )

      const timeReportByDate = await TimeReport.findAll({
        project: project.id,
        department,
      })
        .then((res) =>
          res.map((report) => ({ ...report, date: formatDate(report.date) }))
        )
        .then((res) => groupBy(res, 'date'))
        .then((res) => attachNotes(res, recordNotes))

      const filteredDates = Object.keys(timeReportByDate)

      const departments = Object.values(timeReportByDate).flatMap((report) =>
        Object.keys(report.departments)
      )

      const filteredDepartments = [...new Set(departments)].sort(
        (a, b) => a < b
      )

      return reply.view('report', {
        title: 'Project Report',
        dates: filteredDates,
        departments: filteredDepartments,
        report: timeReportByDate,
        project,
        user: req.user,
      })
    } catch (err) {
      fastify.log.error(err)
      throw httpErrors.NotAcceptable()
    }
  })
}

function formatDate(date, style = 'yyyy-MM-dd') {
  return format(date, style)
}

// Here be mutation demons
function attachNotes(timeRecordGroups, recordNotes) {
  Object.keys(timeRecordGroups).forEach((date) => {
    const entries = timeRecordGroups[`${date}`]
    const departments = groupBy(entries, 'department')

    const departmentsWithNotes = {}
    Object.entries(departments).forEach(([department, deptEntries]) => {
      const notes = recordNotes
        .filter((note) => note.date === date)
        .filter((note) => note.department === department)

      departmentsWithNotes[`${deptEntries[0].departmentName}`] = {
        notes,
        entries: deptEntries,
      }
    })

    timeRecordGroups[`${date}`] = { departments: departmentsWithNotes }
  })

  return timeRecordGroups
}
