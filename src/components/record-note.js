const repo = require('./record-note-repo')

module.exports = class RecordNote {
  constructor (props = {}) {
    this.id = props.id || undefined
    this.project = props.project || undefined
    this.department = props.department || undefined
    this.record = props.timeRecord || undefined
    this.note = props.note || ''
  }

  async get (id) {
    const foundProject = await repo.findById(id)

    return new this.constructor(foundProject)
  }

  async save () {
    const storedProject = await repo.store(this.serialize())

    return new this.constructor(storedProject)
  }

  serialize () {
    return JSON.parse(JSON.stringify(this))
  }
}
