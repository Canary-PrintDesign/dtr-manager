const projectRepo = require('./project-repo')

module.exports = class Project {
  constructor (props = {}) {
    this.id = props.id || undefined
    this.logo = props.logo || ''
    this.name = props.name || ''
    this.startDate = props.startDate || new Date()
    this.status = props.status || 'unpublished'
  }

  async get (id) {
    const foundProject = await projectRepo.findById(id)

    return new Project(foundProject)
  }

  async save () {
    const storedProject = await projectRepo.store(this.serialize())

    return new Project(storedProject)
  }

  serialize () {
    return JSON.parse(JSON.stringify(this))
  }
}
