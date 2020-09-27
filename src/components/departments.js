const repo = require('./department-repo')
const Department = require('./department')

module.exports = class Departments {
  constructor (props = {}) {
    this.departments = props.departments || []
  }

  async all ({ projectId }) {
    return await repo.findAll({ projectId })
      .then(res => res.map(department => new Department(department)))
  }

  serialize () {
    return JSON.parse(JSON.stringify(this))
  }
}
