const repo = require('./time-record-repo')

module.exports = class TimeRecord {
  constructor (props = {}) {
    this.id = props.id || undefined
    this.project = props.project || undefined
    this.department = props.department || undefined
    this.agent = props.agent || undefined

    this.workStart = props.workStart || undefined
    this.workStop = props.workStop || undefined
    this.lunchStart = props.lunchStart || undefined
    this.lunchStop = props.lunchStop || undefined
  }

  async get (id) {
    const foundProject = await repo.findById(id)

    return new this.constructor(foundProject)
  }

  async save () {
    this.work_start = this.workStart
    this.work_stop = this.workStop
    this.lunch_start = this.lunchStart
    this.lunch_stop = this.lunchStop

    delete this.workStart
    delete this.workStop
    delete this.lunchStart
    delete this.lunchStop

    const storedProject = await repo.store(this.serialize())

    return new this.constructor(storedProject)
  }

  serialize () {
    return JSON.parse(JSON.stringify(this))
  }
}
