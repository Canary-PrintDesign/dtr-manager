const debug = require('lib/debug')('http:web:controller:dtr')
const Departments = require('components/departments')
const Project = require('components/project')
const Agents = require('components/agents')

module.exports = {
  index
}

async function index (req, res) {
  debug('index', req.params)

  const project = await new Project()
    .get('d74d6590-923c-48e3-89b5-952a24ea9fd2')

  const departments = await new Departments()
    .all({ projectId: project.id })
    .then(res => res.map(department => ({ key: department.id, value: department.name })))

  const agents = await new Agents()
    .all({ projectId: project.id })
    .then(res => res.map(agent => ({
      name: agent.name,
      position: agent.position,
      department: agent.department
    })))

  res.view = 'time-record.pug'
  res.locals = {
    agents,
    departments,
    project,
    title: 'new'
  }
}
