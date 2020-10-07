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
    const foundProject = await repo.findByProp({ id })

    return new this.constructor(foundProject)
  }

  async all (props) {
    return await repo.findAll({ ...props })
      .then(res => res.map(report => new this.constructor(report)))
  }

  async save () {
    const storedProject = await repo.store(this.serialize())

    return new this.constructor(storedProject)
  }

  serialize () {
    return JSON.parse(JSON.stringify(this))
  }
}
