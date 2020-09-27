const debug = require('lib/debug')('http:web:controller:dtr')
const Department = require('components/department')
const Departments = require('components/departments')
const Project = require('components/project')
const Agent = require('components/agent')
const Agents = require('components/agents')
const TimeRecord = require('components/time-record')

module.exports = {
  index,
  create
}

async function index (req, res) {
  debug('index', req.params)

  const projectId = '72e9cce0-7e87-4b6e-bdaa-3a5a09006e72'
  const project = await getProject(projectId)
  const departments = await getDepartments({ project })
  const agents = await getAgents({ project })

  res.view = 'time-record.pug'
  res.locals = {
    agents,
    departments,
    project,
    title: 'new'
  }
}

async function create (req, res) {
  debug('create', req.params, req.body)

  const projectId = '72e9cce0-7e87-4b6e-bdaa-3a5a09006e72'
  const project = await getProject(projectId)

  const { department, date, records } = Object.entries(req.body)
    .flatMap(([key, value]) => ({ key, value }))
    .reduce((acc, item) => Object.assign(acc, { [item.key]: item.value }), {})

  const savedRecords = await buildRecords(records, { department, date, project })
    .then(res => res.map(record => new TimeRecord(record)))
    .then(res => res.map(async record => await record.save()))
    .then(res => Promise.all(res))
    .then(res => res.map(async record => {
      const recordDepartment = await new Department().get(record.department)
      const recordAgent = await new Agent().get(record.agent)

      return Object.assign(record, { department: recordDepartment, agent: recordAgent })
    }))
    .then(res => Promise.all(res))


  console.log(savedRecords)
  const departments = await getDepartments({ project })
  const agents = await getAgents({ project })


  res.view = 'time-record-receipt.pug'
  res.locals = {
    agents,
    departments,
    project,
    records: savedRecords,

    title: 'receipt'
  }
}

// Private

async function getProject (id) {
  return await new Project().get(id)
}

async function getDepartments ({ project }) {
  return await new Departments()
    .all({ projectId: project.id })
    .then(res => res.map(department => ({ key: department.id, value: department.name })))
}

async function getAgents ({ project }) {
  return await new Agents()
    .all({ projectId: project.id })
    .then(res => res.map(agent => ({
      name: agent.name,
      position: agent.position,
      department: agent.department
    })))
}

function buildRecords (records, { department, date, project }) {
  const builtRecords = Object.entries(records)
    .filter(([key]) => key !== 'undefined')
    .flatMap(([_, value]) => Object.assign(value, { department, date }))
    .map(record => Object.assign(record, { workStart: Number.parseInt(record.workStart) }))
    .map(record => Object.assign(record, { project: project.id }))
    .map(async (record) => {
      const agent = await new Agent().getBy({ name: record.name })

      return Object.assign(record, { agent: agent.id })
    })

  return Promise.all(builtRecords)
}
