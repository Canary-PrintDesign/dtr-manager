const repo = require('./department-repo')

module.exports = class Department {
  constructor (props = {}) {
    this.id = props.id || undefined
    this.name = props.name || ''
    this.custom = props.custom || false
    this.project = props.project || undefined
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
