const debug = require('lib/debug')('http:web:controller:report')
const TimeReport = require('components/time-report')
const format = require('date-fns/format')
const addDays = require('date-fns/addDays')

module.exports = {
  index,
  get
}

async function index (req, res) {
  debug('index', req.params)

  const { project } = req.context
  const TimeReport = await getTimeReport(project.id)
    .then(res => res.map(report =>
      Object.assign(report, { date: format(report.date, 'yyyy-MM-dd') }))
    )
    // replace repeat dates / department names
    .then(res => {
      let date
      let department

      return res.map(report => {
        if (report.date === date) {
          report.presentmentDate = '-'
        } else {
          report.presentmentDate = report.date
          date = report.date
        }

        if (report.department === department) {
          report.department = '-'
        } else {
          department = report.department
        }

        return report
      })
    })

  const dates = TimeReport
    .map(report => report.date)

  const filteredDates = [...new Set(dates)]
    .filter(date => date !== '-')
    .sort((a, b) => a < b)

  res.view = 'report'
  res.locals = {
    ...req.context,
    dates: filteredDates,
    reports: TimeReport,
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
