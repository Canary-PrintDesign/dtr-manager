const repo = require('./agent-repo')

module.exports = class Agent {
  constructor (props = {}) {
    this.id = props.id || undefined
    this.project = props.project || undefined
    this.department = props.department || undefined
    this.name = props.name || ''
    this.position = props.position || ''
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
