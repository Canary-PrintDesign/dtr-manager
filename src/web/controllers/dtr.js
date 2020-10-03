const debug = require('lib/debug')('http:web:controller:dtr')
const Department = require('components/department')
const Departments = require('components/departments')
const Agent = require('components/agent')
const Agents = require('components/agents')
const RecordNote = require('components/record-note')
const TimeRecord = require('components/time-record')

module.exports = {
  index,
  create,
  api
}

async function index (req, res) {
  debug('index', req.params)

  const { project } = req.context
  const departments = await getDepartments({ project })

  res.view = 'time-record.pug'
  res.locals = {
    ...req.context,
    departments,
    title: `New Time Sheet - ${project.name}`
  }
}

async function create (req, res) {
  debug('create', req.params, req.body)

  const { project } = req.context

  const { department: departmentId, date, records = [], notes = '' } = Object.entries(req.body)
    .flatMap(([key, value]) => ({ key, value }))
    .reduce((acc, item) => Object.assign(acc, { [item.key]: item.value }), {})

  const department = await getDepartment(departmentId)

  const savedRecords = await buildRecords(records, { department: departmentId, date, project })
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
    department: department.id,
    date
  }).save()

  res.view = 'time-record-receipt.pug'
  res.locals = {
    project,
    date,
    department,
    records: savedRecords,
    recordNote: savedRecordNote,

    title: `Receipt of Time Sheet | ${project.name}`
  }
}

async function api (req, res) {
  debug('api', req.params, req.body, req.query)

  const { project } = req.context
  const agents = await getAgents({ projectId: project.id, departmentId: req.query.department })

  res.data = { agents }
}

// Private

async function getDepartment (departmentId) {
  return await new Department().get(departmentId)
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
