const repo = require('./time-report-repo')

module.exports = class TimeReport {
  constructor (props = {}) {
    this.date = props.date
    this.department = props.department
    this.agent = props.name
    this.position = props.name
    this.workStart = props.workStart
    this.workStop = props.workStop
    this.lunchStart = props.lunchStart
    this.lunchStop = props.lunchStop
  }

  async all ({ project, date }) {
    return await repo.findAll({ project, date })
      .then(res => res.map(report => new TimeReport(report)))
  }

  serialize () {
    return JSON.parse(JSON.stringify(this))
  }
}
