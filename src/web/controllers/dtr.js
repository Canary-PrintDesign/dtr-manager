const debug = require('lib/debug')('http:web:controller:dtr')
const Department = require('components/department')
const Departments = require('components/departments')
const Project = require('components/project')
const Agent = require('components/agent')
const Agents = require('components/agents')
const RecordNote = require('components/record-note')
const TimeRecord = require('components/time-record')

module.exports = {
  index,
  create,
  api
}

const projectId = '019538af-fc8b-4427-a84d-a4ae9cce9bf2'

async function index (req, res) {
  debug('index', req.params)

  const project = await getProject(projectId)
  const departments = await getDepartments({ project })

  res.view = 'time-record.pug'
  res.locals = {
    departments,
    project,
    title: 'new'
  }
}

async function create (req, res) {
  debug('create', req.params, req.body)

  const project = await getProject(projectId)

  const { department, date, records, notes } = Object.entries(req.body)
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

  const savedRecordNote = await new RecordNote({
    note: notes,
    project: project.id,
    department,
    date
  }).save()

  res.view = 'time-record-receipt.pug'
  res.locals = {
    project,
    records: savedRecords,
    recordNote: savedRecordNote,

    title: 'receipt'
  }
}

async function api (req, res) {
  debug('api', req.params, req.body, req.query)

  const agents = await getAgents({ projectId, departmentId: req.query.department })

  res.data = { agents }
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

async function getAgents ({ projectId, departmentId }) {
  return await new Agents()
    .all({ project: projectId, department: departmentId })
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
      let agent = await new Agent().getBy({ name: record.name })

      if (!agent.id) {
        agent.name = record.name
        agent.position = record.position
        agent.department = department
        agent.project = project.id

        agent = await agent.save()
      }

      return Object.assign(record, { agent: agent.id })
    })

  return Promise.all(builtRecords)
}
