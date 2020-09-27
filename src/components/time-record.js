const repo = require('./time-record-repo')

module.exports = class TimeRecord {
  constructor (props = {}) {
    this.id = props.id || undefined
    this.project = props.project || undefined
    this.department = props.department || undefined
    this.agent = props.agent || undefined

    this.date = props.date || new Date()
    this.workStart = props.workStart || props.work_start || undefined
    this.workStop = props.workStop || props.work_stop || undefined
    this.lunchStart = props.lunchStart || props.lunch_start || undefined
    this.lunchStop = props.lunchStop || props.lunch_stop || undefined
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
