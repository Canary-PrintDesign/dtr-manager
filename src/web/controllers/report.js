const debug = require('lib/debug')('http:web:controller:report')
const Project = require('components/project')
const TimeReport = require('components/time-report')
const format = require('date-fns/format')
const parseISO = require('date-fns/parseISO')

module.exports = {
  index
}

async function index (req, res) {
  debug('index', req.params)

  const project = await getProject(req.hostname)
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
          report.date = '-'
        } else {
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

  res.view = 'report'
  res.locals = {
    project,
    reports: TimeReport,
    title: project.name
  }
}

async function getProject (hostname) {
  return await new Project().getBy({ hostname })
}

async function getTimeReport (projectId) {
  return await new TimeReport().all({ projectId })
}
