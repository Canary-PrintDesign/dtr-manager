const repo = require('./agent-repo')
const Agent = require('./agent')

module.exports = class Agents {
  constructor (props = {}) {
    this.departments = props.agents || []
  }

  async all ({ projectId }) {
    return await repo.findAll({ projectId })
      .then(res => res.map(agent => new Agent(agent)))
  }

  serialize () {
    return JSON.parse(JSON.stringify(this))
  }
}
