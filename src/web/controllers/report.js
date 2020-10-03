const debug = require('lib/debug')('http:web:controller:report')
const groupBy = require('lodash.groupby')
const TimeReport = require('components/time-report')
const RecordNote = require('components/record-note')
const format = require('date-fns/format')
const addDays = require('date-fns/addDays')

module.exports = {
  index,
  get
}

async function index (req, res) {
  debug('index', req.params)

  const { project } = req.context

  const RecordNotes = await getRecordNotes(project.id)
    .then(res => res.filter(note => note.date))
    .then(res => res.filter(note => note.note !== ''))
    .then(res => res.map(note =>
      Object.assign(note, { date: format(note.date, 'yyyy-MM-dd') }))
    )

  const TimeReport = await getTimeReport(project.id)
    .then(res => res.map(report =>
      Object.assign(report, { date: format(report.date, 'yyyy-MM-dd') }))
    )
    .then(res => groupBy(res, 'date'))
    .then(res => {
      Object.keys(res)
        .forEach(dateKey => {
          const entries = res[`${dateKey}`]
          const departments = groupBy(entries, 'department')

          Object.entries(departments)
            .forEach(([deptName, deptEntries]) => {
              const notes = RecordNotes
                .filter(note => note.date === dateKey)
                .filter(note => note.department === deptName)

              departments[`${deptName}`] = {
                notes,
                entries: deptEntries
              }
            })

          res[`${dateKey}`] = { departments }
        })

      return res
    })

  const filteredDates = Object.keys(TimeReport)

  const departments = Object.values(TimeReport)
    .flatMap(report => Object.keys(report.departments))

  const filteredDepartments = [...new Set(departments)]
    .sort((a, b) => a < b)

  res.view = 'report'
  res.locals = {
    ...req.context,
    dates: filteredDates,
    departments: filteredDepartments,
    report: TimeReport,
    title: 'Project Report'
  }
}

async function get (req, res) {
  debug('index', req.params)

  const { project } = req.context
  const date = addDays(project.startDate, req.params.dayNumber - 1)
  const TimeReport = await getTimeReport(project.id, date)

  res.view = 'report'
  res.locals = {
    ...req.context,
    reports: TimeReport,
    title: 'Project Report'
  }
}

async function getTimeReport (project, date) {
  return await new TimeReport().all({ project, date })
}

async function getRecordNotes (project) {
  return await new RecordNote().all({ project })
}
