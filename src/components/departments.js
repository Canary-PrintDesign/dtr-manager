const repo = require('./department-repo')
const Department = require('./department')

module.exports = class Departments {
  constructor (props = {}) {
    this.constructor = props.departments || []
  }

  async all ({ projectId: project }) {
    return await repo.findAll({ project })
      .then(res => res.map(department => new Department(department)))
  }

  serialize () {
    return JSON.parse(JSON.stringify(this))
  }
}
