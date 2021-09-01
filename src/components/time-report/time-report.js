const Repo = require('./time-report-repo')

exports.create = create
function create() {
  return async (props = {}) => ({
    date: props.date,
    department: props.department,
    agent: props.name,
    position: props.position,
    workStart: props.workStart,
    workStop: props.workStop,
    lunchStart: props.lunchStart,
    lunchStop: props.lunchStop,
  })
}

exports.findAll =
  (repo = Repo) =>
  async ({ project, date }) => {
    const reports = await repo.findAll({ project, date })

    return Promise.all(reports.map(create()))
  }
