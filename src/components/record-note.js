const repo = require('./record-note-repo')

module.exports = class RecordNote {
  constructor (props = {}) {
    this.id = props.id || undefined
    this.project = props.project || undefined
    this.department = props.department || undefined
    this.note = props.note || ''
    this.date = props.date || undefined
  }

  async get (id) {
    const foundProject = await repo.findById(id)

    return new this.constructor(foundProject)
  }

  async save () {
    const storedProject = await repo.store(this.serialize())

    return new this.constructor(storedProject)
  }

  async all ({ project }) {
    return await repo.findAll({ project })
      .then(res => res.map(report => new this.constructor(report)))
  }

  serialize () {
    return JSON.parse(JSON.stringify(this))
  }
}
