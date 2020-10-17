const repo = require('./department-repo')

module.exports = class Department {
  constructor (props = {}) {
    this.id = props.id || undefined
    this.name = props.name || ''
    this.custom = props.custom || false
    this.project = props.project || undefined
  }

  async get (id) {
    const foundDepartment = await repo.findByProp({ id })

    return new this.constructor(foundDepartment)
  }

  async getBy (props) {
    const foundDepartment = await repo.findByProp({ ...props })

    return new this.constructor(foundDepartment)
  }

  async save () {
    const storedDepartment = await repo.store(this.serialize())

    return new this.constructor(storedDepartment)
  }

  serialize () {
    return JSON.parse(JSON.stringify(this))
  }
}
