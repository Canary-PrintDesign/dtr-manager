const { store } = require('lib/database')
const Project = require('components/project')
const Department = require('components/department')
const Agent = require('components/agent')

const project = new Project({
  name: 'Test Project',
  logo: 'https://www.google.com/images/branding/googlelogo/2x/googlelogo_color_272x92dp.png'
})

const departmentA = new Department({
  name: 'Department A'
})

const departmentB = new Department({
  name: 'Department B'
})

const departmentC = new Department({
  name: 'Department C',
  custom: true
})

const agent1 = new Agent({
  name: 'Agent 1',
  position: 'First Agent'
})

const agent2 = new Agent({
  name: 'Agent 2',
  position: 'Number Two'
})

const agent3 = new Agent({
  name: 'Agent 3',
  position: 'Tertiary'
})

const agent4 = new Agent({
  name: 'Agent 4',
  position: 'Red Shirt'
})

exports.seed = function (knex) {
  return Promise.resolve()
    .then(() => Promise.all([
      knex('projects').del(),
      knex('departments').del(),
      knex('agents').del()
    ]))
    .then(() => store('projects')(project))
    .then(departmentFactory)
    .then(agentFactory)
}

function departmentFactory (project) {
  const projectId = project.id

  const departments = [departmentA, departmentB, departmentC]
    .map(department => Object.assign(department, { project: projectId }))
    .map(department => store('departments')(department))

  return Promise.all(departments)
}

function agentFactory (departments) {
  const project = departments[0].project

  const agents = [
    Object.assign(agent1, { project, department: departments[0].id }),
    Object.assign(agent2, { project, department: departments[1].id }),
    Object.assign(agent3, { project, department: departments[2].id }),
    Object.assign(agent4, { project, department: departments[0].id })
  ]
    .map(agent => store('agents')(agent))

  return Promise.all(agents)
}
