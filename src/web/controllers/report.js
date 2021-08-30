const debug = require('../../lib/debug')('http:web:controller:report')
const groupBy = require('lodash.groupby')
const TimeReport = require('../../components/time-report')
const RecordNote = require('../../components/record-note')
const format = require('date-fns/format')

module.exports = {
  index
}

async function index (req, res) {
  debug('index', req.params)

  const { project } = req.context

  const recordNotes = await getRecordNotes(project.id)
    .then((res) => res.filter((note) => note.date))
    .then((res) => res.filter((note) => note.note !== ''))
    .then((res) =>
      res.map((note) => ({ ...note, date: formatDate(note.date) }))
    )

  const timeReportByDate = await getTimeReport(project.id)
    .then((res) =>
      res.map((report) => ({ ...report, date: formatDate(report.date) }))
    )
    .then((res) => groupBy(res, 'date'))
    .then((res) => attachNotes(res, recordNotes))

  const filteredDates = Object.keys(timeReportByDate)

  const departments = Object.values(timeReportByDate).flatMap((report) =>
    Object.keys(report.departments)
  )

  const filteredDepartments = [...new Set(departments)].sort((a, b) => a < b)

  res.view = 'report'
  res.locals = {
    ...req.context,
    dates: filteredDates,
    departments: filteredDepartments,
    report: timeReportByDate,
    title: 'Project Report'
  }
}

async function getTimeReport (project, date) {
  return await TimeReport.findAll({ project, date })
}

async function getRecordNotes (projectId) {
  const notes = await RecordNote.findAll(projectId)
  return Promise.all(notes)
}

function formatDate (date, style = 'yyyy-MM-dd') {
  return format(date, style)
}

// Here be mutation demons
function attachNotes (timeRecordGroups, recordNotes) {
  Object.keys(timeRecordGroups).forEach((date) => {
    const entries = timeRecordGroups[`${date}`]
    const departments = groupBy(entries, 'department')

    Object.entries(departments).forEach(([deptName, deptEntries]) => {
      const notes = recordNotes
        .filter((note) => note.date === date)
        .filter((note) => note.department === deptName)

      departments[`${deptName}`] = {
        notes,
        entries: deptEntries
      }
    })

    timeRecordGroups[`${date}`] = { departments }
  })

  return timeRecordGroups
}
