const projectRepo = require('./project-repo')

module.exports = class Project {
  constructor (props = {}) {
    this.id = props.id || undefined
    this.logo = props.logo || ''
    this.name = props.name || ''
    this.hostname = props.hostname || ''
    this.startDate = props.startDate || new Date()
    this.status = props.status || 'unpublished'
  }

  async get (id) {
    const foundProject = await projectRepo.findById(id)

    return new Project(foundProject)
  }

  async getBy (props) {
    const foundProject = await projectRepo.findByProp(props)

    return new this.constructor(foundProject)
  }

  async save () {
    const storedProject = await projectRepo.store(this.serialize())

    return new Project(storedProject)
  }

  serialize () {
    return JSON.parse(JSON.stringify(this))
  }
}
